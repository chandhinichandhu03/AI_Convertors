import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Compass,
  FileCode,
  History as HistoryIcon,
  Settings as SettingsIcon,
  User as UserIcon,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Search,
  Activity,
  Sparkles,
  Sun,
  Moon,
  Code2,
  Calculator,
  Globe,
  HelpCircle
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (!token || !storedUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const ALL_TOOLS = [
    { name: "Universal File Converter", tab: "general", path: "/convert", desc: "Convert files of any type" },
    { name: "Image Quality Modifiers", tab: "images", path: "/convert", desc: "Resize, crop, compress images" },
    { name: "Audio Trimmer & Compressor", tab: "audio", path: "/convert", desc: "Trim and normalize sound files" },
    { name: "Video resolution presets", tab: "video", path: "/convert", desc: "Scale resolution and adjust framerates" },
    { name: "ZIP & Archive packer", tab: "archives", path: "/convert", desc: "Encrypt and compress folders" },
    { name: "Local RAG Chatbot (PDF Chat)", tab: "ai", path: "/convert", desc: "Upload PDFs and chat with AI models" },
    { name: "Code Compiler & Transpiler", path: "/code-db", desc: "Convert Java, Python, C++, Go syntax" },
    { name: "SQL Query Converter", path: "/code-db", desc: "Translate queries (Postgres ↔ MySQL ↔ MongoDB)" },
    { name: "SQL Database Optimizer", path: "/code-db", desc: "Add indexes and improve execution plans" },
    { name: "Calculus Expression Solver", path: "/math-science", desc: "Derivatives, Integrals, and Limits via SymPy" },
    { name: "Matrix & Vector Suite", path: "/math-science", desc: "Determinants, Transpose, multiplication" },
    { name: "Roman Numeral & Bases", path: "/math-science", desc: "Binary, Hex, Octal, Roman converters" },
    { name: "Chemical Equation Balancer", path: "/math-science", desc: "Balance chemical reactions and solve pH" },
    { name: "Stress & Strain Properties", path: "/math-science", desc: "Compute Young's structural modulus" },
    { name: "SI & Imperial Unit Converter", path: "/math-science", desc: "Length, mass, temperature, cooking units" },
    { name: "Offline Language Translator", path: "/data-language", desc: "Translate between languages offline" },
    { name: "Tone Adaptor & Summarizer", path: "/data-language", desc: "Casual, Formal, Academic summaries" },
    { name: "Tabular Data CSV Cleaner", path: "/data-language", desc: "Pandas-based duplicates and null resolution" },
    { name: "Unix Timestamp & Age Converter", path: "/data-language", desc: "Unix epoch epochs and calendar ages" },
    { name: "Global RAG chatbot search", path: "/rag-chatbot", desc: "Ask questions on FFT, Newton, or Binary Trees" },
    
    // English Grammar Suite
    { name: "Grammar Checker & Analyzer", path: "/grammar-language", desc: "Check grammar scores, suggestions, and readability" },
    { name: "Grammar Converter (incorrect to correct)", path: "/grammar-language", desc: "Rewrite sentences with standard grammar rules" },
    { name: "Passive Voice & Active Voice shifts", path: "/grammar-language", desc: "Transpose active/passive grammatical voice" },
    { name: "Past Tense shifts / Present Tense / Future Tense", path: "/grammar-language", desc: "Automatically identify and shift verb tenses" },
    { name: "Direct Speech & Indirect Speech reported", path: "/grammar-language", desc: "Convert direct to indirect reported speech" },
    { name: "Professional Writing Style", path: "/grammar-language", desc: "Adapt text to a professional style" },
    { name: "Formal Writing Tone", path: "/grammar-language", desc: "Adapt text to a formal style" },
    { name: "Academic Writing Tone", path: "/grammar-language", desc: "Adapt text to a scientific academic style" },
    { name: "Paraphrasing & AI Humanizer", path: "/grammar-language", desc: "Paraphrase sentences and humanize AI text" },
    { name: "Summarizer & bullet points", path: "/grammar-language", desc: "Summarize paragraphs into 1-2 sentences or bullets" },
    { name: "Vocabulary Improver (weak words replacement)", path: "/grammar-language", desc: "Enhance vocabulary choices and word variety" },
    { name: "Sentence Rewriter (fluent, confident, polite)", path: "/grammar-language", desc: "Rewrite sentences with varied tones" },
    { name: "Email Generator (complaint, apology, follow-up)", path: "/grammar-language", desc: "Generate business emails and meeting invites" },
    { name: "Resume Grammar & ATS checklist", path: "/grammar-language", desc: "Optimize bullets for ATS and summaries" },
    { name: "Essay Grammar & spelling corrector", path: "/grammar-language", desc: "Improve essay vocabulary and spelling" },
    { name: "Punctuation Checker & commas checker", path: "/grammar-language", desc: "Fix capitalization, spacing, and commas" },
    { name: "Spelling Checker & typos corrector", path: "/grammar-language", desc: "Correct spelling errors (American vs British)" },
    { name: "Case Converter (UPPERCASE, Title Case, camelCase)", path: "/grammar-language", desc: "Convert casings of words and lists" },
    { name: "Text Formatter & duplicate lines cleaner", path: "/grammar-language", desc: "Prune duplicate lines and sort alphabetically" }
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      const filtered = ALL_TOOLS.filter(t => 
        t.name.toLowerCase().includes(query.toLowerCase()) || 
        t.desc.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Compass, color: 'text-indigo-400' },
    { name: 'Convert Studio', path: '/convert', icon: FileCode, color: 'text-sky-400' },
    { name: 'ATS & Career Suite', path: '/ats-career', icon: Sparkles, color: 'text-violet-400' },
    { name: 'Code & DB Studio', path: '/code-db', icon: Code2, color: 'text-emerald-400' },
    { name: 'Math & Science', path: '/math-science', icon: Calculator, color: 'text-amber-400' },
    { name: 'Data & Language', path: '/data-language', icon: Globe, color: 'text-rose-400' },
    { name: 'English Grammar Suite', path: '/grammar-language', icon: Sparkles, color: 'text-pink-400' },
    { name: 'RAG Assistant', path: '/rag-chatbot', icon: HelpCircle, color: 'text-teal-400' },
    { name: 'Activity History', path: '/history', icon: HistoryIcon, color: 'text-zinc-400' },
    { name: 'Profile Details', path: '/profile', icon: UserIcon, color: 'text-purple-400' },
    { name: 'Settings', path: '/settings', icon: SettingsIcon, color: 'text-zinc-400' },
  ];

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      
      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 76 : 260 }}
        className="flex-shrink-0 bg-zinc-900/60 backdrop-blur-xl border-r border-zinc-800/80 flex flex-col justify-between relative z-40 transition-all duration-300"
      >
        <div className="flex flex-col">
          {/* Logo header */}
          <div className="flex items-center gap-3 p-5 border-b border-zinc-800/60 overflow-hidden">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #8B5CF6, #A855F7)' }}>
              <Activity className="w-4 h-4 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <p className="text-white font-extrabold text-sm tracking-tight">OmniConvert</p>
                <p className="text-purple-400 text-[10px] font-bold">OFFLINE CORE</p>
              </div>
            )}
          </div>

          {/* Navigation link group */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[70vh]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                    isActive
                      ? 'bg-purple-600/15 border border-purple-600/30 text-white shadow-lg'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${item.color}`} />
                  {!sidebarCollapsed && <span className="text-xs font-semibold">{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User context footer */}
        <div className="p-3 border-t border-zinc-800/60">
          {!sidebarCollapsed && user && (
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-zinc-950/40 border border-zinc-800/40 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white"
                style={{ background: 'linear-gradient(135deg, #8B5CF6, #A855F7)' }}>
                {user.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="leading-tight overflow-hidden">
                <p className="text-white text-xs font-bold truncate">{user.username}</p>
                <p className="text-[10px] text-zinc-500 truncate">{user.email}</p>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-zinc-500 hover:text-rose-450 hover:bg-rose-500/8 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {!sidebarCollapsed && <span className="text-xs font-semibold">Sign Out</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white shadow-md z-50 cursor-pointer hidden md:flex"
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </motion.aside>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="flex-shrink-0 h-16 border-b border-zinc-900 bg-zinc-950/40 backdrop-blur-md px-6 flex items-center justify-between">
          <div className="relative">
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 w-64">
              <Search className="w-3.5 h-3.5 text-zinc-500" />
              <input
                type="text"
                placeholder="Search every converter..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="bg-transparent text-xs text-zinc-200 placeholder-zinc-500 w-full focus:outline-none"
              />
            </div>
            
            {searchResults.length > 0 && (
              <div className="absolute left-0 mt-2 w-64 rounded-xl border border-zinc-850 bg-zinc-900/95 backdrop-blur-xl shadow-glass p-2 space-y-1 z-50 max-h-64 overflow-y-auto">
                {searchResults.map((tool, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSearchQuery('');
                      setSearchResults([]);
                      if (tool.tab) {
                        navigate(tool.path, { state: { selectTab: tool.tab } });
                      } else {
                        navigate(tool.path);
                      }
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-zinc-800 transition-colors flex flex-col"
                  >
                    <span className="text-xs font-semibold text-white">{tool.name}</span>
                    <span className="text-[10px] text-zinc-500">{tool.desc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold uppercase">
                {user.role} Member
              </span>
            )}
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white"
              style={{ background: 'linear-gradient(135deg, #8B5CF6, #A855F7)' }}>
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-grow p-6 md:p-8 relative z-10 overflow-y-auto max-w-[1400px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
