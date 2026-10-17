import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Moon, 
  Globe, 
  User, 
  Key, 
  ShieldCheck, 
  Clock, 
  Zap,
  Activity,
  AlertTriangle,
  BarChart3
} from 'lucide-react';
import { translations } from '../services/i18n';

export default function Header({
  lang,
  setLang,
  sunlightMode,
  setSunlightMode,
  isOnShift,
  setIsOnShift,
  workerProfile,
  onOpenProfile,
  onOpenApiKey,
  hasApiKey
}) {
  const [shiftSeconds, setShiftSeconds] = useState(0);
  const [shiftAlert, setShiftAlert] = useState('');
  const t = translations[lang] || translations.en;

  // Track shift timer when active
  useEffect(() => {
    let interval = null;
    if (isOnShift) {
      interval = setInterval(() => {
        setShiftSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setShiftSeconds(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOnShift]);

  const toggleShift = () => {
    const nextState = !isOnShift;
    setIsOnShift(nextState);
    if (nextState) {
      setShiftAlert(t.shiftActiveNotice);
    } else {
      setShiftAlert(t.shiftEndedNotice);
    }
    setTimeout(() => setShiftAlert(''), 4500);
  };

  const formatShiftTime = (totalSec) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs > 0 ? `${hrs}h ` : ''}${mins}m ${secs}s`;
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0B1120] border-b border-slate-800 backdrop-blur-md bg-opacity-95 shadow-md">
      {/* Top Banner Alert when Shift changes */}
      {shiftAlert && (
        <div className={`px-4 py-2 text-xs font-bold text-center transition-all ${
          isOnShift 
            ? 'bg-emerald-600 text-white' 
            : 'bg-amber-600 text-slate-900'
        }`}>
          {shiftAlert}
        </div>
      )}

      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2.5">
        <div className="flex items-center justify-between gap-2">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center p-0.5 shadow-glow-amber">
                <div className="w-full h-full bg-[#090D16] rounded-[14px] flex items-center justify-center">
                  <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
                </div>
              </div>
              {isOnShift && (
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#090D16] rounded-full animate-ping" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1">
                  GigSaathi
                </h1>
                <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  GenAI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium leading-none">
                {workerProfile.primaryPlatform} • {workerProfile.name.split(' ')[0]}
              </p>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Shift Toggle Button */}
            <button
              onClick={toggleShift}
              type="button"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-xs transition-all border ${
                isOnShift
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-black border-black shadow-glow-emerald'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title="Toggle On-Duty Shift Status"
            >
              <Activity className={`w-3.5 h-3.5 ${isOnShift ? 'animate-pulse text-black' : 'text-slate-400'}`} />
              <span className="font-extrabold tracking-wide">
                {isOnShift ? t.onShift : t.offShift}
              </span>
              {isOnShift && (
                <span className="hidden sm:inline-block font-mono text-[10px] ml-1 bg-black/30 px-1 py-0.5 rounded text-black font-bold">
                  {formatShiftTime(shiftSeconds)}
                </span>
              )}
            </button>

            {/* Analytics Dashboard Link */}
            <a
              href="/dashboard"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition-all"
              title="Full Analytics & Tax Breakdown"
            >
              <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Dashboard</span>
            </a>

            {/* Sunlight Mode Toggle */}
            <button
              onClick={() => setSunlightMode(!sunlightMode)}
              type="button"
              className={`p-2 rounded-xl transition-all border ${
                sunlightMode
                  ? 'bg-amber-400 text-black border-black font-bold shadow-sunlight'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
              title={sunlightMode ? "Switch to Dark Mode" : "High Contrast Sunlight Mode"}
              aria-label="Toggle Sunlight Mode"
            >
              {sunlightMode ? <Sun className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            {/* Language Dropdown Selector */}
            <div className="relative">
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="bg-slate-800 text-slate-200 text-xs font-bold rounded-xl px-2.5 py-1.5 border border-slate-700 focus:outline-none focus:border-amber-400 cursor-pointer appearance-none pr-6"
                aria-label="Select Language"
              >
                <option value="en">EN</option>
                <option value="hi">हिंदी</option>
                <option value="hinglish">Hinglish</option>
              </select>
              <Globe className="w-3 h-3 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
            </div>

            {/* AI Key Button */}
            <button
              onClick={onOpenApiKey}
              type="button"
              className={`p-2 rounded-xl transition-all border relative ${
                hasApiKey
                  ? 'bg-emerald-950/60 text-emerald-400 border-emerald-600/50 hover:bg-emerald-900/60'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
              title="AI Connection Settings"
              aria-label="AI Key Settings"
            >
              <Key className="w-4 h-4" />
              <span className={`absolute top-1 right-1 w-2 h-2 rounded-full ${hasApiKey ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            </button>

            {/* Worker Profile Button */}
            <button
              onClick={onOpenProfile}
              type="button"
              className="p-2 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-all"
              title="Worker Profile"
              aria-label="Worker Profile"
            >
              <User className="w-4 h-4 text-amber-400" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
