import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Code2,
  Database,
  RefreshCw,
  Copy,
  Check,
  Cpu,
  AlertCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import GlassCard from '../components/GlassCard';

export default function CodeSqlSuite() {
  const [activeTab, setActiveTab] = useState<string>('transpiler');
  const [model, setModel] = useState<string>('llama3');
  const [modelsList, setModelsList] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Code Transpiler States
  const [sourceCode, setSourceCode] = useState<string>('public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello World");\n    }\n}');
  const [sourceLang, setSourceLang] = useState<string>('Java');
  const [targetLang, setTargetLang] = useState<string>('Python');
  const [codeResult, setCodeResult] = useState<any>(null);

  // 2. SQL Converter States
  const [sqlQuery, setSqlQuery] = useState<string>('SELECT u.id, u.username, count(h.id) \nFROM users u \nLEFT JOIN conversion_history h ON h.user_id = u.id \nGROUP BY u.id \nHAVING count(h.id) > 5;');
  const [dbFrom, setDbFrom] = useState<string>('PostgreSQL');
  const [dbTo, setDbTo] = useState<string>('MongoDB Query');
  const [sqlResult, setSqlResult] = useState<any>(null);
  const [sqlOptimizeMode, setSqlOptimizeMode] = useState<boolean>(false);

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

  const handleTranspile = async () => {
    setLoading(true);
    setError(null);
    setCodeResult(null);
    try {
      const res = await fetch('http://127.0.0.1:5001/api/ai/code/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ code: sourceCode, source_lang: sourceLang, target_lang: targetLang, model })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Code transpilation failed');
      setCodeResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSqlConvert = async () => {
    setLoading(true);
    setError(null);
    setSqlResult(null);
    
    const endpoint = sqlOptimizeMode ? '/api/ai/sql/optimize' : '/api/ai/sql/convert';
    const payload = sqlOptimizeMode 
      ? { query: sqlQuery, dbType: dbFrom, model }
      : { query: sqlQuery, dbFrom, dbTo, model };

    try {
      const res = await fetch(`http://127.0.0.1:5001${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'SQL processing failed');
      setSqlResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const LANG_LIST = [
    'Python', 'Java', 'C', 'C++', 'C#', 'JavaScript', 'TypeScript', 'Go', 'Rust',
    'Kotlin', 'Swift', 'PHP', 'Ruby', 'Scala', 'R', 'MATLAB', 'Julia', 'Dart',
    'Lua', 'Perl', 'SQL', 'Shell', 'PowerShell', 'Visual Basic', 'Objective-C', 'Assembly'
  ];

  const DB_LIST = ['PostgreSQL', 'MySQL', 'SQLite', 'Oracle', 'SQL Server', 'MongoDB Query'];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-900/30">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              Code & Database Compiler Studio
              <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
            </h2>
            <p className="text-[11px] text-zinc-500 font-light mt-0.5">
              Transpile syntaxes and migrate relational database queries completely offline.
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
            <div>
              <p className="font-bold">Error Encountered</p>
              <p className="text-[10px] text-rose-450 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Workspace selection */}
        <div className="flex gap-2 p-1 bg-zinc-900 border border-zinc-800 rounded-xl w-fit">
          <button
            onClick={() => { setActiveTab('transpiler'); setError(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'transpiler' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            Compiler Transpiler
          </button>
          <button
            onClick={() => { setActiveTab('sql'); setError(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'sql' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Database className="w-4 h-4" />
            SQL Query Converter
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence mode="wait">
            
            {/* 1. COMPILER TRANSPILER WORKSPACE */}
            {activeTab === 'transpiler' && (
              <motion.div
                key="transpiler"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {/* Source Pane */}
                <GlassCard hoverEffect={false} className="p-6 border-zinc-850 bg-zinc-900/10 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Source code workspace</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-zinc-500 uppercase">From</span>
                      <select
                        value={sourceLang}
                        onChange={(e) => setSourceLang(e.target.value)}
                        className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-[10px] text-zinc-200"
                      >
                        {LANG_LIST.map(l => (
                          <option key={l} value={l}>{l}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <textarea
                    rows={12}
                    value={sourceCode}
                    onChange={(e) => setSourceCode(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-xs text-zinc-300 font-mono focus:outline-none focus:border-purple-650 leading-relaxed whitespace-pre"
                  />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-zinc-500 uppercase">To Target</span>
                      <select
                        value={targetLang}
                        onChange={(e) => setTargetLang(e.target.value)}
                        className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-[10px] text-zinc-200"
                      >
                        {LANG_LIST.map(l => (
                          <option key={l} value={l}>{l}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={handleTranspile}
                      disabled={loading || !sourceCode.trim()}
                      className="btn-premium px-5 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-lg disabled:opacity-55"
                    >
                      {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Code2 className="w-3.5 h-3.5" />}
                      Transpile Code
                    </button>
                  </div>
                </GlassCard>

                {/* Target Result Pane */}
                <GlassCard hoverEffect={false} className="p-6 border-zinc-850 bg-zinc-900/10 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Converted target Code</h3>
                    {codeResult && (
                      <button
                        onClick={() => handleCopy(codeResult.convertedCode, 'code-out')}
                        className="p-2 rounded bg-zinc-950 border border-zinc-850 text-zinc-400 hover:text-white transition-colors"
                      >
                        {copiedText === 'code-out' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>

                  <div className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-xs text-zinc-350 font-mono min-h-[250px] leading-relaxed whitespace-pre-wrap select-text relative">
                    {codeResult ? (
                      codeResult.convertedCode
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600 text-xs font-light">
                        <Cpu className="w-6 h-6 mb-2 text-zinc-700" />
                        Click "Transpile Code" to view optimization output.
                      </div>
                    )}
                  </div>

                  {codeResult && (
                    <div className="space-y-4 pt-4 border-t border-zinc-850 text-[10px] leading-relaxed">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-900">
                          <span className="text-zinc-500 font-bold block mb-0.5">Time Complexity</span>
                          <span className="text-zinc-300 font-mono">{codeResult.timeComplexity}</span>
                        </div>
                        <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-900">
                          <span className="text-zinc-500 font-bold block mb-0.5">Space Complexity</span>
                          <span className="text-zinc-300 font-mono">{codeResult.spaceComplexity}</span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-900 space-y-1">
                        <span className="text-zinc-400 font-bold block">Syntactical Differences:</span>
                        <p className="text-zinc-450 font-light">{codeResult.differences}</p>
                      </div>

                      <div className="p-3.5 rounded-lg bg-emerald-500/5 border border-emerald-500/15 space-y-1">
                        <span className="text-emerald-450 font-bold block">Performance Advantages:</span>
                        <p className="text-zinc-350 font-light">{codeResult.advantages}</p>
                      </div>

                      {codeResult.potentialIssues && (
                        <div className="p-3.5 rounded-lg bg-rose-500/5 border border-rose-500/15 space-y-1">
                          <span className="text-rose-400 font-bold block">Potential Issues:</span>
                          <p className="text-zinc-350 font-light">{codeResult.potentialIssues}</p>
                        </div>
                      )}
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            )}

            {/* 2. SQL QUERY CONVERTER WORKSPACE */}
            {activeTab === 'sql' && (
              <motion.div
                key="sql"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {/* Query Input Pane */}
                <GlassCard hoverEffect={false} className="p-6 border-zinc-850 bg-zinc-900/10 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">SQL Query Workspace</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSqlOptimizeMode(false)}
                        className={`px-3 py-1 rounded-full text-[9px] font-bold border transition-colors ${
                          !sqlOptimizeMode ? 'bg-purple-600/10 border-purple-500 text-white' : 'bg-zinc-950 border-zinc-800 text-zinc-500'
                        }`}
                      >
                        Dialect Translate
                      </button>
                      <button
                        onClick={() => setSqlOptimizeMode(true)}
                        className={`px-3 py-1 rounded-full text-[9px] font-bold border transition-colors ${
                          sqlOptimizeMode ? 'bg-purple-600/10 border-purple-500 text-white' : 'bg-zinc-950 border-zinc-800 text-zinc-500'
                        }`}
                      >
                        Optimizer
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] text-zinc-500 uppercase block mb-1">Source DB Type</label>
                      <select
                        value={dbFrom}
                        onChange={(e) => setDbFrom(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1.5 text-xs text-zinc-200 focus:outline-none"
                      >
                        {DB_LIST.map(db => (
                          <option key={db} value={db}>{db}</option>
                        ))}
                      </select>
                    </div>

                    {!sqlOptimizeMode && (
                      <div>
                        <label className="text-[9px] text-zinc-500 uppercase block mb-1">Target DB Type</label>
                        <select
                          value={dbTo}
                          onChange={(e) => setDbTo(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1.5 text-xs text-zinc-200 focus:outline-none"
                        >
                          {DB_LIST.map(db => (
                            <option key={db} value={db}>{db}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <textarea
                    rows={10}
                    value={sqlQuery}
                    onChange={(e) => setSqlQuery(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-xs text-zinc-300 font-mono focus:outline-none focus:border-purple-650 leading-relaxed whitespace-pre"
                  />

                  <button
                    onClick={handleSqlConvert}
                    disabled={loading || !sqlQuery.trim()}
                    className="w-full btn-premium py-3 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 shadow-lg disabled:opacity-55"
                  >
                    {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
                    {sqlOptimizeMode ? 'Optimize Database Query' : 'Translate Query Dialect'}
                  </button>
                </GlassCard>

                {/* Target Result Pane */}
                <GlassCard hoverEffect={false} className="p-6 border-zinc-850 bg-zinc-900/10 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Database output</h3>
                    {sqlResult && (
                      <button
                        onClick={() => handleCopy(sqlResult.convertedQuery || sqlResult.optimizedQuery, 'sql-out')}
                        className="p-2 rounded bg-zinc-950 border border-zinc-850 text-zinc-400 hover:text-white transition-colors"
                      >
                        {copiedText === 'sql-out' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>

                  <div className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-xs text-zinc-350 font-mono min-h-[220px] leading-relaxed whitespace-pre-wrap select-text relative">
                    {sqlResult ? (
                      sqlResult.convertedQuery || sqlResult.optimizedQuery
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600 text-xs font-light">
                        <Database className="w-6 h-6 mb-2 text-zinc-700" />
                        Execute the conversion pipeline to generate queries.
                      </div>
                    )}
                  </div>

                  {sqlResult && (
                    <div className="space-y-4 pt-4 border-t border-zinc-850 text-[10px] leading-relaxed">
                      {sqlOptimizeMode ? (
                        <>
                          <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-900 space-y-1">
                            <span className="text-rose-400 font-bold block">Bottlenecks Found:</span>
                            <p className="text-zinc-450 font-light">{sqlResult.bottlenecks}</p>
                          </div>
                          
                          <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-900 space-y-1">
                            <span className="text-zinc-400 font-bold block">Optimization Steps:</span>
                            <p className="text-zinc-450 font-light">{sqlResult.optimizationSteps}</p>
                          </div>

                          <div className="p-3.5 rounded-lg bg-emerald-500/5 border border-emerald-500/15 space-y-1 flex justify-between items-center">
                            <div>
                              <span className="text-emerald-450 font-bold block">Recommended Indexes:</span>
                              <p className="text-zinc-350 font-mono mt-0.5">{sqlResult.recommendedIndexes}</p>
                            </div>
                            <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 font-black shrink-0">{sqlResult.estimatedSpeedup}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-900 space-y-1">
                            <span className="text-zinc-400 font-bold block">Dialect Translation Explanation:</span>
                            <p className="text-zinc-450 font-light">{sqlResult.explanation}</p>
                          </div>

                          <div className="p-3.5 rounded-lg bg-emerald-500/5 border border-emerald-500/15 space-y-1">
                            <span className="text-emerald-450 font-bold block">Index Optimization:</span>
                            <p className="text-zinc-350 font-mono">{sqlResult.indexingRecommendation}</p>
                          </div>

                          <div className="p-3.5 rounded-lg bg-rose-500/5 border border-rose-500/15 space-y-1">
                            <span className="text-rose-455 font-bold block">Potential Pitfalls:</span>
                            <p className="text-zinc-350 font-light">{sqlResult.potentialPitfalls}</p>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </DashboardLayout>
  );
}
