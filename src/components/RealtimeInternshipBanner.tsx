import React from 'react';
import { Zap, Radio, Sparkles, PlusCircle, ArrowUpRight, CheckCircle2, Play, Pause } from 'lucide-react';
import { Internship, StudentProfile } from '../types';

interface RealtimeInternshipBannerProps {
  isAutoInfluxActive: boolean;
  onToggleAutoInflux: () => void;
  onTriggerRealtimeDrop: () => void;
  onOpenFastAiPost: () => void;
  realtimeCount: number;
  latestAlertRole?: Internship | null;
  onTrackAlertRole?: (role: Internship) => void;
  onViewAlertRole?: (role: Internship) => void;
  onDismissAlert?: () => void;
}

export const RealtimeInternshipBanner: React.FC<RealtimeInternshipBannerProps> = ({
  isAutoInfluxActive,
  onToggleAutoInflux,
  onTriggerRealtimeDrop,
  onOpenFastAiPost,
  realtimeCount,
  latestAlertRole,
  onTrackAlertRole,
  onViewAlertRole,
  onDismissAlert
}) => {
  return (
    <div className="space-y-3">
      {/* Real-time Status & Control Strip */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-md border border-indigo-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Live Indicator & Status */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-ping absolute" />
            <span className="w-3 h-3 rounded-full bg-emerald-400 relative" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Real-Time Indian Internship Stream</span>
                <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                  {isAutoInfluxActive ? 'LIVE STREAMING' : 'PAUSED'}
                </span>
              </h3>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Live verified hiring cohorts flowing from Bengaluru, Hyderabad, Gurugram, and Pune · Track any role with AI copilot
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          
          {/* Instant Drop Button */}
          <button
            onClick={onTriggerRealtimeDrop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0"
            title="Simulate immediate live role influx"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>Drop Live Role</span>
          </button>

          {/* Auto Influx Toggle */}
          <button
            onClick={onToggleAutoInflux}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
              isAutoInfluxActive 
                ? 'bg-emerald-950/60 text-emerald-200 border-emerald-700/60 hover:bg-emerald-900/60' 
                : 'bg-white/10 text-slate-300 border-white/20 hover:bg-white/20'
            }`}
            title={isAutoInfluxActive ? 'Pause automated real-time stream' : 'Activate live stream'}
          >
            {isAutoInfluxActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>Auto-Stream: {isAutoInfluxActive ? 'ON' : 'OFF'}</span>
          </button>

          {/* Fast AI Post JD */}
          <button
            onClick={onOpenFastAiPost}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white bg-white/10 hover:bg-white/15 border border-white/15 rounded-lg transition-colors whitespace-nowrap shrink-0"
            title="Paste any raw JD text and AI will extract fields into a live posting"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI JD Fast-Post</span>
          </button>

        </div>

      </div>

      {/* Real-time Alert Toast Notification (When a new role streams in) */}
      {latestAlertRole && (
        <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                  Just Influxed Real-Time
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-xs font-bold text-slate-900">{latestAlertRole.company}</span>
                <span className="text-xs text-slate-700 font-mono font-semibold">({latestAlertRole.stipend})</span>
              </div>
              <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
                {latestAlertRole.title} — {latestAlertRole.location}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={() => onTrackAlertRole?.(latestAlertRole)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
            >
              <Sparkles className="w-3 h-3" />
              <span>Track with AI</span>
            </button>

            <button
              onClick={() => onViewAlertRole?.(latestAlertRole)}
              className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-indigo-100/60 rounded-lg transition-colors"
            >
              View
            </button>

            {onDismissAlert && (
              <button
                onClick={onDismissAlert}
                className="text-xs text-slate-400 hover:text-slate-600 px-1 py-1"
                title="Dismiss alert"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
