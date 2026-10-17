'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Phone, 
  MapPin, 
  Bike, 
  Target, 
  ShieldCheck, 
  CheckCircle2, 
  Languages, 
  Download, 
  RotateCcw, 
  Save, 
  AlertCircle, 
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { clientStorage } from '@/lib/storage/clientStorage';
import { storageService } from '@/services/storageService';
import { getTranslation } from '@/lib/i18n/translations';
import { UserProfile, SupportedLanguage, WorkCategory } from '@/types';

const STATES = [
  'Delhi NCR', 'Maharashtra', 'Karnataka', 'Rajasthan', 'Uttar Pradesh', 
  'Punjab', 'Haryana', 'Tamil Nadu', 'Telangana', 'Gujarat', 'West Bengal', 'Kerala', 'Bihar'
];

const PLATFORMS = [
  'Swiggy', 'Zomato', 'Uber', 'Ola', 'Zepto', 'Blinkit', 'Rapido', 'Porter', 'Urban Company', 'Shadowfax'
];

const VEHICLE_TYPES = [
  'Petrol 2-Wheeler', 'EV Bike / Scooter', 'Auto Rickshaw', 'Cab / 4-Wheeler', 'Bicycle', 'Commercial Mini Truck'
];

const WORK_CATEGORIES: { id: WorkCategory; label: string }[] = [
  { id: 'delivery', label: 'Delivery Partner (Food / Grocery / E-comm)' },
  { id: 'driver', label: 'Driver (Cab / Taxi / Auto / Bus)' },
  { id: 'construction', label: 'Construction & Building Labor' },
  { id: 'daily_wage', label: 'Daily Wage / General Unorganised Labor' },
  { id: 'domestic', label: 'Domestic Worker / Home Services' },
  { id: 'freelance', label: 'Freelancer / Technician' },
  { id: 'other', label: 'Other Work' }
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(clientStorage.getProfile());
  const [isDemo, setIsDemo] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Delhi NCR');
  const [workCategory, setWorkCategory] = useState<WorkCategory>('delivery');
  const [primaryPlatform, setPrimaryPlatform] = useState('Swiggy');
  const [dailyGoal, setDailyGoal] = useState<number>(1100);
  const [monthlyGoal, setMonthlyGoal] = useState<number>(28000);
  const [preferredLanguage, setPreferredLanguage] = useState<SupportedLanguage>('en');

  // Emergency & Insurance
  const [emergencyContactName, setEmergencyContactName] = useState('Sunita Kumar (Spouse)');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('+91 98123 45678');
  const [hasEshram, setHasEshram] = useState(false);
  const [hasHealthCover, setHasHealthCover] = useState(false);

  useEffect(() => {
    const prof = clientStorage.getProfile();
    const legacyProf = storageService.getProfile();
    const demo = clientStorage.isDemoMode();

    setProfile(prof);
    setIsDemo(demo);

    setFullName(prof.fullName || legacyProf.name || 'Ramesh Kumar');
    setPhone(prof.phone || legacyProf.phone || '+91 98765 43210');
    setCity(prof.district || legacyProf.city || 'South Delhi');
    setState(prof.state || legacyProf.state || 'Delhi NCR');
    setWorkCategory(prof.workCategory || 'delivery');
    setPrimaryPlatform(prof.primaryPlatform || legacyProf.primaryPlatform || 'Swiggy');
    setDailyGoal(prof.dailyIncomeGoal || legacyProf.dailyEarningsTarget || 1100);
    setMonthlyGoal(prof.monthlyIncomeGoal || 28000);
    setPreferredLanguage(prof.preferredLanguage || 'en');

    if (legacyProf.emergencyContactName) setEmergencyContactName(legacyProf.emergencyContactName);
    if (legacyProf.emergencyContactPhone) setEmergencyContactPhone(legacyProf.emergencyContactPhone);
    if (typeof legacyProf.hasEshram === 'boolean') setHasEshram(legacyProf.hasEshram);
    if (typeof legacyProf.hasHealthCover === 'boolean') setHasHealthCover(legacyProf.hasHealthCover);

    setMounted(true);
  }, []);

  const lang: SupportedLanguage = preferredLanguage || 'en';
  const t = getTranslation(lang);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedProfile: UserProfile = {
      ...profile,
      fullName,
      phone,
      district: city,
      state,
      workCategory,
      primaryPlatform,
      dailyIncomeGoal: Number(dailyGoal) || 1000,
      monthlyIncomeGoal: Number(monthlyGoal) || 25000,
      preferredLanguage,
      updatedAt: new Date().toISOString()
    };

    // Save to clientStorage
    clientStorage.saveProfile(updatedProfile);
    clientStorage.setLanguage(preferredLanguage);

    // Save to legacy storageService
    storageService.saveProfile({
      name: fullName,
      phone,
      city,
      state,
      primaryPlatform,
      dailyEarningsTarget: Number(dailyGoal) || 1000,
      hasEshram,
      hasHealthCover,
      emergencyContactName,
      emergencyContactPhone
    });

    setProfile(updatedProfile);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleExportData = () => {
    const data = {
      profile: clientStorage.getProfile(),
      earnings: clientStorage.getEarnings(),
      grievances: clientStorage.getGrievances(),
      documents: clientStorage.getDocuments(),
      exportedAt: new Date().toISOString(),
      app: 'GigSaathi'
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gigsaathi-data-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetDemoData = () => {
    if (window.confirm('Reset all demo data (earnings, grievances, documents) back to factory default?')) {
      if (typeof window !== 'undefined') {
        localStorage.clear();
      }
      window.location.reload();
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-emerald-900/40">
                {fullName ? fullName.charAt(0).toUpperCase() : 'R'}
              </div>
              <div>
                <div className="inline-flex items-center space-x-1.5 bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider mb-1">
                  <span>{workCategory.replace('_', ' ')}</span>
                  <span>•</span>
                  <span>{primaryPlatform}</span>
                </div>
                <h1 className="text-2xl font-extrabold tracking-tight">
                  {fullName || 'Worker Profile'}
                </h1>
                <p className="text-xs text-slate-300 mt-0.5">
                  {phone} • {city}, {state}
                </p>
              </div>
            </div>

            {saveSuccess && (
              <div className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl flex items-center space-x-2 animate-fade-in shadow-md">
                <CheckCircle2 className="w-4 h-4" />
                <span>Profile Saved Successfully!</span>
              </div>
            )}
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Personal & Work Details */}
            <div className="space-y-6">
              {/* Card 1: Personal Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                    <User className="w-4 h-4 text-emerald-700" />
                    <span>Personal & Contact Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Mobile Phone (WhatsApp)</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">District / City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">State</label>
                      <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        {STATES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 2: Work & Platform Particulars */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                    <Bike className="w-4 h-4 text-emerald-700" />
                    <span>Work Sector & Primary Platform</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Work Category</label>
                    <select
                      value={workCategory}
                      onChange={(e) => setWorkCategory(e.target.value as WorkCategory)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {WORK_CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Primary Platform / App</label>
                    <select
                      value={primaryPlatform}
                      onChange={(e) => setPrimaryPlatform(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {PLATFORMS.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Targets, Protection & Settings */}
            <div className="space-y-6">
              {/* Card 3: Income Targets */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                    <Target className="w-4 h-4 text-emerald-700" />
                    <span>Earnings Target Goals</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Powers the daily and monthly goal progress meters on your dashboard.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Daily Target (₹)</label>
                      <input
                        type="number"
                        value={dailyGoal}
                        onChange={(e) => setDailyGoal(Number(e.target.value))}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Monthly Target (₹)</label>
                      <input
                        type="number"
                        value={monthlyGoal}
                        onChange={(e) => setMonthlyGoal(Number(e.target.value))}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 4: Welfare & Protection Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Welfare Schemes & Emergency</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <div>
                      <div className="font-bold text-slate-800">e-Shram Universal Card</div>
                      <div className="text-[11px] text-slate-500">Enables government social security cover</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setHasEshram(!hasEshram)}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                        hasEshram ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {hasEshram ? 'Registered' : 'Not Registered'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <div>
                      <div className="font-bold text-slate-800">Ayushman / Health Cover</div>
                      <div className="text-[11px] text-slate-500">₹5 Lakh cashless hospital protection</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setHasHealthCover(!hasHealthCover)}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                        hasHealthCover ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {hasHealthCover ? 'Active' : 'No Cover'}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Emergency Contact</label>
                      <input
                        type="text"
                        value={emergencyContactName}
                        onChange={(e) => setEmergencyContactName(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Emergency Phone</label>
                      <input
                        type="tel"
                        value={emergencyContactPhone}
                        onChange={(e) => setEmergencyContactPhone(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 5: App Language Preference */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                    <Languages className="w-4 h-4 text-emerald-700" />
                    <span>Preferred Interface Language</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { code: 'en', label: 'English' },
                      { code: 'hi', label: 'हिंदी (Hindi)' },
                      { code: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)' }
                    ].map((l) => (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => setPreferredLanguage(l.code as SupportedLanguage)}
                        className={`p-2.5 rounded-xl font-bold border text-xs transition-all ${
                          preferredLanguage === l.code
                            ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Form Submit Button */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <Button
              type="submit"
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-md flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Worker Profile</span>
            </Button>
          </div>
        </form>

        {/* Data & Privacy Actions */}
        <Card className="border-slate-200 mt-8">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-slate-900">
              {t.profile?.dataPrivacy || 'Data Privacy & Offline Retention'}
            </CardTitle>
            <CardDescription className="text-xs">
              All worker logs, shifts, and grievances are stored locally with zero unauthorized tracking.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3 text-xs">
            <button
              onClick={handleExportData}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl flex items-center space-x-2 transition-colors"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>{t.profile?.exportAllData || 'Export All Data (JSON)'}</span>
            </button>

            <button
              onClick={handleResetDemoData}
              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl border border-rose-200 flex items-center space-x-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-rose-600" />
              <span>{t.profile?.resetData || 'Reset Demo Data to Default'}</span>
            </button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
