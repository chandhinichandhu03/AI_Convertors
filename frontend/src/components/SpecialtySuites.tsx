import React, { useState } from 'react';
import {
  Ruler,
  Palette,
  Clock,
  Code2,
  Calculator,
  Type
} from 'lucide-react';
import GlassCard from './GlassCard';

interface Category {
  id: string;
  label: string;
  icon: any;
  color: string;
  bgColor: string;
}

const CATEGORIES: Category[] = [
  { id: 'scientific', label: 'Scientific Units', icon: Ruler, color: 'text-indigo-400', bgColor: 'bg-indigo-500/10 border-indigo-500/20' },
  { id: 'color', label: 'Color Tools', icon: Palette, color: 'text-pink-400', bgColor: 'bg-pink-500/10 border-pink-500/20' },
  { id: 'datetime', label: 'Date & Time', icon: Clock, color: 'text-violet-400', bgColor: 'bg-violet-500/10 border-violet-500/20' },
  { id: 'encoding', label: 'Encoding Suite', icon: Code2, color: 'text-orange-400', bgColor: 'bg-orange-500/10 border-orange-500/20' },
  { id: 'math', label: 'Mathematics', icon: Calculator, color: 'text-amber-400', bgColor: 'bg-amber-500/10 border-amber-500/20' },
  { id: 'text', label: 'Text Utilities', icon: Type, color: 'text-lime-400', bgColor: 'bg-lime-500/10 border-lime-500/20' },
];

