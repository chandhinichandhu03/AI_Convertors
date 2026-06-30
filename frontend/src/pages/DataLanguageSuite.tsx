import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  RefreshCw,
  FileCode,
  Globe,
  Clock,
  Download,
  AlertCircle,
  CheckCircle,
  Copy,
  Check,
  Cpu
} from 'lucide-react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import GlassCard from '../components/GlassCard';
import DropZone from '../components/DropZone';
import ProgressBar from '../components/ProgressBar';

export default function DataLanguageSuite() {
  const [activeTab, setActiveTab] = useState<string>('cleaner');
  const [model, setModel] = useState<string>('llama3');
  const [modelsList, setModelsList] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // File Upload State (for Data Cleaner)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);
  
  // Data Cleaner Options
  const [dropDuplicates, setDropDuplicates] = useState<boolean>(true);
  const [dropEmptyRows, setDropEmptyRows] = useState<boolean>(false);
  const [normalizeHeaders, setNormalizeHeaders] = useState<boolean>(true);
  const [fillNullValue, setFillNullValue] = useState<string>('N/A');
  const [cleanResult, setCleanResult] = useState<any>(null);

  // Language States
  const [langText, setLangText] = useState<string>('The developer maintains that performance benchmarks were not met due to system restrictions.');
  const [langOp, setLangOp] = useState<string>('translate');
  const [fromLang, setFromLang] = useState<string>('English');
  const [toLang, setToLang] = useState<string>('Spanish');
  const [tone, setTone] = useState<string>('Casual');
  const [langResult, setLangResult] = useState<string | null>(null);

  // Date-Time States
  const [dateInput, setDateInput] = useState<string>(new Date().toISOString().slice(0, 16));
  const [unixResult, setUnixResult] = useState<number>(Math.floor(Date.now() / 1000));
  const [ageDob, setAgeDob] = useState<string>('1995-05-15');
  const [ageResult, setAgeResult] = useState<string>('');

  // Copy State tracker
  const [copiedText, setCopiedText] = useState<string | null>(null);

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

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleFileSelect = async (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !['csv', 'xlsx', 'xls', 'json'].includes(ext)) {
      setError('Unsupported file type for data cleaning. Please upload a CSV, Excel, or JSON file.');
      setSelectedFile(null);
      setFileId(null);
      setCleanResult(null);
      return;
    }

    setSelectedFile(file);
    setFileId(null);
    setCleanResult(null);
    setError(null);
    
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const uploadRes = await fetch('http://127.0.0.1:5001/api/conversion/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: formData,
      });
      const data = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(data.detail || 'Upload failed');
      setFileId(data.fileId);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDataClean = async () => {
    if (!fileId) return;
    setLoading(true);
    setError(null);
    setCleanResult(null);

    const options = {
      drop_duplicates: dropDuplicates,
      drop_empty_rows: dropEmptyRows,
      normalize_headers: normalizeHeaders,
      fill_null_value: fillNullValue
    };

    try {
      const res = await fetch('http://127.0.0.1:5001/api/ai/data/clean', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ fileId, options })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Data cleaning failed');
      setCleanResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageConvert = async () => {
    setLoading(true);
    setError(null);
    setLangResult(null);

    let params: any = {};
    if (langOp === "translate") {
      params = { fromLanguage: fromLang, toLanguage: toLang };
    } else if (langOp === "simplify") {
      params = { tone };
    }

    try {
      const res = await fetch('http://127.0.0.1:5001/api/ai/language/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ text: langText, operation: langOp, params, model })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Language operation failed');
      setLangResult(data.translatedText || data.simplifiedText || data.summary || data.paraphrasedText);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateDateTime = () => {
    const d = new Date(dateInput);
    setUnixResult(Math.floor(d.getTime() / 1000));
  };

  const calculateAge = () => {
    const birthday = new Date(ageDob);
    const ageDifMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDifMs);
    const yrs = Math.abs(ageDate.getUTCFullYear() - 1970);
    setAgeResult(`${yrs} Years old`);
  };

  const menuTabs = [
    { id: 'cleaner', label: 'Pandas Data Cleaner', icon: FileCode },
    { id: 'language', label: 'Language Hub', icon: Globe },
    { id: 'datetime', label: 'Date & Time', icon: Clock }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Header Title */}
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              Data & Language Optimization Suite
              <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
            </h2>
            <p className="text-[11px] text-zinc-500 font-light mt-0.5">
              Refactor dataset headers using Pandas, calculate time zones, and run translation prompts completely offline.
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

        {/* Global Error */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Workspace select tab */}
        <div className="flex gap-2 p-1 bg-zinc-900 border border-zinc-800 rounded-xl w-fit">
          {menuTabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setError(null); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  active ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              
              {/* 1. PANDAS TABULAR CLEANER */}
              {activeTab === 'cleaner' && (
                <motion.div key="cleaner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                  <GlassCard hoverEffect={false} className="p-6 border-zinc-855 bg-zinc-900/10 space-y-4">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Tabular CSV/Excel cleaner</h3>
                    
                    <DropZone onFileSelect={handleFileSelect} accept=".csv,.xlsx,.xls,.json" />
                    
                    {selectedFile && (
                      <div className="p-3 rounded-lg bg-zinc-955 border border-zinc-850 flex items-center justify-between text-xs">
                        <span className="font-bold text-white truncate max-w-[200px]">{selectedFile.name}</span>
                        {fileId ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold">Uploaded</span>
                        ) : (
                          <RefreshCw className="w-4 h-4 animate-spin text-zinc-500" />
                        )}
                      </div>
                    )}

                    <div className="space-y-3 p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/60 text-[10px]">
                      <h4 className="font-bold text-white mb-2">Cleaning Modifiers</h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                          <input type="checkbox" checked={dropDuplicates} onChange={(e) => setDropDuplicates(e.target.checked)} className="accent-purple-500" />
                          <span>Drop Duplicates</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                          <input type="checkbox" checked={dropEmptyRows} onChange={(e) => setDropEmptyRows(e.target.checked)} className="accent-purple-500" />
                          <span>Drop Empty Rows</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                          <input type="checkbox" checked={normalizeHeaders} onChange={(e) => setNormalizeHeaders(e.target.checked)} className="accent-purple-500" />
                          <span>Normalize Headers</span>
                        </label>
                      </div>

                      <div className="pt-2 border-t border-zinc-900">
                        <label className="text-zinc-450 block mb-1">Fill Empty Null Cells Value</label>
                        <input type="text" value={fillNullValue} onChange={(e) => setFillNullValue(e.target.value)} className="bg-zinc-950 border border-zinc-800 rounded p-1.5 text-xs text-zinc-200" />
                      </div>
                    </div>

                    <button
                      onClick={handleDataClean}
                      disabled={loading || !fileId}
                      className="w-full btn-premium py-3 rounded-xl text-xs font-bold text-white shadow-lg disabled:opacity-55"
                    >
                      {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Run Pandas Cleaning Matrix'}
                    </button>
                  </GlassCard>
                </motion.div>
              )}

              {/* 2. OFFLINE LANGUAGE WORKSPACE */}
              {activeTab === 'language' && (
                <motion.div key="language" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                  <GlassCard hoverEffect={false} className="p-6 border-zinc-855 bg-zinc-900/10 space-y-4">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Language translation & tone Simplifier</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] text-zinc-500 block mb-1">Operation</label>
                        <select
                          value={langOp}
                          onChange={(e) => setLangOp(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-xs text-zinc-200"
                        >
                          <option value="translate">Bilingual Translation</option>
                          <option value="simplify">Tone Adaptor</option>
                          <option value="summarize">Summarize Content</option>
                          <option value="paraphrase">Paraphraser</option>
                        </select>
                      </div>
                    </div>

                    <textarea
                      rows={5}
                      value={langText}
                      onChange={(e) => setLangText(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 leading-relaxed"
                    />

                    {langOp === "translate" && (
                      <div className="grid grid-cols-2 gap-4 text-[10px]">
                        <div>
                          <label className="text-zinc-450 block mb-0.5">From Language</label>
                          <input type="text" value={fromLang} onChange={(e) => setFromLang(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-200" />
                        </div>
                        <div>
                          <label className="text-zinc-450 block mb-0.5">To Language</label>
                          <input type="text" value={toLang} onChange={(e) => setToLang(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-200" />
                        </div>
                      </div>
                    )}

                    {langOp === "simplify" && (
                      <div className="text-[10px]">
                        <label className="text-zinc-450 block mb-0.5">Target Tone</label>
                        <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-200">
                          <option value="Casual">Casual</option>
                          <option value="Formal">Formal</option>
                          <option value="Academic">Academic</option>
                          <option value="Professional">Professional</option>
                        </select>
                      </div>
                    )}

                    <button
                      onClick={handleLanguageConvert}
                      disabled={loading || !langText.trim()}
                      className="w-full btn-premium py-3 rounded-xl text-xs font-bold text-white shadow-lg disabled:opacity-55"
                    >
                      {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Run Language Engine'}
                    </button>
                  </GlassCard>
                </motion.div>
              )}

              {/* 3. DATE TIME TOOLS */}
              {activeTab === 'datetime' && (
                <motion.div key="datetime" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                  <GlassCard hoverEffect={false} className="p-6 border-zinc-855 bg-zinc-900/10 space-y-4">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Epoch Unix & Age calculators</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px]">
                      <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/60 space-y-3">
                        <h4 className="font-bold text-white">Unix Timestamp Converter</h4>
                        <div>
                          <label className="text-zinc-500 block mb-1">Local Time Input</label>
                          <input
                            type="datetime-local"
                            value={dateInput}
                            onChange={(e) => setDateInput(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-xs text-zinc-200"
                          />
                        </div>
                        <button onClick={calculateDateTime} className="w-full btn-premium py-2 rounded text-[10px] text-white font-bold">
                          Generate Timestamp
                        </button>
                        <div className="p-3.5 rounded bg-zinc-950 font-mono text-xs text-sky-400 text-center">
                          Unix Output: {unixResult}
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/60 space-y-3">
                        <h4 className="font-bold text-white">Age Duration Calculator</h4>
                        <div>
                          <label className="text-zinc-500 block mb-1">Date of Birth</label>
                          <input
                            type="date"
                            value={ageDob}
                            onChange={(e) => setAgeDob(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-xs text-zinc-200"
                          />
                        </div>
                        <button onClick={calculateAge} className="w-full btn-premium py-2 rounded text-[10px] text-white font-bold">
                          Calculate Age
                        </button>
                        <div className="p-3.5 rounded bg-zinc-950 font-bold text-xs text-sky-400 text-center">
                          {ageResult || 'Select DOB'}
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* RIGHT SIDE OUTPUT CONTAINER */}
          <div className="lg:col-span-1">
            <GlassCard hoverEffect={false} className="p-6 border-zinc-850 bg-zinc-900/20 space-y-4 h-full min-h-[350px] flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Processing Output</h3>
                
                {/* Data cleaner outcome */}
                {activeTab === 'cleaner' && cleanResult && (
                  <div className="space-y-4 text-[10px] leading-relaxed select-text">
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                        <span className="font-bold text-white">Cleaning Finished!</span>
                      </div>
                      <a href={`http://127.0.0.1:5001${cleanResult.downloadUrl}`} className="btn-premium px-3 py-1.5 rounded-full font-bold text-white flex items-center gap-1 shadow">
                        <Download className="w-3.5 h-3.5" />
                        Download CSV
                      </a>
                    </div>
                    
                    <div className="p-3 rounded-lg bg-zinc-955 border border-zinc-850 space-y-2 text-zinc-400">
                      <p><strong>Initial Size:</strong> {cleanResult.cleanStats.initialRows} Rows x {cleanResult.cleanStats.initialCols} Cols</p>
                      <p><strong>Final Clean Size:</strong> {cleanResult.cleanStats.finalRows} Rows x {cleanResult.cleanStats.finalCols} Cols</p>
                      <p><strong>Nulls Resolved:</strong> {cleanResult.cleanStats.initialNulls} → {cleanResult.cleanStats.finalNulls}</p>
                      <p><strong>Duplicates Pruned:</strong> {cleanResult.cleanStats.initialDuplicates}</p>
                      <div className="border-t border-zinc-900 pt-2 font-mono text-[8px] text-zinc-500">
                        <strong>Clean Headers:</strong> {cleanResult.cleanStats.cleanedHeaders.join(', ')}
                      </div>
                    </div>
                  </div>
                )}

                {/* Language outcome */}
                {activeTab === 'language' && langResult && (
                  <div className="space-y-3 select-text">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-zinc-500 font-bold uppercase">Language Results:</span>
                      <button
                        onClick={() => handleCopy(langResult, 'lang-out')}
                        className="p-1.5 rounded bg-zinc-950 border border-zinc-850 text-zinc-400 hover:text-white"
                      >
                        {copiedText === 'lang-out' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <div className="p-4 rounded-xl bg-zinc-955 border border-zinc-850 text-xs text-zinc-300 leading-relaxed font-light whitespace-pre-wrap">
                      {langResult}
                    </div>
                  </div>
                )}

                {!cleanResult && !langResult && (
                  <div className="py-12 text-center text-zinc-600 text-xs font-light">
                    Select a tabular file or write text to run offline operations.
                  </div>
                )}
              </div>

              <div className="p-3 rounded bg-zinc-950/40 border border-zinc-900 text-[8px] text-zinc-500 text-center font-bold uppercase tracking-wider">
                Pandas & NLLB Translator Active Core
              </div>
            </GlassCard>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
