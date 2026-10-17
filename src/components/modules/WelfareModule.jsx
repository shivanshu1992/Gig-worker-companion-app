import React, { useState } from 'react';
import { 
  ShieldCheck, 
  HelpCircle, 
  Sparkles, 
  CheckCircle, 
  ExternalLink, 
  Phone, 
  FileText, 
  Filter, 
  Mic, 
  MicOff, 
  Send,
  Building,
  Award,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { WELFARE_SCHEMES } from '../../services/welfareDatabase';
import { geminiService } from '../../services/geminiService';
import { speechService } from '../../services/speechService';
import { translations } from '../../services/i18n';
import ReadAloudButton from '../ReadAloudButton';

export default function WelfareModule({ workerProfile, lang, sunlightMode, onOpenProfile }) {
  const t = (translations[lang] || translations.en).welfare;

  // Filter: 'all' vs 'matched'
  const [filterMode, setFilterMode] = useState('matched');
  const [expandedSchemeId, setExpandedSchemeId] = useState('scheme-state-gig');

  // AI Chat state
  const [chatQuestion, setChatQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [chatAnswer, setChatAnswer] = useState('');
  const [answerSource, setAnswerSource] = useState('');
  const [isListening, setIsListening] = useState(false);

  // Quick question suggestions
  const quickQuestions = [
    { en: "Will I get insurance money if my bike is hit on duty?", hi: "क्या ड्यूटी के दौरान बाइक एक्सीडेंट होने पर बीमा मिलेगा?", hinglish: "Kya shift time bike accident hone par claim milega?" },
    { en: "How do I register for e-Shram without PF?", hi: "बिना पीएफ के ई-श्रम कार्ड कैसे बनाएं?", hinglish: "Bina PF ke e-Shram card kaise banayein?" },
    { en: "What benefits does Maharashtra/State Gig Worker Board give?", hi: "राज्य गिग वर्कर बोर्ड से क्या-क्या लाभ मिलते हैं?", hinglish: "State gig worker board se kya kya benefits milte hain?" },
    { en: "Can platforms deduct money for rain cancellation?", hi: "क्या बारिश में आर्डर कैंसिल होने पर कंपनी पैसे काट सकती है?", hinglish: "Kya barish me cancellation pe platform cut laga sakta hai?" }
  ];

  // Match schemes with worker profile (Connected Workflow 3)
  const matchedSchemes = WELFARE_SCHEMES.map(scheme => ({
    ...scheme,
    isMatched: scheme.matchCriteria ? scheme.matchCriteria(workerProfile) : true
  }));

  const displayedSchemes = filterMode === 'matched' 
    ? matchedSchemes.filter(s => s.isMatched)
    : matchedSchemes;

  const handleAskAI = async (customQ) => {
    const q = customQ || chatQuestion;
    if (!q.trim()) return;
    setIsAsking(true);
    setChatAnswer('');
    try {
      const res = await geminiService.askWelfareAdvisor(q, workerProfile, lang);
      setChatAnswer(res.text);
      setAnswerSource(res.source);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAsking(false);
    }
  };

  const handleToggleVoiceInput = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    } else {
      const started = speechService.startListening(
        lang,
        (text) => setChatQuestion(text),
        () => setIsListening(false),
        () => setIsListening(false)
      );
      if (started) setIsListening(true);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      
      {/* Header Card */}
      <div className={`p-4 sm:p-5 rounded-3xl transition-all ${
        sunlightMode ? 'card-sunlight' : 'bg-[#111827] border border-slate-800 shadow-xl'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <ShieldCheck className="w-5 h-5" />
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

          {/* Profile Match Banner Button */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold"
          >
            <span>Worker: <strong className="text-amber-400">{workerProfile.name}</strong> ({workerProfile.state})</span>
          </button>
        </div>

        {/* Filter Toggle: Recommended vs All */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterMode('matched')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                filterMode === 'matched'
                  ? 'bg-blue-600 text-white shadow-glow-emerald'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              ⭐ {t.matchedForYou} ({matchedSchemes.filter(s => s.isMatched).length})
            </button>
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                filterMode === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {t.allSchemes} ({WELFARE_SCHEMES.length})
            </button>
          </div>
        </div>
      </div>

      {/* AI Legal & Rights Advisor Box (With Voice Dictation & Read-Aloud) */}
      <div className={`p-5 rounded-3xl transition-all ${
        sunlightMode ? 'card-sunlight' : 'bg-[#111827] border border-blue-900/60 shadow-2xl'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <h3 className={`text-xs font-black uppercase tracking-wider ${sunlightMode ? 'text-black' : 'text-white'}`}>
              {t.checkEligibility}
            </h3>
          </div>
          {chatAnswer && (
            <ReadAloudButton text={chatAnswer} lang={lang} label="Listen to Answer" />
          )}
        </div>

        {/* Question Input + Mic */}
        <div className="relative">
          <input
            type="text"
            placeholder={t.askPlaceholder}
            value={chatQuestion}
            onChange={(e) => setChatQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
            className="w-full bg-slate-900 border border-slate-700 rounded-2xl pl-4 pr-24 py-3 text-xs text-white font-medium focus:border-blue-400 focus:outline-none"
          />
          <div className="absolute right-2 top-2 flex items-center gap-1">
            <button
              type="button"
              onClick={handleToggleVoiceInput}
              className={`p-1.5 rounded-xl text-xs transition-all ${
                isListening ? 'bg-rose-500 text-black animate-pulse' : 'bg-slate-800 text-amber-400 hover:bg-slate-700'
              }`}
              title="Voice Input (Mic)"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={() => handleAskAI()}
              disabled={isAsking}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
            >
              {isAsking ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Quick Question Chips */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold text-slate-500 shrink-0">Try:</span>
          {quickQuestions.map((qObj, idx) => {
            const promptStr = qObj[lang] || qObj.en;
            return (
              <button
                key={idx}
                onClick={() => {
                  setChatQuestion(promptStr);
                  handleAskAI(promptStr);
                }}
                className="text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-xl shrink-0 transition-all text-left truncate max-w-[260px]"
              >
                {promptStr}
              </button>
            );
          })}
        </div>

        {/* AI Answer Card */}
        {chatAnswer && (
          <div className="mt-4 p-4 rounded-2xl bg-blue-950/40 border border-blue-600/40 space-y-2">
            <div className="flex items-center justify-between border-b border-blue-900/60 pb-2">
              <span className="text-[10px] font-black uppercase text-blue-300 tracking-wide flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Saathi Welfare Advice ({answerSource === 'gemini-live' ? 'Live Gemini 1.5' : 'Intelligent Fallback'})
              </span>
            </div>
            <div className="text-xs text-blue-100 whitespace-pre-wrap leading-relaxed font-medium">
              {chatAnswer}
            </div>
          </div>
        )}
      </div>

      {/* Schemes List */}
      <div className="space-y-3.5">
        {displayedSchemes.map((scheme) => {
          const isExpanded = expandedSchemeId === scheme.id;
          return (
            <div
              key={scheme.id}
              className={`p-4 sm:p-5 rounded-3xl transition-all ${
                scheme.isMatched
                  ? 'bg-[#111827] border-2 border-blue-500/50 shadow-lg'
                  : 'bg-[#111827] border border-slate-800'
              }`}
            >
              <div 
                className="flex items-start justify-between gap-3 cursor-pointer select-none"
                onClick={() => setExpandedSchemeId(isExpanded ? null : scheme.id)}
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm sm:text-base font-black text-white">
                      {scheme.shortName}
                    </h4>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {scheme.category}
                    </span>
                    {scheme.isMatched && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center gap-1">
                        <Award className="w-3 h-3 text-blue-400" />
                        RECOMMENDED FOR YOU
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-amber-400 font-bold mt-1">
                    Coverage: {scheme.coverage}
                  </p>
                </div>

                <button
                  type="button"
                  className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white shrink-0 mt-1"
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-slate-800 space-y-3 text-xs leading-relaxed animate-fade-in">
                  
                  <p className="text-slate-300">
                    {scheme.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                      <span className="font-bold text-amber-400 block mb-1">
                        Who is Eligible:
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                        {scheme.eligibility.map((el, idx) => (
                          <li key={idx}>{el}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                      <span className="font-bold text-emerald-400 block mb-1">
                        Required Documents:
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                        {scheme.documents.map((doc, idx) => (
                          <li key={idx}>{doc}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Helpline: <strong className="text-white font-mono">{scheme.helpline}</strong></span>
                    </div>

                    <a
                      href={scheme.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 font-bold text-xs"
                    >
                      <span>Official Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
