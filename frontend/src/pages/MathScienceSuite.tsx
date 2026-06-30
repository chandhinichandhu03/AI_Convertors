import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Calculator,
  Compass,
  AlertCircle,
  BookOpen,
  HelpCircle,
  Copy,
  Check,
  RefreshCw,
  TrendingUp,
  Activity
} from 'lucide-react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import GlassCard from '../components/GlassCard';

export default function MathScienceSuite() {
  const [activeTab, setActiveTab] = useState<string>('math');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Math States
  const [mathOp, setMathOp] = useState<string>('derivative');
  const [mathExpr, setMathExpr] = useState<string>('x**2 + 5*x + sin(x)');
  const [mathVar, setMathVar] = useState<string>('x');
  const [mathLower, setMathLower] = useState<string>('0');
  const [mathUpper, setMathUpper] = useState<string>('3');
  const [mathResult, setMathResult] = useState<any>(null);

  // Matrix State
  const [matrixA, setMatrixA] = useState<string>('[[1, 2], [3, 4]]');
  const [matrixB, setMatrixB] = useState<string>('[[2, 0], [1, 2]]');

  // Base conversions
  const [baseVal, setBaseVal] = useState<string>('42');
  const [baseFrom, setBaseFrom] = useState<number>(10);
  const [baseTo, setBaseTo] = useState<number>(16);

  // Equations list
  const [eqList, setEqList] = useState<string>('x + y - 5\nx - y - 1');

  // Boolean logic
  const [boolExpr, setBoolExpr] = useState<string>('A & (B | ~A)');

  // 2. Physics States
  const [physicsOp, setPhysicsOp] = useState<string>('force');
  const [mass, setMass] = useState<string>('15');
  const [acceleration, setAcceleration] = useState<string>('9.8');
  const [radius, setRadius] = useState<string>('2.5');
  const [forceVal, setForceVal] = useState<string>('50');
  const [angle, setAngle] = useState<string>('30');
  const [frequency, setFrequency] = useState<string>('440');
  const [wavelength, setWavelength] = useState<string>('0.78');
  const [physicsResult, setPhysicsResult] = useState<any>(null);

  // 3. Chemistry States
  const [chemOp, setChemOp] = useState<string>('balancer');
  const [chemEquation, setChemEquation] = useState<string>('C3H8 + O2 -> CO2 + H2O');
  const [phConc, setPhConc] = useState<string>('1e-5');
  const [molarFormula, setMolarFormula] = useState<string>('H2SO4');
  const [chemResult, setChemResult] = useState<any>(null);

  // 4. Engineering States
  const [engOp, setEngOp] = useState<string>('stress_strain');
  const [engForce, setEngForce] = useState<string>('5000');
  const [engArea, setEngArea] = useState<string>('0.02');
  const [changeLen, setChangeLen] = useState<string>('0.005');
  const [origLen, setOrigLen] = useState<string>('2.0');
  const [rpm, setRpm] = useState<string>('1500');
  const [torque, setTorque] = useState<string>('250');
  const [engResult, setEngResult] = useState<any>(null);

  // 5. Units States
  const [unitCategory, setUnitCategory] = useState<string>('length');
  const [unitValue, setUnitValue] = useState<string>('10');
  const [unitFrom, setUnitFrom] = useState<string>('meter');
  const [unitTo, setUnitTo] = useState<string>('foot');
  const [unitResult, setUnitResult] = useState<any>(null);

  // Copy tracker
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleMathSolve = async () => {
    setLoading(true);
    setError(null);
    setMathResult(null);
    
    let payloadData: any = {};
    if (mathOp === "derivative" || mathOp === "integral" || mathOp === "limit") {
      payloadData = { expression: mathExpr, variable: mathVar };
      if (mathOp === "integral" && mathLower && mathUpper) {
        payloadData.lower = mathLower;
        payloadData.upper = mathUpper;
      }
    } else if (mathOp === "matrix") {
      try {
        payloadData = {
          matrixA: JSON.parse(matrixA),
          matrixB: JSON.parse(matrixB),
          operation: 'multiply'
        };
      } catch (e) {
        setError("Invalid Matrix input format. Use nested JSON array: [[1,2],[3,4]]");
        setLoading(false);
        return;
      }
    } else if (mathOp === "solve_equations") {
      payloadData = {
        equations: eqList.split('\n').filter(e => e.trim()),
        variables: ['x', 'y']
      };
    } else if (mathOp === "boolean_simplify") {
      payloadData = { expression: boolExpr };
    } else if (mathOp === "base_conversion") {
      payloadData = { value: baseVal, baseFrom, baseTo };
    }

    try {
      const res = await fetch('http://127.0.0.1:5001/api/ai/math/solve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ problemType: mathOp, data: payloadData })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Math solve failed');
      setMathResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleScienceSolve = async (cat: string) => {
    setLoading(true);
    setError(null);
    
    let payloadData: any = {};
    let type = "";
    
    if (cat === "physics") {
      setPhysicsResult(null);
      type = physicsOp;
      if (physicsOp === "force") payloadData = { mass, acceleration };
      else if (physicsOp === "torque") payloadData = { radius, force: forceVal, angle };
      else if (physicsOp === "wave_frequency") payloadData = { frequency, wavelength };
    } else if (cat === "chemistry") {
      setChemResult(null);
      type = chemOp;
      if (chemOp === "balancer") payloadData = { equation: chemEquation };
      else if (chemOp === "ph_level") payloadData = { hConcentration: phConc };
      else if (chemOp === "molar_mass") payloadData = { formula: molarFormula };
    } else if (cat === "engineering") {
      setEngResult(null);
      type = engOp;
      if (engOp === "stress_strain") payloadData = { force: engForce, area: engArea, changeLength: changeLen, originalLength: origLen };
      else if (engOp === "rpm_torque_power") payloadData = { rpm, torque };
    }

    try {
      const res = await fetch('http://127.0.0.1:5001/api/ai/science/solve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ problemType: type, category: cat, data: payloadData })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Scientific calculation failed');
      
      if (cat === "physics") setPhysicsResult(data);
      else if (cat === "chemistry") setChemResult(data);
      else if (cat === "engineering") setEngResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUnitConvert = async () => {
    setLoading(true);
    setError(null);
    setUnitResult(null);
    try {
      const res = await fetch('http://127.0.0.1:5001/api/ai/units/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ value: unitValue, category: unitCategory, unitFrom, unitTo })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Unit conversion failed');
      setUnitResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const menuTabs = [
    { id: 'math', label: 'Symbolic Math', icon: Calculator },
    { id: 'physics', label: 'Physics Solver', icon: Activity },
    { id: 'chemistry', label: 'Chemistry Lab', icon: BookOpen },
    { id: 'engineering', label: 'Engineering Calc', icon: TrendingUp },
    { id: 'units', label: 'Unit & Currency', icon: Compass }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Header Options */}
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/30">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            Math & Scientific Solver Engine
            <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
          </h2>
          <p className="text-[11px] text-zinc-500 font-light mt-0.5">
            Evaluate limits, derivatives, chemistry balancing, RPM, and dimensional variables offline using SymPy and NumPy.
          </p>
        </div>

        {/* Global Error */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p className="text-rose-450">{error}</p>
          </div>
        )}

        {/* Workspace navigation */}
        <div className="flex flex-wrap gap-2 p-1 bg-zinc-900 border border-zinc-800 rounded-xl w-fit">
          {menuTabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setError(null); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  active ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              
              {/* 1. SYMBOLIC MATHEMATICS */}
              {activeTab === 'math' && (
                <motion.div key="math" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                  <GlassCard hoverEffect={false} className="p-6 border-zinc-855 bg-zinc-900/10 space-y-4">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">SymPy Symbolic Calculus</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] text-zinc-500 block mb-1">Category</label>
                        <select
                          value={mathOp}
                          onChange={(e) => setMathOp(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-xs text-zinc-200"
                        >
                          <option value="derivative">Derivative</option>
                          <option value="integral">Integration</option>
                          <option value="limit">Limits Solver</option>
                          <option value="matrix">Matrix Suite</option>
                          <option value="solve_equations">Solve Equations Array</option>
                          <option value="boolean_simplify">Boolean Simplify</option>
                          <option value="base_conversion">Number Base / Roman</option>
                        </select>
                      </div>

                      {mathOp === "derivative" || mathOp === "integral" || mathOp === "limit" ? (
                        <div>
                          <label className="text-[10px] text-zinc-500 block mb-1">Variable</label>
                          <input type="text" value={mathVar} onChange={(e) => setMathVar(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-xs text-zinc-200" />
                        </div>
                      ) : null}
                    </div>

                    {/* Conditional inputs */}
                    {mathOp === "derivative" || mathOp === "integral" || mathOp === "limit" ? (
                      <div>
                        <label className="text-[10px] text-zinc-400 block mb-1">Math Expression</label>
                        <input type="text" value={mathExpr} onChange={(e) => setMathExpr(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-xs text-zinc-200 font-mono" />
                      </div>
                    ) : null}

                    {mathOp === "integral" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] text-zinc-500 block mb-0.5">Lower Bound</label>
                          <input type="text" value={mathLower} onChange={(e) => setMathLower(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-xs text-zinc-200" />
                        </div>
                        <div>
                          <label className="text-[10px] text-zinc-500 block mb-0.5">Upper Bound</label>
                          <input type="text" value={mathUpper} onChange={(e) => setMathUpper(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-xs text-zinc-200" />
                        </div>
                      </div>
                    )}

                    {mathOp === "matrix" && (
                      <div className="grid grid-cols-2 gap-4 text-[10px]">
                        <div>
                          <label className="text-zinc-400 block mb-1">Matrix A (Nested list)</label>
                          <textarea rows={4} value={matrixA} onChange={(e) => setMatrixA(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 font-mono text-zinc-300" />
                        </div>
                        <div>
                          <label className="text-zinc-400 block mb-1">Matrix B (Nested list)</label>
                          <textarea rows={4} value={matrixB} onChange={(e) => setMatrixB(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 font-mono text-zinc-300" />
                        </div>
                      </div>
                    )}

                    {mathOp === "solve_equations" && (
                      <div>
                        <label className="text-[10px] text-zinc-400 block mb-1">Equations List (One per line)</label>
                        <textarea rows={3} value={eqList} onChange={(e) => setEqList(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-xs font-mono text-zinc-350" />
                      </div>
                    )}

                    {mathOp === "boolean_simplify" && (
                      <div>
                        <label className="text-[10px] text-zinc-400 block mb-1">Boolean Logical Expression</label>
                        <input type="text" value={boolExpr} onChange={(e) => setBoolExpr(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-xs font-mono text-zinc-200" />
                      </div>
                    )}

                    {mathOp === "base_conversion" && (
                      <div className="grid grid-cols-3 gap-2 text-[10px]">
                        <div>
                          <label className="text-zinc-400 block mb-1">Value</label>
                          <input type="text" value={baseVal} onChange={(e) => setBaseVal(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-200" />
                        </div>
                        <div>
                          <label className="text-zinc-400 block mb-1">From Base (0=Roman)</label>
                          <input type="number" value={baseFrom} onChange={(e) => setBaseFrom(parseInt(e.target.value))} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-200" />
                        </div>
                        <div>
                          <label className="text-zinc-400 block mb-1">To Base (0=Roman)</label>
                          <input type="number" value={baseTo} onChange={(e) => setBaseTo(parseInt(e.target.value))} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-200" />
                        </div>
                      </div>
                    )}

                    <button
                      onClick={handleMathSolve}
                      disabled={loading}
                      className="w-full btn-premium py-3 rounded-xl text-xs font-bold text-white shadow-lg disabled:opacity-55"
                    >
                      {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Evaluate Equation'}
                    </button>
                  </GlassCard>
                </motion.div>
              )}

              {/* 2. PHYSICS SOLVER */}
              {activeTab === 'physics' && (
                <motion.div key="physics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                  <GlassCard hoverEffect={false} className="p-6 border-zinc-855 bg-zinc-900/10 space-y-4">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Physics Unit Solvers</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] text-zinc-500 block mb-1">Problem Category</label>
                        <select
                          value={physicsOp}
                          onChange={(e) => setPhysicsOp(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-xs text-zinc-200"
                        >
                          <option value="force">Newton Classical Force</option>
                          <option value="torque">Angular Torque</option>
                          <option value="wave_frequency">Wave frequency & Speed</option>
                        </select>
                      </div>
                    </div>

                    {physicsOp === "force" && (
                      <div className="grid grid-cols-2 gap-4 text-[10px]">
                        <div>
                          <label className="text-zinc-400 block mb-1">Mass (kg)</label>
                          <input type="text" value={mass} onChange={(e) => setMass(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-200" />
                        </div>
                        <div>
                          <label className="text-zinc-400 block mb-1">Acceleration (m/s^2)</label>
                          <input type="text" value={acceleration} onChange={(e) => setAcceleration(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-200" />
                        </div>
                      </div>
                    )}

                    {physicsOp === "torque" && (
                      <div className="grid grid-cols-3 gap-2 text-[10px]">
                        <div>
                          <label className="text-zinc-400 block mb-1">Radius (meters)</label>
                          <input type="text" value={radius} onChange={(e) => setRadius(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-200" />
                        </div>
                        <div>
                          <label className="text-zinc-400 block mb-1">Force (N)</label>
                          <input type="text" value={forceVal} onChange={(e) => setForceVal(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-200" />
                        </div>
                        <div>
                          <label className="text-zinc-400 block mb-1">Angle (degrees)</label>
                          <input type="text" value={angle} onChange={(e) => setAngle(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-200" />
                        </div>
                      </div>
                    )}

                    {physicsOp === "wave_frequency" && (
                      <div className="grid grid-cols-2 gap-4 text-[10px]">
                        <div>
                          <label className="text-zinc-400 block mb-1">Frequency (Hz)</label>
                          <input type="text" value={frequency} onChange={(e) => setFrequency(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-200" />
                        </div>
                        <div>
                          <label className="text-zinc-400 block mb-1">Wavelength (meters)</label>
                          <input type="text" value={wavelength} onChange={(e) => setWavelength(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-200" />
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => handleScienceSolve("physics")}
                      disabled={loading}
                      className="w-full btn-premium py-3 rounded-xl text-xs font-bold text-white shadow-lg"
                    >
                      Calculate Physics Equations
                    </button>
                  </GlassCard>
                </motion.div>
              )}

              {/* 3. CHEMISTRY LAB */}
              {activeTab === 'chemistry' && (
                <motion.div key="chemistry" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                  <GlassCard hoverEffect={false} className="p-6 border-zinc-855 bg-zinc-900/10 space-y-4">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Chemistry Balance & Periodic Search</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] text-zinc-500 block mb-1">Formula Mappings</label>
                        <select
                          value={chemOp}
                          onChange={(e) => setChemOp(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-xs text-zinc-200"
                        >
                          <option value="balancer">Equation Balancer</option>
                          <option value="molar_mass">Molar Mass Solver</option>
                          <option value="ph_level">pH Concentration</option>
                        </select>
                      </div>
                    </div>

                    {chemOp === "balancer" && (
                      <div>
                        <label className="text-[10px] text-zinc-400 block mb-1">{"Chemical Equation (Format: C3H8 + O2 -> CO2 + H2O)"}</label>
                        <input type="text" value={chemEquation} onChange={(e) => setChemEquation(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-xs font-mono text-zinc-200" />
                      </div>
                    )}

                    {chemOp === "molar_mass" && (
                      <div>
                        <label className="text-[10px] text-zinc-400 block mb-1">Compound Formula (e.g. H2SO4)</label>
                        <input type="text" value={molarFormula} onChange={(e) => setMolarFormula(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-xs font-mono text-zinc-200" />
                      </div>
                    )}

                    {chemOp === "ph_level" && (
                      <div>
                        <label className="text-[10px] text-zinc-400 block mb-1">Hydrogen Ion Concentration [H+] (mol/L)</label>
                        <input type="text" value={phConc} onChange={(e) => setPhConc(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-xs font-mono text-zinc-200" />
                      </div>
                    )}

                    <button
                      onClick={() => handleScienceSolve("chemistry")}
                      disabled={loading}
                      className="w-full btn-premium py-3 rounded-xl text-xs font-bold text-white shadow-lg"
                    >
                      Balance / Solve Chemical Reaction
                    </button>
                  </GlassCard>
                </motion.div>
              )}

              {/* 4. ENGINEERING CALC */}
              {activeTab === 'engineering' && (
                <motion.div key="engineering" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                  <GlassCard hoverEffect={false} className="p-6 border-zinc-855 bg-zinc-900/10 space-y-4">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Mechanical & Civil Engineering Calculations</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] text-zinc-500 block mb-1">Engineering Topic</label>
                        <select
                          value={engOp}
                          onChange={(e) => setEngOp(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-xs text-zinc-200"
                        >
                          <option value="stress_strain">Stress & Strain Properties</option>
                          <option value="rpm_torque_power">Torque, RPM, Power</option>
                        </select>
                      </div>
                    </div>

                    {engOp === "stress_strain" && (
                      <div className="grid grid-cols-2 gap-4 text-[10px]">
                        <div>
                          <label className="text-zinc-400 block mb-0.5">Applied Force (N)</label>
                          <input type="text" value={engForce} onChange={(e) => setEngForce(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-200" />
                        </div>
                        <div>
                          <label className="text-zinc-400 block mb-0.5">Cross-Section Area (m^2)</label>
                          <input type="text" value={engArea} onChange={(e) => setEngArea(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-200" />
                        </div>
                        <div>
                          <label className="text-zinc-400 block mb-0.5">Change in Length (meters)</label>
                          <input type="text" value={changeLen} onChange={(e) => setChangeLen(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-200" />
                        </div>
                        <div>
                          <label className="text-zinc-400 block mb-0.5">Original Length (meters)</label>
                          <input type="text" value={origLen} onChange={(e) => setOrigLen(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-200" />
                        </div>
                      </div>
                    )}

                    {engOp === "rpm_torque_power" && (
                      <div className="grid grid-cols-2 gap-4 text-[10px]">
                        <div>
                          <label className="text-zinc-400 block mb-0.5">RPM Speed</label>
                          <input type="text" value={rpm} onChange={(e) => setRpm(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-200" />
                        </div>
                        <div>
                          <label className="text-zinc-400 block mb-0.5">Torque (N * m)</label>
                          <input type="text" value={torque} onChange={(e) => setTorque(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-200" />
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => handleScienceSolve("engineering")}
                      disabled={loading}
                      className="w-full btn-premium py-3 rounded-xl text-xs font-bold text-white shadow-lg"
                    >
                      Compute Structural Modulus
                    </button>
                  </GlassCard>
                </motion.div>
              )}

              {/* 5. UNIT & CURRENCY */}
              {activeTab === 'units' && (
                <motion.div key="units" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                  <GlassCard hoverEffect={false} className="p-6 border-zinc-855 bg-zinc-900/10 space-y-4">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">SI & Imperial unit / Currency conversions</h3>
                    
                    <div className="grid grid-cols-3 gap-2 text-[10px]">
                      <div>
                        <label className="text-zinc-400 block mb-1">Value</label>
                        <input type="number" value={unitValue} onChange={(e) => setUnitValue(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-200 font-mono" />
                      </div>
                      <div>
                        <label className="text-zinc-400 block mb-1">Category</label>
                        <select
                          value={unitCategory}
                          onChange={(e) => {
                            setUnitCategory(e.target.value);
                            if (e.target.value === "currency") { setUnitFrom("usd"); setUnitTo("eur"); }
                            else if (e.target.value === "weight") { setUnitFrom("kilogram"); setUnitTo("pound"); }
                            else if (e.target.value === "temperature") { setUnitFrom("celsius"); setUnitTo("fahrenheit"); }
                            else { setUnitFrom("meter"); setUnitTo("foot"); }
                          }}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded p-1.5 text-zinc-200 focus:outline-none"
                        >
                          <option value="length">Length</option>
                          <option value="weight">Weight / Mass</option>
                          <option value="temperature">Temperature</option>
                          <option value="currency">Currency (Offline rates)</option>
                          <option value="digital_storage">Digital Storage</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-[10px]">
                      <div>
                        <label className="text-zinc-400 block mb-1">From Unit</label>
                        <input type="text" value={unitFrom} onChange={(e) => setUnitFrom(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-200 font-mono" />
                      </div>
                      <div>
                        <label className="text-zinc-400 block mb-1">To Unit</label>
                        <input type="text" value={unitTo} onChange={(e) => setUnitTo(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-200 font-mono" />
                      </div>
                    </div>

                    <button
                      onClick={handleUnitConvert}
                      disabled={loading}
                      className="w-full btn-premium py-3 rounded-xl text-xs font-bold text-white shadow-lg"
                    >
                      Convert Units / Currency
                    </button>
                  </GlassCard>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* RIGHT SIDE OUTPUT CONTAINER */}
          <div className="lg:col-span-1">
            <GlassCard hoverEffect={false} className="p-6 border-zinc-850 bg-zinc-900/20 space-y-4 h-full min-h-[350px] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Calculation Output</h3>
                  {((activeTab === 'math' && mathResult) || (activeTab === 'physics' && physicsResult) || (activeTab === 'chemistry' && chemResult) || (activeTab === 'engineering' && engResult) || (activeTab === 'units' && unitResult)) && (
                    <button
                      onClick={() => {
                        const target = activeTab === 'math' ? mathResult.result : (activeTab === 'physics' ? physicsResult.result : (activeTab === 'chemistry' ? chemResult.balancedEquation || chemResult.ph || chemResult.molarMass : (activeTab === 'engineering' ? engResult.stress || engResult.powerKw : unitResult.result)));
                        handleCopy(String(target), 'science-out');
                      }}
                      className="p-2 rounded bg-zinc-950 border border-zinc-850 text-zinc-400 hover:text-white transition-colors"
                    >
                      {copiedText === 'science-out' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>

                {/* Math Outcome */}
                {activeTab === 'math' && mathResult && (
                  <div className="space-y-4 text-[10px] leading-relaxed select-text">
                    <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-850 font-mono text-purple-400">
                      <span className="text-zinc-500 font-bold block mb-1 text-[8px] uppercase">Symbolic Result:</span>
                      {String(mathResult.result)}
                    </div>
                    {mathResult.steps && (
                      <div className="p-3 rounded-lg bg-zinc-950/40 border border-zinc-850">
                        <span className="text-zinc-500 font-bold block mb-0.5 text-[8px] uppercase">Steps & Explanations:</span>
                        <p className="text-zinc-400 font-light">{mathResult.steps}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Physics Outcome */}
                {activeTab === 'physics' && physicsResult && (
                  <div className="space-y-3 text-[10px] leading-relaxed select-text">
                    <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-850 font-bold text-sky-400">
                      <span className="text-zinc-500 block mb-0.5 text-[8px] uppercase">Computed Value:</span>
                      {physicsResult.result}
                    </div>
                    <div className="p-3 rounded bg-zinc-950/40 border border-zinc-850 text-zinc-400 font-light space-y-2">
                      <p><strong>Formula:</strong> {physicsResult.formula}</p>
                      <p><strong>SI Units:</strong> {physicsResult.siUnits}</p>
                      <p><strong>Dim Analysis:</strong> {physicsResult.dimensionalAnalysis}</p>
                      <p className="border-t border-zinc-900 pt-1.5 leading-relaxed text-[9px] text-zinc-500">{physicsResult.derivation}</p>
                    </div>
                  </div>
                )}

                {/* Chemistry Outcome */}
                {activeTab === 'chemistry' && chemResult && (
                  <div className="space-y-3 text-[10px] leading-relaxed select-text">
                    {chemResult.balancedEquation && (
                      <div className="p-3 rounded bg-zinc-950 border border-zinc-850 text-emerald-400 font-mono">
                        <span className="text-zinc-500 block mb-0.5 text-[8px] uppercase">Balanced Equation:</span>
                        {chemResult.balancedEquation}
                      </div>
                    )}
                    {chemResult.ph && (
                      <div className="p-3 rounded bg-zinc-950 border border-zinc-850 text-emerald-400 font-bold">
                        <span className="text-zinc-500 block mb-0.5 text-[8px] uppercase">pH concentration result:</span>
                        {chemResult.ph} ({chemResult.acidityStatus})
                      </div>
                    )}
                    {chemResult.molarMass && (
                      <div className="p-3 rounded bg-zinc-950 border border-zinc-850 text-emerald-400 text-xs">
                        <span className="text-zinc-500 block mb-1 text-[8px] uppercase">Molar weight:</span>
                        {chemResult.molarMass} {chemResult.unit}
                      </div>
                    )}
                  </div>
                )}

                {/* Engineering Outcome */}
                {activeTab === 'engineering' && engResult && (
                  <div className="space-y-3 text-[10px] leading-relaxed select-text">
                    {engResult.stress && (
                      <div className="p-3 rounded bg-zinc-950 border border-zinc-850 text-amber-450 text-xs space-y-2 font-mono">
                        <p><strong>Stress:</strong> {engResult.stress}</p>
                        <p><strong>Strain:</strong> {engResult.strain}</p>
                        <p><strong>Young Modulus:</strong> {engResult.youngModulus}</p>
                      </div>
                    )}
                    {engResult.powerKw && (
                      <div className="p-3 rounded bg-zinc-950 border border-zinc-850 text-amber-450 text-xs space-y-2 font-mono">
                        <p><strong>Power:</strong> {engResult.powerKw} kW ({engResult.powerHp} HP)</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Unit / Currency Outcome */}
                {activeTab === 'units' && unitResult && (
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-850 text-center select-text">
                    <span className="text-zinc-500 text-[8px] font-black uppercase tracking-wider block mb-1">Converted Unit Output</span>
                    <span className="text-xl font-black text-white">{unitResult.result} {unitTo}</span>
                  </div>
                )}

                {!mathResult && !physicsResult && !chemResult && !engResult && !unitResult && (
                  <div className="py-12 text-center text-zinc-600 text-xs font-light">
                    Solvers active. Enter values and submit equations to view numerical responses.
                  </div>
                )}
              </div>

              <div className="p-3 rounded bg-zinc-950/40 border border-zinc-900 text-[8px] text-zinc-500 text-center font-bold uppercase tracking-wider">
                SymPy 1.14 & NumPy 2.5 Active Core
              </div>
            </GlassCard>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
