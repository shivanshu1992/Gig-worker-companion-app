'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  AlertOctagon, 
  Send, 
  Sparkles, 
  Copy, 
  Download, 
  Share2, 
  Mic, 
  MicOff, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  History, 
  ExternalLink, 
  Scale, 
  Trash2, 
  PhoneCall, 
  ShieldCheck,
  FileCheck
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { clientStorage } from '@/lib/storage/clientStorage';
import { getTranslation } from '@/lib/i18n/translations';
import { GrievanceDraft, GrievanceTone, GrievanceCategory, SupportedLanguage } from '@/types';

const CATEGORIES = [
  'Damaged Parcel / Spilled Beverage Penalty',
  'Unpaid Rain & Peak Surge Incentive',
  'Wrongful Account Suspension / ID Block',
  'Unfair Customer Rating Strike',
  'Merchant Dispatch Delay Penalty',
  'Cash On Delivery (COD) Deposit Discrepancy'
];

const PLATFORMS = [
  'Swiggy', 'Zomato', 'Uber', 'Ola', 'Zepto', 'Blinkit', 'Rapido', 'Porter', 'Urban Company', 'Shadowfax'
];

function GrievancesContent() {
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState(clientStorage.getProfile());
  const [savedGrievances, setSavedGrievances] = useState<GrievanceDraft[]>([]);
  const [mounted, setMounted] = useState(false);

  // Form Fields
  const [platform, setPlatform] = useState<string>(searchParams.get('platform') || 'Swiggy');
  const [category, setCategory] = useState<string>(searchParams.get('category') || CATEGORIES[0]);
  const [amount, setAmount] = useState<string>(searchParams.get('amount') || '320');
  const [tripId, setTripId] = useState<string>(searchParams.get('tripId') || 'ORD-849201');
  const [incidentDate, setIncidentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [tone, setTone] = useState<GrievanceTone>('formal_assertive');
  const [userExplanation, setUserExplanation] = useState<string>('');

  // Audio / Speech-to-text
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  // AI Generation States
  const [isGenerating, setIsGenerating] = useState(false);
  const [draftResult, setDraftResult] = useState<{ subject: string; body: string } | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);

  useEffect(() => {
    const prof = clientStorage.getProfile();
    setProfile(prof);
    setSavedGrievances(clientStorage.getGrievances());
    setMounted(true);

    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setSpeechSupported(true);
    }

    // Prefill explanation if query param passed
    if (searchParams.get('tripId') && !userExplanation) {
      setUserExplanation(`Unfair penalty deduction for trip ${searchParams.get('tripId')}. Order was delivered on time and securely.`);
    }
  }, [searchParams]);

  const lang: SupportedLanguage = profile?.preferredLanguage || 'en';
  const t = getTranslation(lang);

  // Toggle Voice Recognition
  const handleToggleMic = () => {
    if (!speechSupported) return;

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setUserExplanation((prev) => (prev ? `${prev} ${transcript}` : transcript));
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  // Generate Structured AI Appeal
  const handleGenerateAppeal = async () => {
    setIsGenerating(true);
    const workerName = profile?.fullName || 'Ramesh Kumar';
    const workerPhone = profile?.phone || '+91 98765 43210';

    try {
      const res = await fetch('/api/ai/grievances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          platformOrEmployer: platform,
          disputedAmount: Number(amount) || 0,
          incidentDate,
          referenceIds: tripId,
          tone,
          language: lang,
          userExplanation: userExplanation || `Dispute for ${category} with penalty of ₹${amount}.`
        })
      });

      if (res.ok) {
        const data = await res.json();
        const subject = data.subjectLine || `Formal Dispute: ${category} (Order #${tripId})`;
        const body = data.draftContent || '';
        setDraftResult({ subject, body });

        // Save to persistent storage
        const saved = clientStorage.addGrievance({
          category: category as any,
          platformOrEmployer: platform,
          disputedAmount: Number(amount) || 0,
          incidentDate,
          referenceIds: tripId,
          language: lang,
          tone,
          subjectLine: subject,
          draftContent: body,
          status: 'draft'
        });
        setSavedGrievances(clientStorage.getGrievances());
      } else {
        throw new Error('API failed');
      }
    } catch {
      // Deterministic structured grievance fallback
      const subject = `Urgent Dispute Appeal: ${category} | Order ID: ${tripId || 'N/A'} (Amount: ₹${amount || '0'})`;
      const body = `To: Partner Grievance Redressal Desk, ${platform} India
Date: ${incidentDate}

Subject: ${subject}

Dear Partner Support & Redressal Team,

I am writing as an active registered partner (${workerName}, Contact: ${workerPhone}) to formally register an appeal against the deduction / penalty levied regarding ${category}.

CASE DETAILS:
• Platform: ${platform}
• Reference / Trip ID: ${tripId || 'N/A'}
• Disputed Amount: ₹${amount || '0'}
• Date of Incident: ${incidentDate}
• Worker Context: ${userExplanation || 'The issue was caused by external circumstances beyond driver control, including merchant packaging or weather conditions.'}

STATEMENT & REASONING:
I completed all assigned duties with utmost diligence adhering to safety guidelines. Platform GPS tracking and timestamp records confirm active participation on duty. Unilateral financial penalties without itemized evidence violate fair platform partner standards and Section 13 of the Motor Vehicle Aggregator Guidelines.

REQUESTED RESOLUTION:
I request immediate investigation into the dispatch records and full credit of ₹${amount || '0'} into my linked payout account within 48 hours.

Respectfully,
${workerName}
Partner ID / Mobile: ${workerPhone}
City: ${profile?.district || 'Mumbai'}, ${profile?.state || 'Maharashtra'}`;

      setDraftResult({ subject, body });

      clientStorage.addGrievance({
        category: category as any,
        platformOrEmployer: platform,
        disputedAmount: Number(amount) || 0,
        incidentDate,
        referenceIds: tripId,
        language: lang,
        tone,
        subjectLine: subject,
        draftContent: body,
        status: 'draft'
      });
      setSavedGrievances(clientStorage.getGrievances());
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(text);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    }
  };

  const handleShareWhatsApp = () => {
    if (!draftResult) return;
    const text = encodeURIComponent(`*${draftResult.subject}*\n\n${draftResult.body}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleDownloadTxt = () => {
    if (!draftResult) return;
    const content = `${draftResult.subject}\n\n${draftResult.body}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Grievance-${tripId || 'Appeal'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteGrievance = (id: string) => {
    clientStorage.deleteGrievance(id);
    setSavedGrievances(clientStorage.getGrievances());
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-rose-500/20 border border-rose-400/30 text-rose-300 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
              <AlertOctagon className="w-4 h-4 text-rose-400" />
              <span>Grievance & Dispute Drafter</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t.grievances?.title || 'AI Grievance & Dispute Drafter'}
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              {t.grievances?.subtitle || 'Generate firm, professional complaints referencing platform terms and Indian labor protections in seconds.'}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl flex items-center space-x-3 text-xs shrink-0">
            <Scale className="w-5 h-5 text-emerald-400" />
            <div>
              <div className="text-slate-300 font-medium">Statutory Protection:</div>
              <div className="font-bold text-white">MoRTH & Labor Codes</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Columns: Grievance Wizard Form */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold text-slate-900">
                Dispute Ticket Details
              </CardTitle>
              <CardDescription className="text-xs">
                Provide specifics of the unfair deduction or rating strike.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 text-xs">
              {/* Platform Selector */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {t.grievances?.platformLabel || 'Aggregator Platform'}
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {t.grievances?.categoryLabel || 'Issue Category'}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Disputed Amount & Reference ID */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {t.grievances?.amountLabel || 'Disputed Amount (₹)'}
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 320"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {t.grievances?.refIdLabel || 'Order / Trip ID'}
                  </label>
                  <input
                    type="text"
                    value={tripId}
                    onChange={(e) => setTripId(e.target.value)}
                    placeholder="ORD-849201"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              {/* Incident Date & Tone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {t.grievances?.incidentDateLabel || 'Date of Incident'}
                  </label>
                  <input
                    type="date"
                    value={incidentDate}
                    onChange={(e) => setIncidentDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {t.grievances?.toneLabel || 'Appeal Tone'}
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value as GrievanceTone)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="formal_assertive">Formal & Assertive</option>
                    <option value="polite_cooperative">Polite & Cooperative</option>
                    <option value="urgent_legal">Urgent / Statutory Notice</option>
                  </select>
                </div>
              </div>

              {/* Voice-supported Explanation */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">
                    {t.grievances?.detailsLabel || 'What happened? (Simple Words)'}
                  </label>
                  {speechSupported && (
                    <button
                      type="button"
                      onClick={handleToggleMic}
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-lg flex items-center space-x-1 transition-colors ${
                        isListening
                          ? 'bg-rose-600 text-white animate-pulse'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                      <span>{isListening ? 'Listening...' : 'Voice Input'}</span>
                    </button>
                  )}
                </div>
                <textarea
                  rows={3}
                  value={userExplanation}
                  onChange={(e) => setUserExplanation(e.target.value)}
                  placeholder="Explain why the deduction was unfair (e.g. restaurant delayed packing, thunderstorm, customer didn't pick call)..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <Button
                onClick={handleGenerateAppeal}
                disabled={isGenerating}
                fullWidth
                className="mt-2 bg-rose-600 hover:bg-rose-700 flex items-center justify-center space-x-2 shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-rose-200" />
                <span>{isGenerating ? (t.grievances?.generating || 'Drafting Appeal...') : (t.grievances?.generateBtn || 'Draft Formal Grievance with AI')}</span>
              </Button>
            </CardContent>
          </Card>

          {/* Official Escalation Contacts */}
          <Card className="bg-slate-50 border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                <PhoneCall className="w-4 h-4 text-emerald-700" />
                <span>{t.grievances?.escalationContactsTitle || 'Official Escalation Desks'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-xl">
                <div>
                  <div className="font-bold text-slate-800">National Consumer Helpline</div>
                  <div className="text-[11px] text-slate-500">Free redressal for digital service disputes</div>
                </div>
                <a href="tel:1915" className="px-2.5 py-1 bg-emerald-50 text-emerald-800 font-bold rounded-lg border border-emerald-200">
                  1915
                </a>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-xl">
                <div>
                  <div className="font-bold text-slate-800">State Gig Worker Board Tribunal</div>
                  <div className="text-[11px] text-slate-500">Statutory dispute settlement forum</div>
                </div>
                <a href="tel:14434" className="px-2.5 py-1 bg-blue-50 text-blue-800 font-bold rounded-lg border border-blue-200">
                  14434
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 7 Columns: Drafted Grievance Display & Export */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="border-rose-200">
            <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base text-slate-900 font-bold">
                  {draftResult ? 'Drafted Formal Appeal' : 'Appeal Preview'}
                </CardTitle>
                <CardDescription className="text-xs">
                  {draftResult ? 'Ready to send to partner support & labor tribunal' : 'Complete details on the left to generate legal appeal'}
                </CardDescription>
              </div>

              {draftResult && (
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => handleCopy(`${draftResult.subject}\n\n${draftResult.body}`)}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    title={t.grievances?.copyDraft || 'Copy appeal text'}
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleShareWhatsApp}
                    className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors"
                    title={t.grievances?.whatsappShare || 'Share via WhatsApp'}
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleDownloadTxt}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    title={t.grievances?.downloadDraft || 'Download text file'}
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              )}
            </CardHeader>

            <CardContent className="pt-4">
              {draftResult ? (
                <div className="space-y-3">
                  <div className="p-3 bg-slate-100 rounded-xl font-bold text-xs text-slate-900 border border-slate-200">
                    {draftResult.subject}
                  </div>
                  <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl font-mono text-xs whitespace-pre-wrap leading-relaxed max-h-[480px] overflow-y-auto">
                    {draftResult.body}
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 space-y-3">
                  <AlertOctagon className="w-12 h-12 text-slate-300 mx-auto" />
                  <div className="text-slate-600 font-semibold text-sm">No appeal drafted yet</div>
                  <p className="text-slate-400 text-xs max-w-sm mx-auto">
                    Select your platform and issue category, then click "Draft Formal Grievance with AI".
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Grievance History List */}
          {savedGrievances.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                  <History className="w-4 h-4 text-slate-500" />
                  <span>Previous Grievances ({savedGrievances.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {savedGrievances.slice(0, 3).map((g) => (
                  <div
                    key={g.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-800">{g.subjectLine}</div>
                      <div className="text-slate-400 text-[11px]">
                        {g.platformOrEmployer} • ₹{g.disputedAmount} • {new Date(g.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => setDraftResult({ subject: g.subjectLine, body: g.draftContent })}
                        className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteGrievance(g.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GrievancesPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="p-8 text-center text-slate-500 text-sm">Loading Grievance Drafter...</div>}>
        <GrievancesContent />
      </Suspense>
    </AppShell>
  );
}
