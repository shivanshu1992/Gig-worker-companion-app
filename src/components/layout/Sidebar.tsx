'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  IndianRupee, 
  Bot, 
  ShieldCheck, 
  Scale, 
  FileText, 
  AlertOctagon, 
  User, 
  LogOut,
  ExternalLink
} from 'lucide-react';
import { SupportedLanguage } from '@/types';
import { getTranslation } from '@/lib/i18n/translations';

export function Sidebar({ currentLanguage }: { currentLanguage: SupportedLanguage }) {
  const pathname = usePathname();
  const t = getTranslation(currentLanguage);

  const navItems = [
    { href: '/dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
    { href: '/earnings', label: t.nav.earnings, icon: IndianRupee },
    { href: '/assistant', label: t.nav.assistant, icon: Bot, badge: 'AI' },
    { href: '/safety', label: t.nav.safety, icon: ShieldCheck },
    { href: '/rights', label: t.nav.rights, icon: Scale },
    { href: '/documents', label: t.nav.documents, icon: FileText },
    { href: '/grievances', label: t.nav.grievances, icon: AlertOctagon, highlight: true },
    { href: '/profile', label: t.nav.profile, icon: User }
  ];

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4 justify-between">
      <div className="space-y-1">
        <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Main Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? 'text-emerald-700' : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Official Government Quick Portals */}
      <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 space-y-2 text-xs">
        <div className="font-bold text-slate-700">Official Portals</div>
        <a
          href="https://eshram.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between text-slate-600 hover:text-emerald-700 py-0.5"
        >
          <span>e-Shram Registration</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </a>
        <a
          href="https://beneficiary.nha.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between text-slate-600 hover:text-emerald-700 py-0.5"
        >
          <span>Ayushman Bharat (PM-JAY)</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </a>
      </div>
    </aside>
  );
}
