'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShieldAlert, 
  Sun, 
  Languages, 
  Sparkles, 
  Menu, 
  X, 
  HelpCircle,
  LogOut,
  User,
  AlertTriangle
} from 'lucide-react';
import { SupportedLanguage } from '@/types';
import { getTranslation } from '@/lib/i18n/translations';
import { clientStorage } from '@/lib/storage/clientStorage';
import { isSupabaseConfigured } from '@/lib/supabase/client';

export function Navbar({
  currentLanguage,
  onLanguageChange
}: {
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
}) {
  const pathname = usePathname();
  const t = getTranslation(currentLanguage);
  const [isDemo, setIsDemo] = useState(true);
  const [isSunlightMode, setIsSunlightMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsDemo(clientStorage.isDemoMode());
  }, []);

  const toggleSunlight = () => {
    const nextVal = !isSunlightMode;
    setIsSunlightMode(nextVal);
    if (typeof document !== 'undefined') {
      if (nextVal) {
        document.documentElement.classList.add('sun-readable');
      } else {
        document.documentElement.classList.remove('sun-readable');
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Demo Mode Banner if in demo mode */}
      {isDemo && (
        <div className="bg-amber-500 text-slate-950 px-4 py-1.5 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="bg-slate-900 text-white px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
              {t.demoBadge}
            </span>
            <span className="hidden sm:inline">{t.demoNotice}</span>
          </div>
          <Link
            href="/login"
            className="underline hover:text-slate-800 text-[11px] font-bold"
          >
            {isSupabaseConfigured ? 'Switch to Real Account' : 'Supabase Configured'}
          </Link>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/dashboard" className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-lg text-slate-900 tracking-tight leading-none block">
              {t.appName}
            </span>
            <span className="text-[11px] text-emerald-700 font-medium block">
              {t.tagline}
            </span>
          </div>
        </Link>

        {/* Action Controls: Language, Sunlight toggle, SOS Quick Trigger, Profile */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Language Selector */}
          <div className="relative flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
            <Languages className="w-4 h-4 text-slate-600 ml-1 mr-1.5" />
            <select
              value={currentLanguage}
              onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer pr-1"
              aria-label="Select Language"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
            </select>
          </div>

          {/* Sunlight Mode Toggle */}
          <button
            onClick={toggleSunlight}
            title="Toggle high-contrast sunlight readability"
            className={`p-2 rounded-xl border transition-all ${
              isSunlightMode
                ? 'bg-amber-100 border-amber-300 text-amber-800'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Sun className="w-4 h-4" />
          </button>

          {/* Emergency SOS Button */}
          <Link
            href="/safety"
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-rose-600/30 transition-transform active:scale-95"
          >
            <ShieldAlert className="w-4 h-4" />
            <span className="hidden sm:inline">SOS 112</span>
          </Link>

          {/* User Profile avatar */}
          <Link
            href="/profile"
            className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 transition-colors"
            title="View Profile & Settings"
          >
            <User className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
