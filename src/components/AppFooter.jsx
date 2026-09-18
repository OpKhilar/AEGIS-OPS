import React from 'react';
import { REGION } from '../config/region';

/** App footer: region label + data-source attribution. */
export default function AppFooter() {
  return (
    <footer className="w-full border-t border-slate-900 bg-slate-950 py-4 text-center text-xs font-mono text-slate-500">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>AEGIS-OPS • {REGION.label}</div>
        <div className="text-slate-600">{REGION.attribution} • SUPABASE • LEAFLET</div>
      </div>
    </footer>
  );
}
