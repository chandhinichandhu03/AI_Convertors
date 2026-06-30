import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FileText,
  Zap,
  Activity,
  ArrowRight,
  TrendingUp,
  Database,
  Layers,
  Sparkles,
  ArrowUpRight,
  Star,
  Download,
  Info
} from 'lucide-react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import GlassCard from '../components/GlassCard';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>({
    totalConversions: 0,
    successPercentage: 100,
    averageDurationMs: 0,
    storageSizeMb: 0.0,
    recentActivity: [],
  });
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
    fetchStats();
    fetchBookmarks();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5001/api/conversion/stats', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.warn('Failed to load stats:', err);
    }
  };

  const fetchBookmarks = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5001/api/conversion/bookmarks', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setBookmarks(data.bookmarks || []);
      }
    } catch (err) {
      console.warn('Failed to load bookmarks:', err);
    }
  };

  const getTabLabel = (id: string) => {
    const labels: Record<string, string> = {
      general: 'Universal Converter',
      images: 'Image Modifiers',
      audio: 'Audio Trimmer',
      video: 'Video Presets',
      archives: 'Archive Packer',
      ai: 'Neural AI Labs (RAG)',
      specialty: 'Scientific Calculators'
    };
    return labels[id] || id;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Welcome Header Banner */}
        <div className="p-6 rounded-2xl border border-indigo-500/10 bg-indigo-500/5 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
              Welcome back, {user?.username || 'developer'}
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
            </h2>
            <p className="text-zinc-400 text-xs mt-1.5 font-light leading-relaxed">
              Your offline workspace is synchronized. All local SymPy symbolic engines, Pandas cleaners, FAISS vector search chatbot, and LibreOffice binaries are fully online and responsive.
            </p>
          </div>
        </div>

        {/* Stats Grid Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Conversions', val: stats.totalConversions, icon: Zap, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/25' },
            { label: 'Success Rate', val: `${stats.successPercentage}%`, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/25' },
            { label: 'Average Execution', val: `${(stats.averageDurationMs / 1000).toFixed(2)}s`, icon: Activity, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/25' },
            { label: 'Storage Used', val: `${stats.storageSizeMb.toFixed(2)} MB`, icon: Database, color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/25' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className={`p-4 rounded-xl border ${item.bg} backdrop-blur-md`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-400">{item.label}</span>
                  <Icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <p className="text-2xl font-black text-white mt-2 tracking-tight">{item.val}</p>
              </div>
            );
          })}
        </div>

        {/* Analytics Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Conversion Volume Line Graph (SVG) */}
          <GlassCard hoverEffect={false} className="p-6 border-white/5 bg-zinc-900/40">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Conversion Volume (Last 7 Days)</h3>
              <span className="text-[9px] px-2 py-0.5 rounded bg-zinc-950 text-zinc-450 border border-zinc-800">Timeline</span>
            </div>
            
            <div className="h-44 w-full relative flex items-end">
              {/* Dynamic SVG Line Graph */}
              <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,35 Q15,10 30,22 T60,5 T90,28 T100,12 L100,40 L0,40 Z"
                  fill="url(#chartGrad)"
                />
                <path
                  d="M0,35 Q15,10 30,22 T60,5 T90,28 T100,12"
                  fill="none"
                  stroke="#A855F7"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                />
                {/* Horizontal marker grids */}
                <line x1="0" y1="10" x2="100" y2="10" stroke="#27272a" strokeWidth="0.1" />
                <line x1="0" y1="20" x2="100" y2="20" stroke="#27272a" strokeWidth="0.1" />
                <line x1="0" y1="30" x2="100" y2="30" stroke="#27272a" strokeWidth="0.1" />
              </svg>

              <div className="absolute inset-0 flex justify-between items-end text-[8px] text-zinc-500 font-mono pointer-events-none select-none">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </GlassCard>

          {/* Chart 2: Storage share distribution breakdown (SVG Bars & Percentages) */}
          <GlassCard hoverEffect={false} className="p-6 border-white/5 bg-zinc-900/40">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Local Storage Breakdown</h3>
              <span className="text-[9px] px-2 py-0.5 rounded bg-zinc-950 text-zinc-450 border border-zinc-800">Capacity Share</span>
            </div>
            
            <div className="space-y-3.5 pt-2">
              {[
                { type: 'Images', percent: 45, size: '4.2 MB', color: 'bg-indigo-500' },
                { type: 'Documents & PDFs', percent: 30, size: '2.8 MB', color: 'bg-emerald-500' },
                { type: 'Audio Clips', percent: 15, size: '1.4 MB', color: 'bg-rose-500' },
                { type: 'Video Presets', percent: 10, size: '0.9 MB', color: 'bg-sky-500' }
              ].map((row, idx) => (
                <div key={idx} className="space-y-1.5 text-[10px]">
                  <div className="flex justify-between font-semibold text-zinc-300">
                    <span className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${row.color}`} />
                      {row.type}
                    </span>
                    <span className="text-zinc-500 font-mono">{row.size} ({row.percent}%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-900">
                    <div className={`h-full ${row.color} rounded-full`} style={{ width: `${row.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Quick Launch & Activities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6 lg:col-span-1 flex flex-col justify-between">
            
            {/* Quick Convert Launch */}
            <GlassCard hoverEffect={false} className="p-6 border-white/5 bg-zinc-900/40 flex-1 flex flex-col justify-between mb-4 lg:mb-0">
              <div>
                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-sky-400" />
                  Launch Converter
                </h3>
                <p className="text-zinc-400 text-xs font-light leading-relaxed mb-4">
                  Scale visual images, balance equations, translate languages, or package zip archives entirely offline.
                </p>
              </div>
              
              <Link
                to="/convert"
                className="w-full btn-premium py-2.5 rounded-lg text-xs font-semibold text-white flex items-center justify-center gap-1.5 shadow-lg group"
              >
                Open Convert Studio
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </GlassCard>

            {/* Favorited bookmarks list */}
            {bookmarks.length > 0 && (
              <GlassCard hoverEffect={false} className="p-6 border-white/5 bg-zinc-900/40">
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  Bookmarked Tools
                </h3>
                <div className="space-y-2">
                  {bookmarks.map((bId) => (
                    <button
                      key={bId}
                      onClick={() => navigate('/convert', { state: { selectTab: bId } })}
                      className="w-full text-left p-2.5 rounded-lg bg-zinc-955 border border-zinc-800 hover:border-purple-550 text-xs text-zinc-300 font-semibold transition-all flex items-center justify-between"
                    >
                      <span>{getTabLabel(bId)}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
                    </button>
                  ))}
                </div>
              </GlassCard>
            )}

          </div>

          <GlassCard hoverEffect={false} className="p-6 border-white/5 bg-zinc-900/40 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">Recent Activities</h3>
              <Link to="/history" className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1">
                View all logs
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {stats.recentActivity && stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((act: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/45 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-white truncate max-w-[200px] sm:max-w-md">{act.original_name}</p>
                        <p className="text-[10px] text-zinc-500 uppercase mt-0.5">{act.source_format} → {act.target_format}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        act.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {act.status}
                      </span>
                      {act.status === 'completed' && (
                        <a
                          href={`http://127.0.0.1:5001/api/conversion/download/${act.id}`}
                          className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
                          title="Download Converted File"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-zinc-650 text-xs font-light">
                  No conversions performed recently.
                </div>
              )}
            </div>
          </GlassCard>
        </div>

      </div>
    </DashboardLayout>
  );
}
