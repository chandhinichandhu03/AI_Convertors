import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Zap, ServerCrash } from 'lucide-react';
import MainLayout from '../components/layouts/MainLayout';

export default function LandingPage() {
  return (
    <MainLayout>
      <div className="relative overflow-hidden pt-20 pb-16 px-6">
        
        {/* Glow Orb overlay */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full filter blur-[120px] opacity-10 bg-gradient-to-tr from-purple-600 to-indigo-600 pointer-events-none" />

        {/* Hero Section */}
        <div className="max-w-[900px] mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            100% Local Offline Sandbox
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
            Universal Files Conversion <br />
            <span className="bg-clip-text text-transparent bg-glow-gradient">Powered by Local AI</span>
          </h1>

          <p className="text-zinc-400 text-sm md:text-base font-light max-w-xl mx-auto leading-relaxed">
            Convert documents, compress videos, extract text with OCR, or translate code locally. Zero server uploads, absolute privacy, and premium speeds.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/login"
              className="btn-premium px-6 py-3.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-lg w-full sm:w-auto text-center justify-center"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Value Proposition Cards */}
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 relative z-10">
          {[
            { title: 'Offline Security First', desc: 'Conversions execute within your local browser context. Your document secrets never hit external clouds.', icon: ShieldCheck, color: 'text-emerald-400' },
            { title: 'Zero Network Bottlenecks', desc: 'No upload waits or server queues. Process media files, PDF structures, or CAD models at local hardware speeds.', icon: Zap, color: 'text-indigo-400' },
            { title: 'AI Integration Available', desc: 'Activate local NLLB translation or configure your OpenAI/Gemini credentials to run semantic tasks.', icon: Sparkles, color: 'text-purple-400' }
          ].map((card, idx) => {
            const Icon = card.icon;
            return (
              <div key={idx} className="p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40 backdrop-blur-xl">
                <Icon className={`w-8 h-8 ${card.color} mb-4`} />
                <h3 className="text-sm font-bold text-white mb-2">{card.title}</h3>
                <p className="text-zinc-400 text-xs font-light leading-relaxed">{card.desc}</p>
              </div>
            );
          })}
        </div>

      </div>
    </MainLayout>
  );
}
