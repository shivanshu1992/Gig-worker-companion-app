'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  Languages, 
  Briefcase, 
  MapPin, 
  Target, 
  ArrowRight, 
  Check, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { SupportedLanguage, WorkCategory } from '@/types';
import { clientStorage } from '@/lib/storage/clientStorage';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Form states
  const [preferredLanguage, setPreferredLanguage] = useState<SupportedLanguage>('en');
  const [workCategory, setWorkCategory] = useState<WorkCategory>('delivery');
  const [state, setState] = useState('Delhi');
  const [district, setDistrict] = useState('South Delhi');
  const [primaryPlatform, setPrimaryPlatform] = useState('Swiggy');
  const [monthlyIncomeGoal, setMonthlyIncomeGoal] = useState<number>(28000);
  const [dailyIncomeGoal, setDailyIncomeGoal] = useState<number>(1100);

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Save and complete onboarding
      const profile = clientStorage.getProfile();
      profile.preferredLanguage = preferredLanguage;
      profile.workCategory = workCategory;
      profile.state = state;
      profile.district = district;
      profile.primaryPlatform = primaryPlatform;
      profile.monthlyIncomeGoal = Number(monthlyIncomeGoal) || 25000;
      profile.dailyIncomeGoal = Number(dailyIncomeGoal) || 1000;
      profile.onboardingCompleted = true;

      clientStorage.saveProfile(profile);
      clientStorage.setLanguage(preferredLanguage);
      router.push('/dashboard');
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-800 rounded-full px-3 py-1 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Worker Onboarding • Step {step} of 4</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Personalize Your Companion
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tailor earnings, welfare schemes, and safety tips to your daily reality
          </p>

          {/* Stepper Progress */}
          <div className="flex items-center justify-center space-x-2 mt-4">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  s === step
                    ? 'w-8 bg-emerald-600'
                    : s < step
                    ? 'w-2 bg-emerald-400'
                    : 'w-2 bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Wizard Card */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          {/* STEP 1: Language */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-slate-900 font-bold text-base">
                <Languages className="w-5 h-5 text-emerald-600" />
                <span>What is your preferred language?</span>
              </div>
              <p className="text-xs text-slate-500">
                You can switch between English, Hindi, and Punjabi at any time from the top bar.
              </p>

              <div className="grid grid-cols-1 gap-3 pt-2">
                {[
                  { id: 'en', label: 'English', desc: 'Standard platform & government English' },
                  { id: 'hi', label: 'हिंदी (Hindi)', desc: 'सरल और स्पष्ट हिंदी भाषा' },
                  { id: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)', desc: 'ਆਮ ਬੋਲਚਾਲ ਵਾਲੀ ਪੰਜਾਬੀ ਭਾਸ਼ਾ' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPreferredLanguage(item.id as SupportedLanguage)}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 text-left transition-all ${
                      preferredLanguage === item.id
                        ? 'border-emerald-600 bg-emerald-50/60 text-slate-900 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm">{item.label}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
                    </div>
                    {preferredLanguage === item.id && (
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Work Category */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-slate-900 font-bold text-base">
                <Briefcase className="w-5 h-5 text-emerald-600" />
                <span>What type of work do you primarily do?</span>
              </div>
              <p className="text-xs text-slate-500">
                This helps us surface applicable welfare board schemes (BOCW, Transport acts) and safety tips.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  { id: 'delivery', label: 'Food & Quick Grocery Delivery', sub: 'Swiggy, Zomato, Blinkit, Zepto' },
                  { id: 'driver', label: 'Cab, Auto & Bike Taxi', sub: 'Uber, Ola, Rapido, InDrive' },
                  { id: 'construction', label: 'Construction Worker / Mason', sub: 'BOCW registered or daily sites' },
                  { id: 'daily_wage', label: 'Daily-Wage Labourer / Helper', sub: 'Loading, mandi, logistics' },
                  { id: 'domestic', label: 'Home Services / Domestic', sub: 'Urban Company, maintenance' },
                  { id: 'freelance', label: 'Other Informal Work', sub: 'Self-employed, street vending' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setWorkCategory(item.id as WorkCategory)}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                      workCategory === item.id
                        ? 'border-emerald-600 bg-emerald-50/60 text-slate-900'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="font-bold text-xs leading-snug">{item.label}</div>
                    <div className="text-[10px] text-slate-500 mt-1">{item.sub}</div>
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Primary Platform or Employer (Optional)
                </label>
                <input
                  type="text"
                  value={primaryPlatform}
                  onChange={(e) => setPrimaryPlatform(e.target.value)}
                  placeholder="e.g. Swiggy, Zomato, Uber, Local Contractor"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          {/* STEP 3: State & Location */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-slate-900 font-bold text-base">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <span>Where do you work?</span>
              </div>
              <p className="text-xs text-slate-500">
                Welfare schemes (Rajasthan Gig Act, Karnataka Bill, Delhi Welfare Boards) are location-specific.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">State / UT</label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer font-medium"
                  >
                    <option value="Delhi">Delhi NCT</option>
                    <option value="Karnataka">Karnataka (Bengaluru)</option>
                    <option value="Maharashtra">Maharashtra (Mumbai / Pune)</option>
                    <option value="Rajasthan">Rajasthan (Jaipur)</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Haryana">Haryana (Gurugram / Faridabad)</option>
                    <option value="Uttar Pradesh">Uttar Pradesh (Noida / Ghaziabad / Lucknow)</option>
                    <option value="Telangana">Telangana (Hyderabad)</option>
                    <option value="Tamil Nadu">Tamil Nadu (Chennai)</option>
                    <option value="West Bengal">West Bengal (Kolkata)</option>
                    <option value="Other">Other State</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">District / City (Optional)</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="e.g. South Delhi, Bengaluru Urban"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Income Goals */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-slate-900 font-bold text-base">
                <Target className="w-5 h-5 text-emerald-600" />
                <span>Set Your Income Targets (Optional)</span>
              </div>
              <p className="text-xs text-slate-500">
                Your dashboard will track your daily and monthly progress toward this milestone.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Monthly Take-Home Target (₹)
                  </label>
                  <input
                    type="number"
                    min="5000"
                    step="1000"
                    value={monthlyIncomeGoal}
                    onChange={(e) => setMonthlyIncomeGoal(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Daily Shift Target (₹)
                  </label>
                  <input
                    type="number"
                    min="200"
                    step="50"
                    value={dailyIncomeGoal}
                    onChange={(e) => setDailyIncomeGoal(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  />
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center space-x-3 text-xs text-emerald-800">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  All set! We do not collect Aadhaar or bank numbers. Your companion is ready.
                </span>
              </div>
            </div>
          )}

          {/* Stepper Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                Back
              </button>
            ) : (
              <span />
            )}

            <div className="flex items-center space-x-2">
              {step > 1 && step < 4 && (
                <button
                  type="button"
                  onClick={handleSkip}
                  className="px-3.5 py-2 text-xs font-bold text-slate-400 hover:text-slate-600"
                >
                  Skip
                </button>
              )}

              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-emerald-600/30 transition-all flex items-center space-x-1.5 active:scale-98"
              >
                <span>{step === 4 ? 'Launch Dashboard' : 'Next Step'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
