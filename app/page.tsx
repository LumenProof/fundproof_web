'use client';

import { FormEvent, useState, useEffect } from 'react';

// Add TypeScript declaration for Freighter wallet on window object
declare global {
  interface Window {
    freighter?: unknown;
  }
}
import { 
  CheckCircle2, FileKey2, PlayCircle, ShieldCheck, WalletCards, XCircle, 
  Wallet, ArrowRight, History, QrCode, Copy, Check, ExternalLink, 
  Loader2, ChevronRight, Info, Sun, Moon
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  isConnected, getPublicKey, setAllowed, isAllowed, requestAccess
} from '@stellar/freighter-api';

type AttestationResponse = {
  id: string;
  stellarAddress: string;
  thresholdCents: number;
  expiresAt: number;
  addressHash: string;
  attestationHash: string;
  signature: string;
  publicKey: string;
  demo: {
    mockBalanceCents: number;
    note: string;
  };
};

type ProofInputResponse = {
  input: Record<string, string>;
  publicSignals: Record<string, string>;
  nextStep: string;
};

type GeneratedProofResponse = {
  attestationId: string;
  verified: boolean;
  proof: unknown;
  publicSignals: string[];
  publicSignalNames: string[];
  files: {
    input: string;
    proof: string;
    public: string;
  };
  nextStep: string;
};

type ProofHistoryItem = {
  id: string;
  attestationId: string;
  createdAt: number;
  thresholdCents: number;
  stellarAddress: string;
  verified: boolean;
  proofUrl?: string;
};

const apiBase = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4000';

const STEPS = [
  { id: 'connect', title: 'Connect Wallet', description: 'Connect your Stellar wallet' },
  { id: 'details', title: 'Set Parameters', description: 'Define your funding threshold' },
  { id: 'attestation', title: 'Generate Attestation', description: 'Create your proof attestation' },
  { id: 'proof', title: 'Generate ZK Proof', description: 'Create your zero-knowledge proof' },
  { id: 'share', title: 'Share Proof', description: 'Share your verified proof' },
];

import LandingPage from './landing-page';

