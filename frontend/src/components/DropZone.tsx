import React, { useState } from 'react';
import { UploadCloud } from 'lucide-react';

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
}

export default function DropZone({ onFileSelect, accept }: DropZoneProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
 
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
        dragActive
          ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_20px_rgba(139,92,246,0.15)]'
          : 'border-zinc-800 bg-zinc-900/10 hover:border-zinc-700'
      }`}
    >
      <input
        type="file"
        id="file-upload"
        multiple={false}
        onChange={handleChange}
        accept={accept}
        className="hidden"
      />
      <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
        <UploadCloud className="w-10 h-10 text-zinc-500 mb-3" />
        <p className="text-xs text-white font-bold">Drag & drop your files here</p>
        <p className="text-[10px] text-zinc-500 mt-1 font-medium">
          Supports CSV, Excel, JSON and tabular datasets
        </p>
      </label>
    </div>
  );
}

