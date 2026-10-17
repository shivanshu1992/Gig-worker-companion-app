'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  PlusCircle, 
  Download, 
  Sparkles, 
  Trash2, 
  Edit3, 
  AlertCircle, 
  IndianRupee, 
  Fuel, 
  TrendingUp, 
  Calendar,
  Filter,
  CheckCircle2,
  X
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { EarningModal } from '@/components/earnings/EarningModal';
import { EarningRecord, SupportedLanguage, WorkCategory } from '@/types';
import { clientStorage } from '@/lib/storage/clientStorage';
import { getTranslation } from '@/lib/i18n/translations';
import { aggregateEarnings, filterRecordsByPeriod } from '@/lib/calculations';

export default function EarningsPage() {
  const [profile, setProfile] = useState(clientStorage.getProfile());
  const [earnings, setEarnings] = useState<EarningRecord[]>([]);
  const [period, setPeriod] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<EarningRecord | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setProfile(clientStorage.getProfile());
    setEarnings(clientStorage.getEarnings());
    setMounted(true);
  }, []);

  const lang = profile.preferredLanguage || 'en';
  const t = getTranslation(lang);

  // Filter records
  const periodFiltered = filterRecordsByPeriod(earnings, period);
  const finalFiltered = categoryFilter === 'all'
    ? periodFiltered
    : periodFiltered.filter((r) => r.workCategory === categoryFilter);

  const stats = aggregateEarnings(finalFiltered);

  const handleSaveEarning = (recordData: Omit<EarningRecord, 'id' | 'createdAt' | 'netEarnings'>) => {
    if (editingRecord) {
      clientStorage.updateEarning(editingRecord.id, recordData);
      setEditingRecord(null);
    } else {
      clientStorage.addEarning(recordData);
    }
    setEarnings(clientStorage.getEarnings());
  };

  const handleDeleteEarning = (id: string) => {
    if (confirm(t.earnings.confirmDelete)) {
      clientStorage.deleteEarning(id);
      setEarnings(clientStorage.getEarnings());
    }
  };

  const handleExportCsv = () => {
    const csvContent = clientStorage.exportEarningsCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `gig_earnings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExplainEarnings = async () => {
    setIsExplaining(true);
    setAiSummary(null);

    try {
      const res = await fetch('/api/ai/explain-earnings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          records: earnings,
          preferredLanguage: lang
        })
      });

      const data = await res.json();
      setAiSummary(data.summary || 'Summary generated.');
    } catch (err) {
      setAiSummary('Failed to contact AI service. Please review your saved table records below.');
    } finally {
      setIsExplaining(false);
    }
  };

  if (!mounted) return <div className="min-h-screen bg-stone-50" />;

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {t.earnings.title}
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              {t.earnings.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all border border-slate-200 flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.earnings.exportCsvBtn}</span>
            </button>

            <button
              onClick={handleExplainEarnings}
              disabled={isExplaining}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isExplaining ? t.earnings.explainingAi : t.earnings.explainEarningsBtn}</span>
            </button>

            <button
              onClick={() => {
                setEditingRecord(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-emerald-600/30 transition-all flex items-center space-x-1.5 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.earnings.addNewBtn}</span>
            </button>
          </div>
        </div>

        {/* AI Explain Earnings Summary Modal / Card */}
        {aiSummary && (
          <div className="bg-gradient-to-br from-emerald-950 to-slate-900 text-white border border-emerald-800/50 rounded-3xl p-6 shadow-xl relative animate-in fade-in duration-300">
            <button
              onClick={() => setAiSummary(null)}
              className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>GenAI Shift & Spend Audit</span>
            </div>
            <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
              {aiSummary}
            </div>
          </div>
        )}

        {/* Aggregate Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">{t.earnings.grossTotal}</span>
            <div className="text-2xl font-black text-slate-900 mt-1">₹{stats.totalGross}</div>
            <span className="text-[10px] text-slate-400">Tips: ₹{stats.totalTips} • Bonuses: ₹{stats.totalBonuses}</span>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
            <span className="text-xs font-semibold text-amber-700">{t.earnings.expensesTotal}</span>
            <div className="text-2xl font-black text-amber-800 mt-1">₹{stats.totalExpenses}</div>
            <span className="text-[10px] text-slate-400">Fuel, EV swaps & data</span>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
            <span className="text-xs font-semibold text-rose-700">{t.earnings.deductionsTotal}</span>
            <div className="text-2xl font-black text-rose-800 mt-1">₹{stats.totalDeductions}</div>
            <span className="text-[10px] text-slate-400">Platform penalties</span>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 shadow-xs">
            <span className="text-xs font-bold text-emerald-800">{t.earnings.netTotal}</span>
            <div className="text-2xl font-black text-emerald-700 mt-1">₹{stats.totalNet}</div>
            <span className="text-[10px] text-emerald-600 font-medium">True take-home pay</span>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-semibold">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600">Period:</span>
            <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl">
              {(['all', 'today', 'week', 'month'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1 rounded-lg capitalize transition-all ${
                    period === p ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <span className="text-slate-600">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-slate-800 font-bold focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="delivery">Delivery</option>
              <option value="driver">Driver (Cab/Auto)</option>
              <option value="construction">Construction</option>
              <option value="daily_wage">Daily Wage</option>
            </select>
          </div>
        </div>

        {/* Transaction History Table */}
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">
              Saved Shift History ({finalFiltered.length} records)
            </h3>
            <span className="text-[11px] text-slate-400">
              Formula: Net = Gross + Bonus + Tip - Deduction - Expense
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Date & Platform</th>
                  <th className="px-4 py-3">Gross & Bonuses</th>
                  <th className="px-4 py-3">Expenses (Fuel)</th>
                  <th className="px-4 py-3">Deductions</th>
                  <th className="px-4 py-3">Net Take-Home</th>
                  <th className="px-4 py-3">Hours / Dist</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {finalFiltered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                      No shift records match this filter. Log a shift to start!
                    </td>
                  </tr>
                ) : (
                  finalFiltered.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{record.platformOrEmployer}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {record.date} {record.tripOrOrderId ? `• ${record.tripOrOrderId}` : ''}
                        </div>
                        {record.notes && (
                          <div className="text-[10px] text-slate-500 truncate max-w-[200px]">
                            {record.notes}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900">₹{record.grossEarnings}</div>
                        {(record.bonuses > 0 || record.tips > 0) && (
                          <div className="text-[10px] text-emerald-600">
                            +{record.bonuses} surge • +{record.tips} tip
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <span className="font-semibold text-amber-800">₹{record.expenses}</span>
                        <div className="text-[10px] text-slate-400 capitalize">{record.paymentMode}</div>
                      </td>

                      <td className="px-4 py-3">
                        {record.deductions > 0 ? (
                          <div>
                            <span className="font-bold text-rose-700">₹{record.deductions}</span>
                            <Link
                              href="/grievances"
                              className="block text-[10px] text-rose-600 font-bold hover:underline"
                            >
                              Dispute Penalty &rarr;
                            </Link>
                          </div>
                        ) : (
                          <span className="text-slate-400">₹0</span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <span className="font-black text-emerald-700 text-sm">
                          ₹{record.netEarnings}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-slate-500">
                        {record.hoursWorked} hrs
                        {record.distanceKm ? ` • ${record.distanceKm} km` : ''}
                      </td>

                      <td className="px-4 py-3 text-right space-x-1">
                        <button
                          onClick={() => {
                            setEditingRecord(record);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                          title="Edit Record"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteEarning(record.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add / Edit Earning Modal */}
      <EarningModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRecord(null);
        }}
        onSave={handleSaveEarning}
        initialData={editingRecord}
        currentLanguage={lang}
      />
    </AppShell>
  );
}
