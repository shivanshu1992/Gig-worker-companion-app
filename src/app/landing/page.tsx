'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  IndianRupee, 
  ShieldCheck, 
  Scale, 
  FileText, 
  AlertOctagon, 
  Bot, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  Languages, 
  HeartHandshake, 
  ExternalLink,
  ChevronRight,
  Zap
} from 'lucide-react';
import { SupportedLanguage } from '@/types';
import { getTranslation } from '@/lib/i18n/translations';
import { clientStorage } from '@/lib/storage/clientStorage';

export default function LandingPage() {
  const [lang, setLang] = useState<SupportedLanguage>('en');
  const t = getTranslation(lang);

  const handleDemoClick = () => {
    clientStorage.setDemoMode(true);
  };

  const featureCards = [
    {
      title: 'Transparent Earnings Tracker',
      titleHi: 'पारदर्शी कमाई का हिसाब',
      description: 'Calculates real net take-home pay after platform fees, fuel costs, EV charging, and mystery deductions with date filters and export.',
      icon: IndianRupee,
      color: 'from-emerald-500 to-teal-600',
      badge: 'Formula Grounded'
    },
    {
      title: 'Worker Safety Center',
      titleHi: 'कामगार सुरक्षा केंद्र',
      description: 'Instant 112 emergency hotline trigger, roadside audio distress beacon, WhatsApp live location, and pre-shift vehicle checklists.',
      icon: ShieldCheck,
      color: 'from-amber-500 to-orange-600',
      badge: 'Life Safety'
    },
    {
      title: 'Worker Rights Directory',
      titleHi: 'श्रमिक अधिकार डायरेक्टरी',
      description: 'Learn your legal protections: statutory 20% platform commission caps under MoRTH, protection from arbitrary deactivations, and shift caps.',
      icon: Scale,
      color: 'from-blue-500 to-indigo-600',
      badge: 'MoRTH & Labor Codes'
    },
    {
      title: 'Verified Welfare Schemes',
      titleHi: 'सत्यापित सरकारी योजनाएं',
      description: 'Search central & state programs (e-Shram, PM-SYM Pension, PM-JAY ₹5L health cover, BOCW boards) with an AI Scheme Discovery Assistant.',
      icon: HeartHandshake,
      color: 'from-purple-500 to-pink-600',
      badge: 'Government Verified'
    },
    {
      title: 'AI Document Help Center',
      titleHi: 'दस्तावेज सहायता केंद्र',
      description: 'Draft professional payment vouchers, work experience declarations, and informal worker self-certifications with live translation and print views.',
      icon: FileText,
      color: 'from-teal-500 to-cyan-600',
      badge: 'Print & PDF Ready'
    },
    {
      title: 'AI Grievance & Dispute Drafter',
      titleHi: 'शिकायत एवं विवाद ड्राफ्टर',
      description: 'Generate firm, professional complaint tickets for delayed payouts, unfair late penalties, and account blocking referencing Indian labor standards.',
      icon: AlertOctagon,
      color: 'from-rose-500 to-red-600',
      badge: 'Formal Appeal Tickets'
    }
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Set Up in Your Language',
      description: 'Select English, Hindi, or Punjabi. Enter your work type (delivery, cab, construction) and target income goal in 60 seconds.'
    },
    {
      step: '02',
      title: 'Log Shifts & Track Net Pay',
      description: 'Record your gross earnings, fuel costs, and platform fees. Our engine calculates your true hourly rate without double-counting.'
    },
    {
      step: '03',
      title: 'Assert Rights & Draft Appeals',
      description: 'When hit with unfair deductions or ID suspensions, generate evidence-backed formal grievance tickets ready for WhatsApp or email.'
    },
    {
      step: '04',
      title: 'Unlock Welfare Benefits',
      description: 'Check eligibility for government safety nets like e-Shram, PM-JAY healthcare, and accident insurance without middlemen fees.'
    }
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-slate-900 flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight leading-none block">
                GigSaathi
              </span>
              <span className="text-[11px] text-amber-700 font-medium block">
                Gig Worker Companion
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black shadow-sm transition-all"
            >
              🚀 Open GigSaathi App
            </Link>

            <Link
              href="/dashboard"
              onClick={handleDemoClick}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-all hidden sm:inline-block"
            >
              {t.exploreDemo}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-200/80 bg-gradient-to-b from-white to-stone-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200/90 rounded-full px-3.5 py-1 text-xs font-semibold text-emerald-800">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Built for Delivery Partners, Drivers & Informal Labor in India</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
            GigSaathi — Gig Worker Companion
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Voice-enabled GenAI assistant providing multilingual guidance on earnings tracking, safety practices, rights and welfare scheme awareness, document help, and grievance dispute drafting.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link
              href="/"
              className="w-full sm:w-auto px-7 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl text-base font-black shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center space-x-2 active:scale-98"
            >
              <Zap className="w-5 h-5 fill-slate-950" />
              <span>Launch Live App</span>
            </Link>

            <Link
              href="/dashboard"
              onClick={handleDemoClick}
              className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-50 border-2 border-slate-300 text-slate-800 rounded-2xl text-base font-bold shadow-xs transition-all flex items-center justify-center space-x-2 active:scale-98"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Explore Analytics Dashboard</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Six Critical Modules Empowering Every Worker
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Designed specifically for individuals with limited digital literacy facing real-world road and wage pressures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl bg-gradient-to-tr ${feat.color} text-white shadow-sm`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                      {feat.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">
                    {lang === 'hi' ? feat.titleHi : feat.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                  <Link href="/" className="flex items-center space-x-1 hover:underline">
                    <span>Try in GigSaathi App</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div className="font-bold text-slate-700">
            GigSaathi — Gig Worker Companion
          </div>
          <div className="pt-2 text-[11px] text-slate-400">
            Emergency Helpline: 112 | Ambulance: 108 | National Consumer Helpline: 1915
          </div>
        </div>
      </footer>
    </div>
  );
}
