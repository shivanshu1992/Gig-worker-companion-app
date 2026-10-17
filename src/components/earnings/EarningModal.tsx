'use client';

import React, { useState, useEffect } from 'react';
import { X, Calculator, AlertCircle } from 'lucide-react';
import { EarningRecord, SupportedLanguage, WorkCategory } from '@/types';
import { getTranslation } from '@/lib/i18n/translations';
import { calculateNetEarnings } from '@/lib/calculations';

export function EarningModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  currentLanguage = 'en'
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: Omit<EarningRecord, 'id' | 'createdAt' | 'netEarnings'>) => void;
  initialData?: EarningRecord | null;
  currentLanguage?: SupportedLanguage;
}) {
  const t = getTranslation(currentLanguage);

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [workCategory, setWorkCategory] = useState<WorkCategory>('delivery');
  const [platformOrEmployer, setPlatformOrEmployer] = useState('Swiggy');
  const [tripOrOrderId, setTripOrOrderId] = useState('');
  const [grossEarnings, setGrossEarnings] = useState<number>(1000);
  const [bonuses, setBonuses] = useState<number>(100);
  const [tips, setTips] = useState<number>(50);
  const [deductions, setDeductions] = useState<number>(0);
  const [deductionReason, setDeductionReason] = useState('');
  const [expenses, setExpenses] = useState<number>(200);
  const [hoursWorked, setHoursWorked] = useState<number>(6.0);
  const [distanceKm, setDistanceKm] = useState<number>(45);
  const [paymentMode, setPaymentMode] = useState<'cash' | 'digital' | 'mixed'>('digital');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialData) {
      setDate(initialData.date);
      setWorkCategory(initialData.workCategory);
      setPlatformOrEmployer(initialData.platformOrEmployer);
      setTripOrOrderId(initialData.tripOrOrderId || '');
      setGrossEarnings(initialData.grossEarnings);
      setBonuses(initialData.bonuses);
      setTips(initialData.tips);
      setDeductions(initialData.deductions);
      setDeductionReason(initialData.deductionReason || '');
      setExpenses(initialData.expenses);
      setHoursWorked(initialData.hoursWorked);
      setDistanceKm(initialData.distanceKm || 0);
      setPaymentMode(initialData.paymentMode);
      setNotes(initialData.notes || '');
    } else {
      setDate(new Date().toISOString().split('T')[0]);
      setGrossEarnings(1200);
      setBonuses(150);
      setTips(60);
      setDeductions(0);
      setDeductionReason('');
      setExpenses(250);
      setHoursWorked(6.5);
      setDistanceKm(55);
      setNotes('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Live calculation of net earnings
  const liveNet = calculateNetEarnings({
    grossEarnings,
    bonuses,
    tips,
    deductions,
    expenses
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      date,
      workCategory,
      platformOrEmployer,
      tripOrOrderId: tripOrOrderId.trim() || undefined,
      grossEarnings: Number(grossEarnings) || 0,
      bonuses: Number(bonuses) || 0,
      tips: Number(tips) || 0,
      deductions: Number(deductions) || 0,
      deductionReason: deductionReason.trim() || undefined,
      expenses: Number(expenses) || 0,
      hoursWorked: Number(hoursWorked) || 0,
      distanceKm: Number(distanceKm) || 0,
      paymentMode,
      notes: notes.trim() || undefined,
      disputeStatus: deductions > 0 ? 'can_dispute' : 'none'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg">
              {initialData ? t.earnings.form.submitEdit : t.earnings.addNewBtn}
            </h3>
            <p className="text-xs text-slate-500">
              {t.earnings.subtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs font-semibold text-slate-700">
          {/* Live Net Earnings Banner */}
          <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-emerald-800 font-bold uppercase tracking-wider flex items-center space-x-1">
                <Calculator className="w-3.5 h-3.5" />
                <span>Calculated Net Take-Home</span>
              </div>
              <div className="text-[10px] text-emerald-600 font-medium">
                Gross ({grossEarnings}) + Bonus ({bonuses}) + Tip ({tips}) - Ded ({deductions}) - Exp ({expenses})
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-700">
              ₹{liveNet}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Date */}
            <div>
              <label className="block mb-1 text-slate-600">{t.earnings.form.date}</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Work Category */}
            <div>
              <label className="block mb-1 text-slate-600">{t.earnings.form.workCategory}</label>
              <select
                value={workCategory}
                onChange={(e) => setWorkCategory(e.target.value as WorkCategory)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="delivery">Delivery Partner (Food/Grocery)</option>
                <option value="driver">Cab / Auto / Bike Taxi</option>
                <option value="construction">Construction Worker / Mason</option>
                <option value="daily_wage">Daily Wage Labourer</option>
                <option value="domestic">Domestic / Cleaning / Helper</option>
                <option value="freelance">Freelance / Logistics</option>
                <option value="other">Other Informal Work</option>
              </select>
            </div>

            {/* Platform or Employer */}
            <div>
              <label className="block mb-1 text-slate-600">{t.earnings.form.platformOrEmployer}</label>
              <input
                type="text"
                required
                value={platformOrEmployer}
                onChange={(e) => setPlatformOrEmployer(e.target.value)}
                placeholder="e.g. Swiggy, Zomato, Uber, Contractor"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Trip / Order ID */}
            <div>
              <label className="block mb-1 text-slate-600">{t.earnings.form.tripOrOrderId}</label>
              <input
                type="text"
                value={tripOrOrderId}
                onChange={(e) => setTripOrOrderId(e.target.value)}
                placeholder="e.g. SWG-984210"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Gross Earnings */}
            <div>
              <label className="block mb-1 text-slate-600">{t.earnings.form.grossEarnings}</label>
              <input
                type="number"
                min="0"
                step="any"
                required
                value={grossEarnings}
                onChange={(e) => setGrossEarnings(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
              />
            </div>

            {/* Bonuses */}
            <div>
              <label className="block mb-1 text-slate-600">{t.earnings.form.bonuses}</label>
              <input
                type="number"
                min="0"
                step="any"
                value={bonuses}
                onChange={(e) => setBonuses(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Tips */}
            <div>
              <label className="block mb-1 text-slate-600">{t.earnings.form.tips}</label>
              <input
                type="number"
                min="0"
                step="any"
                value={tips}
                onChange={(e) => setTips(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Expenses */}
            <div>
              <label className="block mb-1 text-slate-600">{t.earnings.form.expenses}</label>
              <input
                type="number"
                min="0"
                step="any"
                value={expenses}
                onChange={(e) => setExpenses(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-amber-800 font-bold"
              />
            </div>

            {/* Platform Deductions */}
            <div>
              <label className="block mb-1 text-rose-700">{t.earnings.form.deductions}</label>
              <input
                type="number"
                min="0"
                step="any"
                value={deductions}
                onChange={(e) => setDeductions(parseFloat(e.target.value) || 0)}
                className="w-full bg-rose-50/50 border border-rose-200 rounded-xl px-3 py-2 text-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-500 font-bold"
              />
            </div>

            {/* Hours Worked */}
            <div>
              <label className="block mb-1 text-slate-600">{t.earnings.form.hoursWorked}</label>
              <input
                type="number"
                min="0.1"
                max="24"
                step="0.5"
                required
                value={hoursWorked}
                onChange={(e) => setHoursWorked(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Reason for deduction if deduction > 0 */}
          {deductions > 0 && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 space-y-1">
              <label className="block text-rose-800 text-xs font-bold flex items-center space-x-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{t.earnings.form.deductionReason}</span>
              </label>
              <input
                type="text"
                value={deductionReason}
                onChange={(e) => setDeductionReason(e.target.value)}
                placeholder="e.g. Unfair late food pickup penalty (restaurant delay)"
                className="w-full bg-white border border-rose-200 rounded-xl px-3 py-2 text-rose-950 focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
              <span className="text-[10px] text-rose-700">
                You can draft an appeal in the Grievance Drafter module to recover this ₹{deductions}.
              </span>
            </div>
          )}

          {/* Payment Mode & Distance */}
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block mb-1 text-slate-600">{t.earnings.form.paymentMode}</label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="digital">Digital (Online / UPI)</option>
                <option value="cash">Cash in Hand</option>
                <option value="mixed">Mixed (Cash & UPI)</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-slate-600">{t.earnings.form.distanceKm}</label>
              <input
                type="number"
                min="0"
                step="any"
                value={distanceKm}
                onChange={(e) => setDistanceKm(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block mb-1 text-slate-600">{t.earnings.form.notes}</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. High demand rain surge in Saket, completed 14 orders"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold"
            >
              {t.earnings.form.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-600/30"
            >
              {initialData ? t.earnings.form.submitEdit : t.earnings.form.submitAdd}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
