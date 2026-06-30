import React from 'react';

interface ProgressBarProps {
  progress: number;
  statusText?: string;
}

export default function ProgressBar({ progress, statusText = 'Processing...' }: ProgressBarProps) {
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-[11px] font-semibold">
        <span className="text-zinc-400 truncate max-w-[280px]">{statusText}</span>
        <span className="text-purple-400">{progress}%</span>
      </div>
      <div className="progress-track w-full">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
