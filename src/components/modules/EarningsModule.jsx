import React, { useState } from 'react';
import { 
  TrendingUp, 
  Fuel, 
  Percent, 
  AlertCircle, 
  Plus, 
  Sparkles, 
  Clock, 
  Compass, 
  CheckCircle,
  HelpCircle,
  ChevronRight,
  ArrowUpRight,
  ShieldAlert,
  Coins
} from 'lucide-react';
import { geminiService } from '../../services/geminiService';
import { translations } from '../../services/i18n';
import ReadAloudButton from '../ReadAloudButton';

export default function EarningsModule({
  shifts,
  onAddShift,
  onTriggerDispute,
  workerProfile,
  lang,
  sunlightMode
}) {
  const t = (translations[lang] || translations.en).earnings;

  // Selected shift for detailed audit (defaults to the most recent shift)
  const [selectedShiftId, setSelectedShiftId] = useState(shifts[0]?.id || null);
  const [showLogModal, setShowLogModal] = useState(false);
  const [aiReview, setAiReview] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [aiSource, setAiSource] = useState('');

  // Selected shift object
  const currentShift = shifts.find(s => s.id === selectedShiftId) || shifts[0];

  // Calculations for current selected shift
  const gross = currentShift?.grossEarnings || 0;
  const platformFee = currentShift?.platformFee || 0;
  const fuel = currentShift?.fuelCost || 0;
  const deductions = currentShift?.deductions || 0;
  const tips = currentShift?.tips || 0;
  const incentives = currentShift?.incentives || 0;
  const hours = currentShift?.hoursWorked || 1;
  const netPay = gross - platformFee - fuel - deductions + tips + incentives;
  const hourlyRate = hours > 0 ? Math.round(netPay / hours) : 0;
  const fuelPercent = gross > 0 ? Math.round((fuel / gross) * 100) : 0;
  const feePercent = gross > 0 ? Math.round((platformFee / gross) * 100) : 0;

  // Target progress
  const target = workerProfile?.dailyEarningsTarget || 1200;
  const targetPercent = Math.min(100, Math.round((netPay / target) * 100));

  // Handle GenAI Shift Audit
  const handleGenerateAudit = async () => {
    if (!currentShift) return;
    setIsAuditing(true);
    setAiReview('');
    try {
      const res = await geminiService.generateShiftReview(currentShift, lang);
      setAiReview(res.text);
      setAiSource(res.source);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAuditing(false);
    }
  };

  // Form state for new shift logger
  const [newShift, setNewShift] = useState({
    platform: workerProfile.primaryPlatform || 'Swiggy',
    grossEarnings: 1200,
    platformFee: 180,
    fuelCost: 220,
    tips: 50,
    incentives: 100,
    deductions: 0,
    hoursWorked: 6.0,
    kmDriven: 50,
    tripCount: 12,
    deductionReason: '',
    tripId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`
  });

  const handleSaveNewShift = (e) => {
    e.preventDefault();
    const created = {
      ...newShift,
      id: `shift-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      disputeStatus: newShift.deductions > 0 ? 'can_dispute' : 'none',
      notes: 'Logged via Quick Shift Logger'
    };
    onAddShift(created);
    setSelectedShiftId(created.id);
    setShowLogModal(false);
    // Reset audit
    setAiReview('');
  };

  return (
    <div className="space-y-5 animate-fade-in">
      
      {/* Top Header Card */}
      <div className={`p-4 sm:p-5 rounded-3xl transition-all ${
        sunlightMode
          ? 'card-sunlight'
          : 'bg-[#111827] border border-slate-800 shadow-xl'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h2 className={`text-lg sm:text-xl font-black tracking-tight ${sunlightMode ? 'text-black' : 'text-white'}`}>
                {t.title}
              </h2>
            </div>
            <p className={`text-xs mt-1 ${sunlightMode ? 'text-slate-800 font-bold' : 'text-slate-400'}`}>
              {t.subtitle}
            </p>
          </div>

          <button
            onClick={() => setShowLogModal(true)}
            type="button"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs transition-all shadow-glow-amber"
            style={{ minHeight: '48px' }}
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{t.quickLogBtn}</span>
          </button>
        </div>

        {/* Shift selector pills */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className={`text-[11px] font-bold uppercase tracking-wider shrink-0 ${sunlightMode ? 'text-black' : 'text-slate-400'}`}>
            Shifts:
          </span>
          {shifts.map((shift) => {
            const isSelected = (shift.id === selectedShiftId);
            const isDeducted = (shift.deductions > 0);
            return (
              <button
                key={shift.id}
                onClick={() => {
                  setSelectedShiftId(shift.id);
                  setAiReview('');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-black shadow-md border-2 border-black font-black'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                <span>{shift.platform}</span>
                <span className="opacity-80">({shift.date.slice(5)})</span>
                {isDeducted && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" title="Deduction flagged" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Net Pay Showcase Card */}
      <div className={`p-5 rounded-3xl relative overflow-hidden transition-all ${
        sunlightMode
          ? 'card-sunlight'
          : 'bg-gradient-to-br from-slate-900 via-[#111827] to-[#0B1120] border border-slate-700/80 shadow-2xl'
      }`}>
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className={`text-xs font-black uppercase tracking-wider ${sunlightMode ? 'text-black' : 'text-slate-400'}`}>
              {currentShift?.platform} • {currentShift?.date}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-black">
              {currentShift?.hoursWorked} Hours Active
            </span>
          </div>

          {/* Big In-Hand Net Pay Amount */}
          <div className="mt-3 flex flex-wrap items-baseline gap-3">
            <div className="flex items-baseline">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 mr-1">₹</span>
              <span className={`text-4xl sm:text-5xl font-black tracking-tight ${sunlightMode ? 'text-black' : 'text-white'}`}>
                {netPay.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-emerald-400">
                {t.netPay}
              </span>
              <span className={`text-[11px] font-semibold ${sunlightMode ? 'text-slate-700' : 'text-slate-400'}`}>
                ₹{hourlyRate}/hr real wage
              </span>
            </div>
          </div>

          {/* Target Progress Bar */}
          <div className="mt-4 pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className={sunlightMode ? 'text-black' : 'text-slate-300'}>
                {t.targetProgress} (Target: ₹{target})
              </span>
              <span className={targetPercent >= 100 ? 'text-emerald-400' : 'text-amber-400'}>
                {targetPercent}% Completed
              </span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div 
                className={`h-full rounded-full transition-all duration-700 ${
                  targetPercent >= 100 
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-glow-emerald' 
                    : 'bg-gradient-to-r from-amber-500 to-yellow-400'
                }`}
                style={{ width: `${targetPercent}%` }}
              />
            </div>
          </div>

          {/* 4 Quick Breakdown Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5">
            
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60">
              <div className="text-[11px] font-bold text-slate-400">{t.grossPay}</div>
              <div className="text-base font-black text-white mt-0.5">₹{gross}</div>
              <div className="text-[10px] text-slate-500">{currentShift?.tripCount || 10} trips</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60">
              <div className="text-[11px] font-bold text-slate-400 flex items-center justify-between">
                <span>{t.fuelCharging}</span>
                <span className="text-amber-400">{fuelPercent}%</span>
              </div>
              <div className="text-base font-black text-amber-400 mt-0.5">-₹{fuel}</div>
              <div className="text-[10px] text-slate-500">{currentShift?.kmDriven} km</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60">
              <div className="text-[11px] font-bold text-slate-400 flex items-center justify-between">
                <span>{t.platformCut}</span>
                <span className="text-slate-400">{feePercent}%</span>
              </div>
              <div className="text-base font-black text-slate-300 mt-0.5">-₹{platformFee}</div>
              <div className="text-[10px] text-slate-500">Platform fee</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60">
              <div className="text-[11px] font-bold text-slate-400">{t.tips}</div>
              <div className="text-base font-black text-emerald-400 mt-0.5">+₹{tips}</div>
              <div className="text-[10px] text-emerald-500/80">Customer direct</div>
            </div>

          </div>

          {/* CONNECTED WORKFLOW 1: DEDUCTION ALERT & DISPUTE BUTTON */}
          {deductions > 0 && (
            <div className="mt-4 p-4 rounded-2xl bg-rose-950/70 border-2 border-rose-500/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-glow-safety">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-rose-500 text-black mt-0.5">
                  <ShieldAlert className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-rose-300">
                      Unexpected Penalty Flagged
                    </span>
                    <span className="text-xs font-black px-2 py-0.5 rounded bg-rose-500 text-black">
                      -₹{deductions}
                    </span>
                  </div>
                  <p className="text-xs text-white font-medium mt-0.5">
                    {currentShift.deductionReason || 'Unfair penalty or uncredited peak incentive'}
                  </p>
                  <p className="text-[11px] text-rose-200/80">
                    Order ID: <code className="bg-black/40 px-1 py-0.5 rounded font-mono">{currentShift.tripId || 'TRIP-9821'}</code>
                  </p>
                </div>
              </div>

              {/* Connected Workflow 1 Trigger Button */}
              <button
                onClick={() => onTriggerDispute({
                  platform: currentShift.platform,
                  date: currentShift.date,
                  amount: deductions,
                  tripId: currentShift.tripId || 'ZOM-441928',
                  reason: currentShift.deductionReason || 'Unfair penalty deduction on shift'
                })}
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rose-500 hover:bg-rose-400 text-black font-black text-xs transition-all shadow-md shrink-0"
                style={{ minHeight: '48px' }}
              >
                <span>{t.disputeDeductionBtn}</span>
                <ArrowUpRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          )}

          {/* GenAI Shift Review & Spoken Audit Section */}
          <div className="mt-5 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h4 className={`text-xs font-black uppercase tracking-wider ${sunlightMode ? 'text-black' : 'text-slate-200'}`}>
                  Spoken AI Shift Audit
                </h4>
              </div>

              {aiReview && (
                <ReadAloudButton text={aiReview} lang={lang} label="Listen to Review" />
              )}
            </div>

            {!aiReview ? (
              <button
                onClick={handleGenerateAudit}
                disabled={isAuditing}
                type="button"
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-glow-amber"
                style={{ minHeight: '48px' }}
              >
                {isAuditing ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-black" />
                    <span>{t.aiReviewGenerating}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-black" />
                    <span>{t.aiReviewBtn} (GenAI Insights)</span>
                  </>
                )}
              </button>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/40 text-slate-200 text-xs leading-relaxed space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-[10px] font-black uppercase text-amber-400 tracking-wide flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Voice & Text Audit ({aiSource === 'gemini-live' ? 'Live Gemini 1.5' : 'Intelligent Fallback'})
                  </span>
                  <button
                    onClick={handleGenerateAudit}
                    className="text-[11px] text-slate-400 hover:text-amber-400 font-bold underline"
                  >
                    Re-audit
                  </button>
                </div>
                <p className="whitespace-pre-line text-slate-100 text-[13px] leading-relaxed font-medium">
                  {aiReview}
                </p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Quick Shift Logger Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111827] border border-slate-700 w-full max-w-lg rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white">Log Today's Shift</h3>
              <button
                onClick={() => setShowLogModal(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNewShift} className="mt-4 space-y-3.5">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Platform</label>
                  <select
                    value={newShift.platform}
                    onChange={(e) => setNewShift({ ...newShift, platform: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold"
                  >
                    {['Swiggy', 'Zomato', 'Uber', 'Ola', 'Zepto', 'Blinkit', 'Rapido', 'Porter'].map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Gross Booking (₹)</label>
                  <input
                    type="number"
                    value={newShift.grossEarnings}
                    onChange={(e) => setNewShift({ ...newShift, grossEarnings: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Fuel / EV Charge (₹)</label>
                  <input
                    type="number"
                    value={newShift.fuelCost}
                    onChange={(e) => setNewShift({ ...newShift, fuelCost: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Platform Cut (₹)</label>
                  <input
                    type="number"
                    value={newShift.platformFee}
                    onChange={(e) => setNewShift({ ...newShift, platformFee: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Tips Received (₹)</label>
                  <input
                    type="number"
                    value={newShift.tips}
                    onChange={(e) => setNewShift({ ...newShift, tips: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Incentives / Surge (₹)</label>
                  <input
                    type="number"
                    value={newShift.incentives}
                    onChange={(e) => setNewShift({ ...newShift, incentives: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold"
                  />
                </div>
              </div>

              <div className="p-3 bg-rose-950/40 border border-rose-800/40 rounded-2xl space-y-2">
                <label className="block text-xs font-bold text-rose-300">
                  Did the company deduct any penalty or fee? (₹)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="0"
                    value={newShift.deductions}
                    onChange={(e) => setNewShift({ ...newShift, deductions: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold"
                  />
                  <input
                    type="text"
                    placeholder="Reason (e.g. late pickup)"
                    value={newShift.deductionReason}
                    onChange={(e) => setNewShift({ ...newShift, deductionReason: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Active Hours</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newShift.hoursWorked}
                    onChange={(e) => setNewShift({ ...newShift, hoursWorked: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2 py-2 text-xs text-white font-bold text-center"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Distance (km)</label>
                  <input
                    type="number"
                    value={newShift.kmDriven}
                    onChange={(e) => setNewShift({ ...newShift, kmDriven: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2 py-2 text-xs text-white font-bold text-center"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Trips</label>
                  <input
                    type="number"
                    value={newShift.tripCount}
                    onChange={(e) => setNewShift({ ...newShift, tripCount: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2 py-2 text-xs text-white font-bold text-center"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider transition-all shadow-glow-emerald"
                  style={{ minHeight: '48px' }}
                >
                  Save Shift & Calculate Real Net Pay
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
