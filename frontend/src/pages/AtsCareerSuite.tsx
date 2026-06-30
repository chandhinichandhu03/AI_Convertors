import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  FileText,
  Briefcase,
  Award,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Cpu,
  BookOpen,
  Send,
  RefreshCw,
  Copy,
  Plus,
  Download,
  Trash2,
  Check
} from 'lucide-react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import GlassCard from '../components/GlassCard';
import DropZone from '../components/DropZone';
import ProgressBar from '../components/ProgressBar';

export default function AtsCareerSuite() {
  const [activeSuite, setActiveSuite] = useState<string>('ats');
  const [model, setModel] = useState<string>('llama3');
  const [modelsList, setModelsList] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Upload/File States
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [processProgress, setProcessProgress] = useState<number>(0);
  const [progressText, setProgressText] = useState<string>('');

  // 1. ATS Score Results State
  const [atsResult, setAtsResult] = useState<any>(null);

  // 2. JD Matching State
  const [jdText, setJdText] = useState<string>('');
  const [jdResult, setJdResult] = useState<any>(null);

  // 3. Bullet Rewriter State
  const [bulletsInput, setBulletsInput] = useState<string>('');
  const [rewrittenBullets, setRewrittenBullets] = useState<any[]>([]);

  // 4. Keyword Optimizer State
  const [optText, setOptText] = useState<string>('');
  const [optResult, setOptResult] = useState<any>(null);

  // 5. Section Generator State
  const [selectedSection, setSelectedSection] = useState<string>('summary');
  const [secResumeDetails, setSecResumeDetails] = useState<string>('');
  const [secResult, setSecResult] = useState<any>(null);

  // 6. Skill Gap Analyzer State
  const [selectedTrack, setSelectedTrack] = useState<string>('frontend');
  const [gapResult, setGapResult] = useState<any>(null);

  // 7. Career Recommendation State
  const [careerResult, setCareerResult] = useState<any>(null);

  // 8. Cover Letter State
  const [clJdText, setClJdText] = useState<string>('');
  const [clResult, setClResult] = useState<any>(null);

  // 9. Portfolio Review State
  const [portfolioResult, setPortfolioResult] = useState<any>(null);

  // 10. AI Chat States
  const [chatInput, setChatInput] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [chatLoading, setChatLoading] = useState<boolean>(false);

  // 11. Interview Prep State
  const [interviewResult, setInterviewResult] = useState<any>(null);
  const [selectedQuestionIdx, setSelectedQuestionIdx] = useState<number | null>(null);
  const [selectedQuestionType, setSelectedQuestionType] = useState<string>('hrQuestions');

  // Copy State Tracker
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
    setSelectedFile(file);
    setFileId(null);
    setAtsResult(null);
    setJdResult(null);
    setGapResult(null);
    setCareerResult(null);
    setPortfolioResult(null);
    setInterviewResult(null);
    setError(null);

    // Auto Upload file
    setProcessing(true);
    setProcessProgress(20);
    setProgressText("Uploading document text extraction context...");
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
      setProcessProgress(100);
      setProgressText("Document registered into memory index.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const triggerAtsCheck = async () => {
    if (!fileId) return;
    setProcessing(true);
    setError(null);
    setProcessProgress(40);
    setProgressText("Mapping content against local ATS rules...");

    try {
      const res = await fetch('http://127.0.0.1:5001/api/ai/resume/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ fileId, model })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'ATS analysis failed');
      setAtsResult(data);
      setProcessProgress(100);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const triggerJdMatch = async () => {
    if (!fileId || !jdText.trim()) return;
    setProcessing(true);
    setError(null);
    setProcessProgress(50);
    setProgressText("Aligning achievements and skills coverage against Job Description...");

    try {
      const res = await fetch('http://127.0.0.1:5001/api/ai/resume/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ fileId, jdText, model })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'JD matching failed');
      setJdResult(data);
      setProcessProgress(100);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const triggerBulletRewrite = async () => {
    if (!bulletsInput.trim()) return;
    setProcessing(true);
    setError(null);
    setProcessProgress(60);
    setProgressText("Transforming descriptions using active STAR formulas...");

    const bulletsArray = bulletsInput.split('\n').filter(b => b.trim());

    try {
      const res = await fetch('http://127.0.0.1:5001/api/ai/resume/rewrite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ bullets: bulletsArray, model })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Bullet rewriting failed');
      setRewrittenBullets(data.bullets || []);
      setProcessProgress(100);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const triggerKeywordOptimize = async () => {
    if (!optText.trim()) return;
    setProcessing(true);
    setError(null);
    setProcessProgress(50);
    setProgressText("Analyzing keywords gaps...");

    try {
      const res = await fetch('http://127.0.0.1:5001/api/ai/resume/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ resumeText: optText, model })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Optimization failed');
      setOptResult(data);
      setProcessProgress(100);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const triggerSectionGenerate = async () => {
    if (!secResumeDetails.trim()) return;
    setProcessing(true);
    setError(null);
    setProcessProgress(60);
    setProgressText(`Drafting template structure for ${selectedSection}...`);

    try {
      const res = await fetch('http://127.0.0.1:5001/api/ai/resume/generate-section', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ sectionName: selectedSection, resumeText: secResumeDetails, model })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Section generation failed');
      setSecResult(data);
      setProcessProgress(100);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const triggerGapAnalysis = async () => {
    if (!fileId) return;
    setProcessing(true);
    setError(null);
    setProcessProgress(50);
    setProgressText(`Validating roadmap targets for ${selectedTrack.toUpperCase()}...`);

    try {
      const res = await fetch('http://127.0.0.1:5001/api/ai/skills/gap-analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ fileId, track: selectedTrack, model })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Gap analysis failed');
      setGapResult(data);
      setProcessProgress(100);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const triggerCareerRecommendation = async () => {
    if (!fileId) return;
    setProcessing(true);
    setError(null);
    setProcessProgress(50);
    setProgressText("Mapping qualifications to industry sectors...");

    try {
      const res = await fetch('http://127.0.0.1:5001/api/ai/career/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ fileId, model })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Career recommend failed');
      setCareerResult(data);
      setProcessProgress(100);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const triggerCoverLetterWrite = async () => {
    if (!fileId || !clJdText.trim()) return;
    setProcessing(true);
    setError(null);
    setProcessProgress(60);
    setProgressText("Drafting targeted value hooks and paragraphs...");

    try {
      const res = await fetch('http://127.0.0.1:5001/api/ai/cover-letter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ fileId, jdText: clJdText, model })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Cover letter failed');
      setClResult(data);
      setProcessProgress(100);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const triggerPortfolioReview = async () => {
    if (!fileId) return;
    setProcessing(true);
    setError(null);
    setProcessProgress(50);
    setProgressText("Critiquing typography and layouts structure...");

    try {
      const res = await fetch('http://127.0.0.1:5001/api/ai/resume/portfolio-analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ fileId, model })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Portfolio analysis failed');
      setPortfolioResult(data);
      setProcessProgress(100);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const triggerInterviewPrep = async () => {
    if (!fileId) return;
    setProcessing(true);
    setError(null);
    setProcessProgress(50);
    setProgressText("Generating tailored technical, HR, and scenario questions...");

    try {
      const res = await fetch('http://127.0.0.1:5001/api/ai/resume/interview-prep', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ fileId, model })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Interview prep failed');
      setInterviewResult(data);
      setSelectedQuestionIdx(0);
      setProcessProgress(100);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMessage = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    setChatLoading(true);

    try {
      const res = await fetch('http://127.0.0.1:5001/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          message: userMessage,
          model,
          chatHistory,
          fileId
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Chat failed');
      setChatHistory(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setChatLoading(false);
    }
  };

  const suiteTabs = [
    { id: 'ats', label: 'ATS Checker', icon: FileText, color: 'text-violet-400' },
    { id: 'match', label: 'JD Alignment', icon: Briefcase, color: 'text-sky-400' },
    { id: 'rewrite', label: 'STAR Bullet Rewriter', icon: Sparkles, color: 'text-pink-400' },
    { id: 'optimize', label: 'Keyword Optimizer', icon: TrendingUp, color: 'text-emerald-400' },
    { id: 'section', label: 'Section Builder', icon: Award, color: 'text-amber-400' },
    { id: 'roadmap', label: 'Career Roadmaps', icon: BookOpen, color: 'text-orange-400' },
    { id: 'coverletter', label: 'Cover Letter Maker', icon: FileText, color: 'text-rose-400' },
    { id: 'portfolio', label: 'Portfolio Critique', icon: Cpu, color: 'text-indigo-400' },
    { id: 'interview', label: 'Interview Training', icon: HelpCircle, color: 'text-cyan-400' },
    { id: 'chat', label: 'Resume Chat Assistant', icon: Cpu, color: 'text-teal-400' }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Header Options */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-900/30">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              ATS Resume & Career Builder Suite
              <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
            </h2>
            <p className="text-[11px] text-zinc-500 font-light mt-0.5">
              Refactor, tailor, optimize, and analyze your job applications completely offline.
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

        {/* Global Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <div>
              <p className="font-bold">Execution Error</p>
              <p className="text-[10px] text-rose-400/80 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Navigation and Document Upload Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            
            {/* Upload Area */}
            <GlassCard hoverEffect={false} className="p-4 border-zinc-800 bg-zinc-900/20 space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Pin Resume / Portfolio</h3>
              <p className="text-[10px] text-zinc-500 leading-relaxed font-light">
                Drop your PDF, DOCX, or TXT file here to parse its segments.
              </p>
              
              <DropZone onFileSelect={handleFileSelect} />
              
              {selectedFile && (
                <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-between text-[10px] text-zinc-400">
                  <div className="truncate">
                    <p className="font-bold text-white truncate max-w-[150px]">{selectedFile.name}</p>
                    <p className="text-[9px] text-zinc-500 mt-0.5">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                  {fileId ? (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">Indexed</span>
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-zinc-500" />
                  )}
                </div>
              )}
            </GlassCard>

            {/* Sidebar Navigation Tabs */}
            <div className="flex flex-col gap-1 p-1 bg-zinc-900/60 border border-zinc-800 rounded-xl">
              {suiteTabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeSuite === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveSuite(tab.id); setError(null); }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-xs font-semibold transition-all ${
                      active
                        ? 'bg-zinc-850 text-white shadow-sm border border-zinc-800'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${tab.color}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

          </div>

          {/* Main Action Content Area */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSuite}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                
                {/* 1. ATS Score Checker */}
                {activeSuite === 'ats' && (
                  <GlassCard hoverEffect={false} className="p-6 border-zinc-800 bg-zinc-900/20 space-y-6">
                    <div>
                      <h3 className="text-sm font-black text-white">ATS Resume Checker</h3>
                      <p className="text-[10px] text-zinc-500 font-light mt-0.5">Reviews syntax, structure headings, keyword density, and grammar rules.</p>
                    </div>

                    {!fileId ? (
                      <div className="py-12 text-center text-zinc-500 text-xs font-light">
                        Please upload your resume in the sidebar to run the checker.
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {!atsResult && !processing && (
                          <button
                            onClick={triggerAtsCheck}
                            className="w-full btn-premium py-3 rounded-xl text-xs font-bold text-white shadow-lg"
                          >
                            Analyze Resume Score
                          </button>
                        )}

                        {processing && (
                          <ProgressBar progress={processProgress} statusText={progressText} />
                        )}

                        {atsResult && (
                          <div className="space-y-6">
                            
                            {/* Score Matrix */}
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                              {[
                                { label: 'Overall Score', score: atsResult.atsScore, color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
                                { label: 'Format Alignment', score: atsResult.formattingScore, color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20' },
                                { label: 'Grammar Correctness', score: atsResult.grammarScore, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
                                { label: 'Keywords Density', score: atsResult.keywordScore, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
                                { label: 'Action Verbs Fit', score: atsResult.actionVerbScore, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' }
                              ].map((item, idx) => (
                                <div key={idx} className={`p-4 rounded-xl border ${item.bg} text-center`}>
                                  <span className="text-[9px] font-bold text-zinc-400 block mb-1 uppercase">{item.label}</span>
                                  <span className={`text-2xl font-black ${item.color}`}>{item.score}</span>
                                </div>
                              ))}
                            </div>

                            {/* Reviews Text Block */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {[
                                { title: 'Readability Index', content: atsResult.readability },
                                { title: 'Experience Quality', content: atsResult.experienceQuality },
                                { title: 'Skills Coverage', content: atsResult.skillsCoverage },
                                { title: 'Education Analysis', content: atsResult.educationAnalysis },
                                { title: 'Projects Scope', content: atsResult.projectsAnalysis },
                                { title: 'Achievements & Metrics', content: atsResult.achievementsAnalysis }
                              ].map((item, idx) => (
                                <div key={idx} className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/60 space-y-1.5">
                                  <h4 className="text-xs font-extrabold text-white">{item.title}</h4>
                                  <p className="text-[10px] text-zinc-400 leading-relaxed font-light">{item.content}</p>
                                </div>
                              ))}
                            </div>

                            {/* Keywords lists */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/60">
                                <h4 className="text-xs font-bold text-white mb-2">Hard Skills Detected</h4>
                                <div className="flex flex-wrap gap-1.5">
                                  {atsResult.hardSkills?.map((s: string) => (
                                    <span key={s} className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-semibold">{s}</span>
                                  ))}
                                </div>
                              </div>
                              <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/60">
                                <h4 className="text-xs font-bold text-white mb-2">Soft Skills Detected</h4>
                                <div className="flex flex-wrap gap-1.5">
                                  {atsResult.softSkills?.map((s: string) => (
                                    <span key={s} className="px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[9px] font-semibold">{s}</span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Bullet Points analysis */}
                            {atsResult.weakBulletPoints && atsResult.weakBulletPoints.length > 0 && (
                              <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/60 space-y-3">
                                <h4 className="text-xs font-bold text-white">Weak Bullet Points Analysis</h4>
                                <div className="space-y-3">
                                  {atsResult.weakBulletPoints.map((item: any, idx: number) => (
                                    <div key={idx} className="p-3 rounded-lg bg-zinc-950 border border-zinc-850 space-y-2 text-[10px]">
                                      <p className="text-rose-400"><strong className="text-rose-500">Weak:</strong> "{item.original}"</p>
                                      <p className="text-zinc-500"><strong className="text-zinc-400">Reason:</strong> {item.reason}</p>
                                      <div className="p-2 rounded bg-emerald-500/5 border border-emerald-500/15 text-emerald-350 flex justify-between items-center">
                                        <span><strong className="text-emerald-400">Suggest:</strong> "{item.suggestion}"</span>
                                        <button
                                          onClick={() => handleCopy(item.suggestion, `ats-bullet-${idx}`)}
                                          className="p-1 text-zinc-400 hover:text-white"
                                        >
                                          {copiedText === `ats-bullet-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Gaps / Suggestions */}
                            <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/60 grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px]">
                              <div>
                                <h4 className="text-xs font-bold text-white mb-2">Structure & Suggestions</h4>
                                <ul className="list-disc list-inside space-y-1 text-zinc-400 font-light">
                                  <li><strong>Resume Length:</strong> {atsResult.resumeLength}</li>
                                  <li><strong>Resume Structure:</strong> {atsResult.resumeStructure}</li>
                                  {atsResult.missingSections?.map((s: string) => (
                                    <li key={s} className="text-amber-400"><strong>Missing section:</strong> {s}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-white mb-2">Overall Suggestions</h4>
                                <p className="text-zinc-400 font-light leading-relaxed">{atsResult.overallSuggestions}</p>
                              </div>
                            </div>

                          </div>
                        )}
                      </div>
                    )}
                  </GlassCard>
                )}

                {/* 2. Job Description Alignment */}
                {activeSuite === 'match' && (
                  <GlassCard hoverEffect={false} className="p-6 border-zinc-800 bg-zinc-900/20 space-y-6">
                    <div>
                      <h3 className="text-sm font-black text-white">Job Description Matching</h3>
                      <p className="text-[10px] text-zinc-500 font-light mt-0.5">Upload a resume and paste target Job Description requirements to extract match margins.</p>
                    </div>

                    {!fileId ? (
                      <div className="py-12 text-center text-zinc-500 text-xs font-light">
                        Please upload your resume in the sidebar to map JD matching.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] text-zinc-400 block mb-1.5 font-bold uppercase">Job Description Text</label>
                          <textarea
                            rows={6}
                            placeholder="Paste the target job description requirements here..."
                            value={jdText}
                            onChange={(e) => setJdText(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
                          />
                        </div>

                        {!jdResult && !processing && (
                          <button
                            onClick={triggerJdMatch}
                            disabled={!jdText.trim()}
                            className="w-full btn-premium py-3 rounded-xl text-xs font-bold text-white shadow-lg disabled:opacity-50"
                          >
                            Analyze JD Matching Gaps
                          </button>
                        )}

                        {processing && (
                          <ProgressBar progress={processProgress} statusText={progressText} />
                        )}

                        {jdResult && (
                          <div className="space-y-6">
                            
                            {/* Score Matrix */}
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-sky-500/10 border border-sky-500/20">
                              <span className="text-3xl font-black text-sky-400">{jdResult.matchPercentage}%</span>
                              <div className="leading-tight">
                                <h4 className="font-extrabold text-white text-xs">Job Alignment Match</h4>
                                <p className="text-[10px] text-zinc-400 font-light mt-0.5">Score evaluates matching requirements against resume experience blocks.</p>
                              </div>
                            </div>

                            {/* Skills lists */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/60">
                                <h4 className="text-xs font-bold text-emerald-400 mb-2">Matching Skills</h4>
                                <div className="flex flex-wrap gap-1.5">
                                  {jdResult.matchingSkills?.map((s: string) => (
                                    <span key={s} className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-semibold">{s}</span>
                                  ))}
                                </div>
                              </div>
                              <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/60">
                                <h4 className="text-xs font-bold text-rose-450 mb-2">Missing Skills from JD</h4>
                                <div className="flex flex-wrap gap-1.5">
                                  {jdResult.missingSkills?.map((s: string) => (
                                    <span key={s} className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-450 border border-rose-500/20 text-[9px] font-semibold">{s}</span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Gaps Text Blocks */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {[
                                { title: 'Experience Gap', content: jdResult.experienceGap },
                                { title: 'Education Gap', content: jdResult.educationGap },
                                { title: 'Project Gap', content: jdResult.projectGap }
                              ].map((item, idx) => (
                                <div key={idx} className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/60 space-y-1.5">
                                  <h4 className="text-xs font-extrabold text-white">{item.title}</h4>
                                  <p className="text-[10px] text-zinc-400 leading-relaxed font-light">{item.content}</p>
                                </div>
                              ))}
                            </div>

                            {/* Recommendations */}
                            <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/60 space-y-2">
                              <h4 className="text-xs font-bold text-white">Recommended Improvements</h4>
                              <ul className="list-disc list-inside space-y-1 text-[10px] text-zinc-400 font-light">
                                {jdResult.recommendedImprovements?.map((item: string, idx: number) => (
                                  <li key={idx}>{item}</li>
                                ))}
                              </ul>
                            </div>

                            {/* Optimized Resume Section */}
                            <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/60 space-y-3">
                              <div className="flex justify-between items-center">
                                <h4 className="text-xs font-bold text-white">Optimized Resume Suggestion</h4>
                                <button
                                  onClick={() => handleCopy(jdResult.optimizedResumeVersion, 'jd-optimized-text')}
                                  className="btn-premium px-3 py-1 rounded-full text-[9px] text-white font-bold flex items-center gap-1 shadow"
                                >
                                  {copiedText === 'jd-optimized-text' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                  Copy Text
                                </button>
                              </div>
                              <pre className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-850 text-[10px] text-zinc-300 font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
                                {jdResult.optimizedResumeVersion}
                              </pre>
                            </div>

                          </div>
                        )}
                      </div>
                    )}
                  </GlassCard>
                )}

                {/* 3. Resume Bullet Rewriter */}
                {activeSuite === 'rewrite' && (
                  <GlassCard hoverEffect={false} className="p-6 border-zinc-800 bg-zinc-900/20 space-y-6">
                    <div>
                      <h3 className="text-sm font-black text-white">STAR Bullet Rewriter</h3>
                      <p className="text-[10px] text-zinc-500 font-light mt-0.5">Input weak descriptions (one per line) and get impact-driven accomplishments using action verbs and metrics.</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] text-zinc-400 block mb-1.5 font-bold uppercase">Weak Bullet Points</label>
                        <textarea
                          rows={4}
                          placeholder="Worked on backend database.&#10;Helped optimize website speed."
                          value={bulletsInput}
                          onChange={(e) => setBulletsInput(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      {!processing && (
                        <button
                          onClick={triggerBulletRewrite}
                          disabled={!bulletsInput.trim()}
                          className="w-full btn-premium py-3 rounded-xl text-xs font-bold text-white shadow-lg disabled:opacity-50"
                        >
                          Rewrite Achievements
                        </button>
                      )}

                      {processing && (
                        <ProgressBar progress={processProgress} statusText={progressText} />
                      )}

                      {rewrittenBullets.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold text-white">Rewritten Bullet Results</h4>
                          <div className="space-y-3">
                            {rewrittenBullets.map((item: any, idx: number) => (
                              <div key={idx} className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/60 space-y-2 text-[10px]">
                                <p className="text-zinc-500 font-light"><strong className="text-zinc-400">Weak input:</strong> "{item.original}"</p>
                                <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/15 text-emerald-350 flex justify-between items-center leading-relaxed">
                                  <span><strong className="text-emerald-400">STAR rewrite:</strong> "{item.strong}"</span>
                                  <button
                                    onClick={() => handleCopy(item.strong, `rewrite-${idx}`)}
                                    className="p-1 text-zinc-400 hover:text-white"
                                  >
                                    {copiedText === `rewrite-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </GlassCard>
                )}

                {/* 4. Keyword Optimizer */}
                {activeSuite === 'optimize' && (
                  <GlassCard hoverEffect={false} className="p-6 border-zinc-800 bg-zinc-900/20 space-y-6">
                    <div>
                      <h3 className="text-sm font-black text-white">Keyword Optimizer</h3>
                      <p className="text-[10px] text-zinc-500 font-light mt-0.5">Scans resume descriptions and extracts keywords to suggest certification targets and hot trending skills.</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] text-zinc-400 block mb-1.5 font-bold uppercase">Resume Description details</label>
                        <textarea
                          rows={5}
                          placeholder="Paste your skills list or resume experience sections here..."
                          value={optText}
                          onChange={(e) => setOptText(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      {!processing && (
                        <button
                          onClick={triggerKeywordOptimize}
                          disabled={!optText.trim()}
                          className="w-full btn-premium py-3 rounded-xl text-xs font-bold text-white shadow-lg disabled:opacity-50"
                        >
                          Extract & Suggest Keywords
                        </button>
                      )}

                      {processing && (
                        <ProgressBar progress={processProgress} statusText={progressText} />
                      )}

                      {optResult && (
                        <div className="space-y-4">
                          {[
                            { title: 'Missing ATS keywords', items: optResult.missingAtsKeywords, color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
                            { title: 'Industry keywords', items: optResult.industryKeywords, color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20' },
                            { title: 'Trending skills', items: optResult.trendingSkills, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
                            { title: 'Action Verbs recommended', items: optResult.actionVerbs, color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20' },
                            { title: 'Suggested Certifications', items: optResult.certificationRecommendations, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' }
                          ].map((sec, idx) => (
                            <div key={idx} className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/60 space-y-2">
                              <h4 className="text-xs font-bold text-white">{sec.title}</h4>
                              <div className="flex flex-wrap gap-1.5">
                                {sec.items?.map((item: string) => (
                                  <span key={item} className={`px-2 py-0.5 rounded-full ${sec.bg} ${sec.color} text-[9px] font-semibold`}>{item}</span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </GlassCard>
                )}

                {/* 5. Resume Section Builder */}
                {activeSuite === 'section' && (
                  <GlassCard hoverEffect={false} className="p-6 border-zinc-800 bg-zinc-900/20 space-y-6">
                    <div>
                      <h3 className="text-sm font-black text-white">Resume Section Generator</h3>
                      <p className="text-[10px] text-zinc-500 font-light mt-0.5">Select a target section and detail your background to build a formatted section.</p>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] text-zinc-400 block mb-1.5 font-bold uppercase">Section Category</label>
                          <select
                            value={selectedSection}
                            onChange={(e) => setSelectedSection(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-205 focus:outline-none"
                          >
                            <option value="summary">Professional Summary</option>
                            <option value="objective">Career Objective</option>
                            <option value="skills">Technical Skills</option>
                            <option value="projects">Key Projects</option>
                            <option value="achievements">Accomplishments</option>
                            <option value="certifications">Certifications</option>
                            <option value="volunteer">Volunteer Experience</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="text-[10px] text-zinc-400 block mb-1.5 font-bold uppercase">Candidate details</label>
                          <textarea
                            rows={3}
                            placeholder="Brief facts: 3 years node dev, worked on api, likes system optimization..."
                            value={secResumeDetails}
                            onChange={(e) => setSecResumeDetails(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none"
                          />
                        </div>
                      </div>

                      {!processing && (
                        <button
                          onClick={triggerSectionGenerate}
                          disabled={!secResumeDetails.trim()}
                          className="w-full btn-premium py-3 rounded-xl text-xs font-bold text-white shadow-lg disabled:opacity-50"
                        >
                          Generate Section
                        </button>
                      )}

                      {processing && (
                        <ProgressBar progress={processProgress} statusText={progressText} />
                      )}

                      {secResult && (
                        <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/60 space-y-3">
                          <div className="flex justify-between items-center">
                            <h4 className="text-xs font-bold text-white capitalize">{secResult.sectionName} section Output</h4>
                            <button
                              onClick={() => handleCopy(secResult.content, 'sec-copy')}
                              className="btn-premium px-3 py-1 rounded-full text-[9px] text-white font-bold flex items-center gap-1 shadow"
                            >
                              {copiedText === 'sec-copy' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                              Copy Section
                            </button>
                          </div>
                          <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-850 text-xs text-zinc-350 leading-relaxed whitespace-pre-wrap">
                            {secResult.content}
                          </div>
                        </div>
                      )}
                    </div>
                  </GlassCard>
                )}

                {/* 6. Skill Gap Roadmaps */}
                {activeSuite === 'roadmap' && (
                  <GlassCard hoverEffect={false} className="p-6 border-zinc-800 bg-zinc-900/20 space-y-6">
                    <div>
                      <h3 className="text-sm font-black text-white">Skill Gap Roadmap Analyzer</h3>
                      <p className="text-[10px] text-zinc-500 font-light mt-0.5">Upload a resume and click a track to see missing skills, learning roadmaps, and certification suggestions.</p>
                    </div>

                    {!fileId ? (
                      <div className="py-12 text-center text-zinc-500 text-xs font-light">
                        Please upload your resume in the sidebar to review career roadmap gaps.
                      </div>
                    ) : (
                      <div className="space-y-6">
                        
                        {/* Track Selection */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                          {[
                            { id: 'frontend', label: 'Frontend' },
                            { id: 'backend', label: 'Backend' },
                            { id: 'ai', label: 'AI/ML' },
                            { id: 'cloud', label: 'Cloud' },
                            { id: 'devops', label: 'DevOps' },
                            { id: 'security', label: 'Cyber' },
                            { id: 'data', label: 'Data Sci' }
                          ].map((track) => (
                            <button
                              key={track.id}
                              onClick={() => setSelectedTrack(track.id)}
                              className={`p-2 rounded-lg text-center text-[10px] font-bold border transition-all ${
                                selectedTrack === track.id
                                  ? 'bg-purple-600/10 border-purple-500 text-white'
                                  : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                              }`}
                            >
                              {track.label}
                            </button>
                          ))}
                        </div>

                        {!gapResult && !processing && (
                          <button
                            onClick={triggerGapAnalysis}
                            className="w-full btn-premium py-3 rounded-xl text-xs font-bold text-white shadow-lg"
                          >
                            Analyze Skill Gaps & Draw Roadmap
                          </button>
                        )}

                        {processing && (
                          <ProgressBar progress={processProgress} statusText={progressText} />
                        )}

                        {gapResult && (
                          <div className="space-y-6">
                            
                            {/* Skills alignment list */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/60">
                                <h4 className="text-xs font-bold text-emerald-400 mb-2">My Matching Skills</h4>
                                <div className="flex flex-wrap gap-1.5">
                                  {gapResult.matchingSkills?.map((s: string) => (
                                    <span key={s} className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-semibold">{s}</span>
                                  ))}
                                </div>
                              </div>
                              <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/60">
                                <h4 className="text-xs font-bold text-amber-450 mb-2">Target Skills Gaps</h4>
                                <div className="flex flex-wrap gap-1.5">
                                  {gapResult.missingSkills?.map((s: string) => (
                                    <span key={s} className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-450 border border-amber-500/20 text-[9px] font-semibold">{s}</span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Roadmap Nodes Layout */}
                            <div className="space-y-4">
                              <h4 className="text-xs font-bold text-white">Structured Learning Roadmap</h4>
                              
                              <div className="relative border-l border-zinc-800 pl-6 ml-2 space-y-6">
                                {gapResult.learningRoadmap?.map((node: any, idx: number) => (
                                  <div key={idx} className="relative">
                                    {/* Glowing point */}
                                    <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-purple-600 border border-zinc-950 shadow-[0_0_8px_rgba(139,92,246,0.8)] flex items-center justify-center text-[8px] font-black text-white">
                                      {node.step}
                                    </div>
                                    <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-2">
                                      <h5 className="text-xs font-extrabold text-white">{node.topic}</h5>
                                      <p className="text-[10px] text-zinc-400 leading-relaxed font-light">{node.description}</p>
                                      
                                      {node.resources && node.resources.length > 0 && (
                                        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-zinc-900">
                                          <span className="text-[8px] text-zinc-500 font-bold uppercase">Study Resources:</span>
                                          {node.resources.map((r: string, rIdx: number) => (
                                            <span key={rIdx} className="text-[9px] text-purple-400 font-semibold">{r}</span>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Certifications and summary */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px]">
                              <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/60 space-y-2">
                                <h4 className="text-xs font-bold text-white">Recommended Certifications</h4>
                                <ul className="list-disc list-inside space-y-1 text-zinc-400 font-light">
                                  {gapResult.recommendedCertifications?.map((c: string) => (
                                    <li key={c}>{c}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/60 space-y-2">
                                <h4 className="text-xs font-bold text-white">Career Alignment Summary</h4>
                                <p className="text-zinc-400 font-light leading-relaxed">{gapResult.careerProgression}</p>
                              </div>
                            </div>

                          </div>
                        )}
                      </div>
                    )}
                  </GlassCard>
                )}

                {/* 7. Cover Letter Generator */}
                {activeSuite === 'coverletter' && (
                  <GlassCard hoverEffect={false} className="p-6 border-zinc-800 bg-zinc-900/20 space-y-6">
                    <div>
                      <h3 className="text-sm font-black text-white">Cover Letter Generator</h3>
                      <p className="text-[10px] text-zinc-500 font-light mt-0.5">Inputs your resume details and maps them directly to job requirements to draft a customized cover letter.</p>
                    </div>

                    {!fileId ? (
                      <div className="py-12 text-center text-zinc-500 text-xs font-light">
                        Please upload your resume in the sidebar to build cover letters.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] text-zinc-400 block mb-1.5 font-bold uppercase">Job Description Text</label>
                          <textarea
                            rows={5}
                            placeholder="Paste the target job description requirements here..."
                            value={clJdText}
                            onChange={(e) => setClJdText(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-205 focus:outline-none"
                          />
                        </div>

                        {!clResult && !processing && (
                          <button
                            onClick={triggerCoverLetterWrite}
                            disabled={!clJdText.trim()}
                            className="w-full btn-premium py-3 rounded-xl text-xs font-bold text-white shadow-lg disabled:opacity-50"
                          >
                            Generate Cover Letter
                          </button>
                        )}

                        {processing && (
                          <ProgressBar progress={processProgress} statusText={progressText} />
                        )}

                        {clResult && (
                          <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/60 space-y-4">
                            <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                              <div className="text-[10px] text-zinc-400">
                                <strong>Subject:</strong> {clResult.subject}
                              </div>
                              <button
                                onClick={() => handleCopy(clResult.fullLetter, 'cl-copy')}
                                className="btn-premium px-3 py-1 rounded-full text-[9px] text-white font-bold flex items-center gap-1 shadow"
                              >
                                {copiedText === 'cl-copy' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                Copy Letter
                              </button>
                            </div>
                            
                            <div className="p-3 rounded bg-zinc-950 text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto">
                              {clResult.fullLetter}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </GlassCard>
                )}

                {/* 8. Portfolio Critique */}
                {activeSuite === 'portfolio' && (
                  <GlassCard hoverEffect={false} className="p-6 border-zinc-800 bg-zinc-900/20 space-y-6">
                    <div>
                      <h3 className="text-sm font-black text-white">Portfolio Design Analyzer</h3>
                      <p className="text-[10px] text-zinc-500 font-light mt-0.5">Upload your portfolio index PDF to evaluate visual structures, typography details, and accessibility standards.</p>
                    </div>

                    {!fileId ? (
                      <div className="py-12 text-center text-zinc-500 text-xs font-light">
                        Please upload your portfolio PDF in the sidebar to run the review.
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {!portfolioResult && !processing && (
                          <button
                            onClick={triggerPortfolioReview}
                            className="w-full btn-premium py-3 rounded-xl text-xs font-bold text-white shadow-lg"
                          >
                            Analyze Portfolio Design
                          </button>
                        )}

                        {processing && (
                          <ProgressBar progress={processProgress} statusText={progressText} />
                        )}

                        {portfolioResult && (
                          <div className="space-y-6">
                            
                            {/* Score Matrix */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {[
                                { label: 'Layout Design', score: portfolioResult.designScore, color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
                                { label: 'Typography Fit', score: portfolioResult.typographyScore, color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20' },
                                { label: 'Visual Consistency', score: portfolioResult.consistencyScore, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
                                { label: 'Accessibility Tagging', score: portfolioResult.accessibilityScore, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' }
                              ].map((item, idx) => (
                                <div key={idx} className={`p-4 rounded-xl border ${item.bg} text-center`}>
                                  <span className="text-[9px] font-bold text-zinc-400 block mb-1 uppercase">{item.label}</span>
                                  <span className={`text-2xl font-black ${item.color}`}>{item.score}</span>
                                </div>
                              ))}
                            </div>

                            {/* Critique Details */}
                            <div className="space-y-3 text-[10px]">
                              {[
                                { title: 'Design Review', text: portfolioResult.designReview },
                                { title: 'Typography Review', text: portfolioResult.typographyReview },
                                { title: 'Projects Showcase', text: portfolioResult.projectsReview },
                                { title: 'Visual Flow & Alignments', text: portfolioResult.consistencyReview },
                                { title: 'Accessibility Compliance', text: portfolioResult.accessibilityReview }
                              ].map((item, idx) => (
                                <div key={idx} className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/60 space-y-1">
                                  <h4 className="text-xs font-bold text-white">{item.title}</h4>
                                  <p className="text-zinc-400 font-light leading-relaxed">{item.text}</p>
                                </div>
                              ))}
                            </div>

                            {/* Suggestions List */}
                            <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/60 space-y-2 text-[10px]">
                              <h4 className="text-xs font-bold text-white">Optimization Suggestions</h4>
                              <ul className="list-disc list-inside space-y-1 text-zinc-400 font-light">
                                {portfolioResult.suggestions?.map((item: string, idx: number) => (
                                  <li key={idx}>{item}</li>
                                ))}
                              </ul>
                            </div>

                          </div>
                        )}
                      </div>
                    )}
                  </GlassCard>
                )}

                {/* 9. Interview Training Questions */}
                {activeSuite === 'interview' && (
                  <GlassCard hoverEffect={false} className="p-6 border-zinc-800 bg-zinc-900/20 space-y-6">
                    <div>
                      <h3 className="text-sm font-black text-white">Interview Preparation</h3>
                      <p className="text-[10px] text-zinc-500 font-light mt-0.5">Extracts work experience details to construct customized HR, technical, and coding interview question lists.</p>
                    </div>

                    {!fileId ? (
                      <div className="py-12 text-center text-zinc-500 text-xs font-light">
                        Please upload your resume in the sidebar to generate interview questions.
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {!interviewResult && !processing && (
                          <button
                            onClick={triggerInterviewPrep}
                            className="w-full btn-premium py-3 rounded-xl text-xs font-bold text-white shadow-lg"
                          >
                            Build Interview Questions List
                          </button>
                        )}

                        {processing && (
                          <ProgressBar progress={processProgress} statusText={progressText} />
                        )}

                        {interviewResult && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            
                            {/* Question Type list */}
                            <div className="md:col-span-1 space-y-1.5 p-1 bg-zinc-950 border border-zinc-850 rounded-xl h-fit">
                              {[
                                { id: 'hrQuestions', label: 'HR Questions' },
                                { id: 'technicalQuestions', label: 'Technical Questions' },
                                { id: 'behavioralQuestions', label: 'Behavioral (STAR)' },
                                { id: 'projectQuestions', label: 'Project Architecture' },
                                { id: 'scenarioQuestions', label: 'Incident Scenarios' },
                                { id: 'codingQuestions', label: 'Coding Challenges' }
                              ].map((item) => (
                                <button
                                  key={item.id}
                                  onClick={() => { setSelectedQuestionType(item.id); setSelectedQuestionIdx(0); }}
                                  className={`w-full text-left p-2.5 rounded-lg text-[10px] font-bold border transition-colors ${
                                    selectedQuestionType === item.id
                                      ? 'bg-purple-600/10 border-purple-500 text-white'
                                      : 'border-transparent text-zinc-400 hover:text-zinc-200'
                                  }`}
                                >
                                  {item.label}
                                </button>
                              ))}
                            </div>

                            {/* Questions Details panel */}
                            <div className="md:col-span-2 space-y-4">
                              
                              {/* Selection slider */}
                              <div className="flex gap-2">
                                {interviewResult[selectedQuestionType]?.map((_: any, idx: number) => (
                                  <button
                                    key={idx}
                                    onClick={() => setSelectedQuestionIdx(idx)}
                                    className={`w-6 h-6 rounded-lg text-[10px] font-bold flex items-center justify-center border transition-all ${
                                      selectedQuestionIdx === idx
                                        ? 'bg-zinc-805 text-white border-zinc-700'
                                        : 'bg-zinc-950/40 border-zinc-850 text-zinc-500'
                                    }`}
                                  >
                                    {idx + 1}
                                  </button>
                                ))}
                              </div>

                              {selectedQuestionIdx !== null && interviewResult[selectedQuestionType]?.[selectedQuestionIdx] && (
                                <div className="p-5 rounded-xl bg-zinc-950/40 border border-zinc-800 space-y-4 text-[10px]">
                                  <div className="space-y-1">
                                    <span className="text-[8px] font-black text-purple-400 uppercase tracking-wider">Question {selectedQuestionIdx + 1}</span>
                                    <h4 className="text-xs font-black text-white leading-relaxed">
                                      "{interviewResult[selectedQuestionType][selectedQuestionIdx].question}"
                                    </h4>
                                  </div>

                                  <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-850 space-y-1">
                                    <h5 className="font-bold text-zinc-400">Purpose / Focus:</h5>
                                    <p className="text-zinc-500 font-light">{interviewResult[selectedQuestionType][selectedQuestionIdx].purpose}</p>
                                  </div>

                                  <div className="p-3.5 rounded-lg bg-emerald-500/5 border border-emerald-500/15 space-y-1">
                                    <h5 className="font-bold text-emerald-400">Suggested Approach:</h5>
                                    <p className="text-zinc-350 leading-relaxed font-light">{interviewResult[selectedQuestionType][selectedQuestionIdx].suggestedApproach}</p>
                                  </div>
                                </div>
                              )}
                            </div>

                          </div>
                        )}
                      </div>
                    )}
                  </GlassCard>
                )}

                {/* 10. AI Resume Chat Assistant */}
                {activeSuite === 'chat' && (
                  <GlassCard hoverEffect={false} className="p-6 border-zinc-800 bg-zinc-900/20 col-span-2 flex flex-col justify-between h-[520px]">
                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4">
                      {chatHistory.length > 0 ? (
                        chatHistory.map((msg, idx) => (
                          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-3.5 rounded-xl max-w-[80%] text-xs leading-relaxed ${
                              msg.role === 'user'
                                ? 'bg-purple-600 text-white'
                                : 'bg-zinc-950 border border-zinc-850 text-zinc-300'
                            }`}>
                              {msg.content}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center text-zinc-600 text-xs font-light">
                          <Cpu className="w-8 h-8 text-zinc-700 mb-2 animate-pulse" />
                          Chat with local LLM pinned to your uploaded Resume context.
                          <div className="flex flex-wrap gap-2 justify-center mt-4 max-w-md">
                            {[
                              "How can I improve this resume?",
                              "Why is my ATS score low?",
                              "How do I improve projects details?",
                              "Should I add certifications?"
                            ].map((q) => (
                              <button
                                key={q}
                                onClick={() => setChatInput(q)}
                                className="px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-850 hover:border-purple-650 text-[10px] text-zinc-400 hover:text-white transition-all text-left"
                              >
                                {q}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <form onSubmit={handleSendChatMessage} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Ask the resume assistant..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-xs text-zinc-200 focus:outline-none focus:border-purple-500 placeholder-zinc-650"
                      />
                      <button
                        type="submit"
                        disabled={chatLoading}
                        className="p-3.5 rounded-xl btn-premium text-white flex items-center justify-center disabled:opacity-50"
                      >
                        {chatLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      </button>
                    </form>
                  </GlassCard>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