export default function Home() {
  const [showApp, setShowApp] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [stellarAddress, setStellarAddress] = useState('');
  const [threshold, setThreshold] = useState('1000');
  const [attestation, setAttestation] = useState<AttestationResponse | null>(null);
  const [proofInput, setProofInput] = useState<ProofInputResponse | null>(null);
  const [generatedProof, setGeneratedProof] = useState<GeneratedProofResponse | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [proofLoading, setProofLoading] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletPublicKey, setWalletPublicKey] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [proofHistory, setProofHistory] = useState<ProofHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  // Load saved theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.add('light-mode');
    }
  }, []);

  const toggleTheme = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    if (newIsDarkMode) {
      document.documentElement.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    }
  };

  const disconnectWallet = async () => {
    try {
      // First set all states to disconnected
      setWalletConnected(false);
      setWalletPublicKey('');
      setStellarAddress('');
      setCurrentStep(0);
      // Reset all form states
      setAttestation(null);
      setProofInput(null);
      setGeneratedProof(null);
      setError('');
      
      // Force prevent auto-reconnection by adding a small delay
      // and only allow reconnection if user manually clicks connect again
      sessionStorage.setItem('walletManuallyDisconnected', 'true');
    } catch (err) {
      console.error('Error disconnecting wallet:', err);
    }
  };

  useEffect(() => {
    // This effect only runs when showApp becomes true (user clicks Get Started)
    if (!showApp) return;
    
    // Only run browser-specific code after app is activated
    const initializeApp = async () => {
      // Load history first
      try {
        const savedHistory = localStorage.getItem('fundproof_history');
        if (savedHistory) {
          setProofHistory(JSON.parse(savedHistory));
        }
      } catch (err) {
        console.error('Failed to load proof history:', err);
        try { localStorage.removeItem('fundproof_history'); } catch (e) {}
      }

      // Check wallet connection
      try {
        // Safely access sessionStorage only if it exists
        let manuallyDisconnected = null;
        try {
          manuallyDisconnected = window?.sessionStorage?.getItem('walletManuallyDisconnected');
        } catch (e) {
          console.log('Session storage not accessible');
        }
        
        if (manuallyDisconnected) return;

        const connected = await isConnected();
        const allowed = await isAllowed();
        if (connected && allowed) {
          const pubKey = await getPublicKey();
          setWalletPublicKey(pubKey);
          setStellarAddress(pubKey);
          setWalletConnected(true);
          setCurrentStep(1);
        }
      } catch (err) {
        console.log('Wallet not available:', err);
      }
    };

    initializeApp();
  }, [showApp]);

  console.log('Rendering, showApp =', showApp);
  if (!showApp) {
    return <LandingPage onGetStarted={() => setShowApp(true)} />;
  }

  const connectWallet = async () => {
    try {
      setError('');
      // Clear the manual disconnect flag when user tries to connect again
      sessionStorage.removeItem('walletManuallyDisconnected');
      console.log('Attempting to connect wallet...');
      
      // Request wallet permissions. This will trigger the Freighter pop-up
      // only if the user has not already approved the site. If the site is
      // already approved, it will return the public key without a prompt.
      console.log('Requesting wallet permissions...');
      const pubKey = await requestAccess();
      console.log('Permission granted, public key:', pubKey);
      
      if (pubKey) {
        console.log('Successfully connected, public key:', pubKey);
        setWalletPublicKey(pubKey);
        setStellarAddress(pubKey);
        setWalletConnected(true);
        setCurrentStep(1);
      } else {
        setError('Wallet connection rejected. Please allow access to continue.');
      }
    } catch (err) {
      console.error('Wallet connection error details:', err);
      setError('Freighter wallet not detected. Please install the Freighter browser extension from https://www.freighter.app/ and ensure it is unlocked.');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy');
    }
  };

  const saveToHistory = (proof: GeneratedProofResponse, attestationData: AttestationResponse) => {
    const newItem: ProofHistoryItem = {
      id: Date.now().toString(),
      attestationId: proof.attestationId,
      createdAt: Date.now(),
      thresholdCents: attestationData.thresholdCents,
      stellarAddress: attestationData.stellarAddress,
      verified: proof.verified,
      proofUrl: `${window.location.origin}/verify/${proof.attestationId}`,
    };
    
    const updatedHistory = [newItem, ...proofHistory].slice(0, 20);
    setProofHistory(updatedHistory);
    localStorage.setItem('fundproof_history', JSON.stringify(updatedHistory));
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setProofInput(null);
    setGeneratedProof(null);
    setAttestation(null);
    setLoading(true);

    try {
      const thresholdCents = Math.round(Number(threshold) * 100);
      const attestationResponse = await fetch(`${apiBase}/attestations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stellarAddress, thresholdCents }),
      });

      if (!attestationResponse.ok) {
        throw new Error(await attestationResponse.text());
      }

      const nextAttestation = (await attestationResponse.json()) as AttestationResponse;
      setAttestation(nextAttestation);
      setCurrentStep(2);

      const proofResponse = await fetch(`${apiBase}/proof-input`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attestationId: nextAttestation.id }),
      });

      if (!proofResponse.ok) {
        throw new Error(await proofResponse.text());
      }

      setProofInput((await proofResponse.json()) as ProofInputResponse);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Request failed.');
    } finally {
      setLoading(false);
    }
  }

  async function generateProof() {
    if (!attestation) {
      return;
    }

    setError('');
    setGeneratedProof(null);
    setProofLoading(true);

    try {
      const proofResponse = await fetch(`${apiBase}/proofs/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attestationId: attestation.id }),
      });

      if (!proofResponse.ok) {
        throw new Error(await proofResponse.text());
      }

      const proof = (await proofResponse.json()) as GeneratedProofResponse;
      setGeneratedProof(proof);
      setCurrentStep(3);
      saveToHistory(proof, attestation);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Proof generation failed.');
    } finally {
      setProofLoading(false);
    }
  }

  const passes = attestation ? attestation.demo.mockBalanceCents >= attestation.thresholdCents : false;

  const formatUsd = (cents: number) => {
    return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) return 'complete';
    if (stepIndex === currentStep) return 'current';
    return 'pending';
  };

  return (
    <main>
      <section className="shell">
        <div className="headline">
          <div className="brand">
            <ShieldCheck aria-hidden />
            <span>FundProof</span>
          </div>
          <div className="header-actions" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button 
              className="theme-toggle" 
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button 
              className="secondary-button small" 
              onClick={() => setShowHistory(!showHistory)}
            >
              <History size={16} />
              History
            </button>
          </div>
          <h1>Private proof-of-funds for Stellar USDC</h1>
          <p>
            Prove a wallet meets a funding threshold without revealing the exact balance. The local demo uses a backend-signed attestation and Circom/Groth16 circuit input ready for Stellar verification.
          </p>
        </div>

        <div className="workspace">
          <div className="progress-steps">
            {STEPS.map((step, index) => (
              <div key={step.id} className={`step ${getStepStatus(index)}`}>
                <div className="step-indicator">
                  {index < currentStep ? <CheckCircle2 size={18} /> : <span>{index + 1}</span>}
                </div>
                <div className="step-content">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
                {index < STEPS.length - 1 && <ChevronRight className="step-arrow" size={16} />}
              </div>
            ))}
          </div>

          {showHistory && (
            <div className="panel history-panel">
              <div className="panel-title">
                <History aria-hidden />
                <h2>Proof History</h2>
              </div>
              {proofHistory.length === 0 ? (
                <p className="empty">No proofs generated yet. Your proof history will appear here.</p>
              ) : (
                <div className="history-list">
                  {proofHistory.map((item) => (
                    <div key={item.id} className="history-item">
                      <div className="history-status">
                        {item.verified ? <CheckCircle2 className="status-icon pass" /> : <XCircle className="status-icon fail" />}
                      </div>
                      <div className="history-details">
                        <p className="address">{item.stellarAddress.slice(0, 12)}...{item.stellarAddress.slice(-8)}</p>
                        <p className="threshold">{formatUsd(item.thresholdCents)}</p>
                        <p className="date">{new Date(item.createdAt).toLocaleDateString()}</p>
                      </div>
                      {item.proofUrl && (
                        <button 
                          className="icon-button"
                          onClick={() => copyToClipboard(item.proofUrl!)}
                          title="Copy link"
                        >
                          <Copy size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {!walletConnected ? (
            <div className="panel connect-panel">
              <div className="panel-title">
                <Wallet aria-hidden />
                <h2>Connect Your Wallet</h2>
              </div>
              <div className="connect-content">
                <div className="info-box">
                  <Info size={20} />
                  <p>To use FundProof, you need to connect your Freighter wallet. Freighter is the official wallet for the Stellar network.</p>
                </div>
                <button onClick={connectWallet} className="primary-button">
                  <Wallet aria-hidden />
                  Connect Freighter Wallet
                </button>
                {error && <p className="error">{error}</p>}
                <div className="install-note">
                  <p>Don't have Freighter installed?</p>
                  <a 
                    href="https://www.freighter.app/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="link"
                  >
                    Install Freighter <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="panel">
              <div className="panel-title">
                <WalletCards aria-hidden />
                <h2>Create Your Claim</h2>
              </div>

              <div className="wallet-info">
                <div className="connected-wallet">
                  <CheckCircle2 className="connected-icon" />
                  <span>Connected: {walletPublicKey.slice(0, 12)}...{walletPublicKey.slice(-8)}</span>
                  <button 
                    type="button" 
                    onClick={disconnectWallet}
                    className="disconnect-btn"
                  >
                    Disconnect
                  </button>
                </div>
              </div>

              <label>
                Stellar address (read-only)
                <input 
                  value={stellarAddress} 
                  readOnly
                  disabled
                  placeholder="Connect your wallet to populate this field"
                  className="readonly-input"
                />
                <small>This is automatically populated from your connected Freighter wallet and cannot be edited.</small>
              </label>

              <label>
                Minimum USDC threshold
                <input 
                  value={threshold} 
                  onChange={(event) => setThreshold(event.target.value)} 
                  inputMode="decimal"
                  placeholder="1000.00"
                />
                <small>This is the minimum balance you want to prove you hold. Your exact balance remains private.</small>
              </label>

              <button type="submit" disabled={loading}>
                {loading ? <Loader2 className="spinner" /> : <FileKey2 aria-hidden />}
                {loading ? 'Preparing your attestation...' : 'Generate attestation'}
              </button>

              {error ? <p className="error">{error}</p> : null}
            </form>
          )}

          <section className="panel result-panel">
            <div className="panel-title">
              {attestation && passes ? <CheckCircle2 aria-hidden /> : attestation ? <XCircle aria-hidden /> : <ShieldCheck aria-hidden />}
              <h2>Verification Package</h2>
            </div>

            {!attestation ? (
              <div className="empty-state">
                <ShieldCheck size={48} className="empty-icon" />
                <p className="empty">Connect your wallet and generate an attestation to prepare private circuit inputs and public signals.</p>
              </div>
            ) : (
              <div className="result">
                <div className={passes ? 'status pass' : 'status fail'}>
                  {passes ? '✓ Local balance satisfies threshold' : '✗ Local balance is below threshold'}
                </div>

                <div className="stats-grid">
                  <div className="stat-card">
                    <dt>Mock balance</dt>
                    <dd>{formatUsd(attestation.demo.mockBalanceCents)}</dd>
                  </div>
                  <div className="stat-card">
                    <dt>Threshold</dt>
                    <dd>{formatUsd(attestation.thresholdCents)}</dd>
                  </div>
                  <div className="stat-card">
                    <dt>Expires</dt>
                    <dd>{new Date(attestation.expiresAt * 1000).toLocaleDateString()}</dd>
                  </div>
                </div>

                <div className="details-section">
                  <h3>Technical Details</h3>
                  <dl>
                    <div>
                      <dt>Attestation hash</dt>
                      <dd className="hash">{attestation.attestationHash}</dd>
                    </div>
                    <div>
                      <dt>Address hash</dt>
                      <dd className="hash">{attestation.addressHash}</dd>
                    </div>
                  </dl>
                </div>

                {proofInput && !generatedProof && (
                  <div className="action-section">
                    <button 
                      type="button" 
                      className="secondary-button primary" 
                      onClick={generateProof} 
                      disabled={proofLoading || !passes}
                    >
                      {proofLoading ? <Loader2 className="spinner" /> : <PlayCircle aria-hidden />}
                      {proofLoading ? 'Generating your ZK proof...' : 'Generate Zero-Knowledge Proof'}
                    </button>
                    
                    <div className="code-block">
                      <div className="code-header">
                        <span>Public Signals</span>
                        <button 
                          className="copy-btn" 
                          onClick={() => copyToClipboard(JSON.stringify(proofInput.publicSignals, null, 2))}
                        >
                          {copied ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      </div>
                      <pre>{JSON.stringify(proofInput.publicSignals, null, 2)}</pre>
                    </div>
                  </div>
                )}

                {generatedProof && (
                  <div className="proof-complete">
                    <div className="status pass large">
                      <CheckCircle2 size={24} />
                      Groth16 proof verified locally
                    </div>
                    
                    <div className="proof-stats">
                      <div className="stat-card">
                        <dt>Public signals</dt>
                        <dd>{generatedProof.publicSignals.length}</dd>
                      </div>
                      <div className="stat-card">
                        <dt>Proof file</dt>
                        <dd>{generatedProof.files.proof}</dd>
                      </div>
                    </div>

                    <div className="share-section">
                      <h3>Share Your Proof</h3>
                      <div className="share-actions">
                        <button 
                          className="secondary-button"
                          onClick={() => setShowQR(!showQR)}
                        >
                          <QrCode size={16} />
                          {showQR ? 'Hide QR Code' : 'Show QR Code'}
                        </button>
                        <button 
                          className="secondary-button"
                          onClick={() => copyToClipboard(`${window.location.origin}/verify/${generatedProof.attestationId}`)}
                        >
                          <Copy size={16} />
                          {copied ? 'Copied!' : 'Copy Proof Link'}
                        </button>
                      </div>
                      
                      {showQR && (
                        <div className="qr-container">
                          <QRCodeSVG 
                            value={`${window.location.origin}/verify/${generatedProof.attestationId}`}
                            size={200}
                          />
                          <p>Scan to verify this proof</p>
                        </div>
                      )}
                    </div>

                    <div className="code-block">
                      <div className="code-header">
                        <span>Full Proof Data</span>
                        <button 
                          className="copy-btn"
                          onClick={() => copyToClipboard(JSON.stringify(generatedProof, null, 2))}
                        >
                          {copied ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      </div>
                      <pre>{JSON.stringify(generatedProof, null, 2)}</pre>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}

function formatUsd(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
}