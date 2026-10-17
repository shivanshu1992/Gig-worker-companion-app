'use client';

import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import { EarningRecord, SupportedLanguage } from '@/types';
import { getTranslation } from '@/lib/i18n/translations';

export function EarningsChart({
  records,
  currentLanguage = 'en'
}: {
  records: EarningRecord[];
  currentLanguage?: SupportedLanguage;
}) {
  const t = getTranslation(currentLanguage);
  const [metricView, setMetricView] = useState<'net_vs_gross' | 'expenses'>('net_vs_gross');

  // Format data for chart (sorted chronologically)
  const chartData = [...records]
    .slice(0, 7)
    .reverse()
    .map((r) => {
      // Format short date (e.g. 16 Oct)
      const parts = r.date.split('-');
      const shortDate = parts.length === 3 ? `${parts[2]}/${parts[1]}` : r.date;

      return {
        date: shortDate,
        platform: r.platformOrEmployer,
        gross: r.grossEarnings,
        expenses: r.expenses,
        net: r.netEarnings,
        deductions: r.deductions
      };
    });

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-bold text-slate-900 text-base md:text-lg">
            {currentLanguage === 'hi'
              ? 'कमाई एवं खर्च का चार्ट'
              : currentLanguage === 'pa'
              ? 'ਕਮਾਈ ਅਤੇ ਖਰਚੇ ਦਾ ਗ੍ਰਾਫ'
              : 'Earnings & Expense Breakdown'}
          </h3>
          <p className="text-xs text-slate-500">
            {currentLanguage === 'hi'
              ? 'हाल की 7 शिफ्टों का पारदर्शी हिसाब'
              : currentLanguage === 'pa'
              ? 'ਪਿਛਲੀਆਂ 7 ਸ਼ਿਫਟਾਂ ਦਾ ਹਿਸਾਬ'
              : 'Visualizing Net Take-Home vs. Fuel & Deductions'}
          </p>
        </div>

        <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setMetricView('net_vs_gross')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              metricView === 'net_vs_gross'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {currentLanguage === 'hi' ? 'ग्रॉस बनाम शुद्ध' : 'Gross vs Net'}
          </button>
          <button
            onClick={() => setMetricView('expenses')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              metricView === 'expenses'
                ? 'bg-white text-rose-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {currentLanguage === 'hi' ? 'खर्च व कटौती' : 'Fuel & Penalties'}
          </button>
        </div>
      </div>

      <div className="w-full h-64 sm:h-72">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm">
            {t.dashboard.noShiftsRecorded}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e2e8f0',
                  borderRadius: '0.75rem',
                  fontSize: '0.75rem',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                formatter={(value: any) => [`₹${value}`, '']}
              />
              <Legend wrapperStyle={{ fontSize: '0.75rem', paddingTop: '10px' }} />
              {metricView === 'net_vs_gross' ? (
                <>
                  <Bar dataKey="gross" name="Gross Pay (₹)" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="net" name="Net Take-Home (₹)" fill="#059669" radius={[4, 4, 0, 0]} />
                </>
              ) : (
                <>
                  <Bar dataKey="expenses" name="Fuel & Expenses (₹)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="deductions" name="Platform Penalties (₹)" fill="#e11d48" radius={[4, 4, 0, 0]} />
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
