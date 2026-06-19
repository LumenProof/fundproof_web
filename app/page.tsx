'use client';

import { FormEvent, useState } from 'react';
import { CheckCircle2, FileKey2, PlayCircle, ShieldCheck, WalletCards, XCircle } from 'lucide-react';

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

const apiBase = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4000';

export default function Home() {
  const [stellarAddress, setStellarAddress] = useState('GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF');
  const [threshold, setThreshold] = useState('1000');
  const [attestation, setAttestation] = useState<AttestationResponse | null>(null);
  const [proofInput, setProofInput] = useState<ProofInputResponse | null>(null);
  const [generatedProof, setGeneratedProof] = useState<GeneratedProofResponse | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [proofLoading, setProofLoading] = useState(false);

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

      setGeneratedProof((await proofResponse.json()) as GeneratedProofResponse);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Proof generation failed.');
    } finally {
      setProofLoading(false);
    }
  }

  const passes = attestation ? attestation.demo.mockBalanceCents >= attestation.thresholdCents : false;

  return (
    <main>
      <section className="shell">
        <div className="headline">
          <div className="brand">
            <ShieldCheck aria-hidden />
            <span>FundProof</span>
          </div>
          <h1>Private proof-of-funds for Stellar USDC</h1>
          <p>
            Prove a wallet meets a funding threshold without revealing the exact balance. The local demo uses a backend-signed attestation and Circom/Groth16 circuit input ready for Stellar verification.
          </p>
        </div>

        <div className="workspace">
          <form onSubmit={submit} className="panel">
            <div className="panel-title">
              <WalletCards aria-hidden />
              <h2>Create Claim</h2>
            </div>

            <label>
              Stellar address
              <input value={stellarAddress} onChange={(event) => setStellarAddress(event.target.value)} />
            </label>

            <label>
              Minimum USDC
              <input value={threshold} onChange={(event) => setThreshold(event.target.value)} inputMode="decimal" />
            </label>

            <button type="submit" disabled={loading}>
              <FileKey2 aria-hidden />
              {loading ? 'Preparing...' : 'Generate attestation'}
            </button>

            {error ? <p className="error">{error}</p> : null}
          </form>

          <section className="panel result-panel">
            <div className="panel-title">
              {attestation && passes ? <CheckCircle2 aria-hidden /> : <XCircle aria-hidden />}
              <h2>Verification Package</h2>
            </div>

            {!attestation ? (
              <p className="empty">Generate an attestation to prepare private circuit inputs and public signals.</p>
            ) : (
              <div className="result">
                <div className={passes ? 'status pass' : 'status fail'}>
                  {passes ? 'Local balance satisfies threshold' : 'Local balance is below threshold'}
                </div>

                <dl>
                  <div>
                    <dt>Mock balance</dt>
                    <dd>{formatUsd(attestation.demo.mockBalanceCents)}</dd>
                  </div>
                  <div>
                    <dt>Threshold</dt>
                    <dd>{formatUsd(attestation.thresholdCents)}</dd>
                  </div>
                  <div>
                    <dt>Attestation hash</dt>
                    <dd>{attestation.attestationHash}</dd>
                  </div>
                  <div>
                    <dt>Expires</dt>
                    <dd>{new Date(attestation.expiresAt * 1000).toLocaleString()}</dd>
                  </div>
                </dl>

                {proofInput ? (
                  <>
                    <button type="button" className="secondary-button" onClick={generateProof} disabled={proofLoading || !passes}>
                      <PlayCircle aria-hidden />
                      {proofLoading ? 'Generating proof...' : 'Generate ZK proof'}
                    </button>
                    <pre>{JSON.stringify(proofInput.publicSignals, null, 2)}</pre>
                  </>
                ) : null}

                {generatedProof ? (
                  <div className="proof-box">
                    <div className="status pass">
                      Groth16 proof verified locally
                    </div>
                    <dl>
                      <div>
                        <dt>Public signals</dt>
                        <dd>{generatedProof.publicSignals.length}</dd>
                      </div>
                      <div>
                        <dt>Proof file</dt>
                        <dd>{generatedProof.files.proof}</dd>
                      </div>
                    </dl>
                  </div>
                ) : null}
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
