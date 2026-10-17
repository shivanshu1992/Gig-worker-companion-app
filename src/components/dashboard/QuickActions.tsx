'use client';

import React from 'react';
import Link from 'next/link';
import { PlusCircle, Bot, Scale, AlertOctagon, ArrowUpRight } from 'lucide-react';
import { SupportedLanguage } from '@/types';
import { getTranslation } from '@/lib/i18n/translations';

export function QuickActions({
  currentLanguage = 'en',
  onOpenAddModal
}: {
  currentLanguage?: SupportedLanguage;
  onOpenAddModal: () => void;
}) {
  const t = getTranslation(currentLanguage);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {/* 1. Log Shift */}
      <button
        onClick={onOpenAddModal}
        className="flex flex-col justify-between p-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-sm hover:shadow-md transition-all text-left active:scale-98 group"
      >
        <div className="flex items-center justify-between w-full mb-3">
          <div className="p-2 bg-emerald-500/50 rounded-xl">
            <PlusCircle className="w-5 h-5 text-white" />
          </div>
          <ArrowUpRight className="w-4 h-4 opacity-75 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
        <div>
          <div className="font-bold text-sm leading-snug">{t.dashboard.logNewShift}</div>
          <div className="text-[11px] text-emerald-100 mt-0.5">Track pay & fuel</div>
        </div>
      </button>

      {/* 2. Ask AI */}
      <Link
        href="/assistant"
        className="flex flex-col justify-between p-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl shadow-sm hover:shadow-md transition-all text-left active:scale-98 group"
      >
        <div className="flex items-center justify-between w-full mb-3">
          <div className="p-2 bg-slate-800 rounded-xl text-emerald-400">
            <Bot className="w-5 h-5" />
          </div>
          <ArrowUpRight className="w-4 h-4 opacity-75 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
        <div>
          <div className="font-bold text-sm leading-snug">{t.dashboard.askAi}</div>
          <div className="text-[11px] text-slate-300 mt-0.5">Instant legal & pay help</div>
        </div>
      </Link>

      {/* 3. Check Welfare Schemes */}
      <Link
        href="/rights"
        className="flex flex-col justify-between p-4 bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-900 rounded-2xl shadow-sm hover:shadow-md transition-all text-left active:scale-98 group"
      >
        <div className="flex items-center justify-between w-full mb-3">
          <div className="p-2 bg-teal-50 text-teal-700 rounded-xl">
            <Scale className="w-5 h-5" />
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
        <div>
          <div className="font-bold text-sm leading-snug">{t.dashboard.checkSchemes}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">e-Shram, PM-SYM, PM-JAY</div>
        </div>
      </Link>

      {/* 4. Draft Grievance */}
      <Link
        href="/grievances"
        className="flex flex-col justify-between p-4 bg-white hover:bg-rose-50/50 border border-slate-200/90 text-slate-900 rounded-2xl shadow-sm hover:shadow-md transition-all text-left active:scale-98 group"
      >
        <div className="flex items-center justify-between w-full mb-3">
          <div className="p-2 bg-rose-50 text-rose-700 rounded-xl">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
        <div>
          <div className="font-bold text-sm leading-snug">{t.dashboard.draftGrievance}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Appeal unfair penalties</div>
        </div>
      </Link>
    </div>
  );
}
