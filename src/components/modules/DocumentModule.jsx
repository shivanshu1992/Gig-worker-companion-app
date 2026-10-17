import React, { useState } from 'react';
import { 
  FileCheck, 
  Sparkles, 
  ArrowUpRight, 
  AlertTriangle, 
  Copy, 
  CheckCircle2, 
  HelpCircle,
  FileText
} from 'lucide-react';
import { SAMPLE_NOTICES } from '../../services/storageService';
import { geminiService } from '../../services/geminiService';
import { translations } from '../../services/i18n';
import ReadAloudButton from '../ReadAloudButton';

export default function DocumentModule({ onTriggerAppeal, lang, sunlightMode }) {
  const t = (translations[lang] || translations.en).docs;

  const [selectedSampleId, setSelectedSampleId] = useState(SAMPLE_NOTICES[0].id);
  const [noticeText, setNoticeText] = useState(SAMPLE_NOTICES[0].rawText);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');
  const [analysisSource, setAnalysisSource] = useState('');

  // Handle sample selection
  const handleSelectSample = (sample) => {
    setSelectedSampleId(sample.id);
    setNoticeText(sample.rawText);
    setAnalysisResult('');
  };

  // Run GenAI 3-bullet simplification
  const handleAnalyzeNotice = async () => {
    if (!noticeText.trim()) return;
    setIsAnalyzing(true);
    setAnalysisResult('');
    try {
      const res = await geminiService.simplifyNotice(noticeText, lang);
      setAnalysisResult(res.text);
      setAnalysisSource(res.source);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Trigger Connected Workflow 2: Port context into Grievance Drafter
  const handleDraftAppeal = () => {
    const activeSample = SAMPLE_NOTICES.find(s => s.id === selectedSampleId);
    
    // Extract metadata
    const platform = activeSample?.platform || (noticeText.includes('Zomato') ? 'Zomato' : (noticeText.includes('Uber') ? 'Uber' : 'Swiggy'));
    const amount = activeSample?.penaltyAmount || (noticeText.includes('320') ? 320 : (noticeText.includes('450') ? 450 : 0));
    const tripId = activeSample?.id === 'notice-sample-1' ? 'ORD-849201' : (activeSample?.id === 'notice-sample-2' ? 'UBR-992104' : 'ZOM-441928');
    const category = amount > 0 
      ? 'Damaged Parcel / Spilled Beverage Penalty' 
      : 'Wrongful Account Suspension / ID Block';

    onTriggerAppeal({
      platform,
      amount,
      tripId,
      category,
      details: `Appealing against formal penalty notice: "${activeSample?.title || 'Notice'}". ${analysisResult.slice(0, 180)}...`
    });
  };

  return (
    <div className="space-y-5 animate-fade-in">
      
      {/* Header */}
      <div className={`p-4 sm:p-5 rounded-3xl transition-all ${
        sunlightMode ? 'card-sunlight' : 'bg-[#111827] border border-slate-800 shadow-xl'
      }`}>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <FileCheck className="w-5 h-5" />
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

        {/* Sample Notices Selector */}
        <div className="mt-4 pt-4 border-t border-slate-800">
          <label className="block text-xs font-bold text-slate-300 mb-2">
            {t.sampleNoticesLabel}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {SAMPLE_NOTICES.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className={`p-3 rounded-2xl text-left transition-all border ${
                  selectedSampleId === sample.id
                    ? 'bg-indigo-950/60 text-white border-indigo-500 shadow-glow-emerald'
                    : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-bold uppercase mb-1">
                  <span className="text-amber-400">{sample.platform}</span>
                  {sample.penaltyAmount > 0 && (
                    <span className="text-rose-400 font-black">-₹{sample.penaltyAmount}</span>
                  )}
                </div>
                <div className="text-xs font-bold text-slate-200 line-clamp-1">
                  {sample.title}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Notice Input & GenAI Action */}
      <div className={`p-5 rounded-3xl transition-all ${
        sunlightMode ? 'card-sunlight' : 'bg-[#111827] border border-slate-800 shadow-2xl'
      }`}>
        <label className="block text-xs font-bold text-slate-300 mb-1.5">
          {t.pasteLabel}
        </label>
        
        <textarea
          rows={5}
          value={noticeText}
          onChange={(e) => setNoticeText(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-3.5 text-xs text-slate-200 font-mono leading-relaxed focus:border-indigo-400"
        />

        <div className="mt-3">
          <button
            onClick={handleAnalyzeNotice}
            disabled={isAnalyzing}
            type="button"
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg"
            style={{ minHeight: '48px' }}
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-white" />
                <span>{t.analyzing}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white" />
                <span>{t.analyzeBtn}</span>
              </>
            )}
          </button>
        </div>

        {/* 3-Bullet Breakdown Output */}
        {analysisResult && (
          <div className="mt-6 pt-5 border-t border-slate-800 space-y-4 animate-fade-in">
            
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4" />
                {t.breakdownTitle} ({analysisSource === 'gemini-live' ? 'Live Gemini 1.5' : 'Intelligent Fallback'})
              </span>
              
              <ReadAloudButton text={analysisResult} lang={lang} label="Read 3 Bullets" />
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/40 text-slate-200 text-xs leading-relaxed space-y-3 select-text">
              <div className="prose prose-invert max-w-none text-slate-100 font-medium text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                {analysisResult}
              </div>
            </div>

            {/* CONNECTED WORKFLOW 2: ONE-CLICK DRAFT APPEAL FOR THIS NOTICE */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 border-2 border-amber-500/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-glow-amber">
              <div>
                <h4 className="text-xs font-black uppercase text-amber-300">
                  Unfair Penalty or Account Suspension Detected?
                </h4>
                <p className="text-xs text-amber-100/90 mt-0.5">
                  Click below to port this notice into the Grievance Drafter with all case details pre-filled.
                </p>
              </div>

              <button
                onClick={handleDraftAppeal}
                type="button"
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider transition-all shadow-md shrink-0"
                style={{ minHeight: '48px' }}
              >
                <span>{t.draftAppealBtn}</span>
                <ArrowUpRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
