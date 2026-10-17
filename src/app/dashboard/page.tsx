'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  IndianRupee, 
  Clock, 
  TrendingUp, 
  Fuel, 
  AlertTriangle, 
  PlusCircle, 
  Sparkles, 
  ChevronRight, 
  ShieldCheck,
  Bot,
  Filter,
  Zap
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { EarningsChart } from '@/components/dashboard/EarningsChart';
import { GoalProgressCard } from '@/components/dashboard/GoalProgressCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { EarningModal } from '@/components/earnings/EarningModal';
import { EarningRecord, UserProfile, SupportedLanguage } from '@/types';
import { clientStorage } from '@/lib/storage/clientStorage';
import { getTranslation } from '@/lib/i18n/translations';
import { aggregateEarnings, filterRecordsByPeriod } from '@/lib/calculations';

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile>(clientStorage.getProfile());
  const [earnings, setEarnings] = useState<EarningRecord[]>([]);
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'all'>('month');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setProfile(clientStorage.getProfile());
    setEarnings(clientStorage.getEarnings());
    setMounted(true);
  }, []);

  const lang = profile.preferredLanguage || 'en';
  const t = getTranslation(lang);

  // Time-based personalized greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return t.dashboard.greetingMorning;
    if (hour >= 12 && hour < 17) return t.dashboard.greetingAfternoon;
    if (hour >= 17 && hour < 22) return t.dashboard.greetingEvening;
    return t.dashboard.greetingNight;
  };

  // Aggregated totals for specific periods
  const todayRecords = filterRecordsByPeriod(earnings, 'today');
  const weekRecords = filterRecordsByPeriod(earnings, 'week');
  const monthRecords = filterRecordsByPeriod(earnings, 'month');

  const todayStats = aggregateEarnings(todayRecords);
  const weekStats = aggregateEarnings(weekRecords);
  const monthStats = aggregateEarnings(monthRecords);

  // Currently filtered records for the chart and table
  const displayedRecords = filterRecordsByPeriod(earnings, period);
  const displayedStats = aggregateEarnings(displayedRecords);

  const handleSaveEarning = (recordData: Omit<EarningRecord, 'id' | 'createdAt' | 'netEarnings'>) => {
    const newRecord = clientStorage.addEarning(recordData);
    setEarnings(clientStorage.getEarnings());
  };

  if (!mounted) {
    return <div className="min-h-screen bg-stone-50" />;
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm">
          <div>
            <div className="text-xs font-semibold text-emerald-700 flex items-center space-x-1 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>{profile.workCategory.toUpperCase()} • {profile.state}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {getGreeting()}, {profile.fullName || 'Worker'}!
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.dashboard.subtitle || 'Track your net take-home earnings, road safety, and workplace rights'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/"
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black shadow-sm shadow-amber-500/20 transition-all flex items-center space-x-1.5 active:scale-98"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>GigSaathi Companion</span>
            </Link>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-emerald-600/30 transition-all flex items-center space-x-2 active:scale-98"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.dashboard.logNewShift}</span>
            </button>
          </div>
        </div>

        {/* Financial Highlights Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Today's Net Earnings */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">{t.dashboard.todayEarnings}</span>
              <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
                <IndianRupee className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              ₹{todayStats.totalNet}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center space-x-1">
              <span>Gross: ₹{todayStats.totalGross}</span>
              <span>•</span>
              <span className="text-amber-700">Fuel: ₹{todayStats.totalExpenses}</span>
            </div>
          </div>

          {/* Weekly Net Earnings */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">{t.dashboard.weeklyEarnings}</span>
              <div className="p-1.5 bg-teal-50 text-teal-700 rounded-lg">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              ₹{weekStats.totalNet}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {weekStats.tripCount} shifts logged this week
            </div>
          </div>

          {/* Monthly Net Earnings */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">{t.dashboard.monthlyEarnings}</span>
              <div className="p-1.5 bg-blue-50 text-blue-700 rounded-lg">
                <IndianRupee className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              ₹{monthStats.totalNet}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Total expenses: ₹{monthStats.totalExpenses}
            </div>
          </div>

          {/* Effective Hourly Rate */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">{t.dashboard.hourlyRate}</span>
              <div className="p-1.5 bg-purple-50 text-purple-700 rounded-lg">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              ₹{monthStats.avgHourlyRate} <span className="text-xs font-normal text-slate-400">/hr</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Across {monthStats.totalHours} active hours
            </div>
          </div>
        </div>

        {/* Net Take-Home Calculation Rule Banner */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-emerald-500 text-slate-950 rounded-lg shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold block text-sm">Transparent Take-Home Formula:</span>
              <span className="text-slate-300 font-mono text-[11px]">
                {t.dashboard.netFormulaNote}
              </span>
            </div>
          </div>
          <Link
            href="/assistant"
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 rounded-xl text-xs font-bold transition-all shrink-0"
          >
            Explain with AI
          </Link>
        </div>

        {/* Goal Progress & Active Safety Reminder Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <GoalProgressCard
              monthlyGoal={profile.monthlyIncomeGoal}
              currentMonthlyEarnings={monthStats.totalNet}
              dailyGoal={profile.dailyIncomeGoal}
              todayEarnings={todayStats.totalNet}
              currentLanguage={lang}
            />
          </div>

          {/* Active Safety & Dispute Alert Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  {t.dashboard.activeSafetyAlert}
                </span>
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">
                Road Visibility & Hydration
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Take a 10-minute shade break every 2 hours. Over 60% of road incidents happen due to rush fatigue during evening traffic surge hours.
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <Link
                href="/safety"
                className="text-xs font-bold text-emerald-700 hover:underline flex items-center space-x-1"
              >
                <span>Complete Pre-Shift Checklist</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions Component */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            Quick Actions
          </h3>
          <QuickActions
            currentLanguage={lang}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        </div>

        {/* Interactive Earnings Chart & Date Filters */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Shift Visualizer
            </h3>
            <div className="flex items-center space-x-1 bg-white border border-slate-200 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setPeriod('today')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  period === 'today' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {t.dashboard.filterToday}
              </button>
              <button
                onClick={() => setPeriod('week')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  period === 'week' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {t.dashboard.filterWeek}
              </button>
              <button
                onClick={() => setPeriod('month')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  period === 'month' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {t.dashboard.filterMonth}
              </button>
              <button
                onClick={() => setPeriod('all')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  period === 'all' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {t.dashboard.filterAll}
              </button>
            </div>
          </div>

          <EarningsChart records={displayedRecords} currentLanguage={lang} />
        </div>

        {/* Recent Work Shifts Table / Cards */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {t.dashboard.recentShifts}
              </h3>
              <p className="text-xs text-slate-500">
                Latest work entries with gross, expenses, and dispute indicators
              </p>
            </div>
            <Link
              href="/earnings"
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center space-x-1"
            >
              <span>View All Tracker</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {earnings.slice(0, 4).map((record) => (
              <div key={record.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900">{record.platformOrEmployer}</span>
                    <span className="text-slate-400 font-mono text-[11px]">{record.date}</span>
                    {record.disputeStatus === 'can_dispute' && (
                      <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Mystery Deduction ₹{record.deductions}
                      </span>
                    )}
                  </div>
                  <div className="text-slate-500 mt-0.5">
                    {record.hoursWorked} hrs • {record.distanceKm || 0} km • {record.notes || 'Routine shift'}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-black text-emerald-700 text-sm">
                    ₹{record.netEarnings}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Gross ₹{record.grossEarnings}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Earning Modal */}
      <EarningModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveEarning}
        currentLanguage={lang}
      />
    </AppShell>
  );
}
