'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck, FileKey2, PlayCircle, Zap, Bot, Star, Sun, Moon } from 'lucide-react';

type LandingPageProps = {
  onGetStarted: () => void;
};

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Check saved preference or default to dark
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

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Header */}
      <header className={`${isDarkMode ? 'bg-gray-900/80' : 'bg-white/80'} backdrop-blur-sm sticky top-0 z-50`}>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <ShieldCheck className={`h-8 w-8 text-blue-500`} />
              <span className={`text-2xl font-bold ml-3 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>FundProof</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <nav className="flex items-center space-x-6">
                <a href="#how-it-works" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} px-3 py-2 rounded-md text-sm font-medium transition-colors`}>How It Works</a>
                <a href="#features" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} px-3 py-2 rounded-md text-sm font-medium transition-colors`}>Features</a>
                <a href="#get-started" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} px-3 py-2 rounded-md text-sm font-medium transition-colors`}>Get Started</a>
              </nav>
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-gray-700" />}
              </button>
              <button 
                onClick={onGetStarted}
                className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-transform transform hover:scale-105"
              >
                Launch App <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
            {/* Mobile menu */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-gray-700" />}
              </button>
              <button 
                onClick={onGetStarted}
                className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-lg text-xs transition-transform transform hover:scale-105"
              >
                Launch
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className={`text-center py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
          <div className="w-full max-w-4xl mx-auto">
            <h1 className={`text-4xl md:text-6xl font-bold mb-4 transition-colors duration-300 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              Prove Your Financial Standing, Privately.
            </h1>
            <p className={`text-lg md:text-xl max-w-2xl mx-auto mb-8 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
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
        <section id="how-it-works" className={`py-20 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className={`text-3xl md:text-4xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>How It Works</h2>
              <p className={`text-lg mt-4 max-w-3xl mx-auto transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>A simple, three-step process to generate your private proof-of-funds.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className={`rounded-full p-4 mb-4 transition-colors duration-300 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <FileKey2 className="h-10 w-10 text-blue-400" />
                </div>
                <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>1. Connect & Set Threshold</h3>
                <p className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Connect your Freighter wallet and specify the minimum USDC balance you want to prove you hold.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className={`rounded-full p-4 mb-4 transition-colors duration-300 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <Zap className="h-10 w-10 text-blue-400" />
                </div>
                <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>2. Generate Attestation</h3>
                <p className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Our service generates a signed attestation confirming your balance meets the threshold, without revealing the exact amount.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className={`rounded-full p-4 mb-4 transition-colors duration-300 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <ShieldCheck className="h-10 w-10 text-blue-400" />
                </div>
                <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>3. Create & Share ZK Proof</h3>
                <p className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  A Zero-Knowledge Proof is created based on the attestation. Share the proof with anyone to verify your claim.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className={`py-20 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className={`text-3xl md:text-4xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Key Features</h2>
              <p className={`text-lg mt-4 max-w-3xl mx-auto transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Discover the advantages of using FundProof for your financial attestations.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className={`p-6 rounded-lg text-center transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <ShieldCheck className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Complete Privacy</h3>
                <p className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Your account balance is never revealed. Only the proof that you meet a certain threshold is shared.
                </p>
              </div>
              <div className={`p-6 rounded-lg text-center transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <FileKey2 className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Cryptographically Secure</h3>
                <p className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Generate a ZK-Proof that can be independently verified, ensuring the integrity of your attestation.
                </p>
              </div>
              <div className={`p-6 rounded-lg text-center transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <PlayCircle className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>User-Friendly</h3>
                <p className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  A simple, step-by-step process to connect your wallet, set a threshold, and generate your proof.
                </p>
              </div>
              <div className={`p-6 rounded-lg text-center transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <Bot className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Automated Process</h3>
                <p className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  The entire process, from attestation to proof generation, is automated for a seamless experience.
                </p>
              </div>
              <div className={`p-6 rounded-lg text-center transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <Star className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Stellar Integrated</h3>
                <p className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Built on the Stellar network, ensuring fast, reliable, and low-cost transactions and attestations.
                </p>
              </div>
              <div className={`p-6 rounded-lg text-center transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <Zap className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Instant Verification</h3>
                <p className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Anyone with the proof can instantly verify its authenticity without needing access to your account.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Get Started Section */}
        <section id="get-started" className={`py-20 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="w-full max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className={`text-3xl md:text-4xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Ready to Get Started?</h2>
            <p className={`text-lg mt-4 mb-8 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
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
      <footer className={`transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="w-full max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center">
          <p className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>&copy; 2024 FundProof. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}