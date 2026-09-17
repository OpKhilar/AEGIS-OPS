import React, { useState, useEffect } from 'react';
import { 
  X, 
  Flame, 
  AlertOctagon, 
  MapPin, 
  Send,
  PlusCircle,
  Radio
} from 'lucide-react';
import { playAlertSound } from '../utils/audio';

export default function NewIncidentModal({
  isOpen,
  onClose,
  onCreateIncident,
  soundEnabled = true
}) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('fire');
  const [severity, setSeverity] = useState('critical');
  const [address, setAddress] = useState('');
  const [casualties, setCasualties] = useState('');
  const [description, setDescription] = useState('');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Create incident around operational zone with slight offset
    const newInc = {
      id: `INC-${Math.floor(8100 + Math.random() * 800)}`,
      title,
      type,
      severity,
      location: [
        37.7749 + (Math.random() - 0.5) * 0.03,
        -122.4194 + (Math.random() - 0.5) * 0.03
      ],
      address: address || 'Operational Sector Grid 4',
      reportedAt: 'Just now',
      timestamp: Date.now(),
      status: 'ACTIVE_DISPATCH',
      casualties: casualties || 'Assessing on scene',
      description,
      assignedResponders: [],
      radius: severity === 'critical' ? 450 : 250
    };

    if (onCreateIncident) onCreateIncident(newInc);
    if (soundEnabled) playAlertSound(severity);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Log Critical Incident</h2>
              <p className="text-xs text-slate-400 font-mono">Dispatcher Priority Transmission</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 text-xs font-sans">
          
          <div>
            <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1 font-mono text-[11px]">
              Incident Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 3-Alarm Commercial Fire or Gas Main Rupture"
              className="w-full bg-slate-950 text-slate-100 p-2.5 rounded-lg border border-slate-800 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1 font-mono text-[11px]">
                Incident Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-slate-950 text-slate-100 p-2.5 rounded-lg border border-slate-800 focus:outline-none focus:border-rose-500"
              >
                <option value="fire">Fire & Rescue 🔥</option>
                <option value="flood">Flash Flood / Marine 🌊</option>
                <option value="hazmat">Chemical / HazMat ☣️</option>
                <option value="medical">Mass Casualty / Medical 🚑</option>
                <option value="power">Grid / Power Surge ⚡</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1 font-mono text-[11px]">
                Severity Level
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full bg-slate-950 text-slate-100 p-2.5 rounded-lg border border-slate-800 focus:outline-none focus:border-rose-500"
              >
                <option value="critical">Critical (Immediate Evac)</option>
                <option value="warning">Warning (Severe Concern)</option>
                <option value="advisory">Advisory (Logistics/Grid)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1 font-mono text-[11px]">
              Address / Sector
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 220 5th St, Corner of Folsom"
              className="w-full bg-slate-950 text-slate-100 p-2.5 rounded-lg border border-slate-800 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1 font-mono text-[11px]">
              Reported Casualties / Hazards
            </label>
            <input
              type="text"
              value={casualties}
              onChange={(e) => setCasualties(e.target.value)}
              placeholder="e.g. 2 trapped in elevator / Gas odor strong"
              className="w-full bg-slate-950 text-slate-100 p-2.5 rounded-lg border border-slate-800 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1 font-mono text-[11px]">
              Operational Briefing & Notes
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide tactical notes for responding units..."
              className="w-full bg-slate-950 text-slate-100 p-2.5 rounded-lg border border-slate-800 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold tracking-wider uppercase flex items-center gap-2 shadow-lg shadow-rose-950/60"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Incident</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
