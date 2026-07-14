'use client';

import { ArrowRight, ShieldCheck, FileKey2, PlayCircle } from 'lucide-react';

type LandingPageProps = {
  onGetStarted: () => void;
};

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-gray-100">FundProof</h1>
          <p className="text-xl text-gray-400">
            Prove Your Financial Standing, Without Revealing Your Balance.
          </p>
        </header>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <p className="text-2xl mb-8 text-gray-300 max-w-2xl mx-auto">
            Leverage the power of Zero-Knowledge Proofs on the Stellar network to generate cryptographic attestations of your account's funding level.
          </p>
          <button 
            onClick={onGetStarted}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 flex items-center justify-center mx-auto"
          >
            Get Started <ArrowRight className="ml-2" />
          </button>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-gray-800 p-6 rounded-lg">
            <ShieldCheck className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Private & Secure</h3>
            <p className="text-gray-400">
              Your actual account balance is never revealed. Only the proof that you meet a certain threshold is shared.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <FileKey2 className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Cryptographically Verifiable</h3>
            <p className="text-gray-400">
              Generate a ZK-Proof that can be independently verified by anyone, ensuring the integrity of your attestation.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <PlayCircle className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Easy to Use</h3>
            <p className="text-gray-400">
              A simple, step-by-step process to connect your wallet, set a threshold, and generate your proof.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}