import React from 'react';
import { History, X, Trash2, ArrowUpRight } from 'lucide-react';

interface RecentTopicsBarProps {
  recentTopics: string[];
  onSelectTopic: (topic: string) => void;
  onClearTopics: () => void;
  onRemoveTopic: (topicToRemove: string) => void;
}

export const RecentTopicsBar: React.FC<RecentTopicsBarProps> = ({
  recentTopics,
  onSelectTopic,
  onClearTopics,
  onRemoveTopic,
}) => {
  if (!recentTopics || recentTopics.length === 0) {
    return null;
  }

  return (
    <div className="shrink-0 bg-white/70 backdrop-blur-md border-b border-orange-100/90 px-4 py-1.5 text-xs text-slate-800 shadow-2xs">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
        {/* Label and Icon */}
        <div className="flex items-center space-x-1.5 text-orange-950 font-extrabold shrink-0">
          <History className="w-3.5 h-3.5 text-orange-600" />
          <span className="tracking-wide uppercase text-[11px]">Recent Topics:</span>
        </div>

        {/* Chips List (Horizontal scrollable on mobile) */}
        <div className="flex items-center space-x-2 overflow-x-auto py-1 no-scrollbar flex-1 min-w-0">
          {recentTopics.map((topic, idx) => (
            <div
              key={idx}
              className="inline-flex items-center bg-white/95 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 border border-orange-200/80 text-slate-900 rounded-full pl-3 pr-1.5 py-1 text-xs transition-all shrink-0 group max-w-[220px] sm:max-w-[260px] shadow-2xs"
            >
              <button
                id={`recent-topic-btn-${idx}`}
                onClick={() => onSelectTopic(topic)}
                className="truncate text-left flex items-center space-x-1 mr-1 focus:outline-none font-medium text-slate-800 group-hover:text-orange-950"
                title={`Re-ask: "${topic}"`}
              >
                <span className="truncate">{topic}</span>
                <ArrowUpRight className="w-3 h-3 text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </button>

              <button
                id={`recent-topic-remove-${idx}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveTopic(topic);
                }}
                className="p-0.5 hover:bg-slate-200 rounded-full text-slate-400 hover:text-red-600 transition-colors ml-0.5 focus:outline-none"
                title="Remove from recent topics"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Clear All Button */}
        <button
          id="clear-recent-topics-btn"
          onClick={onClearTopics}
          className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-600 border border-slate-200 text-[11px] font-semibold transition-colors shrink-0"
          title="Clear all recent topics history"
        >
          <Trash2 className="w-3 h-3" />
          <span className="hidden md:inline">Clear History</span>
        </button>
      </div>
    </div>
  );
};
