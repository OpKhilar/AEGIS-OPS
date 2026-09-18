import React from 'react';
import { REGION } from '../config/region';

/** Shared pulsing placeholder shown while a lazy section loads. */
export default function LoadingPanel({ label, className = '' }) {
  return (
    <div className={className} role="status" aria-live="polite">
      <span className="text-[11px] font-mono uppercase tracking-widest text-slate-500 animate-pulse">
        {label}
      </span>
    </div>
  );
}
