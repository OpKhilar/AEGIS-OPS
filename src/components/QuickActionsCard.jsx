import React from 'react';
import { HeartPulse, ShieldAlert } from 'lucide-react';

const TRIAGE_CHIPS = [
  { emoji: '🚨', label: 'CPR', query: 'How to perform CPR on an adult', title: 'Adult CPR guide' },
  { emoji: '🩸', label: 'Bleeding', query: 'Step-by-step guide to stop severe arterial bleeding', title: 'Severe bleeding guide' },
  { emoji: '🫁', label: 'Choking', query: 'Choking adult Heimlich maneuver instructions', title: 'Choking guide' },
  { emoji: '🔥', label: 'Burns', query: 'First aid for severe burns and scalds', title: 'Burns guide' }
];

/**
 * Consolidated right-column action card: AI first-aid triage entry points
 * + citizen safety check-in. All behavior is owned by App via callbacks.
 */
export default function QuickActionsCard({ onOpenTriageWithChip, onOpenTriage, onCheckIn }) {
  return (
    <div className="p-4 rounded-2xl bg-surface border border-line shadow-xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-rose-500/20 text-rose-400">
            <HeartPulse className="w-4 h-4 animate-pulse" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-ink">
            ResQ-MEDIC TRIAGE
          </span>
        </div>
        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-400">
          112 READY
        </span>
      </div>

      {/* Fast triage chip buttons */}
      <div className="grid grid-cols-4 gap-1.5 text-[10px] font-mono">
        {TRIAGE_CHIPS.map(chip => (
          <button
            key={chip.label}
            onClick={() => onOpenTriageWithChip(chip.query)}
            title={chip.title}
            className="px-1.5 py-1.5 rounded-lg bg-app-2/90 hover:bg-rose-500/20 hover:text-ink text-ink-2 border border-line transition-all"
          >
            {chip.emoji} {chip.label}
          </button>
        ))}
      </div>

      <button
        onClick={onOpenTriage}
        className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-rose-950/50 flex items-center justify-center gap-2"
      >
        <HeartPulse className="w-3.5 h-3.5" />
        <span>Open First-Aid Terminal</span>
      </button>

      <button
        onClick={onCheckIn}
        className="w-full py-2 px-3 rounded-xl bg-elevated/90 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-700/50 dark:border-emerald-900/50 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
      >
        <ShieldAlert className="w-3.5 h-3.5" />
        <span>Check In My Status</span>
      </button>
    </div>
  );
}
