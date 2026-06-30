import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Clipboard,
  Trash2,
  Download,
  Star,
  Activity,
  History as HistoryIcon,
  AlertCircle,
  Play,
  ArrowLeftRight
} from 'lucide-react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import GlassCard from '../components/GlassCard';

export default function GrammarLanguageSuite() {
  const [model, setModel] = useState<string>('llama3');
  const [modelsList, setModelsList] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Core Inputs
  const [inputText, setInputText] = useState<string>('She don\'t know that the server was restarted by them because of high memory consumption.');
  const [outputText, setOutputText] = useState<string>('');
  const [operation, setOperation] = useState<string>('Incorrect Grammar -> Correct Grammar');

  // Analysis Metrics
  const [metrics, setMetrics] = useState<any>(null);
  const [explanation, setExplanation] = useState<any>(null);
  const [showExplainModal, setShowExplainModal] = useState<boolean>(false);

  // Lists & Bookmarks
  const [favorites, setFavorites] = useState<string[]>([]);
  const [history, setHistory] = useState<Array<{ input: string; output: string; op: string }>>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  // Clipboard Copied feedback
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);

  useEffect(() => {
    fetchModels();
    // Pre-calculate stats for default text
    handleAnalyzeOnly();
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
    setCopiedLabel(label);
    setTimeout(() => setCopiedLabel(null), 2000);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
    } catch (err) {
      console.warn('Clipboard paste failed:', err);
    }
  };

  const handleSwap = () => {
    const temp = inputText;
    setInputText(outputText);
    setOutputText(temp);
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setMetrics(null);
    setExplanation(null);
  };

  const handleAnalyzeOnly = async () => {
    if (!inputText.trim()) return;
    try {
      const res = await fetch('http://127.0.0.1:5001/api/ai/grammar/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ text: inputText, model })
      });
      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
      }
    } catch (err) {
      console.warn('Analysis failed:', err);
    }
  };

  const handleConvert = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://127.0.0.1:5001/api/ai/grammar/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ text: inputText, operation, model })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Language conversion failed');
      
      setOutputText(data.convertedText);
      setExplanation(data.explanation);
      setMetrics(data.analysis);
      
      // Save to local history
      setHistory(prev => [{ input: inputText, output: data.convertedText, op: operation }, ...prev.slice(0, 9)]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!outputText) return;
    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `grammar_conversion_${operation.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const toggleFavorite = () => {
    if (favorites.includes(operation)) {
      setFavorites(prev => prev.filter(f => f !== operation));
    } else {
      setFavorites(prev => [...prev, operation]);
    }
  };

  // Word & Character count helpers
  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const charCount = inputText.length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200)); // 200 WPM average

  // Converters Categories List
  const CONVERTERS_CATEGORIES = [
    {
      group: "Grammar & Style",
      items: [
        "Incorrect Grammar -> Correct Grammar",
        "Correct Grammar -> Simplified Grammar",
        "Simple English -> Professional English",
        "Professional English -> Simple English",
        "Formal -> Informal",
        "Informal -> Formal",
        "Academic -> Professional",
        "Professional -> Academic",
        "British English -> American English",
        "American English -> British English",
        "Old English -> Modern English",
        "Modern English -> Classical Style",
        "Business Writing -> Casual Writing",
        "Casual Writing -> Business Writing",
        "Technical Writing -> Beginner Friendly",
        "Beginner Friendly -> Technical"
      ]
    },
    {
      group: "Voice & Speech",
      items: [
        "Active Voice -> Passive Voice",
        "Passive Voice -> Active Voice",
        "Direct Speech -> Indirect Speech",
        "Indirect Speech -> Direct Speech",
        "Positive Sentence -> Negative Sentence",
        "Negative Sentence -> Positive Sentence",
        "Affirmative -> Interrogative",
        "Interrogative -> Statement",
        "Exclamatory -> Declarative",
        "Declarative -> Exclamatory"
      ]
    },
    {
      group: "Tense Shifts",
      items: [
        "Present Simple -> Past Simple",
        "Present Simple -> Future Simple",
        "Past Simple -> Present Simple",
        "Past Simple -> Future Simple",
        "Future Simple -> Present Simple",
        "Future Simple -> Past Simple",
        "Present Continuous -> Past Continuous",
        "Past Continuous -> Future Continuous",
        "Future Continuous -> Present Continuous",
        "Present Perfect -> Past Perfect",
        "Past Perfect -> Future Perfect",
        "Future Perfect -> Present Perfect",
        "Present Perfect Continuous -> Past Perfect Continuous",
        "Past Perfect Continuous -> Future Perfect Continuous",
        "Future Perfect Continuous -> Present Perfect Continuous"
      ]
    },
    {
      group: "Sentence Structure",
      items: [
        "Simple Sentence -> Compound Sentence",
        "Simple Sentence -> Complex Sentence",
        "Compound Sentence -> Simple Sentence",
        "Compound Sentence -> Complex Sentence",
        "Complex Sentence -> Simple Sentence",
        "Complex Sentence -> Compound Sentence",
        "Short Sentence -> Detailed Sentence",
        "Detailed Sentence -> Concise Sentence"
      ]
    },
    {
      group: "Writing Tones",
      items: [
        "Professional Tone", "Friendly Tone", "Formal Tone", "Informal Tone", "Academic Tone",
        "Business Tone", "Technical Tone", "Creative Tone", "Persuasive Tone", "Marketing Tone",
        "Sales Tone", "Customer Support Tone", "Email Tone", "Interview Tone", "Resume Tone",
        "Cover Letter Tone", "Legal Tone", "Medical Tone", "Journalistic Tone", "Storytelling Tone",
        "Motivational Tone"
      ]
    },
    {
      group: "Text Rewriters & Paraphrasing",
      items: [
        "Rewrite without changing meaning", "Rewrite professionally", "Rewrite academically",
        "Rewrite naturally", "Rewrite fluently", "Rewrite politely", "Rewrite confidently",
        "Rewrite creatively", "Rewrite formally", "Rewrite simply", "Rewrite with better vocabulary",
        "Rewrite shorter", "Rewrite longer", "Rewrite like native English",
        "Light Paraphrase", "Medium Paraphrase", "Deep Paraphrase", "Academic Paraphrase",
        "Business Paraphrase", "Technical Paraphrase", "SEO Paraphrase", "Humanize AI Text",
        "AI Detector Friendly Rewrite"
      ]
    },
    {
      group: "Vocabulary & Spelling",
      items: [
        "Simple Words -> Advanced Vocabulary", "Advanced Vocabulary -> Easy English",
        "Replace Weak Words", "Replace Repeated Words", "Improve Vocabulary",
        "Improve Readability", "Improve Fluency", "Improve Sentence Variety",
        "British Spelling -> American Spelling", "American Spelling -> British Spelling",
        "Correct Misspellings", "Correct Typos", "Auto Spell Check"
      ]
    },
    {
      group: "Punctuation & Casings",
      items: [
        "Fix punctuation", "Insert commas", "Remove unnecessary punctuation",
        "Correct quotation marks", "Correct apostrophes", "Correct capitalization",
        "Correct spacing", "UPPERCASE", "lowercase", "Title Case", "Sentence Case",
        "camelCase", "PascalCase", "snake_case", "kebab-case", "dot.case", "Train-Case",
        "Reverse Case", "Alternating Case", "Random Case"
      ]
    },
    {
      group: "Text Formatters",
      items: [
        "Remove Extra Spaces", "Remove Empty Lines", "Remove Duplicate Lines",
        "Sort Alphabetically", "Reverse Text", "Reverse Words", "Reverse Sentences",
        "Number Lines", "Remove Line Numbers", "Merge Paragraphs", "Split Paragraphs",
        "Alphabetize Paragraphs"
      ]
    },
    {
      group: "Summarizers & Expansion",
      items: [
        "1 Sentence Summary", "2 Sentences Summary", "Short Summary", "Medium Summary",
        "Detailed Summary", "Bullet Points Summary", "Key Points Summary", "Executive Summary",
        "Expand Short Sentence", "Expand Paragraph", "Generate Explanation", "Generate Detailed Version",
        "Generate Examples"
      ]
    },
    {
      group: "Email & Resume builders",
      items: [
        "Convert to Professional Email", "Convert to Formal Email", "Convert to Complaint Email",
        "Convert to Request Email", "Convert to Thank You Email", "Convert to Follow-up Email",
        "Convert to Apology Email", "Convert to Business Proposal", "Convert to Meeting Invitation",
        "Convert to Leave Letter", "Paragraph -> Resume Bullet Points", "Bullet Points -> Paragraph",
        "Weak Resume -> ATS Resume", "Resume -> Cover Letter", "Cover Letter -> Resume Summary"
      ]
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-900/30">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              English Grammar & Language Converter Suite
              <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
            </h2>
            <p className="text-[11px] text-zinc-500 font-light mt-0.5">
              Modify voices, tenses, styles, and spellings offline with preseeded RAG rules guides.
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

        {/* Workspace select converter */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* LEFT SIDEBAR: CONVERTERS PICKER */}
          <div className="lg:col-span-1 space-y-4">
            <GlassCard hoverEffect={false} className="p-4 border-zinc-800 bg-zinc-900/20 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Converter Maps</span>
                <button
                  onClick={toggleFavorite}
                  className="p-1 rounded bg-zinc-950 border border-zinc-850 hover:text-yellow-500 text-zinc-500 transition-colors"
                >
                  <Star className={`w-3.5 h-3.5 ${favorites.includes(operation) ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                </button>
              </div>

              {/* Favorites shortcut block */}
              {favorites.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[9px] text-yellow-500 font-bold uppercase tracking-wide block">Favorites</span>
                  {favorites.map((fav) => (
                    <button
                      key={fav}
                      onClick={() => setOperation(fav)}
                      className={`w-full text-left p-2 rounded text-[10px] transition-all font-semibold block truncate ${
                        operation === fav ? 'bg-purple-600/15 border border-purple-500 text-white' : 'bg-zinc-950/40 border border-zinc-900 text-zinc-400'
                      }`}
                    >
                      ★ {fav}
                    </button>
                  ))}
                </div>
              )}

              {/* Group items iterator */}
              {CONVERTERS_CATEGORIES.map((cat, idx) => (
                <div key={idx} className="space-y-1.5">
                  <span className="text-[9px] text-zinc-500 font-bold uppercase block tracking-wider">{cat.group}</span>
                  <select
                    value={operation.startsWith(cat.group) || cat.items.includes(operation) ? operation : ""}
                    onChange={(e) => { if (e.target.value) setOperation(e.target.value); }}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded p-1.5 text-[10px] text-zinc-300 focus:outline-none"
                  >
                    <option value="">Select option...</option>
                    {cat.items.map(item => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>
              ))}
            </GlassCard>

            {/* Quick Actions Shortcuts */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="w-full flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 hover:text-white transition-colors"
              >
                <HistoryIcon className="w-3.5 h-3.5" />
                History ({history.length})
              </button>
            </div>
          </div>

          {/* MAIN DUAL EDITOR PANE */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Input & Output Double Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
              
              {/* Input text-area */}
              <GlassCard hoverEffect={false} className="p-5 border-zinc-850 bg-zinc-900/10 space-y-3">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-zinc-500 font-bold uppercase">Input workspace</span>
                  <div className="flex items-center gap-2">
                    <button onClick={handlePaste} className="p-1.5 rounded bg-zinc-950 border border-zinc-850 text-zinc-400 hover:text-white" title="Paste clipboard text">
                      <Clipboard className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={handleClear} className="p-1.5 rounded bg-zinc-950 border border-zinc-850 text-zinc-450 hover:text-white" title="Clear text">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <textarea
                  rows={8}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter or paste English text block..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-xs text-zinc-200 leading-relaxed focus:outline-none"
                />

                <div className="flex justify-between text-[9px] text-zinc-500 font-semibold font-mono">
                  <span>Words: {wordCount}</span>
                  <span>Chars: {charCount}</span>
                  <span>Read: {readingTime} Min</span>
                </div>
              </GlassCard>

              {/* Swap Floating control */}
              <button
                onClick={handleSwap}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white shadow z-10 hover:scale-115 transition-transform"
                title="Swap Inputs"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
              </button>

              {/* Output text-area */}
              <GlassCard hoverEffect={false} className="p-5 border-zinc-850 bg-zinc-900/10 space-y-3">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-zinc-500 font-bold uppercase">Output result</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleCopy(outputText, 'out')} className="p-1.5 rounded bg-zinc-950 border border-zinc-850 text-zinc-400 hover:text-white" title="Copy to clipboard">
                      {copiedLabel === 'out' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={handleDownload} disabled={!outputText} className="p-1.5 rounded bg-zinc-950 border border-zinc-850 text-zinc-400 hover:text-white disabled:opacity-50" title="Download text result">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <textarea
                  readOnly
                  rows={8}
                  value={outputText}
                  placeholder="Output converted results shown here..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-xs text-zinc-350 leading-relaxed focus:outline-none select-text"
                />

                <div className="flex justify-between text-[9px] text-zinc-500 font-semibold font-mono">
                  <span>Words: {outputText.trim() ? outputText.trim().split(/\s+/).length : 0}</span>
                  <span>Chars: {outputText.length}</span>
                </div>
              </GlassCard>
            </div>

            {/* Run Button Action */}
            <div className="flex gap-3">
              <button
                onClick={handleConvert}
                disabled={loading || !inputText.trim()}
                className="flex-1 btn-premium py-3.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 shadow-lg disabled:opacity-55"
              >
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                Convert English Style
              </button>
              
              {explanation && (
                <button
                  onClick={() => setShowExplainModal(true)}
                  className="px-6 py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 font-bold hover:text-white transition-colors"
                >
                  AI Explain Changes
                </button>
              )}
            </div>

            {/* LOWER PORTION: DETAILED GRAMMAR ANALYSIS */}
            {metrics && (
              <GlassCard hoverEffect={false} className="p-6 border-zinc-850 bg-zinc-900/10 space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-purple-400" />
                  Detailed Grammatical Structure Analysis
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-900">
                    <span className="text-[9px] text-zinc-500 font-semibold uppercase block mb-1">Grammar Score</span>
                    <span className="text-xl font-black text-white">{metrics.grammarScore}/100</span>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-900">
                    <span className="text-[9px] text-zinc-500 font-semibold uppercase block mb-1">Readability</span>
                    <span className="text-xl font-black text-white">{metrics.readabilityScore}/100</span>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-900">
                    <span className="text-[9px] text-zinc-500 font-semibold uppercase block mb-1">Active Voice</span>
                    <span className="text-xl font-black text-white">{metrics.activePercentage}%</span>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-900">
                    <span className="text-[9px] text-zinc-500 font-semibold uppercase block mb-1">Passive Voice</span>
                    <span className="text-xl font-black text-white">{metrics.passivePercentage}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[10px] leading-relaxed">
                  <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-850 space-y-2">
                    <p><strong>Complexity Class:</strong> {metrics.complexity}</p>
                    <p><strong>Sentence Avg Length:</strong> {metrics.sentenceLength} Words</p>
                    <p><strong>Repeated Words:</strong> {metrics.repeatedWords && metrics.repeatedWords.length > 0 ? metrics.repeatedWords.join(', ') : 'None'}</p>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-850 space-y-2">
                    <p className="text-rose-400"><strong>Weak Verbs detected:</strong> {metrics.weakVerbs && metrics.weakVerbs.length > 0 ? metrics.weakVerbs.join(', ') : 'None'}</p>
                    <p className="text-emerald-400"><strong>Strong Verbs recommended:</strong> {metrics.strongVerbs && metrics.strongVerbs.length > 0 ? metrics.strongVerbs.join(', ') : 'None'}</p>
                  </div>
                </div>

                {metrics.suggestions && metrics.suggestions.length > 0 && (
                  <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-900 space-y-1 text-[10px]">
                    <span className="text-zinc-500 font-bold block">Structural Suggestions:</span>
                    <ul className="list-disc pl-4 text-zinc-350 space-y-1 font-light">
                      {metrics.suggestions.map((sug: string, i: number) => (
                        <li key={i}>{sug}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </GlassCard>
            )}

            {/* History drawer */}
            {showHistory && (
              <GlassCard hoverEffect={false} className="p-5 border-zinc-850 bg-zinc-900/10 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-white uppercase">Execution logs</span>
                  <button onClick={() => setHistory([])} className="text-[10px] text-rose-450 font-bold">Clear All</button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {history.map((h, i) => (
                    <button
                      key={i}
                      onClick={() => { setInputText(h.input); setOutputText(h.output); setOperation(h.op); }}
                      className="w-full text-left p-3 rounded-lg bg-zinc-950 border border-zinc-900 hover:border-purple-500 text-[10px] space-y-1 transition-all"
                    >
                      <div className="flex justify-between text-zinc-500">
                        <span className="font-bold">{h.op}</span>
                        <span className="font-mono">Log Entry</span>
                      </div>
                      <p className="text-zinc-300 truncate font-light">"{h.input}"</p>
                    </button>
                  ))}
                </div>
              </GlassCard>
            )}

          </div>
        </div>

        {/* AI EXPLANATION MODAL VIEW */}
        <AnimatePresence>
          {showExplainModal && explanation && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-glass max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                  <h3 className="text-sm font-extrabold text-white uppercase flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-violet-400" />
                    AI Transformation Explanation
                  </h3>
                  <button
                    onClick={() => setShowExplainModal(false)}
                    className="text-xs text-zinc-500 hover:text-white"
                  >
                    Close
                  </button>
                </div>

                <div className="space-y-4 text-xs leading-relaxed select-text">
                  <div className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-850">
                    <strong className="text-zinc-400 block mb-1">Why it changed:</strong>
                    <p className="text-zinc-300 font-light">{explanation.whyChanged}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 font-mono text-[10px]">
                    <div className="p-3 rounded bg-zinc-900/40 border border-zinc-850">
                      <span className="text-zinc-500 block mb-0.5">Identified Tense:</span>
                      <span className="text-purple-400">{explanation.tenseUsed}</span>
                    </div>
                    <div className="p-3 rounded bg-zinc-900/40 border border-zinc-850">
                      <span className="text-zinc-500 block mb-0.5">Identified Voice:</span>
                      <span className="text-purple-400">{explanation.voiceUsed}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-850">
                    <strong className="text-zinc-400 block mb-1">Grammar rules used:</strong>
                    <p className="text-zinc-300 font-light">{explanation.rulesUsed}</p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-850 space-y-1.5">
                    <strong className="text-zinc-400 block">Alternative variants:</strong>
                    <ul className="list-disc pl-4 text-zinc-300 space-y-1 font-light">
                      {explanation.alternatives?.map((alt: string, i: number) => (
                        <li key={i}>{alt}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-850 space-y-1.5">
                    <strong className="text-zinc-400 block">Usage Examples:</strong>
                    <ul className="list-disc pl-4 text-zinc-300 space-y-1 font-light font-mono text-[10px]">
                      {explanation.examples?.map((ex: string, i: number) => (
                        <li key={i}>{ex}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-lg bg-rose-500/5 border border-rose-500/15 space-y-1.5">
                    <strong className="text-rose-400 block">Common mistakes to avoid:</strong>
                    <ul className="list-disc pl-4 text-zinc-300 space-y-1 font-light">
                      {explanation.commonMistakes?.map((mst: string, i: number) => (
                        <li key={i}>{mst}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </DashboardLayout>
  );
}
