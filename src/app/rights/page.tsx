'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Scale, 
  Search, 
  ShieldCheck, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  Building2, 
  HeartPulse, 
  Landmark, 
  PhoneCall, 
  Volume2, 
  VolumeX, 
  ChevronDown, 
  ChevronUp, 
  UserCheck, 
  AlertCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { VERIFIED_SCHEMES, WORKER_RIGHTS_SUMMARY } from '@/lib/knowledge/schemesData';
import { clientStorage } from '@/lib/storage/clientStorage';
import { getTranslation } from '@/lib/i18n/translations';
import { SupportedLanguage, WelfareScheme } from '@/types';

export default function RightsPage() {
  const [profile, setProfile] = useState(clientStorage.getProfile());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedSchemeId, setExpandedSchemeId] = useState<string | null>('e-shram');
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setProfile(clientStorage.getProfile());
    setMounted(true);
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const lang: SupportedLanguage = profile?.preferredLanguage || 'en';
  const t = getTranslation(lang);

  // Category filter tabs
  const categories = [
    { id: 'all', label: t.rights?.filterAll || 'All Schemes' },
    { id: 'central', label: t.rights?.filterCentral || 'Central Schemes' },
    { id: 'state', label: t.rights?.filterState || 'State Acts' },
    { id: 'pension', label: t.rights?.filterPension || 'Pension' },
    { id: 'healthcare', label: t.rights?.filterHealthcare || 'Healthcare' },
    { id: 'social_security', label: t.rights?.filterSocialSecurity || 'Social Security' },
    { id: 'board', label: t.rights?.filterBoards || 'Welfare Boards' }
  ];

  // Match evaluation based on worker profile
  const isSchemeMatched = (scheme: WelfareScheme): boolean => {
    if (!profile) return true;
    const userState = (profile.state || '').toLowerCase();
    const schemeState = (scheme.stateApplicability || '').toLowerCase();

    // State specific check
    if (schemeState !== 'all india' && !schemeState.includes('all india')) {
      if (userState && schemeState.includes(userState)) {
        return true;
      }
    }

    // Category / role check
    const lowerBeneficiaries = scheme.intendedBeneficiaries.toLowerCase();
    if (profile.workCategory === 'delivery' && (lowerBeneficiaries.includes('delivery') || lowerBeneficiaries.includes('gig'))) {
      return true;
    }
    if (profile.workCategory === 'driver' && (lowerBeneficiaries.includes('driver') || lowerBeneficiaries.includes('cab'))) {
      return true;
    }
    if (profile.workCategory === 'construction' && (lowerBeneficiaries.includes('construction') || lowerBeneficiaries.includes('labor'))) {
      return true;
    }

    // Central universal schemes always match
    if (scheme.category === 'central' || scheme.id === 'e-shram' || scheme.id === 'pmsby') {
      return true;
    }

    return false;
  };

  // Filter schemes by category and search
  const filteredSchemes = useMemo(() => {
    return VERIFIED_SCHEMES.filter((scheme) => {
      const matchCat = selectedCategory === 'all' || scheme.category === selectedCategory;
      if (!matchCat) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const name = (scheme.officialName || '').toLowerCase();
      const nameHi = (scheme.nameHi || '').toLowerCase();
      const desc = (scheme.plainDescription || '').toLowerCase();
      const descHi = (scheme.plainDescriptionHi || '').toLowerCase();
      const benefits = scheme.verifiedBenefits.join(' ').toLowerCase();

      return name.includes(q) || nameHi.includes(q) || desc.includes(q) || descHi.includes(q) || benefits.includes(q);
    });
  }, [selectedCategory, searchQuery]);

  // Audio Read Aloud helper
  const handleToggleSpeak = (scheme: WelfareScheme) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (speakingId === scheme.id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    setSpeakingId(scheme.id);

    const speechText = lang === 'hi' && scheme.plainDescriptionHi
      ? `${scheme.nameHi || scheme.officialName}। ${scheme.plainDescriptionHi}। लाभ: ${scheme.verifiedBenefits.join(', ')}`
      : `${scheme.officialName}. ${scheme.plainDescription}. Benefits: ${scheme.verifiedBenefits.join(', ')}`;

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    window.speechSynthesis.speak(utterance);
  };

  const toggleExpand = (id: string) => {
    setExpandedSchemeId(expandedSchemeId === id ? null : id);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="inline-flex items-center space-x-2 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{t.rights?.verifiedBadge || 'Government Verified Directory'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {t.rights?.title || 'Worker Rights & Welfare Schemes'}
              </h1>
              <p className="text-slate-300 text-sm mt-1 max-w-2xl">
                {t.rights?.subtitle || 'Search verified central & state welfare benefits, insurance, and labor boards matched to your work.'}
              </p>
            </div>

            {/* Profile Context Pill */}
            {mounted && profile && (
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl flex items-center space-x-3 text-xs shrink-0">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/30 flex items-center justify-center text-emerald-300">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-slate-300 font-medium">Matched Profile:</div>
                  <div className="font-bold text-white capitalize">
                    {profile.workCategory || 'Gig Worker'} • {profile.state || 'India'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.rights?.searchPlaceholder || 'Search schemes by name, keyword, or benefit...'}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Schemes List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {filteredSchemes.length} Verified Schemes Available
            </span>
            <Link
              href="/assistant"
              className="text-xs font-semibold text-emerald-700 hover:underline flex items-center space-x-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI Scheme Advisor</span>
            </Link>
          </div>

          {filteredSchemes.length === 0 ? (
            <Card className="text-center py-12">
              <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 font-semibold text-sm">No schemes found matching &ldquo;{searchQuery}&rdquo;</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="mt-3"
              >
                Reset Filters
              </Button>
            </Card>
          ) : (
            filteredSchemes.map((scheme) => {
              const isMatched = isSchemeMatched(scheme);
              const isExpanded = expandedSchemeId === scheme.id;
              const isSpeaking = speakingId === scheme.id;

              return (
                <div
                  key={scheme.id}
                  className={`bg-white border rounded-2xl transition-all overflow-hidden ${
                    isMatched ? 'border-emerald-200 shadow-sm' : 'border-slate-200'
                  }`}
                >
                  {/* Scheme Summary Header */}
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                            scheme.category === 'central'
                              ? 'bg-blue-100 text-blue-800'
                              : scheme.category === 'state'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {scheme.category.replace('_', ' ')}
                          </span>

                          {isMatched && (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <Sparkles className="w-3 h-3 text-emerald-600" />
                              <span>{t.rights?.eligibilityBadge || 'Matched to Profile'}</span>
                            </span>
                          )}

                          <span className="text-xs text-slate-400 font-medium">
                            • {scheme.stateApplicability}
                          </span>
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                          {lang === 'hi' && scheme.nameHi ? scheme.nameHi : scheme.officialName}
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {lang === 'hi' && scheme.plainDescriptionHi ? scheme.plainDescriptionHi : scheme.plainDescription}
                        </p>
                      </div>

                      {/* Header Actions */}
                      <div className="flex items-center space-x-2 shrink-0 sm:self-start">
                        {/* Audio Listen Button */}
                        <button
                          onClick={() => handleToggleSpeak(scheme)}
                          title="Listen to scheme summary aloud"
                          className={`p-2 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
                            isSpeaking
                              ? 'bg-emerald-700 text-white border-emerald-700 animate-pulse'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                          <span className="text-[11px] hidden sm:inline">{isSpeaking ? 'Stop' : 'Listen'}</span>
                        </button>

                        {/* Expand / Collapse Button */}
                        <button
                          onClick={() => toggleExpand(scheme.id)}
                          className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                          aria-label="Expand Scheme Details"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Verified Benefits Highlights */}
                    <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-2">
                      {scheme.verifiedBenefits.slice(0, isExpanded ? scheme.verifiedBenefits.length : 2).map((benefit, idx) => (
                        <div key={idx} className="flex items-start space-x-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>

                    {/* Expanded Details Body */}
                    {isExpanded && (
                      <div className="mt-5 pt-5 border-t border-slate-200 space-y-4 animate-fade-in text-xs">
                        {/* Eligibility Criteria */}
                        <div className="bg-slate-50 p-4 rounded-xl space-y-2">
                          <div className="font-bold text-slate-800 flex items-center space-x-2">
                            <UserCheck className="w-4 h-4 text-emerald-700" />
                            <span>Eligibility Criteria:</span>
                          </div>
                          <ul className="list-disc pl-5 space-y-1 text-slate-600">
                            {scheme.eligibilityCriteria.map((c, i) => (
                              <li key={i}>{c}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Required Documents */}
                        <div className="bg-slate-50 p-4 rounded-xl space-y-2">
                          <div className="font-bold text-slate-800 flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-blue-700" />
                            <span>Required Documents:</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {scheme.requiredDocuments.map((doc, i) => (
                              <span key={i} className="bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-slate-700 font-medium">
                                {doc}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Application Procedure */}
                        <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-1.5">
                          <div className="font-bold text-emerald-900">How to Apply:</div>
                          <p className="text-emerald-800 leading-relaxed">{scheme.applicationProcedure}</p>
                        </div>

                        {/* Links & Actions */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                          <div className="text-[11px] text-slate-400">
                            Verified Source: <a href={scheme.officialSourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-600">{scheme.officialSourceUrl}</a>
                          </div>

                          <div className="flex items-center space-x-2">
                            {scheme.applicationUrl && (
                              <a
                                href={scheme.applicationUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-sm transition-colors"
                              >
                                <span>{t.rights?.applyOnline || 'Official Portal'}</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                            <Link
                              href={`/assistant?q=${encodeURIComponent('Tell me step by step how to apply for ' + scheme.officialName)}`}
                              className="inline-flex items-center space-x-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-semibold text-xs transition-colors"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                              <span>Ask AI Guide</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Summary of Core Worker Legal Rights */}
        <div className="mt-8 space-y-4">
          <div className="flex items-center space-x-2">
            <Scale className="w-5 h-5 text-emerald-700" />
            <h2 className="text-lg font-bold text-slate-900">
              {lang === 'hi' ? 'प्रमुख श्रमिक कानूनी सुरक्षाएं' : 'Fundamental Workplace Legal Protections'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {WORKER_RIGHTS_SUMMARY.map((right, idx) => (
              <Card key={idx} className="border-slate-200">
                <CardHeader className="mb-2">
                  <CardTitle className="text-base text-slate-900 font-bold">
                    {lang === 'hi' && right.titleHi ? right.titleHi : right.title}
                  </CardTitle>
                  <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
                    {right.source}
                  </span>
                </CardHeader>
                <CardContent className="text-xs text-slate-600 leading-relaxed">
                  {right.description}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Emergency & Helpline Quick Directory */}
        <Card className="bg-slate-900 text-white border-slate-800 p-6 rounded-3xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
                <PhoneCall className="w-4 h-4" />
                <span>Worker Emergency & Grievance Hotlines</span>
              </div>
              <h3 className="text-lg font-bold">Have a dispute or need immediate government help?</h3>
              <p className="text-slate-400 text-xs mt-1">Free toll-free assistance services operational across India.</p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <a
                href="tel:14434"
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl font-bold flex items-center space-x-1.5"
              >
                <span>e-Shram: 14434</span>
              </a>
              <a
                href="tel:1915"
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl font-bold flex items-center space-x-1.5"
              >
                <span>Consumer Desk: 1915</span>
              </a>
              <Link
                href="/safety"
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center space-x-1.5 shadow-sm"
              >
                <span>Police/Ambulance: 112</span>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
