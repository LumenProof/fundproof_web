'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowRight, ShieldCheck, Sun, Moon, Wallet, Lock, Eye, Shield,
  Zap, Bot, Layers, CheckCircle2, PlayCircle, Globe, ExternalLink,
  Github, Twitter, MessageCircle
} from 'lucide-react';

type LandingPageProps = {
  onGetStarted: () => void;
};

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.add('light-mode');
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  const features = [
    {
      icon: <Eye className="h-6 w-6" />,
      title: "Complete Privacy",
      description: "Your account balance is never revealed. Only the proof that you meet a certain threshold is shared."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Cryptographically Secure",
      description: "Generate a ZK-Proof that can be independently verified, ensuring the integrity of your attestation."
    },
    {
      icon: <Wallet className="h-6 w-6" />,
      title: "Stellar Integrated",
      description: "Built on the Stellar network, ensuring fast, reliable, and low-cost transactions and attestations."
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Instant Verification",
      description: "Anyone with the proof can instantly verify its authenticity without needing access to your account."
    },
    {
      icon: <Bot className="h-6 w-6" />,
      title: "Fully Automated",
      description: "The entire process, from attestation to proof generation, is automated for a seamless experience."
    },
    {
      icon: <Layers className="h-6 w-6" />,
      title: "User-Friendly",
      description: "A simple, step-by-step process to connect your wallet, set a threshold, and generate your proof."
    }
  ];

  const stats = [
    { value: '10K+', label: 'Proofs Generated' },
    { value: '99.9%', label: 'Uptime' },
    { value: '< 2min', label: 'Average Time' },
    { value: '0', label: 'Data Leaks' }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-panel/80 backdrop-blur-xl border-b border-line' 
            : 'bg-transparent'
        }`}
      >
        <div className="w-[min(1200px,calc(100%-32px))] mx-auto">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <div className="bg-blue p-2 rounded-lg">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold ml-3">FundProof</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#how-it-works" className="text-muted hover:text-ink px-1 py-2 text-sm font-medium transition-colors">
                How It Works
              </a>
              <a href="#features" className="text-muted hover:text-ink px-1 py-2 text-sm font-medium transition-colors">
                Features
              </a>
              <a href="#get-started" className="text-muted hover:text-ink px-1 py-2 text-sm font-medium transition-colors">
                Get Started
              </a>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-line transition-colors"
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun className="h-5 w-5 text-gold" /> : <Moon className="h-5 w-5" />}
              </button>
              <button 
                onClick={onGetStarted}
                className="flex items-center bg-blue hover:bg-blue/90 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Launch App
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/15 transition-colors"
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun className="h-5 w-5 text-gold" /> : <Moon className="h-5 w-5" />}
              </button>
              <button 
                onClick={onGetStarted}
                className="flex items-center bg-blue text-white font-semibold py-2 px-4 rounded-lg"
              >
                Launch
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-40 pb-24 px-6">
          <div className="w-[min(1200px,calc(100%-32px))] mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-line mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green"></span>
                </span>
                <span className="text-sm font-medium">Now live on Stellar Mainnet</span>
              </div>
              <h1 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight">
                Prove Your Funds.<br />
                <span className="text-blue">Keep Your Privacy.</span>
              </h1>
              <p className="text-xl text-muted max-w-2xl mx-auto mb-12">
                Leverage cutting-edge Zero-Knowledge Proofs on the Stellar network to generate cryptographic attestations 
                of your account's funding level. Your balance stays private. Your credibility is proven.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                <button 
                  onClick={onGetStarted}
                  className="w-full sm:w-auto flex items-center justify-center bg-blue hover:bg-blue/90 text-white font-semibold py-4 px-8 rounded-xl text-lg transition-colors"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <button className="w-full sm:w-auto flex items-center justify-center bg-white/5 hover:bg-white/10 border border-line font-semibold py-4 px-8 rounded-xl text-lg transition-colors">
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Watch Demo
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-muted">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green" />
                  <span>Open source</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green" />
                  <span>Self-custodial</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted By Section */}
        <section className="py-16 border-t border-b border-line">
          <div className="w-[min(1200px,calc(100%-32px))] mx-auto px-6">
            <p className="text-center text-sm font-medium mb-10 text-muted">TRUSTED BY DEVELOPERS AND COMPANIES BUILDING ON STELLAR</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-50">
              <div className="text-2xl font-bold">Stellar</div>
              <div className="text-2xl font-bold">Freighter</div>
              <div className="text-2xl font-bold">USDC</div>
              <div className="text-2xl font-bold">SDF</div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 px-6 bg-panel/50">
          <div className="w-[min(1200px,calc(100%-32px))] mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-blue/10 text-blue mb-6">How It Works</span>
              <h2 className="text-4xl font-bold mb-4">Three simple steps</h2>
              <p className="text-xl text-muted max-w-2xl mx-auto">Generate your private proof-of-funds in under five minutes. No technical expertise required.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="group relative">
                <div className="bg-panel p-8 rounded-2xl border border-line group-hover:border-blue/20 transition-colors">
                  <span className="text-8xl font-bold text-line">01</span>
                  <div className="-mt-12 mb-6 inline-flex p-4 rounded-xl bg-blue text-white">
                    <Wallet className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Connect Your Wallet</h3>
                  <p className="text-muted">Link your Freighter wallet to FundProof in just one click. Your keys stay in your control at all times.</p>
                </div>
              </div>
              <div className="group relative">
                <div className="bg-panel p-8 rounded-2xl border border-line group-hover:border-blue/20 transition-colors">
                  <span className="text-8xl font-bold text-line">02</span>
                  <div className="-mt-12 mb-6 inline-flex p-4 rounded-xl bg-blue text-white">
                    <Lock className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Set Your Threshold</h3>
                  <p className="text-muted">Define the minimum balance you want to prove you hold. Your actual amount remains completely private.</p>
                </div>
              </div>
              <div className="group relative">
                <div className="bg-panel p-8 rounded-2xl border border-line group-hover:border-blue/20 transition-colors">
                  <span className="text-8xl font-bold text-line">03</span>
                  <div className="-mt-12 mb-6 inline-flex p-4 rounded-xl bg-blue text-white">
                    <ShieldCheck className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Generate & Share</h3>
                  <p className="text-muted">Create your zero-knowledge proof and share it with anyone. They can verify without accessing your data.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-24 px-6">
          <div className="w-[min(1200px,calc(100%-32px))] mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-blue/10 text-blue mb-6">Powerful Features</span>
              <h2 className="text-4xl font-bold mb-4">Everything you need</h2>
              <p className="text-xl text-muted max-w-2xl mx-auto">Discover the advantages of using FundProof for all your financial attestation needs.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="bg-panel p-8 rounded-2xl border border-line hover:border-blue/20 transition-colors">
                  <div className="bg-blue/10 p-3 rounded-lg w-fit mb-6">
                    <div className="text-blue">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 px-6 bg-panel/50">
          <div className="w-[min(1200px,calc(100%-32px))] mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 p-12 rounded-2xl bg-panel border border-line">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl sm:text-5xl font-bold text-blue mb-2">{stat.value}</div>
                  <div className="text-sm font-medium text-muted">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Get Started Section */}
        <section id="get-started" className="py-24 px-6">
          <div className="w-[min(1200px,calc(100%-32px))] mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-panel p-12 sm:p-20 rounded-[3rem] border border-line">
                <h2 className="text-4xl sm:text-5xl font-bold mb-6">Ready to experience private finance?</h2>
                <p className="text-xl text-muted mb-10 max-w-3xl mx-auto">
                  Create your first private proof-of-funds in minutes. Connect your wallet and experience the future of financial privacy.
                </p>
                <button 
                  onClick={onGetStarted}
                  className="inline-flex items-center justify-center bg-blue hover:bg-blue/90 text-white font-semibold py-4 px-10 rounded-xl text-lg transition-colors"
                >
                  Launch App & Create Your First Proof
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-line py-12 px-6">
        <div className="w-[min(1200px,calc(100%-32px))] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center">
            <div className="bg-blue p-2 rounded-lg">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold ml-3">FundProof</span>
          </div>
          <p className="text-muted text-sm">&copy; 2024 FundProof. Built with ❤️ for the Stellar community.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors">
              <Twitter className="h-4 w-4" />
              Twitter
            </a>
            <a href="#" className="flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors">
              <Github className="h-4 w-4" />
              GitHub
            </a>
            <a href="#" className="flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors">
              <MessageCircle className="h-4 w-4" />
              Discord
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}