import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export default function GlassCard({ children, className = '', hoverEffect = true }: GlassCardProps) {
  return (
    <div
      className={`glass-panel rounded-2xl p-6 transition-all duration-300 ${
        hoverEffect ? 'hover:border-purple-500/30 hover:shadow-purple-500/5' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
