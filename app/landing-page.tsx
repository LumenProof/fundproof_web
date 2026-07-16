'use client';

import { ShieldCheck, Zap, Lock } from 'lucide-react';

type LandingPageProps = {
  onGetStarted: () => void;
};

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl blur-lg opacity-50"></div>
            <div className="relative bg-gradient-to-br from-blue-500 to-cyan-400 p-2.5 rounded-xl">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">FundProof</span>
        </div>
      </div>

      <main className="relative pt-20 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent mb-6 leading-tight">
            Prove Your Funds, Preserve Your Privacy
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Generate a zero-knowledge proof to verify your Stellar USDC balance without revealing the exact amount.
          </p>
          <button 
            onClick={onGetStarted}
            className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-semibold py-4 px-10 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transform hover:scale-105"
          >
            Get Started
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
          </button>
        </div>

        <div className="max-w-6xl mx-auto mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8 text-center transform hover:-translate-y-2 transition-transform duration-300">
            <div className="inline-block p-4 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl mb-4">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Private by Design</h3>
            <p className="text-slate-400">Your exact balance is never revealed, only that it meets a certain threshold.</p>
          </div>
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8 text-center transform hover:-translate-y-2 transition-transform duration-300">
            <div className="inline-block p-4 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl mb-4">
              <ShieldCheck className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Cryptographically Secure</h3>
            <p className="text-slate-400">Powered by zk-SNARKs, the same technology that secures leading cryptocurrencies.</p>
          </div>
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8 text-center transform hover:-translate-y-2 transition-transform duration-300">
            <div className="inline-block p-4 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl mb-4">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Fast & Simple</h3>
            <p className="text-slate-400">Connect your wallet, set a threshold, and generate a shareable proof in seconds.</p>
          </div>
        </div>
      </main>
    </div>
  );
}