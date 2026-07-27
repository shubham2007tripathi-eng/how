import React, { useRef, useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import { ChatMessage } from '../types';
import { Scale, User, Copy, Check, Volume2, VolumeX, AlertCircle, ShieldCheck, Sparkles, History, ArrowUpRight } from 'lucide-react';

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSelectQuickQuestion: (q: string) => void;
  quickQuestions: string[];
  recentTopics?: string[];
  languageMode?: 'hindi' | 'english' | 'hinglish';
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  isLoading,
  onSelectQuickQuestion,
  quickQuestions,
  recentTopics = [],
  languageMode = 'hindi',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isLoading]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (id: string, text: string) => {
    if ('speechSynthesis' in window) {
      if (speakingId === id) {
        window.speechSynthesis.cancel();
        setSpeakingId(null);
        return;
      }
      window.speechSynthesis.cancel();
      const cleanedText = text
        .replace(/[\*\#\_\\[\]\(\)]/g, '')
        .replace(/^\s*[-*•]\s*/gm, '')
        .replace(/\s+/g, ' ')
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanedText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      if (languageMode === 'english') {
        utterance.lang = 'en-IN';
      } else {
        utterance.lang = 'hi-IN';
      }

      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);
      setSpeakingId(id);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div ref={containerRef} className="flex-1 min-h-0 w-full overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-100/40 backdrop-blur-xs">
      {messages.length === 0 ? (
        <div className="max-w-2xl mx-auto my-6 p-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-orange-100/90 text-slate-900 shadow-xl space-y-6">
          <div className="flex items-center space-x-3 border-b border-orange-100/80 pb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-md shadow-orange-500/20">
              <Scale className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">
                {languageMode === 'hindi'
                  ? 'नमस्ते! मैं न्याय वाणी हूँ 🙏'
                  : languageMode === 'english'
                  ? 'Namaste! I am Justice Voice 🙏'
                  : 'Namaste! Main Justice Voice Hoon 🙏'}
              </h2>
              <p className="text-sm text-slate-600 font-medium">
                {languageMode === 'hindi'
                  ? 'भारतीय न्याय संहिता (BNS 2023) के तहत आपकी कानूनी सहायता के लिए तैयार।'
                  : languageMode === 'english'
                  ? 'Ready to guide you with Indian Bharatiya Nyaya Sanhita (BNS 2023) legal advice.'
                  : 'Bharatiya Nyaya Sanhita (BNS 2023) ke tahat aapki aam kanooni madad ke liye tayar.'}
              </p>
            </div>
          </div>

          {recentTopics.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-200/80">
              <h3 className="text-xs font-bold uppercase tracking-wider text-orange-950 flex items-center space-x-1">
                <History className="w-4 h-4 text-orange-600" />
                <span>
                  {languageMode === 'hindi'
                    ? 'हाल के विषय (स्थानीय संग्रहण में सहेजे गए):'
                    : 'Recent Topics (Saved in Local Storage):'}
                </span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {recentTopics.map((topic, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelectQuickQuestion(topic)}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-50 to-pink-50 hover:from-orange-100 hover:to-pink-100 border border-orange-200 text-xs text-slate-800 font-semibold hover:text-orange-950 transition-all group shadow-2xs"
                  >
                    <span>"{topic}"</span>
                    <ArrowUpRight className="w-3 h-3 text-orange-600 opacity-80 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-orange-950 flex items-center space-x-1">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span>
                {languageMode === 'hindi'
                  ? 'आप क्या पूछ सकते हैं (पूछने के लिए टैप करें):'
                  : languageMode === 'english'
                  ? 'Common Legal Questions (Tap to Ask):'
                  : 'Aap kya puch sakte hain (Tap to Ask):'}
              </span>
            </h3>

            <div className="grid grid-cols-1 gap-2">
              {quickQuestions.map((question, idx) => (
                <button
                  key={idx}
                  id={`quick-question-${idx}`}
                  onClick={() => onSelectQuickQuestion(question)}
                  className="text-left px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-50/70 to-pink-50/70 hover:from-orange-100 hover:to-pink-100 border border-orange-200/80 text-sm text-slate-800 hover:text-orange-950 font-medium transition-all flex items-center justify-between group shadow-2xs"
                >
                  <span>"{question}"</span>
                  <span className="text-xs text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity font-bold ml-2">
                    Ask →
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-pink-50 border border-orange-200/80 rounded-xl p-3.5 text-xs text-orange-950 space-y-1 shadow-2xs">
            <p className="font-bold flex items-center space-x-1 text-orange-900">
              <ShieldCheck className="w-4 h-4 mr-1 text-orange-600 inline" />
              Legal Awareness Assurance:
            </p>
            <p className="text-slate-700">
              Sawal bilkul aam bhasha ya Hinglish mein likhein. Justice Voice ke jawaab BNS 2023 dharayo par aadharit hain, bina kisi mushkil legal jargon ke.
            </p>
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'bot' && (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white shrink-0 shadow-md mt-1">
                  <Scale className="w-5 h-5 text-white" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-tr-none shadow-orange-500/10'
                    : 'bg-white/95 backdrop-blur-md border border-orange-100 text-slate-900 rounded-tl-none space-y-3'
                }`}
              >
                <div className={`flex items-center justify-between text-[11px] font-bold pb-1.5 mb-2 border-b ${
                  msg.sender === 'user' ? 'border-white/30 text-white/90' : 'border-slate-100 text-slate-500'
                }`}>
                  <span>
                    {msg.sender === 'user' ? 'Aap (Citizen)' : 'Justice Voice Assistant'}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>

                <div className="text-sm leading-relaxed space-y-2">
                  {msg.sender === 'user' ? (
                    <p className="whitespace-pre-wrap text-white font-medium">{msg.text}</p>
                  ) : (
                    <div className="markdown-body">
                      <Markdown>{msg.text}</Markdown>
                    </div>
                  )}
                </div>

                {msg.sender === 'bot' && (
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                    <div className="flex items-center space-x-2">
                      <button
                        id={`copy-msg-${msg.id}`}
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition-colors border border-slate-200/80 font-medium"
                        title="Copy Response"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-bold text-[11px]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-500" />
                            <span className="text-[11px]">Copy</span>
                          </>
                        )}
                      </button>

                      <button
                        id={`speak-msg-${msg.id}`}
                        onClick={() => handleSpeak(msg.id, msg.text)}
                        className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition-colors border border-slate-200/80 font-medium"
                        title="Read Aloud"
                      >
                        {speakingId === msg.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-orange-600 animate-pulse" />
                            <span className="text-orange-700 font-bold text-[11px]">Stop</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-slate-500" />
                            <span className="text-[11px]">Listen</span>
                          </>
                        )}
                      </button>
                    </div>

                    <span className="text-[10px] text-slate-500 font-medium italic flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1 text-slate-400 inline" />
                      Legal Awareness
                    </span>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center text-orange-950 shrink-0 border border-orange-200/80 mt-1 shadow-2xs">
                  <User className="w-5 h-5 text-orange-950" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white shrink-0 shadow-md">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white/95 border border-orange-100 rounded-2xl rounded-tl-none p-4 text-slate-800 shadow-md">
                <div className="flex items-center space-x-2 text-xs text-orange-950 font-bold">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                  <span>Justice Voice BNS sections check kar raha hai...</span>
                </div>
              </div>
            </div>
          )}

          <div className="h-1" />
        </div>
      )}
    </div>
  );
};
