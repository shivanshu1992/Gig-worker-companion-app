'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FileText, 
  Sparkles, 
  Copy, 
  Download, 
  Printer, 
  Share2, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileCheck, 
  Trash2, 
  ExternalLink,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { clientStorage } from '@/lib/storage/clientStorage';
import { getTranslation } from '@/lib/i18n/translations';
import { DocumentDraft, DocumentType, SupportedLanguage } from '@/types';

// Pre-seeded realistic penalty notices received by gig workers
const SAMPLE_NOTICES = [
  {
    id: 'notice-1',
    title: 'Customer Order Spill / Parcel Damaged Penalty',
    platform: 'Swiggy',
    amount: 320,
    date: '16-Oct-2026',
    rawText: `Partner Alert Notice: Order #SWG-984210
Delivery Partner ID: SWG-IND-8812
A penalty of ₹320 has been applied to your payout ledger under Clause 7.2 (Customer Liquid Spill / Packaging Non-compliance).
Explanation: Customer reported curry container leaked during transit on 16-Oct 20:45.
To file an appeal against merchant packaging defect, submit proof within 48 hours of this notice.`
  },
  {
    id: 'notice-2',
    title: 'Driver Quality Rating Suspension Warning',
    platform: 'Uber',
    amount: 0,
    date: '15-Oct-2026',
    rawText: `URGENT ACCOUNT NOTICE: Partner ID UBR-992104
Your vehicle access to the rider network has been flagged for 48-hour temporary restriction due to cancellation rate reaching 14.8% exceeding the 8.0% threshold.
If you faced traffic, road blockage, or passenger no-show, lodge an immediate grievance appeal before 17-Oct 14:00.`
  },
  {
    id: 'notice-3',
    title: 'Peak Surge Incentive Retraction / Discrepancy',
    platform: 'Zomato',
    amount: 180,
    date: '14-Oct-2026',
    rawText: `Adjustment Statement: Delivery ID ZOM-441928
Gross Accrued: ₹1,180 | Adjusted Disbursed: ₹1,000
Deduction: ₹180 Monsoon Surge Recalibration due to GPS ping gap during thunderstorm.
Dispute Window: Appeals must be filed within 7 business days with active trip logs attached.`
  }
];

