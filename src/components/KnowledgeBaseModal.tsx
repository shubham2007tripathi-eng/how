import React, { useState } from 'react';
import { BNS_CATEGORIES } from '../data/bnsKnowledgeBase';
import { X, Search, BookOpen, ChevronDown, ChevronUp, Shield, Scale, HelpCircle } from 'lucide-react';

interface KnowledgeBaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAskTopic: (topicTitle: string) => void;
}

export const KnowledgeBaseModal: React.FC<KnowledgeBaseModalProps> = ({
  isOpen,
  onClose,
  onAskTopic,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCat, setExpandedCat] = useState<string | null>('part1');

  if (!isOpen) return null;

  const filteredCategories = BNS_CATEGORIES.map((cat) => {
    const matchedTopics = cat.topics.filter(
      (t) =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.details.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const catMatches =
      cat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.hindiTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.summary.toLowerCase().includes(searchTerm.toLowerCase());

    return {
      ...cat,
      topics: catMatches ? cat.topics : matchedTopics,
      isMatch: catMatches || matchedTopics.length > 0,
    };
  }).filter((cat) => cat.isMatch);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-2xl border border-white/90 text-slate-900 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/15 border border-pink-400/40 flex items-center justify-center text-pink-900">
              <BookOpen className="w-6 h-6 text-pink-700" />
            </div>
            <div>
              <h2 className="text-lg font-black text-pink-950">BNS Citizen Knowledge Base (BNS 2023)</h2>
              <p className="text-xs text-slate-600 font-medium">
                Bharatiya Nyaya Sanhita ke sabhi mukhya bhaag (Parts 1–7) sadharan bhasha mein
              </p>
            </div>
          </div>
          <button
            id="close-kb-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-500 hover:text-slate-950 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 bg-slate-50/50 border-b border-slate-200/80">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              id="kb-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search BNS topics (e.g. Self Defence, FIR, Voyeurism, Stalking, Cyber Scam)..."
              className="w-full bg-white border border-slate-300 focus:border-amber-500 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none shadow-xs font-medium"
            />
          </div>
        </div>

        {/* Categories List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12 text-slate-500 space-y-2 font-medium">
              <HelpCircle className="w-10 h-10 mx-auto text-slate-400" />
              <p>Koi topic nahi mila. Dusra keyword try karein.</p>
            </div>
          ) : (
            filteredCategories.map((cat) => {
              const isExpanded = expandedCat === cat.id || searchTerm.length > 0;
              return (
                <div
                  key={cat.id}
                  className="bg-white/80 border border-slate-200 rounded-xl overflow-hidden shadow-2xs transition-all"
                >
                  <button
                    id={`toggle-cat-${cat.id}`}
                    onClick={() => setExpandedCat(isExpanded && !searchTerm ? null : cat.id)}
                    className="w-full p-4 text-left flex items-center justify-between bg-slate-50/80 hover:bg-pink-50/60 transition-colors"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-pink-950 text-base">{cat.title}</span>
                        <span className="text-xs text-slate-500 font-sans font-medium">({cat.hindiTitle})</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5 font-medium">{cat.summary}</p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-pink-600 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="p-4 space-y-3 bg-white/60 border-t border-slate-200/80">
                      {cat.topics.map((topic, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-slate-50/90 border border-slate-200/90 space-y-1.5 shadow-2xs"
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-slate-900 text-sm">{topic.title}</h4>
                            <button
                              id={`ask-topic-${cat.id}-${idx}`}
                              onClick={() => {
                                onAskTopic(`Tell me about ${topic.title} in BNS 2023`);
                                onClose();
                              }}
                              className="text-xs text-pink-950 font-bold px-2.5 py-1 rounded-lg bg-pink-100/90 border border-pink-300 hover:bg-pink-200 transition-colors shadow-2xs"
                            >
                              Ask Assistant →
                            </button>
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed font-medium">{topic.details}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50/80 border-t border-slate-200/80 flex justify-end">
          <button
            id="kb-close-bottom-btn"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-sm font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
