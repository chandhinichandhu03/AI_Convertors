import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Send,
  Cpu,
  BookOpen,
  RefreshCw,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import GlassCard from '../components/GlassCard';

export default function RagAssistant() {
  const [model, setModel] = useState<string>('llama3');
  const [modelsList, setModelsList] = useState<string[]>([]);
  const [chatInput, setChatInput] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5001/api/ai/models', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setModelsList(data.models || []);
        if (data.models && data.models.length > 0) {
          setModel(data.models[0]);
        }
      }
    } catch (err) {
      console.warn('Ollama offline:', err);
    }
  };

  const handleSendChatMessage = async (queryText: string) => {
    const userMessage = queryText || chatInput;
    if (!userMessage.trim() || chatLoading) return;

    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    setChatLoading(true);
    setError(null);

    try {
      const res = await fetch('http://127.0.0.1:5001/api/ai/ask-kb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ query: userMessage, model })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'RAG prompt failed');
      
      setChatHistory(prev => [...prev, {
        role: 'assistant',
        content: data.response,
        hasContext: data.hasContext,
        citation: data.citation
      }]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setChatLoading(false);
    }
  };

  const PRESET_QUERIES = [
    { label: "Convert Java to Python", q: "How do I convert a Java HelloWorld class syntax logic to Python code?" },
    { label: "Explain Newton's Laws", q: "Explain Newton's Three Laws of Motion, their SI units, and dimensional equations." },
    { label: "Explain FFT", q: "Explain what is Fast Fourier Transform (FFT), its complexity gains, and wave DSP algorithms." },
    { label: "Difference between JPG and PNG", q: "What is the difference between JPG and PNG image format, compression, and transparency?" },
    { label: "Explain Binary Tree", q: "Explain Binary Search Tree (BST) algorithms, structures, and recursive traversal orders." },
    { label: "What is Permutation?", q: "Explain Permutation vs Combination math formulas and factorial calculations." },
    { label: "How to calculate Torque?", q: "How do I calculate torque? Show formula, SI units, and dimensional analysis derivation." }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-900/30">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              Local RAG Chatbot Assistant
              <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
            </h2>
            <p className="text-[11px] text-zinc-500 font-light mt-0.5">
              Ask about CS algorithms, programming transpilers, physics formulae, or chemical models solved locally using vector indexing.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-zinc-400 font-semibold uppercase">Ollama Model</span>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:outline-none"
            >
              {modelsList.length > 0 ? (
                modelsList.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))
              ) : (
                <option value="">Ollama Offline</option>
              )}
            </select>
          </div>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Preset Shortcuts panel */}
          <div className="lg:col-span-1 space-y-4">
            <GlassCard hoverEffect={false} className="p-4 border-zinc-800 bg-zinc-900/20 space-y-3">
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wide">
                <BookOpen className="w-4 h-4 text-purple-400" />
                Knowledge Shortcuts
              </h3>
              <p className="text-[10px] text-zinc-500 leading-relaxed font-light">
                Click any shortcut to trigger vector RAG matching against the preseeded knowledge base documents.
              </p>
              
              <div className="flex flex-col gap-1.5 pt-2 border-t border-zinc-900">
                {PRESET_QUERIES.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendChatMessage(item.q)}
                    className="w-full text-left p-2.5 rounded-lg bg-zinc-950/40 border border-zinc-850 hover:border-purple-500 text-[10px] text-zinc-400 hover:text-white transition-all font-semibold leading-tight"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Active Chat workspace */}
          <div className="lg:col-span-3">
            <GlassCard hoverEffect={false} className="p-5 border-white/5 bg-zinc-900/40 flex flex-col justify-between h-[550px]">
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
                {chatHistory.length > 0 ? (
                  chatHistory.map((msg, idx) => (
                    <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`p-3.5 rounded-xl max-w-[85%] text-xs leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-purple-600 text-white'
                          : 'bg-zinc-950 border border-zinc-850 text-zinc-300 select-text'
                      }`}>
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                        
                        {/* Citation tag details */}
                        {msg.role === 'assistant' && msg.hasContext && (
                          <div className="mt-2.5 pt-2 border-t border-zinc-900 text-[9px] text-zinc-500 font-light select-none">
                            <span className="font-bold text-purple-400 uppercase mr-1">RAG Context Citation:</span>
                            "{msg.citation}"
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center text-zinc-650 text-xs font-light">
                    <Cpu className="w-8 h-8 text-zinc-700 mb-2 animate-pulse" />
                    Chat with local LLM pinned to seeded math, physics, programming, and CS knowledge.
                  </div>
                )}
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSendChatMessage(''); }} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask a question..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-xs text-zinc-200 focus:outline-none focus:border-purple-550 placeholder-zinc-650"
                />
                <button
                  type="submit"
                  disabled={chatLoading || !chatInput.trim()}
                  className="p-3.5 rounded-xl btn-premium text-white flex items-center justify-center disabled:opacity-55"
                >
                  {chatLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </form>
            </GlassCard>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
