import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useFarm } from '../context/FarmContext';
import { sendChatMessage } from '../services/api';
import { ChatMessage } from '../types';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Loader2,
  Sprout,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
  AlertCircle,
  Radio,
  Play,
  Languages,
} from 'lucide-react';

// Web Audio API sound feedback for voice recognition
const playAudioCue = (type: 'start' | 'success' | 'error') => {
  try {
    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'start') {
      // Gentle cheerful upward chirp
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(740, now + 0.12);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.18);
    } else if (type === 'success') {
      // Gentle confirmation chime
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.22);
    } else {
      // Low subtle tone
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    }
  } catch {
    // Non-critical audio feedback fallback
  }
};

export const FloatingAssistant: React.FC = () => {
  const { isChatOpen, setIsChatOpen, farmData, preferredLanguage, setPreferredLanguage } = useFarm();
  const isMl = preferredLanguage === 'ml';

  const getInitialGreeting = useCallback(
    (lang: 'en' | 'ml') => {
      if (lang === 'ml') {
        return `നമസ്കാരം! ഞാൻ നിങ്ങളുടെ **ഡാർത്തി AI അസിസ്റ്റന്റ് (DARTHI AI)**.

**${farmData.location}**-ലെ നിങ്ങളുടെ **${farmData.currentCrop}** തോട്ടത്തിലെ മണ്ണിലെ ഈർപ്പവും (${farmData.soilMoisture}%), താപനിലയും (${farmData.airTemperature}°C), കാലാവസ്ഥയും ഞാൻ തത്സമയം നിരീക്ഷിക്കുന്നുണ്ട്.

ഇന്ന് ഞാൻ നിങ്ങളെ എങ്ങനെയാണ് സഹായിക്കേണ്ടത്? മൈക്കിൽ ക്ലിക്ക് ചെയ്ത് മലയാളത്തിൽ സംസാരിക്കുകയോ താഴെയുള്ള ചോദ്യങ്ങളിൽ ഒന്ന് തെരഞ്ഞെടുക്കുകയോ ചെയ്യാം!`;
      }
      return `Hello! I am your **DARTHI AI Assistant**.

I monitor soil sensors (Moisture: ${farmData.soilMoisture}%), weather forecasts, and market trends for your **${farmData.currentCrop}** farm in **${farmData.location}**.

How can I help you today? You can tap the **Mic** button to speak voice commands in English or Malayalam, or type your question below.`;
    },
    [farmData.currentCrop, farmData.location, farmData.soilMoisture, farmData.airTemperature]
  );

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'msg-init',
      sender: 'assistant',
      text: getInitialGreeting(preferredLanguage),
      timestamp: 'Just now',
    },
  ]);

  // Update initial message if language changes and no user interaction yet
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'msg-init') {
        return [
          {
            id: 'msg-init',
            sender: 'assistant',
            text: getInitialGreeting(preferredLanguage),
            timestamp: 'Just now',
          },
        ];
      }
      return prev;
    });
  }, [preferredLanguage, getInitialGreeting]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [autoSendVoice, setAutoSendVoice] = useState(true);
  const [autoReadAnswers, setAutoReadAnswers] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [showVoiceCommandsList, setShowVoiceCommandsList] = useState(false);
  const [speechLang, setSpeechLang] = useState<'ml-IN' | 'en-IN' | 'en-US'>(
    preferredLanguage === 'ml' ? 'ml-IN' : 'en-IN'
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const recognizedTextRef = useRef<string>('');
  const hasSentRef = useRef<boolean>(false);

  // Synchronize speech language when app language switches
  useEffect(() => {
    setSpeechLang(preferredLanguage === 'ml' ? 'ml-IN' : 'en-IN');
  }, [preferredLanguage]);

  // Common Voice Commands and Quick Prompts
  const englishVoiceCommands = [
    { label: '💧 Water Advice', command: 'Should I water my crop today?' },
    { label: '🧪 Soil Health & pH', command: 'How is my soil health, NPK, and pH?' },
    { label: '🌧️ Rain Alert', command: 'Is rain coming in the next 24 hours?' },
    { label: '🌱 Crop Recommendation', command: 'Which crop is best for this weather and soil?' },
    { label: '🐛 Disease Protection', command: 'How to prevent fungal diseases like Quick Wilt?' },
    { label: '📈 Mandi Price', command: 'What is the current market price and harvest advice?' },
  ];

  const malayalamVoiceCommands = [
    { label: '💧 ഇന്ന് നനയ്ക്കണോ?', command: 'ഇന്ന് തോട്ടത്തിൽ നനയ്ക്കണോ?' },
    { label: '🧪 മണ്ണ് പരിശോധന & pH', command: 'എന്റെ മണ്ണിലെ pH ഉം പോഷകങ്ങളുടെ അവസ്ഥയും എന്താണ്?' },
    { label: '🌧️ മഴ സാധ്യത', command: 'അടുത്ത 24 മണിക്കൂറിൽ കനത്ത മഴ പെയ്യുമോ?' },
    { label: '🌱 അനുയോജ്യമായ വിള', command: 'ഈ കാലാവസ്ഥയിൽ ചെയ്യാവുന്ന മികച്ച വിള ഏതാണ്?' },
    { label: '🐛 ദ്രുതവാട്ടം തടയാൻ', command: 'കുമിൾരോഗം അല്ലെങ്കിൽ ദ്രുതവാട്ടം വരാതിരിക്കാൻ എന്ത് ചെയ്യണം?' },
    { label: '📈 വിപണി വില', command: 'വിളകൾ എപ്പോൾ വിൽക്കണം, മാർക്കറ്റ് വില എങ്ങനെ?' },
  ];

  const voiceCommands = isMl ? malayalamVoiceCommands : englishVoiceCommands;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom();
    }
  }, [messages, isChatOpen]);

  // Handle Text to Speech (Speak answer aloud)
  const handleSpeak = useCallback(
    (msgId: string, text: string) => {
      if (!('speechSynthesis' in window)) return;

      if (speakingMessageId === msgId) {
        window.speechSynthesis.cancel();
        setSpeakingMessageId(null);
        return;
      }

      window.speechSynthesis.cancel();
      // Clean markdown symbols, bullets, asterisks, hashtags for clear voice playback
      const cleanText = text
        .replace(/[*#_`~>[\]]/g, '')
        .replace(/- /g, '')
        .replace(/\n\n+/g, '. ')
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.lang = preferredLanguage === 'ml' ? 'ml-IN' : 'en-IN';

      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const matchingVoice = voices.find((v) =>
          preferredLanguage === 'ml'
            ? v.lang.startsWith('ml')
            : v.lang.startsWith('en-IN') || v.lang.startsWith('en')
        );
        if (matchingVoice) {
          utterance.voice = matchingVoice;
        }
      }

      utterance.onend = () => setSpeakingMessageId(null);
      utterance.onerror = () => setSpeakingMessageId(null);

      setSpeakingMessageId(msgId);
      window.speechSynthesis.speak(utterance);
    },
    [preferredLanguage, speakingMessageId]
  );

  // Send message to AI backend
  const handleSend = async (questionText?: string) => {
    const text = (questionText || inputValue).trim();
    if (!text || isLoading) return;

    // Check special reset or language voice commands
    const lower = text.toLowerCase();
    if (lower === 'reset' || lower === 'clear' || lower === 'സംഭാഷണം മാറ്റുക') {
      handleResetChat();
      setInputValue('');
      setLiveTranscript('');
      return;
    }
    if (lower === 'switch to malayalam' || lower === 'മലയാളം' || lower === 'malayalam') {
      handleLanguageChange('ml');
      setInputValue('');
      setLiveTranscript('');
      return;
    }
    if (lower === 'switch to english' || lower === 'english') {
      handleLanguageChange('en');
      setInputValue('');
      setLiveTranscript('');
      return;
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setLiveTranscript('');
    setVoiceError(null);
    setIsLoading(true);

    try {
      const reply = await sendChatMessage(text, farmData, preferredLanguage);
      const assistantMsgId = `assistant-${Date.now()}`;
      const assistantMsg: ChatMessage = {
        id: assistantMsgId,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);

      // If auto read answers is enabled, read it aloud
      if (autoReadAnswers) {
        setTimeout(() => {
          handleSpeak(assistantMsgId, reply);
        }, 300);
      }
    } catch (err) {
      console.warn('Chat service error, serving contextual fallback:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: isMl
          ? `ക്ഷമിക്കണം, നെറ്റ്‌വർക്ക് പ്രതികരണത്തിൽ താമസം നേരിട്ടു. നിങ്ങളുടെ തോട്ടത്തിലെ (${farmData.location}) മണ്ണിലെ ഈർപ്പം ${farmData.soilMoisture}% ആണ്, മഴ സാധ്യത ${farmData.rainfallProbability}% ആയതിനാൽ ഇന്ന് നനയ്ക്കൽ ആവശ്യമില്ല.`
          : `Network notice. Currently, your field soil moisture is at ${farmData.soilMoisture}% and rain probability is ${farmData.rainfallProbability}%. Hold irrigation today!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Start Speech Recognition
  const startListening = () => {
    const SpeechRecognitionClass =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition ||
      (window as any).mozSpeechRecognition ||
      (window as any).msSpeechRecognition;

    if (!SpeechRecognitionClass) {
      playAudioCue('error');
      setVoiceError(
        isMl
          ? 'നിങ്ങളുടെ ബ്രൗസറിൽ വെബ് സ്പീച്ച് എപിഐ (Web Speech API) ലഭ്യമല്ല. ദയവായി താഴെയുള്ള ദ്രുത വോയ്‌സ് കമാൻഡുകൾ ക്ലിക്ക് ചെയ്യുക.'
          : 'Live microphone recognition is not natively supported in this browser. Please click any voice preset below.'
      );
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }

      recognizedTextRef.current = '';
      hasSentRef.current = false;
      setLiveTranscript('');
      setVoiceError(null);

      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.lang = speechLang;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceError(null);
        setLiveTranscript('');
        playAudioCue('start');
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcript;
          } else {
            interim += transcript;
          }
        }

        const candidate = (final || interim).trim();
        if (candidate) {
          recognizedTextRef.current = candidate;
          setLiveTranscript(candidate);
        }

        if (final && final.trim()) {
          const finalCommand = final.trim();
          hasSentRef.current = true;
          setLiveTranscript('');
          setInputValue(finalCommand);
          playAudioCue('success');

          if (autoSendVoice) {
            handleSend(finalCommand);
            try {
              recognition.stop();
            } catch {
              // ignore
            }
          }
        }
      };

      recognition.onerror = (event: any) => {
        const errType = event.error;
        console.warn('Speech recognition event notice:', errType);
        setIsListening(false);
        setLiveTranscript('');

        if (errType === 'no-speech') {
          playAudioCue('error');
          setVoiceError(
            isMl
              ? 'ശബ്ദം തിരിച്ചറിയാനായില്ല. മൈക്കിലേക്ക് സംസാരിക്കൂ അല്ലെങ്കിൽ ചോദ്യം തിരഞ്ഞെടുക്കൂ.'
              : 'No speech was detected. Please speak closer to the microphone or try again.'
          );
        } else if (errType === 'not-allowed' || errType === 'permission-denied') {
          playAudioCue('error');
          setVoiceError(
            isMl
              ? 'മൈക്രോഫോൺ അനുമതി തടയപ്പെട്ടിരിക്കുന്നു. ബ്രൗസറിലെ ലോക്ക് ഐക്കണിൽ ക്ലിക്ക് ചെയ്ത് മൈക്രോഫോൺ ഓൺ ചെയ്യുക.'
              : 'Microphone access is blocked. Please allow microphone permissions in your browser URL bar.'
          );
        } else if (errType === 'language-not-supported') {
          playAudioCue('error');
          // Switch to en-IN fallback automatically
          setSpeechLang('en-IN');
          setVoiceError(
            isMl
              ? 'ബ്രൗസറിൽ മലയാളം വോയ്‌സ് മോഡൽ ലഭ്യമല്ലാത്തതിനാൽ ഇംഗ്ലീഷ് (en-IN) മോഡിലേക്ക് മാറ്റിയിരിക്കുന്നു. താഴെയുള്ള കമാൻഡുകൾ ഉപയോഗിക്കാം.'
              : 'Language pack not supported; switched to en-IN. Click voice presets anytime.'
          );
        } else if (errType !== 'aborted') {
          setVoiceError(
            isMl
              ? `വോയ്‌സ് അറിയിപ്പ് (${errType}). താഴെയുള്ള ദ്രുത കമാൻഡുകൾ ഉപയോഗിക്കുക.`
              : `Voice command notice (${errType}). You can also click a quick command preset below.`
          );
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        // Fallback: If user spoke, speech stopped, but isFinal wasn't triggered
        const pending = recognizedTextRef.current.trim();
        if (pending && !hasSentRef.current) {
          hasSentRef.current = true;
          setLiveTranscript('');
          setInputValue(pending);
          playAudioCue('success');
          if (autoSendVoice) {
            handleSend(pending);
          }
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.warn('Failed to start speech recognition:', err);
      setIsListening(false);
      playAudioCue('error');
      setVoiceError(
        isMl
          ? 'മൈക്രോഫോൺ ആരംഭിക്കാൻ കഴിഞ്ഞില്ല. താഴെയുള്ള വോയ്‌സ് കമാൻഡുകൾ ക്ലിക്ക് ചെയ്യുക.'
          : 'Could not activate microphone recognition. You can click the voice presets below.'
      );
    }
  };

  // Stop active voice recognition
  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);

    // If there is pending recognized text, send or put into input
    const pending = recognizedTextRef.current.trim();
    if (pending && !hasSentRef.current) {
      hasSentRef.current = true;
      setLiveTranscript('');
      setInputValue(pending);
      playAudioCue('success');
      if (autoSendVoice) {
        handleSend(pending);
      }
    }
  };

  // Start or Stop Speech Recognition
  const toggleSpeechRecognition = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Run a preset voice command (acts as 1-tap simulated speech command with audio chime)
  const handleRunVoiceCommand = (command: string) => {
    playAudioCue('start');
    setLiveTranscript(command);
    setIsListening(true);
    setVoiceError(null);
    setShowVoiceCommandsList(false);

    setTimeout(() => {
      playAudioCue('success');
      setIsListening(false);
      setLiveTranscript('');
      setInputValue(command);
      handleSend(command);
    }, 400);
  };

  // Change language and notify user in chat
  const handleLanguageChange = (newLang: 'en' | 'ml') => {
    if (newLang === preferredLanguage) return;
    setPreferredLanguage(newLang);

    const switchNotice: ChatMessage = {
      id: `lang-switch-${Date.now()}`,
      sender: 'assistant',
      text:
        newLang === 'ml'
          ? `🌐 **ഭാഷ മലയാളത്തിലേക്ക് മാറ്റിയിരിക്കുന്നു.**\nനിങ്ങൾക്ക് ഇനി മലയാളത്തിലോ മംഗ്ലീഷിലോ ചോദ്യങ്ങൾ ചോദിക്കാം. മൈക്ക് ഉപയോഗിച്ച് മലയാളത്തിൽ സംസാരിക്കാനും സാധിക്കും.`
          : `🌐 **Language switched to English.**\nYou can now speak or type your farm queries in English. Switch back to Malayalam anytime.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, switchNotice]);
  };

  const handleResetChat = () => {
    if (speakingMessageId) {
      window.speechSynthesis?.cancel();
      setSpeakingMessageId(null);
    }
    stopListening();
    setLiveTranscript('');
    setVoiceError(null);
    setMessages([
      {
        id: `msg-reset-${Date.now()}`,
        sender: 'assistant',
        text: getInitialGreeting(preferredLanguage),
        timestamp: 'Just now',
      },
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button (when closed) */}
      {!isChatOpen && (
        <button
          id="darthi-ai-floating-trigger"
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all group cursor-pointer border border-white/20"
          aria-label="Open DARTHI AI Farming Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-bold text-sm tracking-wide leading-tight flex items-center gap-1.5">
              {isMl ? 'ഡാർത്തി AI സഹായി' : 'Ask DARTHI AI'}
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-400 text-emerald-950">
                VOICE
              </span>
            </span>
            <span className="text-[10px] text-emerald-100 font-medium leading-tight">
              {isMl ? 'സംസാരിക്കൂ / ചാറ്റ്' : 'Speak or Chat'}
            </span>
          </div>
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center ml-1 group-hover:bg-amber-400 group-hover:text-emerald-950 transition-colors">
            <Mic className="w-3.5 h-3.5" />
          </div>
        </button>
      )}

      {/* Assistant Modal Window (when open) */}
      {isChatOpen && (
        <div
          id="darthi-ai-chat-window"
          className="fixed bottom-4 right-4 z-50 w-[95vw] sm:w-[460px] h-[620px] max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-emerald-150 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <Bot className="w-5 h-5 text-emerald-100" />
              </div>
              <div>
                <h2 className="font-bold text-sm tracking-tight flex items-center gap-1.5">
                  DARTHI AI
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/40 text-emerald-100 border border-emerald-400/30 font-normal">
                    {isMl ? 'വോയ്‌സ് & കൃഷി AI' : 'Voice & Ag AI'}
                  </span>
                </h2>
                <p className="text-[11px] text-emerald-100/80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {isMl ? 'കേരള കർഷക ശബ്ദ സഹായി' : 'Living Weather & Farm Advisor'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Language Switcher Pill */}
              <div className="flex items-center bg-black/25 backdrop-blur-md rounded-xl p-0.5 border border-white/20">
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`px-2 py-0.5 text-[11px] font-bold rounded-lg transition-all ${
                    preferredLanguage === 'en'
                      ? 'bg-white text-emerald-950 shadow-xs'
                      : 'text-emerald-100 hover:text-white'
                  }`}
                  title="Switch to English"
                >
                  EN
                </button>
                <button
                  onClick={() => handleLanguageChange('ml')}
                  className={`px-2 py-0.5 text-[11px] font-bold rounded-lg transition-all ${
                    isMl ? 'bg-amber-400 text-gray-950 shadow-xs' : 'text-emerald-100 hover:text-white'
                  }`}
                  title="മലയാളത്തിൽ സംസാരിക്കുക"
                >
                  മലയാളം
                </button>
              </div>

              {/* Reset Chat */}
              <button
                onClick={handleResetChat}
                className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title={isMl ? 'സംഭാഷണം പുനഃക്രമീകരിക്കുക' : 'Reset chat'}
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Close Button */}
              <button
                onClick={() => {
                  stopListening();
                  if (speakingMessageId) {
                    window.speechSynthesis?.cancel();
                    setSpeakingMessageId(null);
                  }
                  setIsChatOpen(false);
                }}
                className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close Assistant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Context Banner */}
          <div className="bg-emerald-50/90 px-4 py-2 border-b border-emerald-100 flex items-center justify-between text-[11px] text-emerald-900">
            <span className="font-medium truncate">
              {isMl ? (
                <>
                  ഈർപ്പം: <span className="font-bold">{farmData.soilMoisture}%</span> • താപനില:{' '}
                  <span className="font-bold">{farmData.airTemperature}°C</span> • മഴ:{' '}
                  <span className="font-bold">{farmData.rainfallProbability}%</span>
                </>
              ) : (
                <>
                  Moisture: <span className="font-bold">{farmData.soilMoisture}%</span> • Temp:{' '}
                  <span className="font-bold">{farmData.airTemperature}°C</span> • Rain:{' '}
                  <span className="font-bold">{farmData.rainfallProbability}%</span>
                </>
              )}
            </span>
            <button
              onClick={() => setShowVoiceCommandsList(!showVoiceCommandsList)}
              className="px-2 py-0.5 rounded-md bg-white text-emerald-800 font-semibold border border-emerald-200 hover:bg-emerald-100 transition-colors shrink-0 flex items-center gap-1 cursor-pointer text-[10px]"
              title="View quick voice command shortcuts"
            >
              <Mic className="w-3 h-3 text-emerald-700" />
              <span>{isMl ? 'ശബ്ദ കമാൻഡുകൾ' : 'Voice Commands'}</span>
            </button>
          </div>

          {/* Quick Voice Commands Drawer / Panel (Toggleable) */}
          {showVoiceCommandsList && (
            <div className="bg-amber-50/95 border-b border-amber-200 p-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
                  {isMl ? 'ദ്രുത വോയ്‌സ് കമാൻഡുകൾ' : 'Quick Voice Commands'}
                </span>
                <button
                  onClick={() => setShowVoiceCommandsList(false)}
                  className="text-amber-800 hover:text-amber-950 text-xs font-semibold cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {voiceCommands.map((vc, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleRunVoiceCommand(vc.command)}
                    disabled={isLoading}
                    className="p-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-950 border border-amber-200/80 hover:border-emerald-300 text-left text-[11px] font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer group"
                  >
                    <Play className="w-3 h-3 text-emerald-600 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    <span className="truncate">{vc.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gray-50/60">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 text-xs shadow-xs mt-0.5">
                    <Sprout className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed group relative ${
                    msg.sender === 'user'
                      ? 'bg-emerald-700 text-white rounded-tr-xs shadow-xs'
                      : 'bg-white text-gray-800 border border-gray-150 rounded-tl-xs shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <div
                    className={`text-[9px] mt-1.5 flex items-center justify-between gap-2 ${
                      msg.sender === 'user' ? 'text-emerald-200' : 'text-gray-400'
                    }`}
                  >
                    <span>{msg.timestamp}</span>

                    {/* Speaker Text-to-Speech Button */}
                    {msg.sender === 'assistant' && (
                      <button
                        onClick={() => handleSpeak(msg.id, msg.text)}
                        className="text-gray-500 hover:text-emerald-700 p-0.5 rounded transition-colors flex items-center gap-1 font-semibold cursor-pointer"
                        title={
                          speakingMessageId === msg.id
                            ? 'നിർത്തുക (Stop reading)'
                            : isMl
                            ? 'ശബ്ദത്തിൽ കേൾക്കുക (Listen aloud)'
                            : 'Listen to response'
                        }
                      >
                        {speakingMessageId === msg.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                            <span className="text-[9px] text-amber-600 font-bold">Stop</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span className="text-[9px]">
                              {isMl ? 'കേൾക്കുക' : 'Listen'}
                            </span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 items-center text-xs text-gray-600 bg-white border border-gray-150 px-3.5 py-2.5 rounded-2xl w-fit shadow-2xs">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                <span>
                  {isMl
                    ? 'ഡാർത്തി നിങ്ങളുടെ തോട്ടത്തിന്റെ അവസ്ഥ വിശകലനം ചെയ്യുന്നു...'
                    : 'DARTHI is reasoning live field conditions...'}
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Voice Error Notice Banner (Dismissible, in-UI) */}
          {voiceError && (
            <div className="px-3.5 py-2 bg-rose-50 border-t border-rose-200 text-rose-800 text-[11px] flex items-start justify-between gap-2 animate-in fade-in duration-150">
              <div className="flex items-start gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="leading-tight">{voiceError}</span>
              </div>
              <button
                onClick={() => setVoiceError(null)}
                className="text-rose-900 font-bold hover:underline shrink-0 text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Active Listening Audio Wave & Real-Time Transcript Banner */}
          {isListening && (
            <div className="px-4 py-2.5 bg-gradient-to-r from-red-50 via-amber-50 to-red-50 border-t border-red-200 flex flex-col gap-1.5 animate-in fade-in duration-150 shadow-inner">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600" />
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-red-900">
                      {speechLang === 'ml-IN'
                        ? 'മലയാളത്തിൽ കേൾക്കുന്നു (Listening in Malayalam)...'
                        : 'Listening (English)... Speak your query'}
                    </span>
                    {/* Visual Animated Audio Equalizer Wave */}
                    <div className="flex items-center gap-0.5 h-3 ml-1">
                      <span className="w-1 bg-red-500 rounded-full h-2 animate-bounce" />
                      <span className="w-1 bg-red-600 rounded-full h-3.5 animate-bounce delay-75" />
                      <span className="w-1 bg-red-500 rounded-full h-2 animate-bounce delay-150" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {liveTranscript && (
                    <button
                      onClick={() => {
                        const cmd = liveTranscript;
                        stopListening();
                        handleSend(cmd);
                      }}
                      className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-bold shadow-xs cursor-pointer"
                    >
                      {isMl ? 'അയക്കുക' : 'Send'}
                    </button>
                  )}
                  <button
                    onClick={stopListening}
                    className="text-[11px] font-bold text-red-900 underline hover:text-red-950 cursor-pointer"
                  >
                    {isMl ? 'നിർത്തുക' : 'Done'}
                  </button>
                </div>
              </div>

              {/* Real-time transcribed words preview */}
              <div className="text-[11px] text-gray-700 italic bg-white/80 px-2.5 py-1 rounded-lg border border-red-200/60 truncate">
                {liveTranscript ? (
                  <span className="text-emerald-950 font-medium font-mono">
                    "{liveTranscript}"
                  </span>
                ) : (
                  <span className="text-gray-400">
                    {speechLang === 'ml-IN'
                      ? 'നിങ്ങൾ സംസാരിക്കുന്ന വാക്കുകൾ ഇവിടെ തത്സമയം കാണാം...'
                      : 'Speak now, words will appear here in real-time...'}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Quick Voice Presets Bar */}
          <div className="px-3 py-1.5 bg-white border-t border-gray-150 overflow-x-auto no-scrollbar flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide shrink-0 flex items-center gap-1">
              <Mic className="w-3 h-3 text-emerald-600" />
              {isMl ? 'കമാൻഡുകൾ:' : 'Voice Prompts:'}
            </span>
            {voiceCommands.slice(0, 4).map((vc, idx) => (
              <button
                key={idx}
                disabled={isLoading}
                onClick={() => handleRunVoiceCommand(vc.command)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-[11px] font-medium transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
              >
                {vc.label}
              </button>
            ))}
          </div>

          {/* Voice Settings & Options Bar */}
          <div className="px-3 py-1.5 bg-gray-50 border-t border-gray-150 flex items-center justify-between text-[10px] text-gray-600">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoSendVoice}
                  onChange={(e) => setAutoSendVoice(e.target.checked)}
                  className="w-3 h-3 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 cursor-pointer"
                />
                <span>{isMl ? 'ഓട്ടോ-സെൻഡ്' : 'Auto-send'}</span>
              </label>

              <label className="flex items-center gap-1 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoReadAnswers}
                  onChange={(e) => setAutoReadAnswers(e.target.checked)}
                  className="w-3 h-3 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 cursor-pointer"
                />
                <span>{isMl ? 'മറുപടി വായിക്കുക' : 'Read aloud'}</span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              {/* Language Selector for voice recognition engine */}
              <button
                type="button"
                onClick={() => setSpeechLang(speechLang === 'ml-IN' ? 'en-IN' : 'ml-IN')}
                className="px-1.5 py-0.5 rounded bg-white border border-gray-200 text-[9px] font-bold text-emerald-800 hover:bg-emerald-50 transition-colors cursor-pointer"
                title="Toggle recognition language between ml-IN and en-IN"
              >
                {speechLang === 'ml-IN' ? 'ശബ്ദം: മലയാളം' : 'Voice: English'}
              </button>

              <button
                onClick={() => handleRunVoiceCommand(voiceCommands[0]?.command || 'Should I water today?')}
                className="text-emerald-700 hover:underline font-semibold cursor-pointer"
              >
                {isMl ? 'ടെസ്റ്റ് വോയ്‌സ്' : 'Test Voice'}
              </button>
            </div>
          </div>

          {/* Input Box & Mic Button */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-gray-150 flex items-center gap-2"
          >
            {/* Primary Voice Mic Button */}
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              className={`p-2.5 rounded-xl border transition-all shrink-0 cursor-pointer relative ${
                isListening
                  ? 'bg-red-600 text-white border-red-600 shadow-md ring-4 ring-red-200 animate-pulse'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300 hover:border-emerald-400'
              }`}
              title={
                isListening
                  ? 'സംസാരം നിർത്തുക (Stop Listening)'
                  : isMl
                  ? 'മലയാളത്തിൽ സംസാരിക്കാൻ മൈക്കിൽ ക്ലിക്ക് ചെയ്യുക (Speak Voice Command)'
                  : 'Click to speak your voice command in English or Malayalam'
              }
              aria-label="Toggle Voice Command"
            >
              {isListening ? (
                <MicOff className="w-4 h-4 text-white" />
              ) : (
                <>
                  <Mic className="w-4 h-4 text-emerald-700" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400" />
                </>
              )}
            </button>

            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                isMl
                  ? 'മൈക്കിൽ സംസാരിക്കൂ അല്ലെങ്കിൽ ചോദ്യം ടൈപ്പ് ചെയ്യൂ...'
                  : 'Speak via mic or type your farm question...'
              }
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-gray-50/70"
              disabled={isLoading}
            />

            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="p-2.5 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 disabled:opacity-40 disabled:hover:bg-emerald-700 transition-colors shrink-0 shadow-xs cursor-pointer"
              aria-label="Send Message"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </form>
        </div>
      )}
    </>
  );
};
