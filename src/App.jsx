'use client';

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import ProfileModal from './components/ProfileModal';
import ApiKeyModal from './components/ApiKeyModal';
import EarningsModule from './components/modules/EarningsModule';
import GrievanceModule from './components/modules/GrievanceModule';
import WelfareModule from './components/modules/WelfareModule';
import DocumentModule from './components/modules/DocumentModule';
import SosModule from './components/modules/SosModule';
import { storageService } from './services/storageService';

export default function App() {
  const [mounted, setMounted] = useState(false);

  // Global States
  const [lang, setLang] = useState('en');
  const [sunlightMode, setSunlightMode] = useState(false);
  const [isOnShift, setIsOnShift] = useState(false);
  const [activeTab, setActiveTab] = useState('earnings');

  // Persistence States
  const [shifts, setShifts] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [workerProfile, setWorkerProfile] = useState({});
  const [geminiApiKey, setGeminiApiKey] = useState('');

  // Connected Workflows pre-fill transit state
  const [prefilledGrievance, setPrefilledGrievance] = useState(null);

  // Modal States
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLang(storageService.getLanguage());
    setSunlightMode(storageService.getSunlightMode());
    setShifts(storageService.getShifts());
    setDisputes(storageService.getDisputes());
    setWorkerProfile(storageService.getProfile());
    setGeminiApiKey(storageService.getApiKey());
  }, []);

  // Sync Language
  useEffect(() => {
    storageService.setLanguage(lang);
  }, [lang]);

  // Sync Sunlight Mode
  useEffect(() => {
    storageService.setSunlightMode(sunlightMode);
    if (sunlightMode) {
      document.body.classList.add('sunlight-mode');
    } else {
      document.body.classList.remove('sunlight-mode');
    }
  }, [sunlightMode]);

  // Save shifts
  const handleAddShift = (newShift) => {
    const updated = storageService.addShift(newShift);
    setShifts(updated);
  };

  // Save disputes
  const handleAddDispute = (newDispute) => {
    const updated = storageService.addDispute(newDispute);
    setDisputes(updated);
  };

  // Save profile (Connected Workflow 3)
  const handleSaveProfile = (updatedProfile) => {
    storageService.saveProfile(updatedProfile);
    setWorkerProfile(updatedProfile);
  };

  // Save API key
  const handleSaveApiKey = (newKey) => {
    storageService.setApiKey(newKey);
    setGeminiApiKey(newKey);
  };

  // --- CONNECTED WORKFLOW 1: Earnings to Dispute Flow ---
  const handleTriggerDisputeFromEarnings = ({ platform, date, amount, tripId, reason }) => {
    setPrefilledGrievance({
      platform,
      date,
      amount,
      tripId,
      reason,
      details: `Shift dispute on ${date}: ${reason}. Trip/Order ID: ${tripId}. Unfair deduction of ₹${amount}.`,
      category: 'Damaged Parcel / Spilled Beverage Penalty'
    });
    setActiveTab('grievance');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- CONNECTED WORKFLOW 2: Notice to Action Flow ---
  const handleTriggerAppealFromNotice = ({ platform, amount, tripId, category, details }) => {
    setPrefilledGrievance({
      platform,
      amount,
      tripId,
      category,
      details
    });
    setActiveTab('grievance');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#090D16] flex items-center justify-center text-amber-500 font-bold">
        <div className="flex items-center space-x-3">
          <div className="w-3.5 h-3.5 rounded-full bg-amber-500 animate-ping" />
          <span className="text-sm tracking-wide">Starting GigSaathi Companion...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-24 md:pb-12 ${
      sunlightMode ? 'bg-[#FFFDF0] text-black' : 'bg-[#090D16] text-slate-100'
    }`}>
      {/* Top Header */}
      <Header
        lang={lang}
        setLang={setLang}
        sunlightMode={sunlightMode}
        setSunlightMode={setSunlightMode}
        isOnShift={isOnShift}
        setIsOnShift={setIsOnShift}
        workerProfile={workerProfile}
        onOpenProfile={() => setShowProfileModal(true)}
        onOpenApiKey={() => setShowApiKeyModal(true)}
        hasApiKey={Boolean(geminiApiKey && geminiApiKey.length > 5)}
      />

      {/* Desktop Tabs Navigation */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        disputesCount={disputes.length}
      />

      {/* Main Responsive Container */}
      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-5">
        
        {/* Module A: Daily Earnings Analyzer */}
        {activeTab === 'earnings' && (
          <EarningsModule
            shifts={shifts}
            onAddShift={handleAddShift}
            onTriggerDispute={handleTriggerDisputeFromEarnings}
            workerProfile={workerProfile}
            lang={lang}
            sunlightMode={sunlightMode}
          />
        )}

        {/* Module B: Grievance & Dispute Drafter */}
        {activeTab === 'grievance' && (
          <GrievanceModule
            disputes={disputes}
            onAddDispute={handleAddDispute}
            prefilledData={prefilledGrievance}
            onClearPrefilled={() => setPrefilledGrievance(null)}
            workerProfile={workerProfile}
            lang={lang}
            sunlightMode={sunlightMode}
          />
        )}

        {/* Module C: Government Welfare & Rights Navigator */}
        {activeTab === 'welfare' && (
          <WelfareModule
            workerProfile={workerProfile}
            lang={lang}
            sunlightMode={sunlightMode}
            onOpenProfile={() => setShowProfileModal(true)}
          />
        )}

        {/* Module D: Document & Penalty Notice Simplifier */}
        {activeTab === 'docs' && (
          <DocumentModule
            onTriggerAppeal={handleTriggerAppealFromNotice}
            lang={lang}
            sunlightMode={sunlightMode}
          />
        )}

        {/* Module E: SOS & Emergency Protocol Guide */}
        {activeTab === 'sos' && (
          <SosModule
            workerProfile={workerProfile}
            lang={lang}
            sunlightMode={sunlightMode}
          />
        )}

      </main>

      {/* Modals */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        profile={workerProfile}
        onSaveProfile={handleSaveProfile}
      />

      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        currentKey={geminiApiKey}
        onSaveKey={handleSaveApiKey}
      />
    </div>
  );
}
