import React, { useState } from 'react';
import { 
  PhoneCall, 
  AlertOctagon, 
  ShieldAlert, 
  MapPin, 
  Camera, 
  HeartHandshake, 
  FileText, 
  Volume2, 
  VolumeX, 
  CheckCircle,
  Share2,
  HeartPulse,
  PhoneForwarded
} from 'lucide-react';
import { speechService } from '../../services/speechService';
import { translations } from '../../services/i18n';

export default function SosModule({ workerProfile, lang, sunlightMode }) {
  const t = (translations[lang] || translations.en).sos;

  const [isSirenActive, setIsSirenActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [gpsLocation, setGpsLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  // Toggle Roadside Distress Siren
  const handleToggleSiren = () => {
    speechService.toggleDistressSiren((state) => {
      setIsSirenActive(state);
    });
  };

  // Get current GPS coords
  const handleGetLocationAndShare = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported in browser. Sharing default SOS location message.');
      shareSosMessage('Near current delivery route');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;
        shareSosMessage(mapsLink);
      },
      (err) => {
        setIsLocating(false);
        console.warn('GPS error:', err);
        shareSosMessage('Location permission unavailable - on active duty');
      },
      { timeout: 7000 }
    );
  };

  const shareSosMessage = (locationStr) => {
    const text = `🚨 *URGENT SOS - GIG WORKER EMERGENCY* 🚨
Name: ${workerProfile.name}
Platform: ${workerProfile.primaryPlatform}
Vehicle: ${workerProfile.vehicleType}
Phone: ${workerProfile.phone}
Emergency Contact: ${workerProfile.emergencyContactName} (${workerProfile.emergencyContactPhone})
Location: ${locationStr}

I need immediate roadside assistance/medical help. Please call me or dispatch emergency services!`;
    
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  const accidentSteps = [
    {
      step: 1,
      title: 'Move to Physical Safety & Turn On Hazards',
      desc: 'If conscious and able to move, step away from the active traffic lane to the footpath. Turn on bike/car hazard indicators to warn approaching high-speed traffic.',
      icon: AlertOctagon,
      action: 'Check physical status'
    },
    {
      step: 2,
      title: 'Check Injuries & Call 108 Ambulance',
      desc: 'Do not remove your helmet if experiencing neck pain. Tap 108 below immediately for paramedic dispatch. Request bystanders for clean water.',
      icon: HeartPulse,
      action: 'Dial 108'
    },
    {
      step: 3,
      title: 'Photograph Vehicle & Plate Number',
      desc: 'Take 3 clear timestamped photos of both vehicles, license plates, road impact point, and delivery parcel status before any vehicle is moved.',
      icon: Camera,
      action: 'Document scene'
    },
    {
      step: 4,
      title: 'Inform Platform Support within 60 Minutes',
      desc: 'Report the accident via the Partner App SOS button within 1 hour. This creates the official incident timestamp required for commercial medical insurance claims.',
      icon: PhoneForwarded,
      action: 'Preserve insurance claim'
    },
    {
      step: 5,
      title: 'Request Police GD (General Diary) Entry',
      desc: 'At the government hospital or police station, ensure a General Diary (GD) number is noted. This legal record protects you from wrongful customer liability.',
      icon: FileText,
      action: 'Legal protection'
    }
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      
      {/* Visual Strobe Alert Banner when Siren is Active */}
      {isSirenActive && (
        <div className="p-4 rounded-3xl bg-rose-600 text-white font-black text-center text-sm uppercase tracking-widest animate-bounce shadow-glow-safety border-4 border-yellow-300">
          ⚠️ ROADSIDE DISTRESS SIREN ACTIVE ⚠️
        </div>
      )}

      {/* Header */}
      <div className={`p-4 sm:p-5 rounded-3xl transition-all ${
        sunlightMode ? 'card-sunlight' : 'bg-[#111827] border border-rose-900/40 shadow-xl'
      }`}>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-rose-500/20 text-rose-500 border border-rose-500/30">
            <ShieldAlert className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h2 className={`text-lg sm:text-xl font-black tracking-tight ${sunlightMode ? 'text-black' : 'text-white'}`}>
              {t.title}
            </h2>
            <p className={`text-xs mt-0.5 ${sunlightMode ? 'text-slate-800 font-bold' : 'text-slate-400'}`}>
              {t.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Hotlines Grid (Speed Dial) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        
        <a
          href="tel:112"
          className="p-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-center flex flex-col items-center justify-center gap-1 shadow-glow-safety transition-all"
          style={{ minHeight: '64px' }}
        >
          <PhoneCall className="w-6 h-6 animate-pulse" />
          <span className="text-base font-black">112</span>
          <span className="text-[10px] uppercase tracking-wider font-extrabold opacity-90">National SOS</span>
        </a>

        <a
          href="tel:108"
          className="p-4 rounded-2xl bg-red-700 hover:bg-red-600 text-white font-black text-center flex flex-col items-center justify-center gap-1 shadow-md transition-all"
          style={{ minHeight: '64px' }}
        >
          <HeartPulse className="w-6 h-6" />
          <span className="text-base font-black">108</span>
          <span className="text-[10px] uppercase tracking-wider font-extrabold opacity-90">Ambulance</span>
        </a>

        <a
          href="tel:100"
          className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-black text-center flex flex-col items-center justify-center gap-1 border border-slate-700 transition-all"
          style={{ minHeight: '64px' }}
        >
          <PhoneCall className="w-6 h-6 text-amber-400" />
          <span className="text-base font-black">100</span>
          <span className="text-[10px] uppercase tracking-wider font-extrabold opacity-90">Police</span>
        </a>

        <a
          href="tel:1091"
          className="p-4 rounded-2xl bg-indigo-900 hover:bg-indigo-800 text-white font-black text-center flex flex-col items-center justify-center gap-1 border border-indigo-700 transition-all"
          style={{ minHeight: '64px' }}
        >
          <HeartHandshake className="w-6 h-6 text-indigo-300" />
          <span className="text-base font-black">1091</span>
          <span className="text-[10px] uppercase tracking-wider font-extrabold opacity-90">Women Helpline</span>
        </a>

      </div>

      {/* Two High-Impact Quick SOS Actions: Siren & Location Beacon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        
        {/* Roadside Siren Toggle */}
        <button
          onClick={handleToggleSiren}
          type="button"
          className={`p-4 rounded-3xl font-black text-sm flex items-center justify-center gap-3 transition-all border-2 ${
            isSirenActive
              ? 'bg-yellow-400 text-black border-black animate-pulse shadow-glow-safety'
              : 'bg-rose-950/70 text-rose-300 border-rose-500/60 hover:bg-rose-900/80 shadow-lg'
          }`}
          style={{ minHeight: '56px' }}
        >
          {isSirenActive ? <VolumeX className="w-6 h-6 text-black" /> : <Volume2 className="w-6 h-6 text-rose-400" />}
          <span>{isSirenActive ? t.distressActive : t.distressSiren}</span>
        </button>

        {/* GPS WhatsApp Location Beacon */}
        <button
          onClick={handleGetLocationAndShare}
          type="button"
          disabled={isLocating}
          className="p-4 rounded-3xl font-black text-sm bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-3 transition-all shadow-glow-emerald"
          style={{ minHeight: '56px' }}
        >
          <Share2 className="w-5 h-5" />
          <span>{isLocating ? 'Acquiring GPS...' : t.sendLocation}</span>
        </button>

      </div>

      {/* Step-by-Step Accident Protocol Checklist */}
      <div className={`p-5 rounded-3xl transition-all ${
        sunlightMode ? 'card-sunlight' : 'bg-[#111827] border border-slate-800 shadow-2xl'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-amber-400" />
            <h3 className={`text-xs font-black uppercase tracking-wider ${sunlightMode ? 'text-black' : 'text-white'}`}>
              {t.accidentProtocol}
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-400">
            Step {currentStep} of {accidentSteps.length}
          </span>
        </div>

        <div className="space-y-3">
          {accidentSteps.map((step) => {
            const Icon = step.icon;
            const isCompleted = step.step < currentStep;
            const isCurrent = step.step === currentStep;

            return (
              <div
                key={step.step}
                onClick={() => setCurrentStep(step.step)}
                className={`p-4 rounded-2xl transition-all cursor-pointer border ${
                  isCurrent
                    ? 'bg-slate-800/90 border-amber-500 shadow-md'
                    : isCompleted
                    ? 'bg-emerald-950/20 border-emerald-800/40 opacity-70'
                    : 'bg-slate-900/60 border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                    isCurrent
                      ? 'bg-amber-500 text-black'
                      : isCompleted
                      ? 'bg-emerald-500 text-black'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isCompleted ? <CheckCircle className="w-4 h-4 stroke-[3]" /> : step.step}
                  </div>

                  <div className="flex-1">
                    <h4 className={`text-xs font-black ${isCurrent ? 'text-amber-300' : 'text-white'}`}>
                      {step.title}
                    </h4>
                    <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
