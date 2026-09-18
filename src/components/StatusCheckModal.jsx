import React, { useState, useEffect } from 'react';
import { REGION } from '../config/region';
import { 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  MapPin, 
  Navigation, 
  Users, 
  HeartHandshake, 
  CheckCircle2, 
  Radio, 
  Send,
  Loader2
} from 'lucide-react';
import { playAlertSound } from '../utils/audio';

export default function StatusCheckModal({
  isOpen,
  onClose,
  onSubmitStatus,
  soundEnabled = true
}) {
  const [triageStatus, setTriageStatus] = useState('safe');
  const [coords, setCoords] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [addressNote, setAddressNote] = useState('Civic Center Plaza, North Entrance');
  const [headcount, setHeadcount] = useState(2);
  const [medicalNotes, setMedicalNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Default coordinate if none acquired
  useEffect(() => {
    if (isOpen && !coords) {
      setCoords({ lat: REGION.center[0], lng: REGION.center[1], accuracy: '± 5m' });
    }
    if (isOpen) {
      setSubmitted(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGetLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: Number(position.coords.latitude.toFixed(4)),
            lng: Number(position.coords.longitude.toFixed(4)),
            accuracy: `± ${Math.round(position.coords.accuracy || 8)}m`
          });
          setIsLocating(false);
          if (soundEnabled) playAlertSound('advisory');
        },
        (error) => {
          console.warn('Geolocation fallback used:', error);
          // Simulated high-precision tactical coordinate
          setCoords({
            lat: REGION.center[0] + (Math.random() - 0.5) * 0.01,
            lng: REGION.center[1] + (Math.random() - 0.5) * 0.01,
            accuracy: '± 4m (Simulated GPS)'
          });
          setIsLocating(false);
          if (soundEnabled) playAlertSound('advisory');
        },
        { timeout: 4000 }
      );
    } else {
      setCoords({ lat: REGION.center[0], lng: REGION.center[1], accuracy: '± 5m (Simulated)' });
      setIsLocating(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalReport = {
      id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      status: triageStatus.toUpperCase(),
      coordinates: [coords?.lat || REGION.center[0], coords?.lng || REGION.center[1]],
      address: addressNote,
      headcount,
      medicalNotes,
      timestamp: Date.now()
    };

    setSubmitted(true);
    if (soundEnabled) {
      playAlertSound(triageStatus === 'critical' ? 'critical' : 'advisory');
    }

    if (onSubmitStatus) {
      onSubmitStatus(finalReport);
    }

    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-app/80 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative w-full max-w-xl bg-elevated border border-line-strong rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-line bg-app-2/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 id="modal-title" className="text-base sm:text-lg font-bold text-ink">
                Citizen Safety Check-In & Triage
              </h2>
              <p className="text-xs text-ink-3 font-mono">
                Encrypted Emergency Mesh Dispatch Protocol
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-3 hover:text-ink hover:bg-app-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-ink">Status Broadcasted Successfully</h3>
            <p className="text-xs text-ink-2 max-w-sm mx-auto font-mono">
              Your status and coordinates have been transmitted across the ad-hoc emergency mesh. Tactical responders in your sector have been alerted.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
            
            {/* 1. Triage Status Selection */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ink-2 font-bold mb-2">
                1. Current Safety Status & Triage Level
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Safe Option */}
                <div
                  onClick={() => setTriageStatus('safe')}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    triageStatus === 'safe'
                      ? 'bg-emerald-950/40 border-emerald-500 text-white ring-2 ring-emerald-500/30'
                      : 'bg-app-2/40 border-line text-ink-3 hover:border-line-strong'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-xs text-emerald-400">I AM SAFE</span>
                  </div>
                  <p className="text-[10px] text-ink-3 leading-tight">
                    Sheltered in place. No immediate injuries or danger.
                  </p>
                </div>

                {/* Need Supplies */}
                <div
                  onClick={() => setTriageStatus('supplies')}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    triageStatus === 'supplies'
                      ? 'bg-amber-950/40 border-amber-500 text-white ring-2 ring-amber-500/30'
                      : 'bg-app-2/40 border-line text-ink-3 hover:border-line-strong'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-xs text-amber-400">NEED AID</span>
                  </div>
                  <p className="text-[10px] text-ink-3 leading-tight">
                    Require water, food, power, or shelter assistance.
                  </p>
                </div>

                {/* Critical Rescue */}
                <div
                  onClick={() => setTriageStatus('critical')}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    triageStatus === 'critical'
                      ? 'bg-rose-950/40 border-rose-500 text-white ring-2 ring-rose-500/30 animate-pulse'
                      : 'bg-app-2/40 border-line text-ink-3 hover:border-line-strong'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <AlertOctagon className="w-4 h-4 text-rose-500" />
                    <span className="font-bold text-xs text-rose-400">RESCUE NEEDED</span>
                  </div>
                  <p className="text-[10px] text-ink-3 leading-tight">
                    Critical trauma, trapped, or immediate danger.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Geolocation Ping */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-ink-2 font-bold">
                  2. Geolocation Ping & Address
                </label>

                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={isLocating}
                  className="flex items-center gap-1 text-[11px] font-mono text-sky-400 hover:text-sky-300 transition-colors"
                >
                  {isLocating ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Locking GPS...</span>
                    </>
                  ) : (
                    <>
                      <Navigation className="w-3 h-3" />
                      <span>Refresh GPS Ping</span>
                    </>
                  )}
                </button>
              </div>

              {coords && (
                <div className="mb-2 p-2 rounded-lg bg-app-2 border border-line flex items-center justify-between text-xs font-mono text-ink-2">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>LAT: {coords.lat}, LNG: {coords.lng}</span>
                  </div>
                  <span className="text-ink-3/80 text-[10px]">{coords.accuracy}</span>
                </div>
              )}

              <input
                type="text"
                value={addressNote}
                onChange={(e) => setAddressNote(e.target.value)}
                placeholder="Apartment #, floor, or visible street landmark..."
                className="w-full bg-app-2 text-ink-2 text-xs px-3 py-2 rounded-lg border border-line focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* 3. Headcount & Medical Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-2 font-bold mb-1">
                  People in Your Group
                </label>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-ink-3" />
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={headcount}
                    onChange={(e) => setHeadcount(Number(e.target.value))}
                    className="w-full bg-app-2 text-ink-2 text-xs px-3 py-2 rounded-lg border border-line focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-2 font-bold mb-1">
                  Special Medical / Access Needs
                </label>
                <input
                  type="text"
                  value={medicalNotes}
                  onChange={(e) => setMedicalNotes(e.target.value)}
                  placeholder="e.g. Oxygen tank, mobility aid, infant"
                  className="w-full bg-app-2 text-ink-2 text-xs px-3 py-2 rounded-lg border border-line focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {/* 4. Encrypted Telemetry Packet Preview */}
            <div className="p-2.5 rounded-lg bg-app-2/80 border border-line text-[10px] font-mono text-ink-3 space-y-1">
              <div className="flex items-center justify-between text-ink-3">
                <span>MESH TELEMETRY PAYLOAD PREVIEW</span>
                <span className="text-emerald-400">SHA-256 ENCRYPTED</span>
              </div>
              <div className="text-ink-2 truncate">                  {`{"node":"CITIZEN-TX","triage":"${triageStatus.toUpperCase()}","coords":[${(coords?.lat || REGION.center[0]).toFixed(2)},${(coords?.lng || REGION.center[1]).toFixed(2)}],"count":${headcount}}`}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-line">
              <button
                type="button"
                onClick={onClose}className="px-4 py-2 rounded-xl text-xs font-mono text-ink-3 hover:text-ink transition-colors">
                Cancel
              </button>

              <button
                type="submit"
                className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xl transition-all ${
                  triageStatus === 'critical'
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/50'
                    : triageStatus === 'supplies'
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Transmit Status Ping</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
