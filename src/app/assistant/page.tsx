'use client';

import React, { useState, useEffect, useRef } from 'react';
import AppShell from '@/components/layout/AppShell';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  RefreshCw, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  User,
  ShieldCheck,
  FileText,
  Volume2
} from 'lucide-react';
import { clientStorage } from '@/lib/storage/clientStorage';
import { SupportedLanguage } from '@/types';
import { translations } from '@/lib/i18n/translations';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  language: SupportedLanguage;
  timestamp: string;
  citations?: Array<{ title: string; url: string; verifiedDate: string }>;
  suggestedActions?: string[];
  isDemo?: boolean;
}

export default function AssistantPage() {
  const [lang, setLang] = useState<SupportedLanguage>('en');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const t = translations[lang] || translations.en;

  const quickPrompts = [
    {
      en: 'How much did I earn this week and what were my fuel expenses?',
      hi: 'इस हफ्ते मैंने कितना कमाया और पेट्रोल का कितना खर्च हुआ?',
      pa: 'ਇਸ ਹਫ਼ਤੇ ਮੈਂ ਕਿੰਨਾ ਕਮਾਇਆ ਅਤੇ ਮੇਰਾ ਤੇਲ ਦਾ ਖਰਚਾ ਕਿੰਨਾ ਹੋਇਆ?'
    },
    {
      en: 'My delivery platform made an unexpected deduction. What can I do?',
      hi: 'मेरी डिलीवरी कंपनी ने बिना बताए पैसे काट लिए। मुझे क्या करना चाहिए?',
      pa: 'ਡਿਲੀਵਰੀ ਕੰਪਨੀ ਨੇ ਬਿਨਾਂ ਦੱਸੇ ਪੈਸੇ ਕੱਟ ਲਏ। ਮੈਂ ਕੀ ਕਰਾਂ?'
    },
    {
      en: 'Which government welfare schemes am I eligible for as a gig worker?',
      hi: 'गिग वर्कर के तौर पर मुझे किन सरकारी योजनाओं का लाभ मिल सकता है?',
      pa: 'ਗਿਗ ਵਰਕਰ ਵਜੋਂ ਮੈਨੂੰ ਕਿਹੜੀਆਂ ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਦਾ ਲਾਭ ਮਿਲ ਸਕਦਾ ਹੈ?'
    },
    {
      en: 'What safety precautions should I take during late night shifts?',
      hi: 'रात के समय काम करते वक्त मुझे किन सुरक्षा बातों का ध्यान रखना चाहिए?',
      pa: 'ਰਾਤ ਨੂੰ ਕੰਮ ਕਰਦੇ ਸਮੇਂ ਮੈਨੂੰ ਕਿਹੜੀਆਂ ਸੁਰੱਖਿਆ ਗੱਲਾਂ ਦਾ ਧਿਆਨ ਰੱਖਣਾ ਚਾਹੀਦਾ ਹੈ?'
    },
    {
      en: 'Help me understand the Rajasthan Platform Gig Workers Act 2023.',
      hi: 'राजस्थान प्लेटफॉर्म गिग वर्कर्स एक्ट 2023 के बारे में आसान भाषा में समझाएं।',
      pa: 'ਰਾਜਸਥਾਨ ਪਲੇਟਫਾਰਮ ਗਿਗ ਵਰਕਰਜ਼ ਐਕਟ 2023 ਬਾਰੇ ਸਰਲ ਭਾਸ਼ਾ ਵਿੱਚ ਸਮਝਾਓ।'
    }
  ];

  useEffect(() => {
    const profile = clientStorage.getProfile();
    const currentLang = (profile?.preferredLanguage || 'en') as SupportedLanguage;
    setLang(currentLang);

    // Initial greeting message
    const greetingText = {
      en: `Namaste ${profile?.fullName || 'Worker Partner'}! I am your AI Gig Saathi. I can help you understand your earnings, check your legal rights, explore government welfare schemes, or draft dispute appeals in simple words. How can I help you today?`,
      hi: `नमस्ते ${profile?.fullName || 'साथी'}! मैं आपका एआई गिग साथी हूँ। मैं आपकी कमाई का हिसाब समझने, सरकारी योजनाओं की जानकारी, काम के अधिकार और शिकायत पत्र तैयार करने में मदद कर सकता हूँ। आज आपकी क्या सहायता करूँ?`,
      pa: `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ${profile?.fullName || 'ਸਾਥੀ'} ਜੀ! ਮੈਂ ਤੁਹਾਡਾ ਏਆਈ ਗਿਗ ਸਾਥੀ ਹਾਂ। ਮੈਂ ਤੁਹਾਡੀ ਕਮਾਈ ਦਾ ਹਿਸਾਬ, ਸਰਕਾਰੀ ਸਕੀਮਾਂ, ਤੁਹਾਡੇ ਕਾਨੂੰਨੀ ਹੱਕਾਂ ਅਤੇ ਸ਼ਿਕਾਇਤ ਲਿਖਣ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ। ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕੀ ਮਦਦ ਕਰਾਂ?`
    }[currentLang] || 'Hello! How can I assist you today?';

    setMessages([
      {
        id: 'msg-initial',
        sender: 'assistant',
        text: greetingText,
        language: currentLang,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          currentLang === 'hi' ? 'कमाई का विश्लेषण' : currentLang === 'pa' ? 'ਕਮਾਈ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ' : 'Explain My Earnings',
          currentLang === 'hi' ? 'कल्याणकारी योजनाएं' : currentLang === 'pa' ? 'ਸਰਕਾਰੀ ਸਕੀਮਾਂ' : 'Find Schemes',
          currentLang === 'hi' ? 'शिकायत पत्र लिखें' : currentLang === 'pa' ? 'ਸ਼ਿਕਾਇਤ ਪੱਤਰ ਲਿਖੋ' : 'Draft Grievance'
        ]
      }
    ]);

    // Check speech recognition capability
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setSpeechSupported(true);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSpeechToggle = () => {
    if (!speechSupported) return;

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const win = window as unknown as {
        SpeechRecognition?: new () => {
          continuous: boolean;
          interimResults: boolean;
          lang: string;
          onstart: () => void;
          onresult: (e: { results: { [key: number]: { [key: number]: { transcript: string } } } }) => void;
          onerror: () => void;
          onend: () => void;
          start: () => void;
        };
        webkitSpeechRecognition?: new () => {
          continuous: boolean;
          interimResults: boolean;
          lang: string;
          onstart: () => void;
          onresult: (e: { results: { [key: number]: { [key: number]: { transcript: string } } } }) => void;
          onerror: () => void;
          onend: () => void;
          start: () => void;
        };
      };
      const SpeechClass = win.SpeechRecognition || win.webkitSpeechRecognition;
      if (!SpeechClass) return;
      const recognition = new SpeechClass();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = lang === 'hi' ? 'hi-IN' : lang === 'pa' ? 'pa-IN' : 'en-IN';

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);

      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  const handleSpeak = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'hi' ? 'hi-IN' : lang === 'pa' ? 'pa-IN' : 'en-IN';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      language: lang,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const profile = clientStorage.getProfile();
      const records = clientStorage.getEarnings();

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          language: lang,
          userContext: {
            profile,
            recentRecords: records.slice(0, 10),
            summary: clientStorage.getSummary()
          }
        })
      });

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'I am having trouble answering right now. Please check your internet or retry.',
        language: lang,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: data.citations || [],
        suggestedActions: data.suggestedActions || [],
        isDemo: data.isDemo
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: lang === 'hi' 
            ? 'क्षमा करें, नेटवर्क में समस्या आ रही है। कृपया पुनः प्रयास करें।'
            : lang === 'pa'
            ? 'ਮਾਫ਼ ਕਰਨਾ, ਨੈੱਟਵਰਕ ਸਮੱਸਿਆ ਆ ਰਹੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।'
            : 'Sorry, I encountered a network issue. Please check your connection and retry.',
          language: lang,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'msg-reset',
        sender: 'assistant',
        text: lang === 'hi' 
          ? 'बातचीत रीसेट कर दी गई है। मैं आपकी क्या मदद करूँ?' 
          : lang === 'pa' 
          ? 'ਗੱਲਬਾਤ ਨਵੇਂ ਸਿਰਿਓਂ ਸ਼ੁਰੂ ਹੋ ਗਈ ਹੈ। ਦੱਸੋ ਕੀ ਮਦਦ ਚਾਹੀਦੀ ਹੈ?'
          : 'Conversation cleared. How can I assist you?',
        language: lang,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)] min-h-[550px]">
        {/* Header Bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 rounded-t-2xl shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-sm">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-bold text-gray-900 text-lg">
                  {lang === 'hi' ? 'एआई गिग साथी' : lang === 'pa' ? 'ਏਆਈ ਗਿਗ ਸਾਥੀ' : 'AI Gig Assistant'}
                </h1>
                <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>{lang === 'hi' ? 'सक्रिय' : lang === 'pa' ? 'ਐਕਟਿਵ' : 'Online'}</span>
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {lang === 'hi' ? 'सत्यापित नियमों और योजनाओं पर आधारित' : lang === 'pa' ? 'ਪ੍ਰਮਾਣਿਤ ਨਿਯਮਾਂ ਅਤੇ ਸਕੀਮਾਂ ਤੇ ਆਧਾਰਿਤ' : 'Grounded on verified worker rights & welfare data'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Quick language toggle */}
            <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-0.5 text-xs font-medium">
              {(['en', 'hi', 'pa'] as SupportedLanguage[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    lang === l ? 'bg-white shadow-sm text-teal-700 font-bold' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {l === 'en' ? 'EN' : l === 'hi' ? 'हिन्दी' : 'ਪੰਜਾਬੀ'}
                </button>
              ))}
            </div>

            <button
              onClick={handleClearChat}
              title="Clear conversation"
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Responsible AI Disclaimer Banner */}
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              {lang === 'hi' 
                ? 'यह एआई केवल कानूनी व कल्याणकारी मार्गदर्शन देता है। यह आपातकालीन हेल्पलाइन (112) या न्यायिक अदालत का विकल्प नहीं है।'
                : lang === 'pa'
                ? 'ਇਹ ਏਆਈ ਸਿਰਫ ਮਦਦਗਾਰ ਜਾਣਕਾਰੀ ਦਿੰਦਾ ਹੈ। ਇਹ ਐਮਰਜੈਂਸੀ ਹੈਲਪਲਾਈਨ (112) ਜਾਂ ਅਦਾਲਤ ਦਾ ਬਦਲ ਨਹੀਂ ਹੈ।'
                : 'Provides verified guidance & educational advice. Not a substitute for 112 emergency services or a licensed court attorney.'}
            </span>
          </div>
        </div>

        {/* Message Feed Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex space-x-2.5 max-w-[85%] md:max-w-[75%] ${
                  msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-xs ${
                    msg.sender === 'user' ? 'bg-slate-700' : 'bg-teal-600'
                  }`}
                >
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`rounded-2xl px-4 py-3 shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-teal-700 text-white rounded-tr-none'
                      : 'bg-white text-gray-900 border border-gray-200 rounded-tl-none'
                  }`}
                >
                  {/* Text Body */}
                  <div className="text-sm whitespace-pre-wrap leading-relaxed font-sans">
                    {msg.text}
                  </div>

                  {/* Audio read-aloud option for assistant messages */}
                  {msg.sender === 'assistant' && (
                    <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                      <button
                        onClick={() => handleSpeak(msg.text)}
                        className="flex items-center space-x-1 text-teal-600 hover:text-teal-800 transition"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{lang === 'hi' ? 'सुनें' : lang === 'pa' ? 'ਸੁਣੋ' : 'Listen'}</span>
                      </button>
                      <span>{msg.timestamp}</span>
                    </div>
                  )}

                  {/* Verified Citations */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5">
                      <div className="text-xs font-semibold text-emerald-800 flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{lang === 'hi' ? 'सत्यापित सरकारी / कानूनी स्रोत:' : lang === 'pa' ? 'ਪ੍ਰਮਾਣਿਤ ਸਰਕਾਰੀ ਸਰੋਤ:' : 'Verified Official Sources:'}</span>
                      </div>
                      {msg.citations.map((c, idx) => (
                        <div key={idx} className="bg-emerald-50 rounded-lg p-2 text-xs flex items-center justify-between border border-emerald-100">
                          <div>
                            <p className="font-medium text-emerald-950">{c.title}</p>
                            <p className="text-[10px] text-emerald-700">Verified: {c.verifiedDate}</p>
                          </div>
                          <a
                            href={c.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-teal-700 hover:text-teal-900 flex items-center space-x-1 font-semibold ml-2"
                          >
                            <span>Link</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Suggested Next Steps */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {msg.suggestedActions.map((action, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(action)}
                          className="px-2.5 py-1 text-xs bg-teal-50 text-teal-800 rounded-full border border-teal-200 hover:bg-teal-100 transition"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  )}

                  {msg.sender === 'user' && (
                    <div className="text-[10px] text-teal-200 text-right mt-1">
                      {msg.timestamp}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="flex space-x-2 max-w-[80%] items-center bg-white border border-gray-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                <Bot className="w-4 h-4 text-teal-600 animate-spin" />
                <span className="text-xs text-gray-500 font-medium">
                  {lang === 'hi' ? 'एआई साथी उत्तर तैयार कर रहा है...' : lang === 'pa' ? 'ਜਵਾਬ ਤਿਆਰ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...' : 'Grounded AI is researching official data...'}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompts (Horizontal Scrollable) */}
        <div className="bg-white border-t border-gray-100 px-4 py-2 overflow-x-auto scrollbar-none flex space-x-2">
          {quickPrompts.map((p, idx) => {
            const promptText = p[lang] || p.en;
            return (
              <button
                key={idx}
                onClick={() => handleSendMessage(promptText)}
                className="whitespace-nowrap px-3 py-1.5 rounded-full bg-gray-100 hover:bg-teal-50 hover:text-teal-800 hover:border-teal-300 text-xs text-gray-700 border border-gray-200 transition shrink-0 flex items-center space-x-1.5"
              >
                <Sparkles className="w-3 h-3 text-teal-600" />
                <span>{promptText.length > 40 ? `${promptText.slice(0, 40)}...` : promptText}</span>
              </button>
            );
          })}
        </div>

        {/* Input Bar */}
        <div className="bg-white border-t border-gray-200 p-3 rounded-b-2xl shadow-lg">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            {speechSupported && (
              <button
                type="button"
                onClick={handleSpeechToggle}
                className={`p-3 rounded-xl transition ${
                  isRecording 
                    ? 'bg-rose-600 text-white animate-pulse' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={isRecording ? 'Listening...' : 'Speak via microphone'}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            )}

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                lang === 'hi'
                  ? 'अपनी भाषा में सवाल पूछें (जैसे: कटौतियों का कारण, स्कीम या सुरक्षा)...'
                  : lang === 'pa'
                  ? 'ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ ਸਵਾਲ ਪੁੱਛੋ (ਜਿਵੇਂ: ਕਟੌਤੀਆਂ ਦਾ ਕਾਰਨ, ਸਕੀਮ ਜਾਂ ਸੁਰੱਖਿਆ)...'
                  : 'Ask about earnings, deductions, rights, welfare schemes, or safety...'
              }
              className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-gray-900"
              disabled={loading}
            />

            <Button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white shrink-0 flex items-center space-x-2"
            >
              <span>{lang === 'hi' ? 'भेजें' : lang === 'pa' ? 'ਭੇਜੋ' : 'Send'}</span>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
