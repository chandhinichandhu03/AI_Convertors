import React, { useState, useEffect } from 'react';
import { History as HistoryIcon } from 'lucide-react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import GlassCard from '../components/GlassCard';

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5001/api/conversion/stats', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setHistory(data.recentActivity || []);
      }
    } catch (err) {
      console.warn('Failed to load history:', err);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <GlassCard hoverEffect={false} className="p-6 border-white/5 bg-zinc-900/40">
          <div className="flex items-center gap-2 mb-6">
            <HistoryIcon className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Local Activity Logs</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs md:text-sm text-zinc-300 border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400">
                  <th className="py-3 px-4">Filename</th>
                  <th className="py-3 px-4">Direction</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {history.length > 0 ? (
                  history.map((hist, idx) => (
                    <tr key={idx} className="border-b border-zinc-800/50 hover:bg-zinc-900/30">
                      <td className="py-3 px-4 font-semibold text-white max-w-[220px] truncate">
                        {hist.original_name || 'Output File'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="uppercase text-[9px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold border border-zinc-700">
                          {hist.source_format} → {hist.target_format}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          hist.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {hist.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-zinc-400">
                        {(hist.duration_ms / 1000).toFixed(2)}s
                      </td>
                      <td className="py-3 px-4 text-zinc-400">
                        {new Date(hist.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-zinc-500 font-light">
                      No conversions registered in local database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
