import React, { useState, useEffect } from 'react';
import { REGION } from '../config/region';
import { 
  AlertOctagon, 
  Siren, 
  Radio, 
  Flame, 
  LifeBuoy, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle,
  Send,
  PhoneCall
} from 'lucide-react';
import { playAlertSound } from '../utils/audio';

export default function SosBanner({ 
  broadcastMessages = [], 
  onTriggerSos,
  incidentsCount = 5,
  respondersCount = 7,
  shelteredCount = 816,
  soundEnabled = true
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [sosActive, setSosActive] = useState(false);
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    if (!broadcastMessages.length) return;
    const interval = setInterval(() => {
      setCurrentIdx(prev => (prev + 1) % broadcastMessages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [broadcastMessages.length]);

  const handleSosClick = () => {
    if (sosActive) {
      // Cancel SOS
      setSosActive(false);
      setCountdown(null);
      return;
    }

    // Trigger confirmation countdown
    setCountdown(3);
    if (soundEnabled) playAlertSound('warning');

    let current = 3;
    const timer = setInterval(() => {
      current -= 1;
      if (current > 0) {
        setCountdown(current);
        if (soundEnabled) playAlertSound('warning');
      } else {
        clearInterval(timer);
        setCountdown(null);
        setSosActive(true);
        if (soundEnabled) playAlertSound('sos');
        if (onTriggerSos) {
          onTriggerSos({
            type: 'CITIZEN_SOS',
            timestamp: Date.now(),
            coordinates: REGION.center
          });
        }
      }
    }, 1000);
  };

  return (
    <section className="relative w-full overflow-hidden border-b border-line bg-app text-ink shadow-xl">
      {/* Background ambient strobe when SOS is active */}
      {sosActive && (
        <div className="absolute inset-0 bg-rose-600/10 pointer-events-none animate-pulse"></div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 sm:gap-4">
          
          {/* Alert Status & Ticker */}
          <div className="flex items-center gap-3 w-full lg:w-auto flex-1 min-w-0">
            <div className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-600 text-white text-xs font-black tracking-widest uppercase shadow-lg shadow-rose-900/50">
              <Siren className="w-4 h-4 animate-bounce" />
              <span>FLASH ALERT</span>
            </div>

            {/* Rotating Broadcast Stream */}
            <div className="flex-1 min-w-0 overflow-hidden">
              <div 
                key={currentIdx}
                className="text-xs sm:text-sm font-medium text-ink-2 truncate transition-all duration-500 ease-out flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>
                <span>{broadcastMessages[currentIdx] || 'ALL UNITS MAINTAIN RADIO SILENCE EXCEPT PRIORITY TRAFFIC'}</span>
              </div>
            </div>
          </div>

          {/* Tactical Counters */}
          <div className="hidden sm:flex items-center gap-4 text-xs font-mono border-y sm:border-y-0 sm:border-x border-line py-1 sm:py-0 sm:px-4">
            <div className="flex items-center gap-1.5 text-ink-2">
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span className="text-ink-3">Incidents:</span>
              <span className="font-bold text-rose-600 dark:text-rose-400">{incidentsCount}</span>
            </div>
            <div className="w-px h-3 bg-line-strong"></div>
            <div className="flex items-center gap-1.5 text-ink-2">
              <Radio className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span className="text-ink-3">Responders:</span>
              <span className="font-bold text-sky-600 dark:text-sky-400">{respondersCount}</span>
            </div>
            <div className="w-px h-3 bg-line-strong"></div>
            <div className="flex items-center gap-1.5 text-ink-2">
              <LifeBuoy className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-ink-3">Sheltered:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{shelteredCount}</span>
            </div>
          </div>

          {/* SOS Trigger Button + Emergency Call */}
          <div className="w-full sm:w-auto flex items-center justify-end gap-2">
            <a
              href={`tel:${REGION.emergencyNumbers.ambulance}`}
              title={`Call ${REGION.emergencyNumbers.ambulance} — Ambulance & Medical Emergency`}
              className="w-full sm:w-auto group px-4 py-2.5 rounded-xl font-bold tracking-wider text-xs uppercase transition-all duration-300 shadow-xl flex items-center justify-center gap-2 bg-emerald-600/90 text-white hover:bg-emerald-500 border border-emerald-400/50 shadow-emerald-950/60"
            >
              <PhoneCall className="w-4 h-4 group-hover:scale-125 transition-transform" />
              <span>Call {REGION.emergencyNumbers.ambulance} Ambulance</span>
            </a>
            <a
              href={`tel:${REGION.emergencyNumbers.fire}`}
              title={`Call ${REGION.emergencyNumbers.fire} — Fire Brigade Emergency`}
              className="w-full sm:w-auto group px-4 py-2.5 rounded-xl font-bold tracking-wider text-xs uppercase transition-all duration-300 shadow-xl flex items-center justify-center gap-2 bg-orange-600/90 text-white hover:bg-orange-500 border border-orange-400/50 shadow-orange-950/60"
            >
              <Flame className="w-4 h-4 group-hover:scale-125 transition-transform" />
              <span>Call {REGION.emergencyNumbers.fire} Fire</span>
            </a>
            <button
              onClick={handleSosClick}
              className={`w-full sm:w-auto relative group overflow-hidden px-5 py-2.5 rounded-xl font-bold tracking-wider text-xs uppercase transition-all duration-300 shadow-xl flex items-center justify-center gap-2 ${
                sosActive
                  ? 'bg-rose-600 text-white ring-4 ring-rose-500/50 shadow-rose-900/80 animate-pulse'
                  : countdown !== null
                  ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/40'
                  : 'bg-gradient-to-r from-rose-700 via-rose-600 to-red-600 text-white hover:from-rose-600 hover:to-red-500 shadow-rose-950/60 border border-rose-500/50'
              }`}
            >
              {sosActive ? (
                <>
                  <AlertOctagon className="w-4 h-4 text-white animate-spin" />
                  <span>SOS ACTIVE: BEACON BROADCASTING</span>
                  <span className="text-[10px] bg-black/40 px-1.5 py-0.5 rounded ml-1 font-mono">CLICK TO CANCEL</span>
                </>
              ) : countdown !== null ? (
                <>
                  <AlertTriangle className="w-4 h-4 text-slate-950 animate-bounce" />
                  <span>BROADCASTING IN {countdown}S...</span>
                </>
              ) : (
                <>
                  <AlertOctagon className="w-4 h-4 text-white group-hover:scale-125 transition-transform" />
                  <span>EMERGENCY SOS BEACON</span>
                  <ChevronRight className="w-4 h-4 text-rose-200 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
