'use client';

import { ArrowRight, ShieldCheck, FileKey2, PlayCircle, Zap, Bot, Star } from 'lucide-react';

type LandingPageProps = {
  onGetStarted: () => void;
};

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <ShieldCheck className="h-8 w-8 text-blue-500" />
              <span className="text-2xl font-bold ml-3 text-gray-100">FundProof</span>
            </div>
            <div className="hidden md:block">
              <nav className="flex items-center space-x-4">
                <a href="#how-it-works" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">How It Works</a>
                <a href="#features" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Features</a>
                <a href="#get-started" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Get Started</a>
              </nav>
            </div>
            <button 
              onClick={onGetStarted}
              className="hidden md:flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-transform transform hover:scale-105"
            >
              Launch App <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="text-center py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
          <div className="w-full max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-100">
              Prove Your Financial Standing, Privately.
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8">
              Leverage Zero-Knowledge Proofs on the Stellar network to generate cryptographic attestations of your account's funding level without revealing your balance.
            </p>
            <button 
              onClick={onGetStarted}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 flex items-center justify-center mx-auto"
            >
              Get Started <ArrowRight className="ml-2" />
            </button>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 bg-gray-800">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-100">How It Works</h2>
              <p className="text-lg text-gray-400 mt-4 max-w-3xl mx-auto">A simple, three-step process to generate your private proof-of-funds.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="bg-gray-700 rounded-full p-4 mb-4">
                  <FileKey2 className="h-10 w-10 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">1. Connect & Set Threshold</h3>
                <p className="text-gray-400">
                  Connect your Freighter wallet and specify the minimum USDC balance you want to prove you hold.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-gray-700 rounded-full p-4 mb-4">
                  <Zap className="h-10 w-10 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">2. Generate Attestation</h3>
                <p className="text-gray-400">
                  Our service generates a signed attestation confirming your balance meets the threshold, without revealing the exact amount.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-gray-700 rounded-full p-4 mb-4">
                  <ShieldCheck className="h-10 w-10 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">3. Create & Share ZK Proof</h3>
                <p className="text-gray-400">
                  A Zero-Knowledge Proof is created based on the attestation. Share the proof with anyone to verify your claim.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-gray-900">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-100">Key Features</h2>
              <p className="text-lg text-gray-400 mt-4 max-w-3xl mx-auto">Discover the advantages of using FundProof for your financial attestations.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-800 p-6 rounded-lg text-center">
                <ShieldCheck className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Complete Privacy</h3>
                <p className="text-gray-400">
                  Your account balance is never revealed. Only the proof that you meet a certain threshold is shared.
                </p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg text-center">
                <FileKey2 className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Cryptographically Secure</h3>
                <p className="text-gray-400">
                  Generate a ZK-Proof that can be independently verified, ensuring the integrity of your attestation.
                </p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg text-center">
                <PlayCircle className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">User-Friendly</h3>
                <p className="text-gray-400">
                  A simple, step-by-step process to connect your wallet, set a threshold, and generate your proof.
                </p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg text-center">
                <Bot className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Automated Process</h3>
                <p className="text-gray-400">
                  The entire process, from attestation to proof generation, is automated for a seamless experience.
                </p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg text-center">
                <Star className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Stellar Integrated</h3>
                <p className="text-gray-400">
                  Built on the Stellar network, ensuring fast, reliable, and low-cost transactions and attestations.
                </p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg text-center">
                <Zap className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Instant Verification</h3>
                <p className="text-gray-400">
                  Anyone with the proof can instantly verify its authenticity without needing access to your account.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Get Started Section */}
        <section id="get-started" className="py-20 bg-gray-800">
          <div className="w-full max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-100">Ready to Get Started?</h2>
            <p className="text-lg text-gray-400 mt-4 mb-8">
              Create your first private proof-of-funds in minutes. Connect your wallet and experience the future of financial privacy.
            </p>
            <button 
              onClick={onGetStarted}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 flex items-center justify-center mx-auto"
            >
              Launch App & Create Proof <ArrowRight className="ml-2" />
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="w-full max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-400">
          <p>&copy; 2024 FundProof. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}