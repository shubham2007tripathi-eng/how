import React from 'react';
import { PhoneCall, ShieldAlert, X, Check } from 'lucide-react';

export interface HelplineTarget {
  name: string;
  number: string;
  desc?: string;
}

interface CallConfirmationModalProps {
  pendingCall: HelplineTarget | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const CallConfirmationModal: React.FC<CallConfirmationModalProps> = ({
  pendingCall,
  onConfirm,
  onCancel,
}) => {
  if (!pendingCall) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-2xl border border-white/90 text-slate-900 rounded-2xl w-full max-w-md p-6 shadow-2xl relative space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          type="button"
          id="close-call-modal-btn"
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-950 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-red-100 border border-red-300 flex items-center justify-center text-red-600 shrink-0 shadow-2xs">
            <PhoneCall className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-black text-red-950">Call for Help?</h3>
            <p className="text-xs text-slate-600 font-medium">Aapatkaalin Helpline Confirmation</p>
          </div>
        </div>

        {/* Details Card */}
        <div className="bg-slate-50/90 border border-slate-200/90 rounded-xl p-4 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-600 font-bold">
            <span>Helpline Service:</span>
            <span className="text-slate-900 font-extrabold">{pendingCall.name}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 text-xs font-bold">Dial Number:</span>
            <span className="font-black text-xl text-pink-900 tracking-wider">
              {pendingCall.number}
            </span>
          </div>
          {pendingCall.desc && (
            <p className="text-xs text-slate-600 font-medium border-t border-slate-200/80 pt-2 mt-2">
              {pendingCall.desc}
            </p>
          )}
        </div>

        {/* Explanation Alert */}
        <div className="flex items-start space-x-2 text-xs text-pink-950 bg-pink-50/90 border border-pink-200/90 rounded-xl p-3 shadow-2xs font-medium">
          <ShieldAlert className="w-4 h-4 text-pink-600 shrink-0 mt-0.5" />
          <span>
            Pressing <strong>"Call Now"</strong> will open your device dialer app to call {pendingCall.number} directly for immediate assistance.
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-3 pt-2">
          <button
            type="button"
            id="cancel-call-btn"
            onClick={onCancel}
            className="flex-1 py-2.5 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-sm transition-colors text-center"
          >
            Cancel
          </button>
          <button
            type="button"
            id="confirm-call-btn"
            onClick={onConfirm}
            className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm transition-all flex items-center justify-center space-x-2 shadow-md shadow-red-600/20"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call Now ({pendingCall.number})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