export default function SpecialtySuites() {
  const [activeCat, setActiveCat] = useState('scientific');

  // Scientific Units State
  const [sciVal, setSciVal] = useState('1');
  const [sciCat, setSciCat] = useState('Length');
  const [sciFrom, setSciFrom] = useState('meter');
  const [sciTo, setSciTo] = useState('kilometer');

  // Color Tools State
  const [hexColor, setHexColor] = useState('#8B5CF6');
  const [rgbColor, setRgbColor] = useState('rgb(139, 92, 246)');

  // Text Transform State
  const [textVal, setTextVal] = useState('');
  const [textOut, setTextOut] = useState('');

  // Encoding State
  const [encVal, setEncVal] = useState('');
  const [encOut, setEncOut] = useState('');

  const scientificUnits: Record<string, Record<string, number>> = {
    Length: { meter: 1, kilometer: 0.001, mile: 0.000621371, yard: 1.09361, foot: 3.28084, inch: 39.3701 },
    Weight: { gram: 1, kilogram: 0.001, pound: 0.00220462, ounce: 0.035274, milligram: 1000 },
    Volume: { liter: 1, milliliter: 1000, cubic_meter: 0.001, gallon: 0.264172, quart: 1.05669 },
    Storage: { byte: 1, KB: 1/1024, MB: 1/1048576, GB: 1/1073741824, TB: 1/1099511627776 },
  };

  const convertUnits = () => {
    const val = parseFloat(sciVal);
    if (isNaN(val)) return '0';
    const catData = scientificUnits[sciCat];
    if (!catData || !catData[sciFrom] || !catData[sciTo]) return '0';
    
    // Convert to base, then to target
    const baseVal = val / catData[sciFrom];
    return (baseVal * catData[sciTo]).toFixed(6).replace(/\.?0+$/, '');
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (val && !val.startsWith('#')) {
      val = '#' + val;
    }
    setHexColor(val);
    if (/^#[0-9A-F]{6}$/i.test(val)) {
      const r = parseInt(val.slice(1, 3), 16);
      const g = parseInt(val.slice(3, 5), 16);
      const b = parseInt(val.slice(5, 7), 16);
      setRgbColor(`rgb(${r}, ${g}, ${b})`);
    } else if (/^#[0-9A-F]{3}$/i.test(val)) {
      const r = parseInt(val[1] + val[1], 16);
      const g = parseInt(val[2] + val[2], 16);
      const b = parseInt(val[3] + val[3], 16);
      setRgbColor(`rgb(${r}, ${g}, ${b})`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Category selection */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const active = activeCat === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`p-3.5 rounded-xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all ${
                active
                  ? 'bg-purple-600/10 border-purple-500 text-white shadow-md'
                  : 'bg-zinc-900/40 border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${cat.color}`} />
              <span className="text-[10px] font-bold tracking-tight">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Calculator Body Panels */}
      <GlassCard hoverEffect={false} className="p-6 border-white/5 bg-zinc-900/40">
        
        {/* Scientific Units Converter */}
        {activeCat === 'scientific' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white mb-4">Scientific Unit Converter</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">Category</label>
                <select
                  value={sciCat}
                  onChange={(e) => {
                    setSciCat(e.target.value);
                    const units = Object.keys(scientificUnits[e.target.value]);
                    setSciFrom(units[0]);
                    setSciTo(units[1] || units[0]);
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none"
                >
                  {Object.keys(scientificUnits).map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">Source Value</label>
                <input
                  type="number"
                  value={sciVal}
                  onChange={(e) => setSciVal(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">From</label>
                <select
                  value={sciFrom}
                  onChange={(e) => setSciFrom(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none"
                >
                  {Object.keys(scientificUnits[sciCat] || {}).map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">To</label>
                <select
                  value={sciTo}
                  onChange={(e) => setSciTo(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none"
                >
                  {Object.keys(scientificUnits[sciCat] || {}).map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-center">
              <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider block mb-1">Converted Output</span>
              <span className="text-xl font-black text-white">{convertUnits()} {sciTo}</span>
            </div>
          </div>
        )}

        {/* Color Tools */}
        {activeCat === 'color' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white mb-4">Color HEX ↔ RGB Converter</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">HEX Code</label>
                <input
                  type="text"
                  value={hexColor}
                  onChange={handleHexChange}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">RGB Output</label>
                <input
                  type="text"
                  readOnly
                  value={rgbColor}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="w-full h-12 rounded-lg border border-zinc-800" style={{ backgroundColor: hexColor }} />
          </div>
        )}

        {/* Text Transformations */}
        {activeCat === 'text' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white mb-4">Text Utility Studio</h3>
            <textarea
              rows={4}
              placeholder="Paste text block here..."
              value={textVal}
              onChange={(e) => setTextVal(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-200 focus:outline-none"
            />
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setTextOut(textVal.toUpperCase())}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 hover:border-purple-500 text-[10px] text-white font-semibold transition-all"
              >
                UPPERCASE
              </button>
              <button
                onClick={() => setTextOut(textVal.toLowerCase())}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 hover:border-purple-500 text-[10px] text-white font-semibold transition-all"
              >
                lowercase
              </button>
              <button
                onClick={() => setTextOut(textVal.split('\n').filter((item, idx, self) => self.indexOf(item) === idx).join('\n'))}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 hover:border-purple-500 text-[10px] text-white font-semibold transition-all"
              >
                Deduplicate Lines
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 min-h-[80px] text-xs font-light text-zinc-300">
              {textOut || 'Output text will render here...'}
            </div>
          </div>
        )}

        {/* Encoding Utilities */}
        {activeCat === 'encoding' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white mb-4">Base64 & URL Encoding Suite</h3>
            <textarea
              rows={3}
              placeholder="Input string here..."
              value={encVal}
              onChange={(e) => setEncVal(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-200 focus:outline-none"
            />

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setEncOut(btoa(encVal))}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 hover:border-purple-500 text-[10px] text-white font-semibold transition-all"
              >
                Base64 Encode
              </button>
              <button
                onClick={() => {
                  try { setEncOut(atob(encVal)); }
                  catch (e) { setEncOut("Invalid Base64 string"); }
                }}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 hover:border-purple-500 text-[10px] text-white font-semibold transition-all"
              >
                Base64 Decode
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-400 break-all">
              {encOut || 'Output string...'}
            </div>
          </div>
        )}

        {/* Date & Time */}
        {activeCat === 'datetime' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white mb-4">Unix Epoch Timestamp Converter</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">Local Time</label>
                <input
                  type="text"
                  readOnly
                  value={new Date().toString()}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">Unix Timestamp</label>
                <input
                  type="text"
                  readOnly
                  value={Math.floor(Date.now() / 1000)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-400 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Mathematics */}
        {activeCat === 'math' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white mb-4">Scientific Base Converter</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">Decimal (Base 10)</label>
                <input
                  type="number"
                  placeholder="e.g. 42"
                  onChange={(e) => {
                    const v = parseInt(e.target.value);
                    if (!isNaN(v)) {
                      setEncOut(`Hex: ${v.toString(16).toUpperCase()}\nBinary: ${v.toString(2)}`);
                    }
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none"
                />
              </div>
              <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-400 whitespace-pre-line">
                {encOut || 'Outputs...'}
              </div>
            </div>
          </div>
        )}

      </GlassCard>
    </div>
  );
}
