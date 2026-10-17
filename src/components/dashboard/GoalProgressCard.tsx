'use client';

import React from 'react';
import { Target, Trophy, Flame } from 'lucide-react';
import { SupportedLanguage } from '@/types';
import { getTranslation } from '@/lib/i18n/translations';
import { calculateGoalProgress } from '@/lib/calculations';

export function GoalProgressCard({
  monthlyGoal,
  currentMonthlyEarnings,
  dailyGoal,
  todayEarnings,
  currentLanguage = 'en'
}: {
  monthlyGoal: number;
  currentMonthlyEarnings: number;
  dailyGoal: number;
  todayEarnings: number;
  currentLanguage?: SupportedLanguage;
}) {
  const t = getTranslation(currentLanguage);

  const monthlyProgress = calculateGoalProgress(currentMonthlyEarnings, monthlyGoal);
  const dailyProgress = calculateGoalProgress(todayEarnings, dailyGoal);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-base">
              {t.dashboard.goalProgress}
            </h4>
            <p className="text-xs text-slate-500">
              {monthlyProgress.isAchieved ? t.dashboard.achieved : `₹${monthlyProgress.remaining} ${t.dashboard.remainingToGoal}`}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-2xl font-black text-slate-900">
            {monthlyProgress.percentage}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            monthlyProgress.percentage >= 100
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
              : 'bg-emerald-600'
          }`}
          style={{ width: `${Math.min(100, monthlyProgress.percentage)}%` }}
        />
      </div>

      {/* Target Comparison Badges */}
      <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
        <div className="bg-stone-50 border border-slate-200/80 rounded-xl p-3">
          <div className="text-slate-500 flex items-center space-x-1 mb-1">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>{t.dashboard.dailyTarget}</span>
          </div>
          <div className="font-bold text-slate-900 text-sm">
            ₹{todayEarnings} <span className="text-slate-400 font-normal">/ ₹{dailyGoal}</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {dailyProgress.percentage}% achieved today
          </div>
        </div>

        <div className="bg-stone-50 border border-slate-200/80 rounded-xl p-3">
          <div className="text-slate-500 flex items-center space-x-1 mb-1">
            <Trophy className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.dashboard.monthlyTarget}</span>
          </div>
          <div className="font-bold text-slate-900 text-sm">
            ₹{currentMonthlyEarnings} <span className="text-slate-400 font-normal">/ ₹{monthlyGoal}</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            ₹{monthlyProgress.remaining} to reach milestone
          </div>
        </div>
      </div>
    </div>
  );
}
