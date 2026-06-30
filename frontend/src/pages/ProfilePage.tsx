import React, { useState, useEffect } from 'react';
import { User as UserIcon, Shield, Mail } from 'lucide-react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import GlassCard from '../components/GlassCard';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <GlassCard hoverEffect={false} className="p-6 border-white/5 bg-zinc-900/40">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black text-white"
              style={{ background: 'linear-gradient(135deg, #8B5CF6, #A855F7)' }}>
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{user?.username || 'developer'}</h2>
              <p className="text-zinc-400 text-xs mt-0.5 font-light">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-4 border-t border-zinc-800 pt-6">
            <div className="flex items-center justify-between text-xs py-2 border-b border-zinc-800/40">
              <span className="text-zinc-400 flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-purple-400" />
                Username
              </span>
              <span className="text-white font-semibold">{user?.username}</span>
            </div>

            <div className="flex items-center justify-between text-xs py-2 border-b border-zinc-800/40">
              <span className="text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-400" />
                Email Address
              </span>
              <span className="text-white font-semibold">{user?.email}</span>
            </div>

            <div className="flex items-center justify-between text-xs py-2 border-b border-zinc-800/40">
              <span className="text-zinc-400 flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-400" />
                Workspace Role
              </span>
              <span className="text-white font-bold uppercase">{user?.role || 'USER'} MEMBER</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
