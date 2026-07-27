import React from 'react';
import { ShieldAlert, X, PhoneCall, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { EMERGENCY_NUMBERS } from '../data/bnsKnowledgeBase';
import { HelplineTarget } from './CallConfirmationModal';

interface EmergencyGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAskEmergency: (query: string) => void;
  onRequestCall: (helpline: HelplineTarget) => void;
}

export const EmergencyGuideModal: React.FC<EmergencyGuideModalProps> = ({
  isOpen,
  onClose,
  onAskEmergency,
  onRequestCall,
}) => {
  if (!isOpen) return null;

  const emergencyGuides = [
    {
      title: 'Mobile Phone Theft / Loss',
      hindi: 'Phone chori hone par',
      steps: [
        'Cyber fraud hone par turant 1930 helpline dial karein.',
        'Telecom provider se SIM card block karwayein.',
        'Paas ke police station mein FIR ya Zero FIR darj karwayein.',
        'CEIR portal par IMEI block karein aur UPI/banking passwords badlein.',
      ],
      query: 'Mera mobile phone chori ho gaya hai, kya steps lene chahiye?',
    },
    {
      title: 'Online Blackmail / Photo Leak Threat',
      hindi: 'Online dhamki ya blackmailing',
      steps: [
        'Apradhi ko paise KABHI NA DEIN.',
        'Chat, messages aur screenshots safe karke saboot rakhein.',
        '1930 Helpline ya cybercrime.gov.in portal par complaint karein.',
        'Police station mein cyber complaint darj karein.',
      ],
      query: 'Kisi ne meri private photo leak karne ki dhamki di hai, kya karun?',
    },
    {
      title: 'Domestic Violence / Threat',
      hindi: 'Gharelu hinsa ya dhamki',
      steps: [
        'National Emergency 112 ya Women Helpline 181 par call karein.',
        'Chot ya ilaaj ka medical record aur saboot sambhaal kar rakhein.',
        'Paas ke police station ya Mahila Thana se Sampark karein.',
      ],
      query: 'Gharelu hinsa aur dhamki se bachav ke kanooni dharayein kya hain?',
    },
    {
      title: 'Cyber / UPI Fraud',
      hindi: 'Online dhokhadhadi aur UPI fraud',
      steps: [
        'Bank ko turant call karke account/card block karein.',
        'Transaction ID, UTR number, mobile number aur screenshots collect karein.',
        '1930 Cyber helpline par report karke hold request karwayein.',
      ],
      query: 'Online UPI fraud ho gaya hai, paise waapis pane ka kya tarika hai?',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-2xl border border-white/90 text-slate-900 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-red-200/80 bg-gradient-to-r from-red-50 via-white to-pink-50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 border border-red-300 flex items-center justify-center text-red-600 shadow-2xs">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-black text-red-950">Citizen Emergency Action Guide</h2>
              <p className="text-xs text-red-800 font-medium">
                Aapatkaalin sthiti mein turant lene wale zaroori kadam
              </p>
            </div>
          </div>
          <button
            id="close-emergency-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-500 hover:text-slate-950 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Direct Helpline Buttons */}
        <div className="p-4 bg-slate-50/70 border-b border-slate-200/80">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Instant Tap-to-Call Helplines:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {EMERGENCY_NUMBERS.map((num) => (
              <button
                key={num.number}
                type="button"
                id={`modal-dial-${num.number}`}
                onClick={() => onRequestCall({ name: num.name, number: num.number, desc: num.desc })}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/90 hover:bg-red-50/90 border border-slate-200/90 hover:border-red-300 text-slate-900 transition-all group text-left cursor-pointer shadow-2xs"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-red-900">
                    {num.name}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">{num.desc}</div>
                </div>
                <span className="text-xs font-black text-pink-950 bg-pink-100 px-2 py-0.5 rounded-lg border border-pink-300 ml-2 shrink-0">
                  {num.number}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Guides List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {emergencyGuides.map((guide, idx) => (
            <div
              key={idx}
              className="bg-white/80 border border-slate-200 rounded-xl p-4 space-y-3 shadow-2xs"
            >
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                <div>
                  <h3 className="font-black text-pink-950 text-sm">{guide.title}</h3>
                  <span className="text-xs text-slate-500 font-sans font-medium">({guide.hindi})</span>
                </div>
                <button
                  id={`ask-emergency-guide-${idx}`}
                  onClick={() => {
                    onAskEmergency(guide.query);
                    onClose();
                  }}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-extrabold text-xs transition-all shadow-2xs"
                >
                  <span>Ask Justice Voice</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                {guide.steps.map((step, sIdx) => (
                  <li key={sIdx} className="flex items-start space-x-2">
                    <span className="w-4 h-4 rounded-full bg-pink-100 text-pink-950 font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-pink-300">
                      {sIdx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50/80 border-t border-slate-200/80 flex justify-between items-center text-xs text-slate-600 font-medium">
          <div className="flex items-center space-x-1 text-pink-950 font-bold">
            <ShieldCheck className="w-4 h-4 text-pink-600" />
            <span>Standard Police Procedure (BNS 2023)</span>
          </div>
          <button
            id="emergency-close-bottom-btn"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
