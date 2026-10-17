// Web Speech API service: SpeechSynthesis (Read-Aloud) & SpeechRecognition (Voice Input)
// Plus Web Audio API emergency siren generator

class SpeechService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.currentUtterance = null;
    this.recognition = null;
    this.audioCtx = null;
    this.sirenOscillator = null;
    this.sirenGain = null;
    this.sirenInterval = null;
    this.isSirenPlaying = false;

    // Initialize speech recognition if available
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
      }
    }
  }

  // --- SPEECH SYNTHESIS (READ ALOUD) ---
  speak(text, lang = 'en', onStart = () => {}, onEnd = () => {}) {
    if (!this.synth) {
      console.warn('Speech synthesis not supported in this browser.');
      return false;
    }

    // Cancel any ongoing speech
    this.stopSpeaking();

    // Clean markdown asterisks or special characters for cleaner spoken delivery
    const cleanText = text
      .replace(/[*#_~`>]/g, '')
      .replace(/₹/g, 'Rupees ')
      .replace(/(\r\n|\n|\r)/gm, ' ');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    this.currentUtterance = utterance;

    // Select suitable voice
    const voices = this.synth.getVoices();
    let selectedVoice = null;

    if (lang === 'hi' || lang === 'hinglish') {
      selectedVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('IN')) ||
                      voices.find(v => v.lang.includes('en-IN')) ||
                      voices[0];
      utterance.lang = 'hi-IN';
    } else {
      selectedVoice = voices.find(v => v.lang.includes('en-IN')) ||
                      voices.find(v => v.lang.includes('en-US')) ||
                      voices[0];
      utterance.lang = 'en-US';
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.rate = 0.95; // slightly slower for high clarity on noisy roads
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      onStart();
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('Speech error:', e);
      this.currentUtterance = null;
      onEnd();
    };

    this.synth.speak(utterance);
    return true;
  }

  stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  isSpeaking() {
    return this.synth ? this.synth.speaking : false;
  }

  // --- SPEECH RECOGNITION (VOICE INPUT) ---
  startListening(lang = 'en', onResult = () => {}, onEnd = () => {}, onError = () => {}) {
    if (!this.recognition) {
      onError('Voice input is not supported in this browser. Please type directly.');
      return false;
    }

    try {
      this.recognition.lang = lang === 'hi' ? 'hi-IN' : (lang === 'hinglish' ? 'hi-IN' : 'en-IN');
      
      this.recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        onResult(transcript);
      };

      this.recognition.onerror = (event) => {
        console.warn('Recognition error:', event.error);
        onError(event.error === 'not-allowed' ? 'Microphone permission denied.' : 'Voice recognition stopped.');
        onEnd();
      };

      this.recognition.onend = () => {
        onEnd();
      };

      this.recognition.start();
      return true;
    } catch (err) {
      console.warn('Recognition start exception:', err);
      onError('Microphone is currently busy.');
      return false;
    }
  }

  stopListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
    }
  }

  // --- ROADSIDE DISTRESS SIREN (Web Audio API) ---
  toggleDistressSiren(onStateChange = () => {}) {
    if (this.isSirenPlaying) {
      this.stopDistressSiren();
      onStateChange(false);
      return false;
    } else {
      this.startDistressSiren();
      onStateChange(true);
      return true;
    }
  }

  startDistressSiren() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.audioCtx = new AudioCtx();

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sawtooth';
      gain.gain.value = 0.3; // safe volume

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();

      let freq = 750;
      let goingUp = true;

      this.sirenInterval = setInterval(() => {
        if (!this.audioCtx) return;
        if (goingUp) {
          freq += 60;
          if (freq >= 1200) goingUp = false;
        } else {
          freq -= 60;
          if (freq <= 650) goingUp = true;
        }
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      }, 50);

      this.sirenOscillator = osc;
      this.sirenGain = gain;
      this.isSirenPlaying = true;
    } catch (e) {
      console.warn('Audio Context siren failed:', e);
    }
  }

  stopDistressSiren() {
    try {
      if (this.sirenInterval) {
        clearInterval(this.sirenInterval);
        this.sirenInterval = null;
      }
      if (this.sirenOscillator) {
        this.sirenOscillator.stop();
        this.sirenOscillator.disconnect();
        this.sirenOscillator = null;
      }
      if (this.audioCtx) {
        this.audioCtx.close();
        this.audioCtx = null;
      }
    } catch (e) {
      // ignore
    }
    this.isSirenPlaying = false;
  }
}

export const speechService = new SpeechService();
