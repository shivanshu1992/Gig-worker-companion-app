import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { speechService } from '../services/speechService';

export default function ReadAloudButton({ text, lang = 'en', label = 'Listen' }) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (isSpeaking) {
        speechService.stopSpeaking();
      }
    };
  }, [isSpeaking]);

  const handleToggleSpeak = () => {
    if (isSpeaking) {
      speechService.stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speechService.speak(
        text,
        lang,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );
    }
  };

  return (
    <button
      onClick={handleToggleSpeak}
      type="button"
      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm ${
        isSpeaking
          ? 'bg-amber-500 text-black border-2 border-black animate-pulse shadow-glow-amber'
          : 'bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700'
      }`}
      title={isSpeaking ? "Stop reading" : "Read aloud in voice"}
    >
      {isSpeaking ? (
        <>
          <VolumeX className="w-4 h-4 text-black animate-spin" />
          <span className="flex items-center gap-1">
            <span className="w-1 h-3 bg-black rounded-full animate-wave-1"></span>
            <span className="w-1 h-4 bg-black rounded-full animate-wave-2"></span>
            <span className="w-1 h-3 bg-black rounded-full animate-wave-3"></span>
            <span className="ml-1 text-black font-extrabold">Reading...</span>
          </span>
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4 text-amber-400" />
          <span>{label}</span>
          <Sparkles className="w-3 h-3 text-amber-300 opacity-80" />
        </>
      )}
    </button>
  );
}
