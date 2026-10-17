'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { SupportedLanguage } from '@/types';
import { clientStorage } from '@/lib/storage/clientStorage';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');

  useEffect(() => {
    const saved = clientStorage.getLanguage();
    if (saved) setCurrentLanguage(saved);
  }, []);

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setCurrentLanguage(lang);
    clientStorage.setLanguage(lang);
    const profile = clientStorage.getProfile();
    profile.preferredLanguage = lang;
    clientStorage.saveProfile(profile);
  };

  return (
    <div className="min-h-screen bg-stone-50/50 flex flex-col text-slate-900 font-sans">
      <Navbar currentLanguage={currentLanguage} onLanguageChange={handleLanguageChange} />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar currentLanguage={currentLanguage} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-12 max-w-5xl mx-auto w-full">
          {children}
        </main>
      </div>
      <BottomNav currentLanguage={currentLanguage} />
    </div>
  );
}

export default AppShell;
