import React from 'react';
import { PhoneCall, ShieldAlert, HeartHandshake, Baby, Globe, Ambulance } from 'lucide-react';
import { EMERGENCY_NUMBERS } from '../data/bnsKnowledgeBase';
import { HelplineTarget } from './CallConfirmationModal';

interface EmergencyBannerProps {
  onRequestCall: (helpline: HelplineTarget) => void;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({ onRequestCall }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldAlert':
        return <ShieldAlert className="w-3.5 h-3.5 text-red-600" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-3.5 h-3.5 text-pink-600" />;
      case 'Baby':
        return <Baby className="w-3.5 h-3.5 text-blue-600" />;
      case 'Globe':
        return <Globe className="w-3.5 h-3.5 text-amber-600" />;
      case 'Ambulance':
        return <Ambulance className="w-3.5 h-3.5 text-emerald-600" />;
      default:
        return <PhoneCall className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  return (
    <div className="shrink-0 bg-gradient-to-r from-orange-50/90 via-pink-50/90 to-orange-50/90 backdrop-blur-md border-b border-orange-200/80 text-slate-800 py-1.5 px-4 text-xs shadow-2xs">
      <div className="max-w-6xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar gap-4">
        <div className="flex items-center space-x-1 text-orange-950 font-extrabold shrink-0 uppercase tracking-wider text-[10px]">
          <PhoneCall className="w-3.5 h-3.5 text-orange-600 animate-bounce" />
          <span>National Emergency Helpline:</span>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          {EMERGENCY_NUMBERS.map((num) => (
            <button
              key={num.number}
              type="button"
              id={`dial-helpline-${num.number}`}
              onClick={() => onRequestCall({ name: num.name, number: num.number, desc: num.desc })}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-white/95 hover:bg-orange-100/90 border border-orange-200/90 text-slate-900 transition-all cursor-pointer shadow-2xs text-xs font-semibold"
              title={`${num.name}: ${num.desc} (Click to Call)`}
            >
              {getIcon(num.icon)}
              <span className="font-bold text-slate-800">{num.name}:</span>
              <span className="font-black text-orange-950">{num.number}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

