import React, { lazy, Suspense } from 'react';
import LoadingPanel from './LoadingPanel';

// The heavy chat chunk (react-markdown + guides) loads only when first opened
const AiTriageChat = lazy(() => import('./AiTriageChat'));

/**
 * Full-screen AEGIS-MEDIC triage terminal overlay.
 * Owns the lazy boundary for AiTriageChat so App stays chunk-lean.
 */
export default function AiTriageModal({ isOpen, onClose, soundEnabled, prefillQuery }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-app/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-3xl h-[88vh] max-h-[800px] flex flex-col">
        <Suspense
          fallback={
            <LoadingPanel
              label="Loading AEGIS-MEDIC…"
              className="w-full h-full rounded-2xl border border-line bg-app-2 flex items-center justify-center"
            />
          }
        >
          <AiTriageChat
            isOpen={true}
            onClose={onClose}
            soundEnabled={soundEnabled}
            prefillQuery={prefillQuery}
          />
        </Suspense>
      </div>
    </div>
  );
}
