'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowRight, ShieldCheck, Sun, Moon, Wallet, Lock, Eye, Shield,
  Zap, Bot, Layers, CheckCircle2, PlayCircle, Github, Twitter, MessageCircle,
  Star, ArrowUpRight, Globe, Users, TrendingUp, CreditCard, Database,
  Sparkles, ChevronDown, Menu, X
} from 'lucide-react';

type LandingPageProps = {
  onGetStarted: () => void;
};

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.add('dark');
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
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
  };

  const features = [
    {
      icon: <Eye className="h-6 w-6" />,
      title: "Complete Privacy",
      description: "Your account balance is never revealed. Only the proof that you meet a certain threshold is shared.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Cryptographically Secure",
      description: "Generate a ZK-Proof that can be independently verified, ensuring the integrity of your attestation.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Wallet className="h-6 w-6" />,
      title: "Stellar Integrated",
      description: "Built on the Stellar network, ensuring fast, reliable, and low-cost transactions and attestations.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Instant Verification",
      description: "Anyone with the proof can instantly verify its authenticity without needing access to your account.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <Bot className="h-6 w-6" />,
      title: "Fully Automated",
      description: "The entire process, from attestation to proof generation, is automated for a seamless experience.",
      gradient: "from-indigo-500 to-blue-500"
    },
    {
      icon: <Layers className="h-6 w-6" />,
      title: "User-Friendly",
      description: "A simple, step-by-step process to connect your wallet, set a threshold, and generate your proof.",
      gradient: "from-violet-500 to-purple-500"
    }
  ];

  const stats = [
    { value: '10K+', label: 'Proofs Generated', icon: <Database className="h-5 w-5" /> },
    { value: '99.9%', label: 'Uptime', icon: <TrendingUp className="h-5 w-5" /> },
    { value: '< 2min', label: 'Average Time', icon: <Zap className="h-5 w-5" /> },
    { value: '0', label: 'Data Leaks', icon: <ShieldCheck className="h-5 w-5" /> }
  ];

  const testimonials = [
    {
      quote: "FundProof revolutionized how we verify funds on Stellar. Our users love the privacy it provides.",
      author: "Sarah Chen",
      role: "CTO, StellarHub",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100"
    },
    {
      quote: "The zero-knowledge implementation is flawless. Finally, a privacy-first solution we can trust.",
      author: "Marcus Johnson",
      role: "Lead Developer, DeFiStellar",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100"
    },
    {
      quote: "Incredible user experience. Our onboarding rates increased by 300% after integrating FundProof.",
      author: "Elena Rodriguez",
      role: "Product Lead, Anchor Protocol",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled 
            ? 'bg-slate-950/80 backdrop-blur-2xl border-b border-slate-800/50 shadow-2xl shadow-black/20' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-blue-500 to-cyan-400 p-2.5 rounded-xl">
                  <ShieldCheck className="h-6 w-6 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">FundProof</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              {['How It Works', 'Features', 'Testimonials', 'Pricing'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-slate-400 hover:text-white px-1 py-2 text-sm font-medium transition-all duration-300 relative group"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300"
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-slate-300" />}
              </button>
              <button 
                onClick={onGetStarted}
                className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-semibold py-2.5 px-5 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
              >
                Launch App
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <button 
              className="md:hidden p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900/95 backdrop-blur-2xl border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-6 py-6 space-y-4">
              {['How It Works', 'Features', 'Testimonials', 'Pricing'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="block text-slate-400 hover:text-white text-lg font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <button 
                onClick={onGetStarted}
                className="w-full mt-4 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold py-3 px-6 rounded-xl"
              >
                Launch App
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative pt-40 pb-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-5xl mx-auto text-center">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm mb-10 group hover:border-blue-500/50 transition-colors duration-300">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400"></span>
                </span>
                <span className="text-sm font-medium text-slate-300">Now live on Stellar Mainnet</span>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
                Prove Your Funds.
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  Keep Your Privacy.
                </span>
              </h1>
              
              <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
                Leverage cutting-edge Zero-Knowledge Proofs on the Stellar network to generate cryptographic attestations 
                of your account's funding level. Your balance stays private. Your credibility is proven.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                <button 
                  onClick={onGetStarted}
                  className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-semibold py-4 px-8 rounded-2xl text-lg transition-all duration-300 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-slate-600/50 backdrop-blur-sm font-semibold py-4 px-8 rounded-2xl text-lg transition-all duration-300 hover:scale-105">
                  <PlayCircle className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                  Watch Demo
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-slate-500">
                {['No credit card required', 'Open source', 'Self-custodial', 'Audited code'].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative mt-24 max-w-5xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 pointer-events-none"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border border-slate-800/50">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-1">
                  <div className="bg-slate-900 rounded-[20px] p-8">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="ml-4 text-sm text-slate-500">FundProof Dashboard</span>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl p-6 border border-blue-500/20">
                        <Wallet className="w-8 h-8 text-blue-400 mb-4" />
                        <div className="text-2xl font-bold mb-1">Connected</div>
                        <div className="text-sm text-slate-400">Freighter Wallet</div>
                      </div>
                      <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-500/20">
                        <Lock className="w-8 h-8 text-purple-400 mb-4" />
                        <div className="text-2xl font-bold mb-1">Threshold Set</div>
                        <div className="text-sm text-slate-400">10,000 USDC</div>
                      </div>
                      <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-500/20">
                        <ShieldCheck className="w-8 h-8 text-green-400 mb-4" />
                        <div className="text-2xl font-bold mb-1">Proof Ready</div>
                        <div className="text-sm text-slate-400">Generated successfully</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted By Section */}
        <section className="py-20 border-y border-slate-800/50 bg-slate-900/30">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-center text-sm font-semibold text-slate-500 uppercase tracking-widest mb-12">
              Trusted by leading teams building on stellar
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
              {['Stellar Development Foundation', 'Freighter', 'Circle', 'Anchor Protocol'].map((company) => (
                <div key={company} className="text-xl font-bold text-slate-500 hover:text-slate-300 transition-colors duration-300">
                  {company}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold bg-blue-500/10 text-blue-400 mb-6 border border-blue-500/20">
                How It Works
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Three simple steps</h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Generate your private proof-of-funds in under five minutes. No technical expertise required.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { 
                  num: '01', 
                  title: 'Connect Your Wallet', 
                  desc: 'Link your Freighter wallet to FundProof in just one click. Your keys stay in your control at all times.',
                  icon: <Wallet className="h-8 w-8" />,
                  gradient: 'from-blue-500 to-cyan-400'
                },
                { 
                  num: '02', 
                  title: 'Set Your Threshold', 
                  desc: 'Define the minimum balance you want to prove you hold. Your actual amount remains completely private.',
                  icon: <Lock className="h-8 w-8" />,
                  gradient: 'from-purple-500 to-pink-500'
                },
                { 
                  num: '03', 
                  title: 'Generate & Share', 
                  desc: 'Create your zero-knowledge proof and share it with anyone. They can verify without accessing your data.',
                  icon: <ShieldCheck className="h-8 w-8" />,
                  gradient: 'from-green-500 to-emerald-500'
                }
              ].map((step, index) => (
                <div key={index} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative bg-slate-800/30 hover:bg-slate-800/50 backdrop-blur-sm p-10 rounded-3xl border border-slate-700/50 group-hover:border-blue-500/30 transition-all duration-500 h-full">
                    <span className="text-8xl font-black text-slate-800 group-hover:text-slate-700 transition-colors">{step.num}</span>
                    <div className={`-mt-14 mb-6 inline-flex p-4 rounded-2xl bg-gradient-to-br ${step.gradient} text-white shadow-lg`}>
                      {step.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-32 px-6 bg-slate-900/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold bg-blue-500/10 text-blue-400 mb-6 border border-blue-500/20">
                Powerful Features
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Everything you need</h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Discover the advantages of using FundProof for all your financial attestation needs.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="group relative bg-slate-800/30 hover:bg-slate-800/50 backdrop-blur-sm p-8 rounded-3xl border border-slate-700/50 hover:border-blue-500/30 transition-all duration-500 hover:-translate-y-2"
                >
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="relative rounded-[3rem] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500"></div>
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8 p-16 text-center">
                {stats.map((stat, index) => (
                  <div key={index} className="text-white">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm mb-4">
                      {stat.icon}
                    </div>
                    <div className="text-4xl sm:text-5xl font-black mb-2">{stat.value}</div>
                    <div className="text-sm font-medium text-white/80">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-32 px-6 bg-slate-900/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold bg-blue-500/10 text-blue-400 mb-6 border border-blue-500/20">
                Testimonials
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Loved by thousands</h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                See what developers and companies are saying about FundProof.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((item, index) => (
                <div key={index} className="bg-slate-800/30 backdrop-blur-sm p-8 rounded-3xl border border-slate-700/50">
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 mb-8 leading-relaxed italic">"{item.quote}"</p>
                  <div className="flex items-center gap-4">
                    <img src={item.avatar} alt={item.author} className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/50" />
                    <div>
                      <div className="font-semibold">{item.author}</div>
                      <div className="text-sm text-slate-400">{item.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="get-started" className="py-32 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="relative rounded-[3rem] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900"></div>
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyan-500/20 rounded-full blur-3xl"></div>
              <div className="relative p-12 sm:p-20 text-center border border-slate-700/50 rounded-[3rem]">
                <Sparkles className="w-12 h-12 text-blue-400 mx-auto mb-8" />
                <h2 className="text-4xl sm:text-5xl font-bold mb-6">Ready to experience private finance?</h2>
                <p className="text-xl text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed">
                  Create your first private proof-of-funds in minutes. Connect your wallet and experience the future of financial privacy.
                </p>
                <button 
                  onClick={onGetStarted}
                  className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-semibold py-4 px-10 rounded-2xl text-lg transition-all duration-300 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105"
                >
                  Launch App & Create Your First Proof
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-16 px-6 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-2 rounded-xl">
                  <ShieldCheck className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">FundProof</span>
              </div>
              <p className="text-slate-400 mb-6 max-w-xs leading-relaxed">
                Empowering financial privacy through zero-knowledge proofs on the Stellar network.
              </p>
              <div className="flex items-center gap-4">
                {[Twitter, Github, MessageCircle].map((Icon, i) => (
                  <a key={i} href="#" className="p-3 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300">
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Security', 'Changelog'] },
              { title: 'Resources', links: ['Documentation', 'API Reference', 'Blog', 'Support'] },
              { title: 'Company', links: ['About', 'Careers', 'Privacy', 'Terms'] }
            ].map((section) => (
              <div key={section.title}>
                <h4 className="font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-slate-400 hover:text-white transition-colors duration-300 text-sm">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">&copy; 2024 FundProof. Built with ❤️ for the Stellar community.</p>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}