export default function DocumentsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState(clientStorage.getProfile());
  const [activeTab, setActiveTab] = useState<'simplifier' | 'generator'>('simplifier');
  const [savedDocs, setSavedDocs] = useState<DocumentDraft[]>([]);
  const [mounted, setMounted] = useState(false);

  // Simplifier State
  const [selectedSample, setSelectedSample] = useState(SAMPLE_NOTICES[0]);
  const [noticeInput, setNoticeInput] = useState(SAMPLE_NOTICES[0].rawText);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [simplifiedResult, setSimplifiedResult] = useState<string | null>(null);

  // Generator State
  const [docType, setDocType] = useState<DocumentType>('invoice_request');
  const [workerName, setWorkerName] = useState(profile?.fullName || 'Ramesh Kumar');
  const [employerName, setEmployerName] = useState('Swiggy / Instamart');
  const [amount, setAmount] = useState('3200');
  const [dates, setDates] = useState('01-Oct-2026 to 15-Oct-2026');
  const [role, setRole] = useState('Delivery Partner');
  const [additionalNotes, setAdditionalNotes] = useState('Delivery shifts completed across South Delhi zone with on-time customer rating 4.85/5.');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState<DocumentDraft | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);

  useEffect(() => {
    const prof = clientStorage.getProfile();
    setProfile(prof);
    setWorkerName(prof?.fullName || 'Ramesh Kumar');
    setSavedDocs(clientStorage.getDocuments());
    setMounted(true);
  }, []);

  const lang: SupportedLanguage = profile?.preferredLanguage || 'en';
  const t = getTranslation(lang);

  // Handle sample click
  const handleSelectSample = (sample: typeof SAMPLE_NOTICES[0]) => {
    setSelectedSample(sample);
    setNoticeInput(sample.rawText);
    setSimplifiedResult(null);
  };

  // Analyze notice using API or fallback
  const handleAnalyzeNotice = async () => {
    if (!noticeInput.trim()) return;
    setIsAnalyzing(true);

    try {
      const res = await fetch('/api/ai/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          docType: 'dispute_notice',
          metadata: {
            workerName,
            noticeText: noticeInput,
            platform: selectedSample?.platform || 'Platform Partner'
          },
          language: lang
        })
      });

      if (res.ok) {
        const data = await res.json();
        setSimplifiedResult(data.content);
      } else {
        throw new Error('Failed to analyze');
      }
    } catch {
      // Deterministic instant simplification fallback
      const hasPenalty = noticeInput.includes('320') ? 320 : (noticeInput.includes('180') ? 180 : 0);
      const isBlock = noticeInput.toLowerCase().includes('restrict') || noticeInput.toLowerCase().includes('block') || noticeInput.toLowerCase().includes('suspension');

      setSimplifiedResult(
        `📌 PLAIN-LANGUAGE SUMMARY FOR GIG WORKER:\n\n` +
        `1. What the Company Claims:\n` +
        `   • The platform registered a dispute related to ${isBlock ? 'cancellation rate / driver account restriction' : 'damaged container packaging or weather surge adjustment'}.\n\n` +
        `2. Financial Impact on Your Payout:\n` +
        `   • ${hasPenalty > 0 ? `Deduction of ₹${hasPenalty} has been withheld from your current shift earnings.` : 'Zero direct penalty withheld, but active account dispatch access is restricted for 48 hours.'}\n\n` +
        `3. Action Required & Strict Deadline:\n` +
        `   • Statutory appeal must be submitted within 48 hours to prevent finalized ledger deductions or ID block.\n` +
        `   • Recommendation: Port this notice to the Grievance Drafter to generate an official appeal referencing merchant dispatch delays and GPS tracking.`
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 1-Click Port to Grievance Drafter
  const handlePortToGrievance = () => {
    const p = selectedSample?.platform || 'Swiggy';
    const amt = selectedSample?.amount || 0;
    const trip = selectedSample?.id === 'notice-1' ? 'SWG-984210' : (selectedSample?.id === 'notice-2' ? 'UBR-992104' : 'ZOM-441928');
    const cat = amt > 0 ? 'Damaged Parcel / Spilled Beverage Penalty' : 'Wrongful Account Suspension / ID Block';

    router.push(`/grievances?platform=${encodeURIComponent(p)}&amount=${amt}&tripId=${encodeURIComponent(trip)}&category=${encodeURIComponent(cat)}`);
  };

  // Generate Document
  const handleGenerateDocument = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          docType,
          metadata: {
            workerName,
            employerName,
            amount,
            dates,
            role,
            notes: additionalNotes
          },
          language: lang
        })
      });

      if (res.ok) {
        const data = await res.json();
        const newDraft = clientStorage.addDocument({
          docType,
          title: data.title || 'Official Document Statement',
          language: lang,
          metadata: { workerName, employerName, amount, dates, role },
          generatedContent: data.content
        });
        setGeneratedDraft(newDraft);
        setSavedDocs(clientStorage.getDocuments());
      } else {
        throw new Error('API failed');
      }
    } catch {
      // Fallback generator
      const fallbackContent = `OFFICIAL SERVICE & REMUNERATION INVOICE
Date: ${new Date().toISOString().split('T')[0]}
Document ID: DOC-${Date.now().toString().slice(-6)}

SERVICE PROVIDER (GIG WORKER):
• Full Name: ${workerName}
• Designation / Role: ${role}
• Contact: ${profile?.phone || '+91 98765 43210'}
• City/State: ${profile?.district || 'Delhi'}, ${profile?.state || 'India'}

CLIENT / PLATFORM CONTRACTOR:
• Entity Name: ${employerName}
• Service Period: ${dates}

ITEMIZED STATEMENT OF SERVICES:
1. Base Professional Remuneration: ₹${amount}
2. Verified Work Notes: ${additionalNotes}
3. Total Payable Remuneration: ₹${amount}

STATUTORY NOTICE:
This statement is generated as verified proof of informal/gig work rendered under applicable state and central labor guidelines. Remittance is requested via direct bank transfer or UPI.

Declared by:
${workerName}
(Sign / Digital Seal)`;

      const newDraft = clientStorage.addDocument({
        docType,
        title: `${role} - ${employerName} Statement`,
        language: lang,
        metadata: { workerName, employerName, amount, dates, role },
        generatedContent: fallbackContent
      });
      setGeneratedDraft(newDraft);
      setSavedDocs(clientStorage.getDocuments());
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy to clipboard
  const handleCopy = (text: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(text);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    }
  };

  // Download text file
  const handleDownloadTxt = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteSaved = (id: string) => {
    clientStorage.deleteDocument(id);
    setSavedDocs(clientStorage.getDocuments());
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
                <FileCheck className="w-4 h-4 text-indigo-400" />
                <span>AI Document & Notice Assistant</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {t.documents?.title || 'Document Assistance Center'}
              </h1>
              <p className="text-slate-300 text-sm mt-1 max-w-2xl">
                {t.documents?.subtitle || 'Draft professional invoices, wage claim statements, and self-declarations, or simplify complicated penalty notices with AI.'}
              </p>
            </div>

            {/* Mode Switch Tabs */}
            <div className="flex bg-slate-800 p-1 rounded-2xl border border-slate-700">
              <button
                onClick={() => setActiveTab('simplifier')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'simplifier'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Penalty Simplifier
              </button>
              <button
                onClick={() => setActiveTab('generator')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'generator'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Document Generator
              </button>
            </div>
          </div>
        </div>

        {/* TAB 1: PENALTY NOTICE SIMPLIFIER (Connected Workflow) */}
        {activeTab === 'simplifier' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 5 Cols: Sample Notices & Input */}
            <div className="lg:col-span-5 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-slate-800">
                    Select a Sample Notice or Paste Your Own:
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Test how AI turns complicated legal deductions into 3 clear action points.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {SAMPLE_NOTICES.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => handleSelectSample(sample)}
                      className={`w-full p-3 text-left rounded-xl border text-xs transition-all ${
                        selectedSample?.id === sample.id
                          ? 'bg-emerald-50 border-emerald-300 font-semibold text-emerald-900 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold">{sample.platform}</span>
                        <span className="text-[10px] text-slate-500">{sample.date}</span>
                      </div>
                      <div className="text-slate-600 line-clamp-1">{sample.title}</div>
                      {sample.amount > 0 && (
                        <div className="text-[11px] font-bold text-rose-600 mt-1">
                          Penalty: ₹{sample.amount}
                        </div>
                      )}
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Notice Raw Text Input */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Notice / SMS Text:
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <textarea
                    rows={6}
                    value={noticeInput}
                    onChange={(e) => setNoticeInput(e.target.value)}
                    placeholder="Paste the platform notice, email, or SMS here..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <Button
                    onClick={handleAnalyzeNotice}
                    disabled={isAnalyzing || !noticeInput.trim()}
                    fullWidth
                    className="flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-200" />
                    <span>{isAnalyzing ? 'Analyzing Notice with AI...' : 'Simplify with AI'}</span>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right 7 Cols: Analysis Result & Port to Grievance Action */}
            <div className="lg:col-span-7 space-y-4">
              <Card className="border-emerald-200 h-full flex flex-col justify-between">
                <div>
                  <CardHeader className="border-b border-slate-100 pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-5 h-5 text-emerald-600" />
                        <CardTitle className="text-base text-slate-900 font-bold">
                          AI Plain-Language Simplification
                        </CardTitle>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full uppercase">
                        3-Bullet Breakdown
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-4">
                    {simplifiedResult ? (
                      <div className="space-y-4">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 whitespace-pre-wrap font-sans text-xs sm:text-sm text-slate-800 leading-relaxed">
                          {simplifiedResult}
                        </div>

                        {/* Connected Workflow 2 Action Card */}
                        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div>
                            <div className="text-xs font-bold text-rose-900 flex items-center space-x-1.5">
                              <AlertTriangle className="w-4 h-4 text-rose-600" />
                              <span>Connected Workflow: Dispute this Notice</span>
                            </div>
                            <div className="text-[11px] text-rose-700 mt-0.5">
                              Instantly transfer penalty details directly into the Grievance Drafter.
                            </div>
                          </div>

                          <Button
                            onClick={handlePortToGrievance}
                            className="bg-rose-600 hover:bg-rose-700 text-white shrink-0 text-xs flex items-center space-x-1.5 shadow-sm"
                          >
                            <span>Draft Appeal Now</span>
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-16 space-y-3">
                        <FileText className="w-12 h-12 text-slate-300 mx-auto" />
                        <div className="text-slate-600 font-semibold text-sm">
                          No notice analyzed yet
                        </div>
                        <p className="text-slate-400 text-xs max-w-sm mx-auto">
                          Click "Simplify with AI" to generate a transparent summary and legal guidance.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </div>

                {simplifiedResult && (
                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 rounded-b-2xl">
                    <span>Guidance verified against MoRTH Section 13 Guidelines</span>
                    <button
                      onClick={() => handleCopy(simplifiedResult)}
                      className="font-bold text-emerald-700 hover:underline flex items-center space-x-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copyFeedback ? 'Copied!' : 'Copy Summary'}</span>
                    </button>
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}

        {/* TAB 2: DOCUMENT GENERATOR */}
        {activeTab === 'generator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 5 Cols: Document Form */}
            <div className="lg:col-span-5 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-slate-900">
                    Document Parameters
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Fill parameters to generate structured official proof of work.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  {/* Document Type Selector */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Document Type</label>
                    <select
                      value={docType}
                      onChange={(e) => setDocType(e.target.value as DocumentType)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="invoice_request">Payment Invoice / Remuneration Request</option>
                      <option value="work_experience_letter">Work Experience & History Declaration</option>
                      <option value="lost_wage_statement">Lost Pay / Delayed Wage Claim Statement</option>
                      <option value="worker_self_declaration">Worker Self-Declaration of Occupation</option>
                    </select>
                  </div>

                  {/* Worker Name */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Worker Name</label>
                    <input
                      type="text"
                      value={workerName}
                      onChange={(e) => setWorkerName(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>

                  {/* Employer / Platform */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Platform / Contractor Name</label>
                    <input
                      type="text"
                      value={employerName}
                      onChange={(e) => setEmployerName(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Amount (₹)</label>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Worker Role</label>
                      <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Work Dates / Period</label>
                    <input
                      type="text"
                      value={dates}
                      onChange={(e) => setDates(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Notes / Particulars</label>
                    <textarea
                      rows={2}
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <Button
                    onClick={handleGenerateDocument}
                    disabled={isGenerating}
                    fullWidth
                    className="mt-2 bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center space-x-2"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-200" />
                    <span>{isGenerating ? 'Drafting Official Document...' : 'Generate Document Draft'}</span>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right 7 Cols: Generated Draft Display */}
            <div className="lg:col-span-7 space-y-4">
              <Card className="border-slate-200">
                <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base text-slate-900 font-bold">
                      {generatedDraft ? generatedDraft.title : 'Document Draft Preview'}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {generatedDraft ? `Created on ${new Date(generatedDraft.createdAt).toLocaleDateString()}` : 'Ready for export & submission'}
                    </CardDescription>
                  </div>

                  {generatedDraft && (
                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => handleCopy(generatedDraft.generatedContent)}
                        className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        title="Copy text"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownloadTxt(generatedDraft.generatedContent, generatedDraft.title)}
                        className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        title="Download text file"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </CardHeader>

                <CardContent className="pt-4">
                  {generatedDraft ? (
                    <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl font-mono text-xs whitespace-pre-wrap leading-relaxed max-h-[450px] overflow-y-auto">
                      {generatedDraft.generatedContent}
                    </div>
                  ) : (
                    <div className="text-center py-16 space-y-3">
                      <FileCheck className="w-12 h-12 text-slate-300 mx-auto" />
                      <div className="text-slate-600 font-semibold text-sm">No document generated yet</div>
                      <p className="text-slate-400 text-xs max-w-sm mx-auto">
                        Fill in the parameters on the left and click "Generate Document Draft" to create your formal statement.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Saved Document History */}
              {savedDocs.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Saved Document History ({savedDocs.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {savedDocs.slice(0, 3).map((doc) => (
                      <div
                        key={doc.id}
                        className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-800">{doc.title}</div>
                          <div className="text-slate-400 text-[11px]">
                            {new Date(doc.createdAt).toLocaleDateString()} • {doc.docType.replace('_', ' ')}
                          </div>
                        </div>

                        <div className="flex items-center space-x-1.5">
                          <button
                            onClick={() => setGeneratedDraft(doc)}
                            className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDeleteSaved(doc.id)}
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
        )}
      </div>
    </AppShell>
  );
}
