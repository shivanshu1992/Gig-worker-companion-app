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
  AlertOctagon 
} from 'lucide-react';
import { SupportedLanguage } from '@/types';
import { getTranslation } from '@/lib/i18n/translations';

export function BottomNav({ currentLanguage }: { currentLanguage: SupportedLanguage }) {
  const pathname = usePathname();
  const t = getTranslation(currentLanguage);

  const navItems = [
    { href: '/dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
    { href: '/earnings', label: t.nav.earnings, icon: IndianRupee },
    { href: '/assistant', label: t.nav.assistant, icon: Bot, isAi: true },
    { href: '/safety', label: t.nav.safety, icon: ShieldCheck },
    { href: '/rights', label: t.nav.rights, icon: Scale },
    { href: '/grievances', label: t.nav.grievances, icon: AlertOctagon }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1 px-2 shadow-lg">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
                isActive
                  ? 'text-emerald-700 font-bold'
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.75px]'}`} />
                {item.isAi && (
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight line-clamp-1 max-w-[56px] text-center">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
