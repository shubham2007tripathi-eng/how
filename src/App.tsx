import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';
import { Header } from './components/Header';
import { EmergencyBanner } from './components/EmergencyBanner';
import { RecentTopicsBar } from './components/RecentTopicsBar';
import { ChatWindow } from './components/ChatWindow';
import { MessageInput } from './components/MessageInput';
import { KnowledgeBaseModal } from './components/KnowledgeBaseModal';
import { EmergencyGuideModal } from './components/EmergencyGuideModal';
import { CallConfirmationModal, HelplineTarget } from './components/CallConfirmationModal';
import { SettingsModal } from './components/SettingsModal';
import { SplashScreen } from './components/SplashScreen';
import { ChatMessage } from './types';
import { QUICK_QUESTIONS } from './data/bnsKnowledgeBase';

const LOCAL_STORAGE_RECENT_TOPICS_KEY = 'nyaya_setu_recent_topics';

// Helper to clean markdown formatting for smooth speech output
function cleanTextForSpeech(text: string): string {
  return text
    .replace(/[\*\#\_\\[\]\(\)]/g, '')
    .replace(/^\s*[-*•]\s*/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [languageMode, setLanguageMode] = useState<'hindi' | 'english' | 'hinglish'>('hindi');
  const [speechLang, setSpeechLang] = useState<'hi-IN' | 'en-IN'>('hi-IN');
  const [isKBOpen, setIsKBOpen] = useState(false);
  const [isEmergencyGuideOpen, setIsEmergencyGuideOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAutoVoiceEnabled, setIsAutoVoiceEnabled] = useState(true);
  const [pendingCall, setPendingCall] = useState<HelplineTarget | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Local storage state for 5 most recent topics
  const [recentTopics, setRecentTopics] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_RECENT_TOPICS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRequestCall = (helpline: HelplineTarget) => {
    setPendingCall(helpline);
  };

  const handleConfirmCall = () => {
    if (pendingCall) {
      window.location.href = `tel:${pendingCall.number}`;
      setPendingCall(null);
    }
  };

  const handleCancelCall = () => {
    setPendingCall(null);
  };

  // Speak out the latest bot reply if auto voice is enabled
  const speakText = (text: string) => {
    if ('speechSynthesis' in window && isAutoVoiceEnabled) {
      window.speechSynthesis.cancel(); // Stop ongoing speech
      const cleanedText = cleanTextForSpeech(text);
      const utterance = new SpeechSynthesisUtterance(cleanedText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      if (languageMode === 'english') {
        utterance.lang = 'en-IN';
      } else {
        utterance.lang = 'hi-IN';
      }
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleClearRecentTopics = () => {
    setRecentTopics([]);
    try {
      localStorage.removeItem(LOCAL_STORAGE_RECENT_TOPICS_KEY);
    } catch (e) {
      console.warn('Failed to clear recent topics from localStorage', e);
    }
  };

  const handleRemoveRecentTopic = (topicToRemove: string) => {
    setRecentTopics((prev) => {
      const updated = prev.filter((t) => t !== topicToRemove);
      try {
        localStorage.setItem(LOCAL_STORAGE_RECENT_TOPICS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to update recent topics in localStorage', e);
      }
      return updated;
    });
  };

  const handleSendMessage = async (text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    // Save topic to local storage (keep 5 most recent, unique)
    setRecentTopics((prev) => {
      const filtered = prev.filter((t) => t.toLowerCase() !== trimmedText.toLowerCase());
      const updated = [trimmedText, ...filtered].slice(0, 5);
      try {
        localStorage.setItem(LOCAL_STORAGE_RECENT_TOPICS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save recent topics to localStorage', e);
      }
      return updated;
    });

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: trimmedText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Build history for backend
      const history = updatedMessages.slice(0, -1).map((msg) => ({
        role: msg.sender === 'user' ? ('user' as const) : ('model' as const),
        parts: [{ text: msg.text }],
      }));

      // Add explicit language instruction depending on selected language mode
      let promptText = text;
      if (languageMode === 'english') {
        promptText = `${text}\n[SYSTEM DIRECTIVE: Respond ENTIRELY in fluent English.]`;
      } else if (languageMode === 'hindi') {
        promptText = `${text}\n[SYSTEM DIRECTIVE: Respond ENTIRELY in fluent Devanagari Hindi (हिंदी).]`;
      } else if (languageMode === 'hinglish') {
        promptText = `${text}\n[SYSTEM DIRECTIVE: Respond ENTIRELY in everyday Hinglish.]`;
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: promptText,
          history,
          languageMode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Server request failed');
      }

      const replyText = data.reply || 'Apna sawal dobara puchiye.';
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);

      // Automatically speak out the reply if auto voice is enabled
      speakText(replyText);
    } catch (err: any) {
      console.error('Error sending message:', err);
      const errorText = `Is topic ke exact section ka pata nahi — kripya ek lawyer ya legal aid se confirm karein.\n\n⚠️ Note: Server error ya connectivity issue ki wajah se response generate nahi ho saka (${err.message || 'Error'}).`;
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: errorText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
      speakText(errorText);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-screen h-dvh w-full bg-amber-50/40 bg-gradient-to-br from-orange-50/70 via-amber-50/50 to-pink-50/70 font-sans text-slate-900 antialiased selection:bg-orange-200 selection:text-orange-950 relative overflow-hidden">
      {/* Background ambient light blur blobs for glassmorphism depth in light orange and light pink */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-200/40 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-200/40 rounded-full blur-3xl pointer-events-none translate-y-1/2" />
      <div className="absolute top-1/2 right-10 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />

      {/* Startup Splash Screen */}
      {showSplash && <SplashScreen onDismiss={() => setShowSplash(false)} />}

      {/* Top Header */}
      <Header
        onOpenKnowledgeBase={() => setIsKBOpen(true)}
        onOpenEmergencyGuide={() => setIsEmergencyGuideOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenSplashScreen={() => setShowSplash(true)}
        languageMode={languageMode}
        setLanguageMode={setLanguageMode}
        isAutoVoiceEnabled={isAutoVoiceEnabled}
        setIsAutoVoiceEnabled={setIsAutoVoiceEnabled}
        speechLang={speechLang}
        setSpeechLang={setSpeechLang}
      />

      {/* Emergency Hotlines Banner */}
      <EmergencyBanner onRequestCall={handleRequestCall} />

      {/* Local Storage-based Recent Topics Bar */}
      <RecentTopicsBar
        recentTopics={recentTopics}
        onSelectTopic={handleSendMessage}
        onClearTopics={handleClearRecentTopics}
        onRemoveTopic={handleRemoveRecentTopic}
      />

      {/* Offline Status Bar Banner */}
      {isOffline && (
        <div className="shrink-0 bg-pink-100/90 backdrop-blur-md border-b border-pink-300/80 text-pink-950 px-4 py-1.5 text-xs flex items-center justify-between shadow-xs z-10">
          <div className="max-w-6xl mx-auto w-full flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <WifiOff className="w-4 h-4 text-pink-700 shrink-0" />
              <span>
                <strong>Offline Mode Active:</strong> App shell, emergency helplines (112, 1930, 1091, 181, 15100), and BNS Knowledge Base remain available offline.
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-pink-200 border border-pink-300 text-pink-950 shrink-0 font-bold hidden sm:inline-block">
              PWA Cached
            </span>
          </div>
        </div>
      )}

      {/* Main Chat Conversation Area */}
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onSelectQuickQuestion={handleSendMessage}
        quickQuestions={QUICK_QUESTIONS}
        recentTopics={recentTopics}
        languageMode={languageMode}
      />

      {/* Bottom Message Input Form */}
      <MessageInput
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        onClearChat={handleClearChat}
        speechLang={speechLang}
        setSpeechLang={setSpeechLang}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        speechLang={speechLang}
        setSpeechLang={setSpeechLang}
        languageMode={languageMode}
        setLanguageMode={setLanguageMode}
        isAutoVoiceEnabled={isAutoVoiceEnabled}
        setIsAutoVoiceEnabled={setIsAutoVoiceEnabled}
      />

      {/* BNS Knowledge Base Modal */}
      <KnowledgeBaseModal
        isOpen={isKBOpen}
        onClose={() => setIsKBOpen(false)}
        onAskTopic={handleSendMessage}
      />

      {/* Emergency Action Guide Modal */}
      <EmergencyGuideModal
        isOpen={isEmergencyGuideOpen}
        onClose={() => setIsEmergencyGuideOpen(false)}
        onAskEmergency={handleSendMessage}
        onRequestCall={handleRequestCall}
      />

      {/* Call Confirmation Dialog Modal */}
      <CallConfirmationModal
        pendingCall={pendingCall}
        onConfirm={handleConfirmCall}
        onCancel={handleCancelCall}
      />
    </div>
  );
}
