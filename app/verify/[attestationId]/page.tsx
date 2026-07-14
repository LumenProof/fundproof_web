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
    <div className="verify-container">
      <div className="verify-card">
        <Link href="/" className="back-link">
          <ArrowLeft size={20} />
          Back to Create Proof
        </Link>
        
        <h1>Proof Verification</h1>
        
        {loading && (
          <div className="loading-state">
            <Loader2 size={48} className="spinner" />
            <p>Verifying your zero-knowledge proof...</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <XCircle size={48} className="error-icon" />
            <p>{error}</p>
          </div>
        )}

        {verification && !loading && (
          <div className={`verification-result ${verification.verified ? 'verified' : 'failed'}`}>
            {verification.verified ? (
              <>
                <div className="success-header">
                  <ShieldCheck size={64} className="success-icon" />
                  <h2>Proof Verified Successfully!</h2>
                </div>
                
                <div className="verification-details">
                  <div className="detail-row">
                    <span className="label">Attestation ID:</span>
                    <span className="value">{attestationId}</span>
                    <button 
                      onClick={() => copyToClipboard(attestationId as string)}
                      className="copy-btn"
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                  
                  <div className="detail-row">
                    <span className="label">Stellar Address:</span>
                    <span className="value address">
                      {verification.attestation?.stellarAddress}
                    </span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="label">Minimum Balance Threshold:</span>
                    <span className="value threshold">
                      {formatCurrency(verification.attestation?.thresholdCents || 0)}
                    </span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="label">Created At:</span>
                    <span className="value">
                      {formatDate(verification.attestation?.createdAt || 0)}
                    </span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="label">Verified At:</span>
                    <span className="value">
                      {formatDate(verification.attestation?.verifiedAt || 0)}
                    </span>
                  </div>
                </div>
                
                <div className="verification-note">
                  <p>
                    This zero-knowledge proof confirms that the Stellar address owns at least the minimum 
                    balance threshold, without revealing any additional financial details.
                  </p>
                </div>
              </>
            ) : (
              <div className="failed-state">
                <XCircle size={64} className="failed-icon" />
                <h2>Proof Verification Failed</h2>
                <p>This proof is either invalid, expired, or has been tampered with.</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      <style jsx>{`
        .verify-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .verify-card {
          background: white;
          border-radius: 16px;
          padding: 40px;
          max-width: 600px;
          width: 100%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          position: relative;
        }
        
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #667eea;
          text-decoration: none;
          font-weight: 500;
          margin-bottom: 20px;
          transition: opacity 0.2s;
        }
        
        .back-link:hover {
          opacity: 0.8;
        }
        
        h1 {
          text-align: center;
          color: #1a1a2e;
          margin-bottom: 30px;
          font-size: 2rem;
        }
        
        .loading-state {
          text-align: center;
          padding: 40px;
        }
        
        .spinner {
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
          color: #667eea;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .error-state {
          text-align: center;
          padding: 40px;
          color: #e74c3c;
        }
        
        .error-icon {
          margin: 0 auto 20px;
        }
        
        .verification-result {
          width: 100%;
        }
        
        .verification-result.verified .success-header {
          text-align: center;
          margin-bottom: 30px;
        }
        
        .success-icon {
          color: #27ae60;
          margin: 0 auto 20px;
        }
        
        .success-header h2 {
          color: #27ae60;
          font-size: 1.8rem;
          margin: 0;
        }
        
        .verification-details {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
        }
        
        .detail-row {
          display: flex;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #e9ecef;
        }
        
        .detail-row:last-child {
          border-bottom: none;
        }
        
        .label {
          font-weight: 600;
          color: #495057;
          min-width: 200px;
        }
        
        .value {
          flex: 1;
          color: #1a1a2e;
          word-break: break-all;
        }
        
        .value.address {
          font-family: 'Courier New', monospace;
          font-size: 0.9rem;
        }
        
        .value.threshold {
          font-weight: 700;
          color: #667eea;
          font-size: 1.1rem;
        }
        
        .copy-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #667eea;
          padding: 4px;
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