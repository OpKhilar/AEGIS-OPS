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
  Wifi
} from 'lucide-react';
import { playAlertSound } from '../utils/audio';

export default function Navbar({ 
  soundEnabled, 
  setSoundEnabled, 
  onOpenStatusModal, 
  onOpenNewIncidentModal,
  threatLevel = 'DEFCON 2',
  activeIncidentsCount = 5,
  activeRespondersCount = 7,
  isSupabaseConnected = false
}) {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

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

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Brand & Command Identity */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600/30 via-slate-900 to-slate-950 border border-rose-500/40 shadow-inner">
              <ShieldAlert className="w-5 h-5 text-rose-500 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-4 ring-rose-500/20 animate-ping"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wider text-white text-base sm:text-lg">
                  AEGIS<span className="text-rose-500">OPS</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 uppercase tracking-wider">
                  {threatLevel}
                </span>
              </div>
              <p className="text-[10px] font-mono tracking-widest text-slate-400 uppercase hidden md:block">
                Tactical Emergency Response & Incident Command
              </p>
            </div>
          </div>

          {/* Telemetry & Network Status */}
          <div className="hidden lg:flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300">
              <span className={`w-2 h-2 rounded-full ${isSupabaseConnected ? 'bg-emerald-400 animate-ping' : 'bg-sky-400'}`}></span>
              <span className="text-slate-400">DB:</span>
              <span className={isSupabaseConnected ? 'text-emerald-400 font-semibold' : 'text-sky-400 font-semibold'}>
                {isSupabaseConnected ? 'SUPABASE REALTIME' : 'LOCAL / RESILIENT MESH'}
              </span>
            </div>

            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300">
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400">Mesh:</span>
              <span className="text-emerald-400 font-semibold">14 NODES ACTIVE</span>
            </div>

            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{dateStr}</span>
              <span className="text-amber-400 font-bold">{timeStr}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Audio Alarm Toggle */}
            <button
              onClick={handleToggleSound}
              title={soundEnabled ? 'Mute Alert Audio' : 'Unmute Alert Audio'}
              className={`p-2 rounded-lg border transition-all ${
                soundEnabled 
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/40 hover:bg-rose-500/20' 
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Quick User Status Check */}
            <button
              onClick={onOpenStatusModal}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/20 hover:border-emerald-500/70 text-xs sm:text-sm font-semibold transition-all shadow-sm group"
            >
              <UserCheck className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="hidden xs:inline">Check In</span>
              <span className="xs:hidden">Status</span>
            </button>

            {/* Log Incident */}
            <button
              onClick={onOpenNewIncidentModal}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg bg-slate-900 text-slate-200 border border-slate-700 hover:border-rose-500/60 hover:text-white text-xs sm:text-sm font-semibold transition-all"
            >
              <PlusCircle className="w-4 h-4 text-rose-400" />
              <span className="hidden md:inline">Log Incident</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
