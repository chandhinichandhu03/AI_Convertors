import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, Activity } from 'lucide-react';
import AuthLayout from '../components/layouts/AuthLayout';
import GlassCard from '../components/GlassCard';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('http://127.0.0.1:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Incorrect credentials');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMockGoogleLogin = () => {
    // Seed test admin credentials to log in without setting up backend first
    localStorage.setItem('token', 'mock-jwt-token-google');
    localStorage.setItem('user', JSON.stringify({
      username: 'google_user',
      email: 'oauth@gmail.com',
      role: 'User'
    }));
    navigate('/dashboard');
  };

  return (
    <AuthLayout>
      <GlassCard hoverEffect={false} className="w-full max-w-[420px] p-8 border border-white/10 rounded-[20px] shadow-glass bg-[#111827]/85 backdrop-blur-2xl">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
            style={{ background: 'linear-gradient(135deg, #8B5CF6, #A855F7)' }}>
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-extrabold text-lg tracking-tight">OmniConvert AI</span>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Welcome Back</h2>
          <p className="text-zinc-400 text-xs mt-1.5 font-light">
            Sign in to start offline files processing
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs text-center font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] font-semibold text-zinc-300 tracking-wide uppercase block mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-950/80 border border-zinc-800 rounded-lg pl-10 pr-3 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-purple-500 placeholder-zinc-600"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-zinc-300 tracking-wide uppercase block mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-950/80 border border-zinc-800 rounded-lg pl-10 pr-10 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-purple-500 placeholder-zinc-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-xs font-semibold text-white shadow-lg btn-premium disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-800" /></div>
          <div className="relative flex justify-center text-xs"><span className="bg-[#111827] px-2 text-zinc-500">Or continue with</span></div>
        </div>

        <button
          onClick={handleMockGoogleLogin}
          type="button"
          className="w-full bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-300 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.516 0-6.372-2.857-6.372-6.371s2.856-6.372 6.372-6.372c1.603 0 3.064.593 4.184 1.574l3.056-3.057C19.222 2.378 15.935 1 12.24 1 5.753 1 .5 6.253.5 12.74S5.753 24.48 12.24 24.48c6.402 0 11.666-5.166 11.666-11.74 0-.765-.084-1.503-.233-2.215H12.24z" />
          </svg>
          Google Identity
        </button>

        <div className="text-center mt-6">
          <p className="text-xs text-zinc-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
              Create account
            </Link>
          </p>
        </div>
      </GlassCard>
    </AuthLayout>
  );
}
