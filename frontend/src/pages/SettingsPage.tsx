import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Shield, Cpu, RefreshCw } from 'lucide-react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import GlassCard from '../components/GlassCard';

export default function SettingsPage() {
  const [modelsList, setModelsList] = useState<string[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    setLoadingModels(true);
    try {
      const res = await fetch('http://127.0.0.1:5001/api/ai/models', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setModelsList(data.models || []);
      }
    } catch (err) {
      console.warn('Failed to load Ollama models:', err);
    } finally {
      setLoadingModels(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <GlassCard hoverEffect={false} className="p-6 border-white/5 bg-zinc-900/40">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-white">System Settings</h2>
            </div>
            
            <button
              onClick={fetchModels}
              disabled={loadingModels}
              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
              title="Refresh models"
            >
              <RefreshCw className={`w-4 h-4 ${loadingModels ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Local AI Model Status */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-zinc-300 flex items-center gap-1.5 uppercase tracking-wide">
                <Cpu className="w-4 h-4 text-purple-400" />
                Local Ollama AI Status
              </h3>
              
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Connection Status</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    modelsList.length > 0
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {modelsList.length > 0 ? 'ONLINE' : 'OLLAMA OFFLINE'}
                  </span>
                </div>

                <div className="space-y-2 pt-2 border-t border-zinc-900">
                  <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wide block">Detected Local Models</span>
                  {modelsList.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {modelsList.map((m) => (
                        <span key={m} className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-purple-400 text-[10px] font-mono">
                          {m}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-500 font-light leading-relaxed">
                      No active Ollama models detected. Start Ollama and run <code className="bg-zinc-900 px-1 py-0.5 rounded text-[10px] text-zinc-300">ollama run llama3</code> to unlock offline chat.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Offline execution settings */}
            <div className="space-y-3 pt-4 border-t border-zinc-850">
              <h3 className="text-xs font-bold text-zinc-300 flex items-center gap-1.5 uppercase tracking-wide">
                <Shield className="w-4 h-4 text-purple-400" />
                Offline Data Policy
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                OmniConvert AI operates completely locally on your hardware. Document reads, vector chunk matches, and chatbot completions run 100% locally. No external telemetry details are transmitted.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
