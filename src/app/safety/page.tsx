'use client';

import React, { useState, useEffect, useRef } from 'react';
import AppShell from '@/components/layout/AppShell';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  ShieldAlert, 
  PhoneCall, 
  Volume2, 
  VolumeX, 
  Share2, 
  CheckSquare, 
  Square, 
  AlertTriangle, 
  MapPin, 
  ExternalLink, 
  Bike, 
  Moon, 
  CloudRain, 
  Activity, 
  ShieldCheck, 
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { 
  SAFETY_TOPICS, 
  INITIAL_PRE_SHIFT_CHECKLIST, 
  VERIFIED_EMERGENCY_CONTACTS 
} from '@/lib/knowledge/safetyData';
import { clientStorage } from '@/lib/storage/clientStorage';
import { SupportedLanguage } from '@/types';
import Link from 'next/link';

export default function SafetyPage() {
  const [lang, setLang] = useState<SupportedLanguage>('en');
  const [checklist, setChecklist] = useState(INITIAL_PRE_SHIFT_CHECKLIST);
  const [sirenPlaying, setSirenPlaying] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const sirenIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const profile = clientStorage.getProfile();
    if (profile?.preferredLanguage) {
      setLang(profile.preferredLanguage);
    }

    // Load saved checklist state if present
    const saved = localStorage.getItem('gigsaathi_safety_checklist');
    if (saved) {
      try {
        setChecklist(JSON.parse(saved));
      } catch {
        // fallback
      }
    }

    return () => {
      stopSiren();
    };
  }, []);

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      );
      localStorage.setItem('gigsaathi_safety_checklist', JSON.stringify(updated));
      return updated;
    });
  };

  const resetChecklist = () => {
    const reset = INITIAL_PRE_SHIFT_CHECKLIST.map((item) => ({ ...item, checked: false }));
    setChecklist(reset);
    localStorage.setItem('gigsaathi_safety_checklist', JSON.stringify(reset));
  };

  // Web Audio API emergency loud buzzer siren
  const startSiren = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      gain.gain.setValueAtTime(0.8, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      oscRef.current = osc;

      let high = false;
      osc.frequency.setValueAtTime(800, ctx.currentTime);

      sirenIntervalRef.current = setInterval(() => {
        if (!oscRef.current || !audioCtxRef.current) return;
        high = !high;
        oscRef.current.frequency.setTargetAtTime(
          high ? 1200 : 700,
          audioCtxRef.current.currentTime,
          0.1
        );
      }, 350);

      setSirenPlaying(true);
    } catch {
      alert('Audio playback not supported on this device.');
    }
  };

  const stopSiren = () => {
    if (sirenIntervalRef.current) {
      clearInterval(sirenIntervalRef.current);
      sirenIntervalRef.current = null;
    }
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch {
        // ignore
      }
      oscRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {
        // ignore
      }
      audioCtxRef.current = null;
    }
    setSirenPlaying(false);
  };

  const toggleSiren = () => {
    if (sirenPlaying) {
      stopSiren();
    } else {
      startSiren();
    }
  };

  // WhatsApp Emergency Distress with Live GPS Location
  const shareEmergencyLocation = () => {
    setLocationStatus('Getting current GPS coordinates...');
    if (!navigator.geolocation) {
      sendWhatsAppEmergency(null, null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationStatus('Location found! Opening WhatsApp...');
        sendWhatsAppEmergency(pos.coords.latitude, pos.coords.longitude);
        setTimeout(() => setLocationStatus(''), 3000);
      },
      () => {
        setLocationStatus('GPS unavailable. Sharing distress alert without coordinates.');
        sendWhatsAppEmergency(null, null);
        setTimeout(() => setLocationStatus(''), 3000);
      },
      { timeout: 7000 }
    );
  };

  const sendWhatsAppEmergency = (lat: number | null, lng: number | null) => {
    const profile = clientStorage.getProfile();
    const name = profile?.fullName || 'Worker';
    const work = profile?.workCategory || 'Delivery/Gig Worker';

    let msg = `🚨 EMERGENCY DISTRESS ALERT 🚨\n\nI am ${name} (${work}). I need immediate assistance or backup!`;

    if (lat && lng) {
      msg += `\n\n📍 My current GPS live map location:\nhttps://maps.google.com/?q=${lat},${lng}`;
    } else {
      msg += `\n\n📍 Please call me immediately or dispatch assistance to my last reported order stop!`;
    }

    msg += `\n\nSent via Gig Worker Companion Safety SOS.`;

    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const checkedCount = checklist.filter((i) => i.checked).length;
  const checklistPercent = Math.round((checkedCount / checklist.length) * 100);

  const getTopicTitle = (topic: typeof SAFETY_TOPICS[0]) => {
    if (lang === 'hi') return topic.titleHi;
    if (lang === 'pa') return topic.titlePa;
    return topic.title;
  };

  const getTopicSummary = (topic: typeof SAFETY_TOPICS[0]) => {
    if (lang === 'hi') return topic.summaryHi;
    if (lang === 'pa') return topic.summaryPa;
    return topic.summary;
  };

  const filteredTopics = selectedCategory === 'all' 
    ? SAFETY_TOPICS 
    : SAFETY_TOPICS.filter((t) => t.category === selectedCategory);

  return (
    <AppShell>
      <div className="space-y-6 max-w-5xl mx-auto pb-12">
        {/* Page Title & Language Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight flex items-center space-x-2">
              <ShieldAlert className="w-8 h-8 text-rose-600" />
              <span>
                {lang === 'hi' ? 'श्रमिक सुरक्षा केंद्र' : lang === 'pa' ? 'ਵਰਕਰ ਸੁਰੱਖਿਆ ਕੇਂਦਰ' : 'Worker Safety Center'}
              </span>
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {lang === 'hi' 
                ? 'आपातकालीन सहायता, शिफ्ट पूर्व चेकलिस्ट और ऑन-रोड सुरक्षा दिशा-निर्देश।'
                : lang === 'pa'
                ? 'ਐਮਰਜੈਂਸੀ ਮਦਦ, ਕੰਮ ਤੋਂ ਪਹਿਲਾਂ ਦੀ ਜਾਂਚ ਅਤੇ ਸੜਕ ਸੁਰੱਖਿਆ ਨਿਯਮ।'
                : 'Emergency response tools, pre-shift readiness checklist, and field survival guidelines.'}
            </p>
          </div>

          <div className="flex rounded-lg border border-gray-300 bg-white p-1 text-xs font-medium self-start sm:self-auto shadow-sm">
            {(['en', 'hi', 'pa'] as SupportedLanguage[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1 rounded-md transition-all ${
                  lang === l ? 'bg-teal-700 text-white font-bold shadow' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {l === 'en' ? 'English' : l === 'hi' ? 'हिन्दी' : 'ਪੰਜਾਬੀ'}
              </button>
            ))}
          </div>
        </div>

        {/* SOS Emergency Response Action Console */}
        <div className="bg-gradient-to-r from-rose-700 via-rose-800 to-red-900 rounded-3xl p-6 text-white shadow-xl border-4 border-rose-300/40 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-lg">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold uppercase tracking-wider text-rose-100">
                <AlertTriangle className="w-4 h-4 text-amber-300" />
                <span>{lang === 'hi' ? 'आपातकालीन अलर्ट कंसोल' : lang === 'pa' ? 'ਐਮਰਜੈਂਸੀ ਅਲਰਟ ਕੰਸੋਲ' : 'Emergency SOS Console'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black leading-tight">
                {lang === 'hi' ? 'मदद की जरूरत है? तत्काल 112 डायल करें' : lang === 'pa' ? 'ਮਦਦ ਚਾਹੀਦੀ ਹੈ? ਤੁਰੰਤ 112 ਡਾਇਲ ਕਰੋ' : 'In Danger? Call 112 Unified Emergency'}
              </h2>
              <p className="text-rose-100 text-xs sm:text-sm">
                {lang === 'hi' 
                  ? 'भारत का एकल 24x7 आपातकालीन नंबर (पुलिस, एम्बुलेंस और अग्निशमन सेवा)। नीचे दिए गए बटन तुरंत सक्रिय हैं।'
                  : lang === 'pa'
                  ? 'ਪੁਲਿਸ, ਐਂਬੂਲੈਂਸ ਅਤੇ ਫਾਇਰ ਬ੍ਰਿਗੇਡ ਲਈ ਪੂਰੇ ਭਾਰਤ ਦਾ ਇੱਕੋ ਇੱਕ 24 ਘੰਟੇ ਐਮਰਜੈਂਸੀ ਨੰਬਰ।'
                  : 'India’s official unified 24x7 emergency helpline for Police, Ambulance, and Fire response.'}
              </p>
              {locationStatus && (
                <div className="text-xs bg-black/30 px-3 py-1.5 rounded-lg text-amber-200 animate-pulse inline-block font-mono">
                  {locationStatus}
                </div>
              )}
            </div>

            {/* Emergency Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0">
              {/* Call 112 */}
              <a
                href="tel:112"
                className="flex items-center justify-center space-x-2 px-5 py-4 bg-white text-rose-800 hover:bg-rose-50 font-black text-lg rounded-2xl shadow-lg transition active:scale-95"
              >
                <PhoneCall className="w-6 h-6 text-rose-700 animate-bounce" />
                <span>CALL 112</span>
              </a>

              {/* Audible Siren Buzzer Toggle */}
              <button
                onClick={toggleSiren}
                className={`flex items-center justify-center space-x-2 px-4 py-4 font-bold rounded-2xl transition border active:scale-95 ${
                  sirenPlaying
                    ? 'bg-amber-400 text-black border-yellow-200 animate-pulse'
                    : 'bg-rose-950/60 hover:bg-rose-950 text-white border-rose-500/50'
                }`}
                title="Emit a piercing alarm buzzer from your phone speaker to deter threats"
              >
                {sirenPlaying ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                <span className="text-sm">
                  {sirenPlaying 
                    ? (lang === 'hi' ? 'साइरन बंद करें' : lang === 'pa' ? 'ਸਾਈਰਨ ਬੰਦ' : 'Stop Siren')
                    : (lang === 'hi' ? 'लाउड साइरन' : lang === 'pa' ? 'ਸਾਈਰਨ ਵਜਾਓ' : 'Loud Siren')}
                </span>
              </button>

              {/* Share Location via WhatsApp */}
              <button
                onClick={shareEmergencyLocation}
                className="flex items-center justify-center space-x-2 px-4 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl transition border border-emerald-400 shadow-md active:scale-95"
              >
                <Share2 className="w-5 h-5" />
                <span className="text-sm">
                  {lang === 'hi' ? 'व्हाट्सएप लोकेशन' : lang === 'pa' ? 'ਵਟਸਐਪ ਲੋਕੇਸ਼ਨ' : 'SOS WhatsApp'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pre-Shift Readiness Checklist */}
        <Card className="border-teal-100 bg-white shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                  <CheckSquare className="w-5 h-5 text-teal-600" />
                  <span>
                    {lang === 'hi' ? 'दैनिक ड्यूटी से पहले सुरक्षा चेकलिस्ट' : lang === 'pa' ? 'ਕੰਮ ਸ਼ੁਰੂ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਚੈੱਕਲਿਸਟ' : 'Pre-Shift Safety Readiness Checklist'}
                  </span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {lang === 'hi' 
                    ? 'सड़क पर निकलने से पहले 2 मिनट में अपने हेलमेट, ब्रेक, टायर और जरूरी दस्तावेजों की पुष्टि करें।'
                    : lang === 'pa'
                    ? 'ਸੜਕ ਤੇ ਨਿਕਲਣ ਤੋਂ ਪਹਿਲਾਂ ਆਪਣੇ ਹੈਲਮੇਟ, ਬ੍ਰੇਕ ਅਤੇ ਦਸਤਾਵੇਜ਼ ਚੈੱਕ ਕਰੋ।'
                    : 'Take 2 minutes to inspect your safety gear, bike condition, and emergency items before logging in.'}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-xs font-semibold text-gray-500 uppercase">
                    {lang === 'hi' ? 'तैयारी स्कोर' : lang === 'pa' ? 'ਤਿਆਰੀ' : 'Readiness'}
                  </div>
                  <div className="text-lg font-extrabold text-teal-700">
                    {checklistPercent}% ({checkedCount}/{checklist.length})
                  </div>
                </div>

                <button
                  onClick={resetChecklist}
                  title="Reset checklist for next shift"
                  className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden my-4">
              <div
                className={`h-full transition-all duration-300 ${
                  checklistPercent === 100 
                    ? 'bg-emerald-500' 
                    : checklistPercent >= 50 
                    ? 'bg-teal-600' 
                    : 'bg-amber-500'
                }`}
                style={{ width: `${checklistPercent}%` }}
              />
            </div>

            {/* Checklist Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {checklist.map((item) => {
                const itemLabel = lang === 'hi' ? item.labelHi : lang === 'pa' ? item.labelPa : item.label;
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleChecklistItem(item.id)}
                    className={`flex items-start space-x-3 p-3.5 rounded-xl border text-left transition ${
                      item.checked
                        ? 'bg-teal-50/60 border-teal-200 text-teal-900'
                        : 'bg-gray-50 hover:bg-white border-gray-200 text-gray-700'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {item.checked ? (
                        <CheckSquare className="w-5 h-5 text-teal-600" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <span className={`text-sm font-medium leading-snug ${item.checked ? 'line-through text-gray-500' : ''}`}>
                      {itemLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Verified Emergency Hotlines Directory */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center space-x-2">
            <PhoneCall className="w-5 h-5 text-navy-800" />
            <span>
              {lang === 'hi' ? 'सत्यापित राष्ट्रीय हेल्पलाइन एवं आपातकालीन नंबर' : lang === 'pa' ? 'ਪ੍ਰਮਾਣਿਤ ਰਾਸ਼ਟਰੀ ਹੈਲਪਲਾਈਨ ਨੰਬਰ' : 'Verified National Emergency Hotlines'}
            </span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {VERIFIED_EMERGENCY_CONTACTS.map((c) => {
              const cName = lang === 'hi' ? c.nameHi : lang === 'pa' ? c.namePa : c.name;
              const cDesc = lang === 'hi' ? c.descriptionHi : c.description;

              return (
                <div
                  key={c.number}
                  className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col justify-between hover:border-teal-400 transition"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-gray-900 text-sm">{cName}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-100 text-rose-800">
                        {c.number}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{cDesc}</p>
                  </div>

                  <a
                    href={`tel:${c.number}`}
                    className="mt-4 flex items-center justify-center space-x-2 w-full py-2 bg-slate-900 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Dial {c.number}</span>
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        {/* Safety Knowledge Guides */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {lang === 'hi' ? 'व्यावहारिक सुरक्षा निर्देशिका' : lang === 'pa' ? 'ਸੁਰੱਖਿਆ ਜਾਣਕਾਰੀ ਡਾਇਰੈਕਟਰੀ' : 'Practical Safety Guidelines'}
              </h3>
              <p className="text-xs text-gray-500">
                {lang === 'hi' 
                  ? 'सड़क, मौसम, रात की ड्यूटी और विवादों से सुरक्षित रहने के नियम।'
                  : 'Practical tips to avoid crashes, heatstroke, back injuries, and customer aggression.'}
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-1.5 text-xs">
              {[
                { id: 'all', label: 'All' },
                { id: 'road', label: 'Road Traffic' },
                { id: 'night', label: 'Night Shift' },
                { id: 'weather', label: 'Weather & Heat' },
                { id: 'ergonomics', label: 'Lifting & Posture' },
                { id: 'conflict', label: 'Disputes' }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedCategory(f.id)}
                  className={`px-3 py-1 rounded-lg border transition ${
                    selectedCategory === f.id
                      ? 'bg-navy-900 text-white border-navy-900 font-bold'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTopics.map((topic) => {
              const points = topic.keyActionPoints[lang] || topic.keyActionPoints.en;

              return (
                <Card key={topic.id} className="p-5 flex flex-col justify-between border-gray-200 hover:shadow-md transition">
                  <div>
                    <div className="flex items-start space-x-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-100">
                        {topic.category === 'road' && <Bike className="w-5 h-5" />}
                        {topic.category === 'night' && <Moon className="w-5 h-5" />}
                        {topic.category === 'weather' && <CloudRain className="w-5 h-5" />}
                        {topic.category === 'ergonomics' && <Activity className="w-5 h-5" />}
                        {topic.category === 'conflict' && <ShieldAlert className="w-5 h-5" />}
                      </div>

                      <div>
                        <h4 className="font-bold text-gray-900 text-base leading-snug">
                          {getTopicTitle(topic)}
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {getTopicSummary(topic)}
                        </p>
                      </div>
                    </div>

                    {/* Action Bullet Points */}
                    <ul className="space-y-2 my-3 text-xs text-gray-700">
                      {points.map((pt, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                          <span className="leading-relaxed">{pt}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Warning Callout if present */}
                    {topic.warning && (
                      <div className="mt-3 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start space-x-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{topic.warning}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-gray-400 font-medium capitalize">
                      Category: {topic.category}
                    </span>
                    <Link
                      href="/assistant"
                      className="text-teal-700 hover:text-teal-900 font-semibold flex items-center space-x-1"
                    >
                      <span>{lang === 'hi' ? 'एआई से पूछें' : lang === 'pa' ? 'ਏਆਈ ਨੂੰ ਪੁੱਛੋ' : 'Ask AI'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
