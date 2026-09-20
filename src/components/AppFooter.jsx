import React from 'react';
import { REGION } from '../config/region';

/** App footer: region label + data-source attribution. */
export default function AppFooter() {
  return (
    <footer className="w-full border-t border-line bg-app py-4 text-center text-xs font-mono text-ink-3">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>ResQBharat • {REGION.label}</div>
        <div className="text-ink-3/70">{REGION.attribution} • SUPABASE • LEAFLET</div>
      </div>
    </footer>
  );
}
