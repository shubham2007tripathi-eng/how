import React, { useState, useEffect } from 'react';
import { Send, Mic, MicOff, RefreshCw, Sparkles, ChevronDown, ChevronUp, Shield, PhoneCall, FileText } from 'lucide-react';
import { QUICK_QUESTIONS } from '../data/bnsKnowledgeBase';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onClearChat: () => void;
  speechLang?: 'hi-IN' | 'en-IN';
  setSpeechLang?: (lang: 'hi-IN' | 'en-IN') => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  isLoading,
  onClearChat,
  speechLang = 'hi-IN',
  setSpeechLang,
}) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [hasSpeechSupport, setHasSpeechSupport] = useState(false);
  const [showQuickOptions, setShowQuickOptions] = useState(true);
  const recognitionRef = React.useRef<any>(null);

  const quickCategoryChips = [
    { label: '📱 Phone Theft', query: 'Mera phone kisi ne chori kar liya hai, kya karun?' },
    { label: '🔒 Photo Leak Threat', query: 'Kisi ne meri private photos leak karne ki dhamki di hai.' },
    { label: '🚔 Zero FIR & Arrest Rights', query: 'Police station mein Zero FIR aur giraftari ke kya adhikar hain?' },
    { label: '🛡️ Self Defence Rules', query: 'Can I hit back in self-defence if someone attacks me?' },
    { label: '💳 UPI / Cyber Fraud', query: 'Online UPI fraud ho gaya hai, paise waapis pane ke liye kya karein?' },
    { label: '⚖️ Theft vs Robbery', query: 'Difference between Theft, Robbery and Snatching in BNS?' },
    { label: '🏠 Domestic Violence', query: 'Ghar par domestic violence ho raha hai, emergency help kaise lein?' },
  ];

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setHasSpeechSupport(true);
    }
  }, []);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.warn('Error stopping speech recognition on send:', err);
      }
      setIsListening(false);
    }
    onSendMessage(input.trim());
    setInput('');
  };

  const handleChipClick = (query: string) => {
    onSendMessage(query);
  };

  const toggleVoiceInput = () => {
    if (!hasSpeechSupport) return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          console.warn('Error stopping recognition:', err);
        }
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = speechLang;
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => setIsListening(true);

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript.trim()) {
          setInput(transcript);
        }
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech recognition error:', err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error('Failed to start speech recognition:', e);
      setIsListening(false);
    }
  };

  return (
    <div className="shrink-0 sticky bottom-0 w-full p-3 sm:p-4 bg-white/95 backdrop-blur-md border-t border-orange-200/80 z-20 shadow-lg">
      <div className="max-w-3xl mx-auto space-y-2.5">
        {/* Quick UI Selection Options Chips */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <button
              type="button"
              id="toggle-quick-options-btn"
              onClick={() => setShowQuickOptions(!showQuickOptions)}
              className="flex items-center space-x-1.5 text-orange-950 hover:text-orange-900 font-bold transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>Quick UI Options (Tap to Ask):</span>
              {showQuickOptions ? (
                <ChevronDown className="w-3.5 h-3.5 text-orange-600" />
              ) : (
                <ChevronUp className="w-3.5 h-3.5 text-orange-600" />
              )}
            </button>
            <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">
              BNS 2023 Citizen Queries
            </span>
          </div>

          {showQuickOptions && (
            <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1 text-xs">
              {quickCategoryChips.map((chip, idx) => (
                <button
                  key={idx}
                  id={`quick-chip-${idx}`}
                  type="button"
                  onClick={() => handleChipClick(chip.query)}
                  disabled={isLoading}
                  className="px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-50 to-pink-50 hover:from-orange-100 hover:to-pink-100 text-slate-800 hover:text-orange-950 border border-orange-200/80 whitespace-nowrap transition-all text-xs font-semibold shrink-0 disabled:opacity-50 shadow-2xs"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Active Listening Visual Banner */}
        {isListening && (
          <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-red-100/90 border border-red-300 text-red-950 text-xs animate-pulse shadow-2xs font-medium">
            <div className="flex items-center space-x-2">
              <Mic className="w-4 h-4 text-red-600 animate-bounce shrink-0" />
              <span className="font-bold">
                Listening ({speechLang === 'hi-IN' ? 'Hindi / देवनागरी hi-IN' : 'English / Hinglish en-IN'})... Speak clearly
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {setSpeechLang && (
                <button
                  type="button"
                  id="toggle-speech-lang-active-btn"
                  onClick={() => setSpeechLang(speechLang === 'hi-IN' ? 'en-IN' : 'hi-IN')}
                  className="px-2.5 py-1 rounded-lg bg-red-200 hover:bg-red-300 text-red-950 text-[10px] font-bold border border-red-300 transition-colors shadow-2xs"
                >
                  Switch to {speechLang === 'hi-IN' ? 'English (en-IN)' : 'Hindi (hi-IN)'}
                </button>
              )}
              <button
                type="button"
                onClick={toggleVoiceInput}
                className="text-[10px] underline font-bold hover:text-red-700"
              >
                Stop
              </button>
            </div>
          </div>
        )}

        {/* Form Controls */}
        <form onSubmit={handleSend} className="flex items-center space-x-2">
          {/* Clear Chat Button */}
          <button
            type="button"
            id="clear-chat-btn"
            onClick={onClearChat}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 hover:text-slate-950 border border-slate-200 transition-colors shrink-0 shadow-2xs"
            title="Reset Conversation"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Voice Input Button */}
          {hasSpeechSupport && (
            <button
              type="button"
              id="voice-input-btn"
              onClick={toggleVoiceInput}
              className={`p-2.5 rounded-xl border transition-all shrink-0 shadow-2xs ${
                isListening
                  ? 'bg-red-600 border-red-500 text-white animate-pulse shadow-md shadow-red-600/20'
                  : 'bg-orange-50 hover:bg-orange-100/80 text-orange-950 border-orange-200'
              }`}
              title={isListening ? 'Listening... Speak now' : 'Voice Input (Hinglish/Hindi)'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-orange-600" />}
            </button>
          )}

          {/* Text Input Field */}
          <input
            id="chat-input-field"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Apna kanooni sawal likhein (e.g. Phone chori hone par kya karein?)..."
            disabled={isLoading}
            className="flex-1 bg-white border border-slate-300/90 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-slate-900 placeholder-slate-400 rounded-xl px-4 py-2.5 text-sm outline-none transition-all shadow-inner font-medium"
          />

          {/* Send Button */}
          <button
            type="submit"
            id="send-message-btn"
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-extrabold transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 shadow-md shadow-orange-500/20"
            title="Send Question"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium px-1">
          <span>Justice Voice BNS 2023 legal awareness assist karta hai.</span>
          <span className="hidden sm:inline">Lawyer ki salah zaroori hoti hai.</span>
        </div>
      </div>
    </div>
  );
};
