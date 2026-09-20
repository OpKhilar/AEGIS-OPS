import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Radio, 
  Satellite, 
  Volume2, 
  VolumeX, 
  Clock, 
  UserCheck, 
  PlusCircle,
  Activity,
  Wifi,
  HeartPulse,
  Menu,
  X
} from 'lucide-react';
import { playAlertSound } from '../utils/audio';
import ThemeToggle from './ThemeToggle';

export default function Navbar({ 
  theme,
  onToggleTheme,
  soundEnabled, 
  setSoundEnabled, 
  onOpenStatusModal, 
  onOpenNewIncidentModal,
  onToggleAiTriage,
  isAiTriageOpen = false,
  threatLevel = 'DEFCON 2',
  activeIncidentsCount = 5,
  activeRespondersCount = 7,
  isSupabaseConnected = false
}) {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toTimeString().split(' ')[0] + ' UTC');
      setDateStr(now.toLocaleDateString('en-US', { 
        month: 'short', 
        day: '2-digit', 
        year: 'numeric' 
      }).toUpperCase());
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) {
      playAlertSound('advisory');
    }
  };

  // Close the mobile menu on Escape, lock body scroll while open
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [menuOpen]);

  /** Run an action from the mobile menu: dismiss it first, then fire. */
  const mobileAction = (fn) => () => {
    setMenuOpen(false);
    fn();
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-app/95 backdrop-blur-md border-b border-line shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Brand & Command Identity */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600/30 via-app-2 to-app border border-rose-500/40 shadow-inner">
              <ShieldAlert className="w-5 h-5 text-rose-500 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-4 ring-rose-500/20 animate-ping"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wider text-ink text-base sm:text-lg">
                  AEGIS<span className="text-rose-500">OPS</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 uppercase tracking-wider">
                  {threatLevel}
                </span>
              </div>
              <p className="text-[10px] font-mono tracking-widest text-ink-3 uppercase hidden md:block">
                Tactical Emergency Response & Incident Command
              </p>
            </div>
          </div>

          {/* Telemetry & Network Status */}
          <div className="hidden lg:flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-app-2/80 border border-line text-ink-2">
              <span className={`w-2 h-2 rounded-full ${isSupabaseConnected ? 'bg-emerald-400 animate-ping' : 'bg-sky-400'}`}></span>
              <span className="text-ink-3">DB:</span>
              <span className={isSupabaseConnected ? 'text-emerald-400 font-semibold' : 'text-sky-400 font-semibold'}>
                {isSupabaseConnected ? 'SUPABASE REALTIME' : 'LOCAL / RESILIENT MESH'}
              </span>
            </div>

            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-app-2/80 border border-line text-ink-2">
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-ink-3">Mesh:</span>
              <span className="text-emerald-400 font-semibold">14 NODES ACTIVE</span>
            </div>

            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-app-2/80 border border-line text-ink-2">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{dateStr}</span>
              <span className="text-amber-400 font-bold">{timeStr}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Light / Dark Mode Toggle */}
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />

            {/* Audio Alarm Toggle */}
            <button
              onClick={handleToggleSound}
              title={soundEnabled ? 'Mute Alert Audio' : 'Unmute Alert Audio'}
              className={`p-2 rounded-lg border transition-all ${
                soundEnabled 
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/40 hover:bg-rose-500/20' 
                  : 'bg-elevated text-ink-3 border-line hover:text-ink'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* AI First-Aid Triage Terminal Toggle */}
            <button
              onClick={onToggleAiTriage}
              title="Toggle AEGIS-MEDIC First-Aid AI Triage Assistant"
              className={`hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-lg border text-sm font-semibold transition-all shadow-sm ${
                isAiTriageOpen 
                  ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white border-rose-400 shadow-rose-950/50 ring-2 ring-rose-500/40' 
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/40 hover:bg-rose-500/20 hover:border-rose-500/70'
              }`}
            >
              <HeartPulse className={`w-4 h-4 text-rose-400 ${isAiTriageOpen ? 'animate-bounce text-white' : 'animate-pulse'}`} />
              <span>AI Triage</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </button>

            {/* Quick User Status Check */}
            <button
              onClick={onOpenStatusModal}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/20 hover:border-emerald-500/70 text-sm font-semibold transition-all shadow-sm group"
            >
              <UserCheck className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Check In</span>
            </button>

            {/* Log Incident */}
            <button
              onClick={onOpenNewIncidentModal}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-elevated text-ink-2 border border-line-strong hover:border-rose-500/60 hover:text-ink text-sm font-semibold transition-all"
            >
              <PlusCircle className="w-4 h-4 text-rose-400" />
              <span className="hidden md:inline">Log Incident</span>
            </button>

            {/* Mobile hamburger — collapses all text actions below 640px */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              aria-expanded={menuOpen}
              aria-controls="aegis-mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className={`sm:hidden flex items-center justify-center w-11 h-11 rounded-lg border transition-all ${
                menuOpen
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/40'
                  : 'bg-elevated text-ink-2 border-line hover:text-ink'
              }`}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile menu panel — full-width dropdown under the bar (< 640px only) */}
      {menuOpen && (
        <>
          <div
            className="sm:hidden fixed inset-0 top-16 z-40 bg-black/40"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <nav
            id="aegis-mobile-menu"
            aria-label="Mobile actions"
            className="sm:hidden absolute top-full left-0 right-0 z-50 border-b border-line bg-app/95 backdrop-blur-md shadow-2xl animate-menu-in"
          >
            <div className="px-4 py-3 space-y-1.5">
              {/* AI First-Aid Triage */}
              <button
                onClick={mobileAction(onToggleAiTriage)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
                  isAiTriageOpen
                    ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white border-rose-400 shadow-lg shadow-rose-950/50'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                }`}
              >
                <HeartPulse className={`w-5 h-5 ${isAiTriageOpen ? 'text-white animate-bounce' : 'text-rose-400 animate-pulse'}`} />
                <span>AI First-Aid Triage</span>
                {isAiTriageOpen && (
                  <span className="ml-auto text-[10px] font-mono uppercase tracking-wider">Open</span>
                )}
              </button>

              {/* Check In */}
              <button
                onClick={mobileAction(onOpenStatusModal)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-semibold bg-emerald-500/10 text-emerald-400 border-emerald-500/30 transition-all"
              >
                <UserCheck className="w-5 h-5" />
                <span>Check In My Status</span>
              </button>

              {/* Log Incident */}
              <button
                onClick={mobileAction(onOpenNewIncidentModal)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-semibold bg-elevated text-ink-2 border-line-strong transition-all"
              >
                <PlusCircle className="w-5 h-5 text-rose-400" />
                <span>Log Critical Incident</span>
              </button>
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
