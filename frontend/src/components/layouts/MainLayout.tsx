import React from 'react';
import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');

  return (
    <div className="min-h-screen flex flex-col justify-between bg-zinc-950">
      
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-zinc-950/60 backdrop-blur-md border-b border-zinc-900/80 px-6 py-3.5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #8B5CF6, #A855F7)' }}>
            <Activity className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-sm tracking-tight">OmniConvert AI</span>
        </Link>

        <div>
          {token ? (
            <Link to="/dashboard" className="btn-premium px-4 py-2 rounded-xl text-xs font-bold text-white">
              Workspace
            </Link>
          ) : (
            <Link to="/login" className="btn-premium px-4 py-2 rounded-xl text-xs font-bold text-white">
              Sign In
            </Link>
          )}
        </div>
      </header>

      <main className="flex-grow w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-6 px-6 bg-zinc-950/40">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-zinc-500 text-xs font-semibold">OmniConvert AI</span>
            <span className="text-zinc-800 text-xs">·</span>
            <span className="status-dot online" />
            <span className="text-zinc-500 text-xs">Offline Ready</span>
          </div>
          <p className="text-zinc-600 text-xs">
            100% Local processing — zero cloud calls
          </p>
        </div>
      </footer>

    </div>
  );
}
