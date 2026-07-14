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
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-x-hidden">
      {/* Animated Background - matching landing page */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header - matching landing page styling */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-2xl border-b border-slate-800/50 shadow-2xl shadow-black/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setShowApp(false)}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-blue-500 to-cyan-400 p-2.5 rounded-xl">
                  <ShieldCheck className="h-6 w-6 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">FundProof</span>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowHistory(!showHistory)}
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 text-sm font-medium"
              >
                <History size={16} />
                History
              </button>
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300"
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-slate-300" />}
              </button>
              <button 
                onClick={() => setShowApp(false)}
                className="group relative inline-flex items-center gap-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 text-white font-semibold py-2.5 px-5 rounded-xl transition-all duration-300"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent mb-4">
              Private proof-of-funds for Stellar USDC
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Prove a wallet meets a funding threshold without revealing the exact balance. The local demo uses a backend-signed attestation and Circom/Groth16 circuit input ready for Stellar verification.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-10">
            <div className="flex items-center justify-between overflow-x-auto pb-4 gap-4">
              {STEPS.map((step, index) => {
                const status = getStepStatus(index);
                return (
                  <div key={step.id} className="flex items-center flex-shrink-0">
                    <div className="flex items-center gap-3">
                      <div className={`relative flex items-center justify-center w-10 h-10 rounded-xl border-2 transition-all duration-300 ${
                        status === 'complete' 
                          ? 'bg-green-500/20 border-green-500 text-green-400' 
                          : status === 'current' 
                            ? 'bg-blue-500/20 border-blue-500 text-blue-400 shadow-lg shadow-blue-500/20' 
                            : 'bg-slate-800/50 border-slate-700 text-slate-500'
                      }`}>
                        {status === 'complete' ? <CheckCircle2 size={20} /> : <span className="font-semibold">{index + 1}</span>}
                      </div>
                      <div className="hidden sm:block">
                        <h3 className={`font-semibold text-sm ${status === 'current' ? 'text-white' : 'text-slate-400'}`}>{step.title}</h3>
                        <p className="text-xs text-slate-500">{step.description}</p>
                      </div>
                    </div>
                    {index < STEPS.length - 1 && (
                      <ChevronRight className={`ml-4 flex-shrink-0 ${index < currentStep ? 'text-green-500' : 'text-slate-700'}`} size={20} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* History Panel */}
          {showHistory && (
            <div className="mb-8 bg-slate-900/70 backdrop-blur-xl border border-slate-800/50 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <History className="text-blue-400" size={20} />
                  </div>
                  <h2 className="text-xl font-bold">Proof History</h2>
                </div>
              </div>
              <div className="p-6">
                {proofHistory.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">No proofs generated yet. Your proof history will appear here.</p>
                ) : (
                  <div className="space-y-4">
                    {proofHistory.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800/70 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={item.verified ? 'text-green-400' : 'text-red-400'}>
                            {item.verified ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                          </div>
                          <div>
                            <p className="font-mono text-sm text-slate-300">{item.stellarAddress.slice(0, 12)}...{item.stellarAddress.slice(-8)}</p>
                            <p className="text-sm text-slate-500">Threshold: {formatUsd(item.thresholdCents)} • {new Date(item.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        {item.proofUrl && (
                          <button 
                            className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors"
                            onClick={() => copyToClipboard(item.proofUrl!)}
                            title="Copy link"
                          >
                            <Copy size={16} className="text-slate-400" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Connect Wallet Panel */}
          {!walletConnected ? (
            <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800/50 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <Wallet className="text-blue-400" size={20} />
                  </div>
                  <h2 className="text-xl font-bold">Connect Your Wallet</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-6">
                  <div className="flex gap-3">
                    <Info size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-300">To use FundProof, you need to connect your Freighter wallet. Freighter is the official wallet for the Stellar network.</p>
                  </div>
                </div>
                <button 
                  onClick={connectWallet} 
                  className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-semibold py-3.5 px-8 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
                >
                  <Wallet aria-hidden />
                  Connect Freighter Wallet
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                {error && <p className="mt-4 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</p>}
                <div className="mt-6 pt-6 border-t border-slate-800">
                  <p className="text-slate-500 mb-2">Don't have Freighter installed?</p>
                  <a 
                    href="https://www.freighter.app/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Install Freighter <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>
          ) : (
            /* Create Claim Form */
            <form onSubmit={submit} className="bg-slate-900/70 backdrop-blur-xl border border-slate-800/50 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/20">
                    <WalletCards className="text-cyan-400" size={20} />
                  </div>
                  <h2 className="text-xl font-bold">Create Your Claim</h2>
                </div>
              </div>
              <div className="p-6 space-y-6">
                {/* Connected Wallet Info */}
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-green-400" size={20} />
                    <span className="font-mono text-sm text-slate-300">Connected: {walletPublicKey.slice(0, 12)}...{walletPublicKey.slice(-8)}</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={disconnectWallet}
                    className="px-4 py-2 text-sm text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    Disconnect
                  </button>
                </div>

                {/* Stellar Address Input */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Stellar address (read-only)</label>
                  <input 
                    value={stellarAddress} 
                    readOnly
                    disabled
                    placeholder="Connect your wallet to populate this field"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-400 font-mono text-sm focus:outline-none focus:border-slate-600 disabled:opacity-60"
                  />
                  <p className="mt-2 text-xs text-slate-500">This is automatically populated from your connected Freighter wallet and cannot be edited.</p>
                </div>

                {/* Threshold Input */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Minimum USDC threshold</label>
                  <input 
                    value={threshold} 
                    onChange={(event) => setThreshold(event.target.value)} 
                    inputMode="decimal"
                    placeholder="1000.00"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                  <p className="mt-2 text-xs text-slate-500">This is the minimum balance you want to prove you hold. Your exact balance remains private.</p>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-semibold py-3.5 px-8 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Preparing your attestation...
                    </>
                  ) : (
                    <>
                      <FileKey2 aria-hidden />
                      Generate attestation
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {error && <p className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</p>}
              </div>
            </form>
          )}

          {/* Verification Package Panel */}
          <section className="mt-8 bg-slate-900/70 backdrop-blur-xl border border-slate-800/50 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800/50">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${attestation && passes ? 'bg-green-500/20' : attestation ? 'bg-red-500/20' : 'bg-blue-500/20'}`}>
                  {attestation && passes ? <CheckCircle2 className="text-green-400" size={20} /> : attestation ? <XCircle className="text-red-400" size={20} /> : <ShieldCheck className="text-blue-400" size={20} />}
                </div>
                <h2 className="text-xl font-bold">Verification Package</h2>
              </div>
            </div>

            <div className="p-6">
              {!attestation ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-800/50 mb-6">
                    <ShieldCheck size={32} className="text-slate-500" />
                  </div>
                  <p className="text-slate-500">Connect your wallet and generate an attestation to prepare private circuit inputs and public signals.</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Status Banner */}
                  <div className={`p-4 rounded-xl flex items-center gap-3 ${passes ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
                    {passes ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                    <span className="font-semibold">{passes ? '✓ Local balance satisfies threshold' : '✗ Local balance is below threshold'}</span>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-5 bg-slate-800/50 rounded-xl">
                      <dt className="text-sm text-slate-500 mb-1">Mock balance</dt>
                      <dd className="text-2xl font-bold text-white">{formatUsd(attestation.demo.mockBalanceCents)}</dd>
                    </div>
                    <div className="p-5 bg-slate-800/50 rounded-xl">
                      <dt className="text-sm text-slate-500 mb-1">Threshold</dt>
                      <dd className="text-2xl font-bold text-white">{formatUsd(attestation.thresholdCents)}</dd>
                    </div>
                    <div className="p-5 bg-slate-800/50 rounded-xl">
                      <dt className="text-sm text-slate-500 mb-1">Expires</dt>
                      <dd className="text-2xl font-bold text-white">{new Date(attestation.expiresAt * 1000).toLocaleDateString()}</dd>
                    </div>
                  </div>

                  {/* Technical Details */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Technical Details</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-800/50 rounded-xl">
                        <dt className="text-sm text-slate-500 mb-2">Attestation hash</dt>
                        <dd className="font-mono text-sm text-slate-300 break-all">{attestation.attestationHash}</dd>
                      </div>
                      <div className="p-4 bg-slate-800/50 rounded-xl">
                        <dt className="text-sm text-slate-500 mb-2">Address hash</dt>
                        <dd className="font-mono text-sm text-slate-300 break-all">{attestation.addressHash}</dd>
                      </div>
                    </div>
                  </div>

                  {proofInput && !generatedProof && (
                    <div className="space-y-6">
                      <button 
                        type="button" 
                        onClick={generateProof} 
                        disabled={proofLoading || !passes}
                        className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-semibold py-3.5 px-8 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {proofLoading ? (
                          <>
                            <Loader2 className="animate-spin" size={20} />
                            Generating your ZK proof...
                          </>
                        ) : (
                          <>
                            <PlayCircle aria-hidden />
                            Generate Zero-Knowledge Proof
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>
                      
                      {/* Public Signals Code Block */}
                      <div className="rounded-xl overflow-hidden border border-slate-700">
                        <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
                          <span className="text-sm font-medium text-slate-300">Public Signals</span>
                          <button 
                            className="p-1.5 rounded-lg hover:bg-slate-700 transition-colors"
                            onClick={() => copyToClipboard(JSON.stringify(proofInput.publicSignals, null, 2))}
                            title="Copy to clipboard"
                          >
                            {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-slate-400" />}
                          </button>
                        </div>
                        <div className="p-4 bg-slate-900/50 overflow-x-auto">
                          <pre className="text-sm text-slate-300">{JSON.stringify(proofInput.publicSignals, null, 2)}</pre>
                        </div>
                      </div>
                    </div>
                  )}

                  {generatedProof && (
                    <div className="space-y-8">
                      {/* Proof Complete Status */}
                      <div className="p-5 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-4">
                        <CheckCircle2 size={28} className="text-green-400 flex-shrink-0" />
                        <div>
                          <span className="font-semibold text-green-400 text-lg">Groth16 proof verified locally</span>
                          <p className="text-sm text-green-400/70">Your zero-knowledge proof has been successfully generated and verified</p>
                        </div>
                      </div>
                      
                      {/* Proof Stats */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-5 bg-slate-800/50 rounded-xl">
                          <dt className="text-sm text-slate-500 mb-1">Public signals</dt>
                          <dd className="text-2xl font-bold text-white">{generatedProof.publicSignals.length}</dd>
                        </div>
                        <div className="p-5 bg-slate-800/50 rounded-xl">
                          <dt className="text-sm text-slate-500 mb-1">Proof file</dt>
                          <dd className="text-lg font-bold text-white font-mono">{generatedProof.files.proof}</dd>
                        </div>
                      </div>

                      {/* Share Section */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Share Your Proof</h3>
                        <div className="flex flex-wrap gap-3 mb-6">
                          <button 
                            onClick={() => setShowQR(!showQR)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 text-sm font-medium"
                          >
                            <QrCode size={16} />
                            {showQR ? 'Hide QR Code' : 'Show QR Code'}
                          </button>
                          <button 
                            onClick={() => copyToClipboard(`${window.location.origin}/verify/${generatedProof.attestationId}`)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 text-sm font-medium"
                          >
                            <Copy size={16} />
                            {copied ? 'Copied!' : 'Copy Proof Link'}
                          </button>
                        </div>
                        
                        {showQR && (
                          <div className="inline-block p-6 bg-white rounded-xl">
                            <QRCodeSVG 
                              value={`${window.location.origin}/verify/${generatedProof.attestationId}`}
                              size={200}
                            />
                            <p className="mt-4 text-center text-slate-600 font-medium">Scan to verify this proof</p>
                          </div>
                        )}
                      </div>

                      {/* Full Proof Data Code Block */}
                      <div className="rounded-xl overflow-hidden border border-slate-700">
                        <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
                          <span className="text-sm font-medium text-slate-300">Full Proof Data</span>
                          <button 
                            className="p-1.5 rounded-lg hover:bg-slate-700 transition-colors"
                            onClick={() => copyToClipboard(JSON.stringify(generatedProof, null, 2))}
                            title="Copy to clipboard"
                          >
                            {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-slate-400" />}
                          </button>
                        </div>
                        <div className="p-4 bg-slate-900/50 overflow-x-auto max-h-80">
                          <pre className="text-sm text-slate-300">{JSON.stringify(generatedProof, null, 2)}</pre>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function formatUsd(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
}