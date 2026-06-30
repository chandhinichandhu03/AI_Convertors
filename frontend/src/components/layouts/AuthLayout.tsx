import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-zinc-950 relative overflow-hidden px-4">
      {/* Background glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full filter blur-[100px] opacity-10"
        style={{ background: 'radial-gradient(circle, #8B5CF6 0%, transparent 70%)' }} />

      <div className="relative z-10 w-full max-w-[420px] py-8">
        {children}
      </div>
    </div>
  );
}
