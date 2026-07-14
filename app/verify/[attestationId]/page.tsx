'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ShieldCheck, XCircle, Loader2, Copy, Check, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type VerificationResponse = {
  verified: boolean;
  attestation?: {
    stellarAddress: string;
    thresholdCents: number;
    createdAt: number;
    verifiedAt: number;
  };
  error?: string;
};

const apiBase = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4000';

export default function VerifyPage() {
  const { attestationId } = useParams();
  const [verification, setVerification] = useState<VerificationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const verifyProof = async () => {
      if (!attestationId) return;
      
      try {
        setLoading(true);
        const response = await fetch(`${apiBase}/verify/${attestationId}`);
        
        if (!response.ok) {
          throw new Error('Failed to verify proof');
        }
        
        const data = await response.json();
        setVerification(data);
      } catch (err) {
        console.error('Verification error:', err);
        setError('Failed to verify the proof. It may be invalid or expired.');
      } finally {
        setLoading(false);
      }
    };

    verifyProof();
  }, [attestationId]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy');
    }
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-x-hidden">
      {/* Animated Background - matching the app's design language */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header - matching the app's header style */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-2xl border-b border-slate-800/50 shadow-2xl shadow-black/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-blue-500 to-cyan-400 p-2.5 rounded-xl">
                  <ShieldCheck className="h-6 w-6 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">FundProof</span>
            </Link>
            
            <Link 
              href="/"
              className="group relative inline-flex items-center gap-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 text-white font-semibold py-2.5 px-5 rounded-xl transition-all duration-300"
            >
              <ArrowLeft size={18} />
              Back to App
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative pt-32 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent mb-4">
              Proof Verification
            </h1>
          </div>

          {/* Verification Card */}
          <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800/50 rounded-2xl shadow-2xl overflow-hidden">
            {loading && (
              <div className="p-12 text-center">
                <Loader2 size={48} className="animate-spin mx-auto mb-6 text-blue-400" />
                <p className="text-slate-400">Verifying your zero-knowledge proof...</p>
              </div>
            )}

            {error && (
              <div className="p-12 text-center">
                <XCircle size={48} className="mx-auto mb-6 text-red-400" />
                <p className="text-red-400">{error}</p>
              </div>
            )}

            {verification && !loading && (
              <div className="p-8">
                {verification.verified ? (
                  <>
                    {/* Success Header */}
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-6">
                        <ShieldCheck size={48} className="text-green-400" />
                      </div>
                      <h2 className="text-3xl font-bold text-green-400 mb-2">Proof Verified Successfully!</h2>
                    </div>
                    
                    {/* Verification Details */}
                    <div className="bg-slate-800/50 rounded-xl p-6 mb-6">
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-slate-700 last:border-0">
                          <span className="font-semibold text-slate-300 sm:min-w-[220px] mb-1 sm:mb-0">Attestation ID:</span>
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-white font-mono text-sm break-all flex-1">{attestationId}</span>
                            <button 
                              onClick={() => copyToClipboard(attestationId as string)}
                              className="p-2 rounded-lg hover:bg-slate-700 transition-colors flex-shrink-0"
                              title="Copy to clipboard"
                            >
                              {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-slate-400" />}
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-slate-700 last:border-0">
                          <span className="font-semibold text-slate-300 sm:min-w-[220px] mb-1 sm:mb-0">Stellar Address:</span>
                          <span className="text-white font-mono text-sm break-all">{verification.attestation?.stellarAddress}</span>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-slate-700 last:border-0">
                          <span className="font-semibold text-slate-300 sm:min-w-[220px] mb-1 sm:mb-0">Minimum Balance Threshold:</span>
                          <span className="text-2xl font-bold text-blue-400">{formatCurrency(verification.attestation?.thresholdCents || 0)}</span>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-slate-700 last:border-0">
                          <span className="font-semibold text-slate-300 sm:min-w-[220px] mb-1 sm:mb-0">Created At:</span>
                          <span className="text-slate-300">{formatDate(verification.attestation?.createdAt || 0)}</span>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-slate-700 last:border-0">
                          <span className="font-semibold text-slate-300 sm:min-w-[220px] mb-1 sm:mb-0">Verified At:</span>
                          <span className="text-slate-300">{formatDate(verification.attestation?.verifiedAt || 0)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Verification Note */}
                    <div className="p-5 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                      <p className="text-slate-300">
                        This zero-knowledge proof confirms that the Stellar address owns at least the minimum 
                        balance threshold, without revealing any additional financial details.
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/20 mb-6">
                      <XCircle size={48} className="text-red-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-red-400 mb-4">Proof Verification Failed</h2>
                    <p className="text-slate-400">This proof is either invalid, expired, or has been tampered with.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
          transition: color 0.2s;
        }
        
        .copy-btn:hover {
          color: #764ba2;
        }
        
        .verification-note {
          background: #e8f4fd;
          border-radius: 8px;
          padding: 16px;
          margin-top: 20px;
        }
        
        .verification-note p {
          margin: 0;
          color: #2980b9;
          line-height: 1.6;
          font-size: 0.95rem;
        }
        
        .failed-state {
          text-align: center;
          padding: 40px;
        }
        
        .failed-icon {
          color: #e74c3c;
          margin: 0 auto 20px;
        }
        
        .failed-state h2 {
          color: #e74c3c;
          font-size: 1.8rem;
          margin: 0 0 15px;
        }
        
        .failed-state p {
          color: #666;
          margin: 0;
        }
        
        @media (max-width: 600px) {
          .verify-card {
            padding: 20px;
          }
          
          .detail-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          
          .label {
            min-width: auto;
          }
        }
      `}</style>
    </div>
  );
}