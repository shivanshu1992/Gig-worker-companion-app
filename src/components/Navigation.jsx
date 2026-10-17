import React from 'react';
import { 
  TrendingUp, 
  FileText, 
  ShieldAlert, 
  Sparkles, 
  HelpCircle, 
  PhoneCall,
  Scale,
  FileCheck
} from 'lucide-react';
import { translations } from '../services/i18n';

export default function Navigation({ activeTab, setActiveTab, lang, disputesCount = 0 }) {
  const t = (translations[lang] || translations.en).tabs;

  const tabs = [
    {
      id: 'earnings',
      label: t.earnings,
      icon: TrendingUp,
      color: 'text-emerald-400'
    },
    {
      id: 'grievance',
      label: t.grievance,
      icon: Scale,
      color: 'text-amber-400',
      badge: disputesCount > 0 ? disputesCount : null
    },
    {
      id: 'welfare',
      label: t.welfare,
      icon: HelpCircle,
      color: 'text-blue-400'
    },
    {
      id: 'docs',
      label: t.docs,
      icon: FileCheck,
      color: 'text-indigo-400'
    },
    {
      id: 'sos',
      label: t.sos,
      icon: PhoneCall,
      color: 'text-rose-500',
      isSos: true
    }
  ];

  return (
    <>
      {/* Mobile Bottom Fixed Navigation Bar (thumb friendly, min-height 60px) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0B1120] border-t border-slate-800 md:hidden pb-safe">
        <div className="grid grid-cols-5 h-16">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex flex-col items-center justify-center gap-1 transition-all h-full ${
                  isActive
                    ? tab.isSos 
                      ? 'text-rose-400 font-extrabold bg-rose-950/30'
                      : 'text-amber-400 font-extrabold bg-amber-500/10'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                style={{ minHeight: '48px', minWidth: '48px' }}
                aria-label={tab.label}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <span className={`absolute top-0 left-2 right-2 h-1 rounded-full ${
                    tab.isSos ? 'bg-rose-500' : 'bg-amber-400'
                  }`} />
                )}

                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? tab.color : 'text-slate-400'}`} />
                  {tab.badge && (
                    <span className="absolute -top-1 -right-2 bg-amber-500 text-black text-[10px] font-black px-1.5 py-0.2 rounded-full min-w-[16px] text-center">
                      {tab.badge}
                    </span>
                  )}
                  {tab.isSos && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                  )}
                </div>

                <span className="text-[10px] leading-tight font-bold tracking-tight truncate max-w-[64px]">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop Top Tab Navigation Bar */}
      <div className="hidden md:flex items-center justify-center py-2 px-4 max-w-4xl mx-auto">
        <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-2xl p-1.5 gap-1.5 shadow-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? tab.isSos
                      ? 'bg-rose-600 text-white shadow-glow-safety'
                      : 'bg-amber-500 text-black font-extrabold shadow-glow-amber'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="ml-1 bg-black/40 text-amber-300 px-1.5 py-0.5 rounded text-[10px] font-black">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
