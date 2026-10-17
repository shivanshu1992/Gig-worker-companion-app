import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  Send, 
  Share2, 
  Copy, 
  Download, 
  Mic, 
  MicOff, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  History,
  FileCheck
} from 'lucide-react';
import { geminiService } from '../../services/geminiService';
import { speechService } from '../../services/speechService';
import { translations } from '../../services/i18n';
import ReadAloudButton from '../ReadAloudButton';

export default function GrievanceModule({
  disputes,
  onAddDispute,
  prefilledData,
  onClearPrefilled,
  workerProfile,
  lang,
  sunlightMode
}) {
  const t = (translations[lang] || translations.en).grievance;

  const categories = [
    'Unpaid Rain & Peak Surge Incentive',
    'Wrongful Account Suspension / ID Block',
    'Unfair Customer Rating Strike',
    'Damaged Parcel / Spilled Beverage Penalty',
    'Merchant Dispatch Delay Penalty',
    'Cash On Delivery (COD) Deposit Discrepancy'
  ];

  const platforms = [
    'Swiggy', 'Zomato', 'Uber', 'Ola', 'Zepto', 'Blinkit', 'Rapido', 'Porter', 'Urban Company'
  ];

  // Wizard state
  const [formData, setFormData] = useState({
    platform: workerProfile.primaryPlatform || 'Swiggy',
    category: categories[0],
    amount: '',
    tripId: '',
    details: '',
    language: lang || 'en'
  });

  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [letterSource, setLetterSource] = useState('');
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [prefilledAlert, setPrefilledAlert] = useState(false);

  // Auto pre-populate when coming from Earnings or Notice Simplifier
  useEffect(() => {
    if (prefilledData) {
      setFormData(prev => ({
        ...prev,
        platform: prefilledData.platform || prev.platform,
        amount: prefilledData.amount ? String(prefilledData.amount) : prev.amount,
        tripId: prefilledData.tripId || prev.tripId,
        details: prefilledData.details || prefilledData.reason || prev.details,
        category: prefilledData.category || (prefilledData.amount ? 'Damaged Parcel / Spilled Beverage Penalty' : prev.category)
      }));
      setPrefilledAlert(true);
      setTimeout(() => setPrefilledAlert(false), 5000);
      if (onClearPrefilled) {
        onClearPrefilled();
      }
    }
  }, [prefilledData, onClearPrefilled]);

  // Voice dictation handler
  const handleToggleVoiceInput = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    } else {
      setSpeechError('');
      const started = speechService.startListening(
        lang,
        (transcript) => {
          setFormData(prev => ({
            ...prev,
            details: prev.details ? `${prev.details} ${transcript}` : transcript
          }));
        },
        () => setIsListening(false),
        (err) => {
          setSpeechError(err);
          setIsListening(false);
        }
      );
      if (started) setIsListening(true);
    }
  };

  // Generate formal dispute letter
  const handleGenerateAppeal = async (e) => {
    if (e) e.preventDefault();
    setIsGenerating(true);
    setGeneratedLetter('');
    try {
      const res = await geminiService.generateGrievanceLetter({
        platform: formData.platform,
        category: formData.category,
        amount: formData.amount,
        tripId: formData.tripId,
        details: formData.details,
        workerName: workerProfile.name,
        workerPhone: workerProfile.phone,
        lang: formData.language
      });
      setGeneratedLetter(res.text);
      setLetterSource(res.source);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Save generated ticket to dispute log
  const handleSaveToHistory = () => {
    if (!generatedLetter) return;
    const newDispute = {
      id: `disp-${Date.now()}`,
      platform: formData.platform,
      category: formData.category,
      amount: Number(formData.amount) || 0,
      tripId: formData.tripId || 'N/A',
      date: new Date().toISOString().split('T')[0],
      status: 'Submitted',
      subject: `Dispute: ${formData.category} (${formData.tripId || 'General'})`,
      body: generatedLetter,
      createdAt: new Date().toISOString()
    };
    onAddDispute(newDispute);
    alert('Dispute saved to your local records successfully!');
  };

  // Copy to clipboard
  const handleCopy = () => {
    if (!generatedLetter) return;
    navigator.clipboard.writeText(generatedLetter);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  // Download text file
  const handleDownload = () => {
    if (!generatedLetter) return;
    const blob = new Blob([generatedLetter], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `GigSaathi_Dispute_${formData.platform}_${formData.tripId || 'Appeal'}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // WhatsApp share
  const handleWhatsAppShare = () => {
    if (!generatedLetter) return;
    const encoded = encodeURIComponent(generatedLetter);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <div className="space-y-5 animate-fade-in">
      
      {/* Top Banner Notice when pre-filled from Workflow */}
      {prefilledAlert && (
        <div className="p-4 rounded-2xl bg-amber-500 text-black font-extrabold text-xs flex items-center justify-between shadow-glow-amber animate-pulse">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-black" />
            <span>Workflow Activated: Grievance fields pre-populated with company, trip ID & deduction amount!</span>
          </div>
          <button onClick={() => setPrefilledAlert(false)} className="font-black px-2">✕</button>
        </div>
      )}

      {/* Header Card */}
      <div className={`p-4 sm:p-5 rounded-3xl transition-all ${
        sunlightMode ? 'card-sunlight' : 'bg-[#111827] border border-slate-800 shadow-xl'
      }`}>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`text-lg sm:text-xl font-black tracking-tight ${sunlightMode ? 'text-black' : 'text-white'}`}>
              {t.title}
            </h2>
            <p className={`text-xs mt-0.5 ${sunlightMode ? 'text-slate-800 font-bold' : 'text-slate-400'}`}>
              {t.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Main Dispute Wizard Form */}
      <div className={`p-5 rounded-3xl transition-all ${
        sunlightMode ? 'card-sunlight' : 'bg-[#111827] border border-slate-800 shadow-2xl'
      }`}>
        <form onSubmit={handleGenerateAppeal} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {t.platformLabel}
              </label>
              <select
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold focus:border-amber-400"
              >
                {platforms.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {t.categoryLabel}
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold focus:border-amber-400"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {t.amountLabel}
              </label>
              <input
                type="number"
                placeholder="e.g. 180 or 320"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {t.tripIdLabel}
              </label>
              <input
                type="text"
                placeholder="e.g. ZOM-441928"
                value={formData.tripId}
                onChange={(e) => setFormData({ ...formData, tripId: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold font-mono focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {t.toneLabel}
              </label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold focus:border-amber-400"
              >
                <option value="en">Professional English</option>
                <option value="hi">Formal Hindi (हिंदी)</option>
                <option value="hinglish">Hinglish (Colloquial Formal)</option>
              </select>
            </div>
          </div>

          {/* Details Text Area + Voice Dictation Button */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-300">
                {t.detailsLabel}
              </label>
              
              {/* Voice Dictation Button */}
              <button
                type="button"
                onClick={handleToggleVoiceInput}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  isListening
                    ? 'bg-rose-500 text-black border-black animate-pulse shadow-glow-safety'
                    : 'bg-slate-800 text-amber-400 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-3.5 h-3.5" />
                    <span>Listening... Tap to Stop</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5" />
                    <span>Speak in Voice (Mic)</span>
                  </>
                )}
              </button>
            </div>

            <textarea
              rows={3}
              placeholder="e.g. The restaurant took 25 minutes to pack the food. My arrival timestamp proves I arrived on time, but platform charged late pickup fine..."
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-3 text-xs text-white font-medium focus:border-amber-400 leading-relaxed"
            />
            {speechError && (
              <p className="text-[11px] text-amber-400 mt-1">{speechError}</p>
            )}
          </div>

          {/* Generate Button */}
          <div>
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-glow-amber"
              style={{ minHeight: '48px' }}
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-black" />
                  <span>{t.generating}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>{t.generateBtn}</span>
                </>
              )}
            </button>
          </div>

        </form>

        {/* Generated Appeal Result Card */}
        {generatedLetter && (
          <div className="mt-6 pt-5 border-t border-slate-800 space-y-3">
            
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4" />
                Generated Legal Ticket ({letterSource === 'gemini-live' ? 'Live Gemini 1.5' : 'Intelligent Fallback'})
              </span>
              
              <ReadAloudButton text={generatedLetter} lang={formData.language} label="Listen to Appeal" />
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700/80 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed select-text">
              {generatedLetter}
            </div>

            {/* Actions: Copy, WhatsApp, Download, Save */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              
              <button
                onClick={handleCopy}
                type="button"
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all"
                style={{ minHeight: '48px' }}
              >
                {copiedSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSuccess ? 'Copied!' : t.copyClipboard}</span>
              </button>

              <button
                onClick={handleWhatsAppShare}
                type="button"
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all shadow-glow-emerald"
                style={{ minHeight: '48px' }}
              >
                <Share2 className="w-4 h-4" />
                <span>{t.whatsappShare}</span>
              </button>

              <button
                onClick={handleDownload}
                type="button"
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all"
                style={{ minHeight: '48px' }}
              >
                <Download className="w-4 h-4" />
                <span>{t.downloadText}</span>
              </button>

              <button
                onClick={handleSaveToHistory}
                type="button"
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs transition-all shadow-glow-amber"
                style={{ minHeight: '48px' }}
              >
                <Clock className="w-4 h-4" />
                <span>Save to History</span>
              </button>

            </div>

          </div>
        )}

      </div>

      {/* Dispute History & Status Log */}
      <div className={`p-5 rounded-3xl transition-all ${
        sunlightMode ? 'card-sunlight' : 'bg-[#111827] border border-slate-800 shadow-xl'
      }`}>
        <div className="flex items-center gap-2 mb-3">
          <History className="w-4 h-4 text-amber-400" />
          <h3 className={`text-xs font-black uppercase tracking-wider ${sunlightMode ? 'text-black' : 'text-slate-300'}`}>
            {t.savedDisputes} ({disputes.length})
          </h3>
        </div>

        <div className="space-y-3">
          {disputes.map((item) => (
            <div 
              key={item.id}
              className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-white">{item.platform}</span>
                  <span className="text-[11px] text-amber-400 font-bold">• {item.category}</span>
                  {item.amount > 0 && (
                    <span className="text-xs font-black text-rose-400">₹{item.amount}</span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                  <span>ID: <code className="font-mono text-slate-300">{item.tripId}</code></span>
                  <span>• Date: {item.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {item.status || 'Active Dispute'}
                </span>
                <button
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      platform: item.platform,
                      category: item.category,
                      amount: String(item.amount || ''),
                      tripId: item.tripId,
                      details: item.subject
                    }));
                    setGeneratedLetter(item.body);
                  }}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
