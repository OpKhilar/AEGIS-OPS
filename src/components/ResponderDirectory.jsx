import React, { useState } from 'react';
import { 
  Users, 
  Radio, 
  BatteryCharging, 
  MapPin, 
  PhoneCall, 
  ExternalLink,
  Shield,
  Flame,
  LifeBuoy,
  Crosshair,
  Search
} from 'lucide-react';

export default function ResponderDirectory({
  responders = [],
  onSelectResponder,
  onFocusIncident
}) {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [activeCommsUnit, setActiveCommsUnit] = useState(null);

  const filteredResponders = responders.filter(resp => {
    const matchesFilter = filter === 'ALL' || resp.status === filter;
    const matchesSearch = 
      resp.name.toLowerCase().includes(search.toLowerCase()) ||
      resp.id.toLowerCase().includes(search.toLowerCase()) ||
      resp.unitType.toLowerCase().includes(search.toLowerCase()) ||
      resp.leadOfficer.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ON SCENE':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'EN ROUTE':
        return 'bg-sky-500/20 text-sky-400 border-sky-500/40 animate-pulse';
      case 'DISPATCHED':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      default:
        return 'bg-app-2 text-ink-3 border-line';
    }
  };

  const getUnitIcon = (unitType) => {
    if (unitType.includes('Air')) return '🚁';
    if (unitType.includes('Fire')) return '🚒';
    if (unitType.includes('Marine')) return '🚤';
    if (unitType.includes('CBRN') || unitType.includes('HazMat')) return '☣️';
    if (unitType.includes('Police') || unitType.includes('Law')) return '🚓';
    return '🚑';
  };

  return (
    <div className="w-full bg-surface backdrop-blur-md rounded-2xl border border-line shadow-2xl p-4 sm:p-5 space-y-4">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-line pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/30">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-ink flex items-center gap-2">
              <span>Tactical Responder Directory</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-500/20 text-sky-300 font-bold">
                {responders.length} UNITS
              </span>
            </h2>
            <p className="text-[10px] text-ink-3 font-mono">Field Units, Medevac & Specialized Emergency Teams</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-ink-3 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search units, officers..."
              className="w-full bg-app-2 text-ink-2 text-xs pl-8 pr-2.5 py-1.5 rounded-lg border border-line focus:outline-none focus:border-sky-500 font-sans"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 bg-app-2 p-1 rounded-lg border border-line text-[11px] font-mono">
            {['ALL', 'ON SCENE', 'EN ROUTE', 'AVAILABLE'].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-2.5 py-1 rounded transition-all ${
                  filter === s 
                    ? 'bg-line-strong text-ink font-bold' 
                    : 'text-ink-3 hover:text-ink-2'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Responders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredResponders.map((resp) => {
          const isCommsOpen = activeCommsUnit === resp.id;

          return (
            <div
              key={resp.id}
              className="p-3.5 rounded-xl bg-elevated/60 border border-line hover:border-sky-500/50 hover:bg-elevated transition-all space-y-3 group shadow-lg"
            >
              {/* Unit Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-app-2 border border-line-strong flex items-center justify-center text-sm shadow">
                    {getUnitIcon(resp.unitType)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-xs text-sky-400">{resp.id}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${getStatusBadge(resp.status)}`}>
                        {resp.status}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-ink-2 group-hover:text-ink transition-colors">
                      {resp.name}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => onSelectResponder && onSelectResponder(resp)}
                  title="Center unit on Tactical Map"className="p-1.5 rounded-lg bg-app-2/80 hover:bg-sky-500/20 text-ink-3 hover:text-sky-400 transition-colors">
                  <Crosshair className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Officer & Specs */}
              <div className="bg-app-2/60 rounded-lg p-2 border border-line text-[11px] space-y-1 font-mono">
                <div className="flex justify-between text-ink-3">
                  <span className="text-ink-3">Lead:</span>
                  <span className="text-ink font-sans font-semibold">{resp.leadOfficer}</span>
                </div>
                <div className="flex justify-between text-ink-3">
                  <span className="text-ink-3">Channel:</span>
                  <span className="text-sky-300 font-bold">{resp.radioChannel}</span>
                </div>
                <div className="flex justify-between text-ink-3">
                  <span className="text-ink-3">Crew / Fuel:</span>
                  <span className="text-ink-2">{resp.crewCount} personnel • {resp.fuelBattery}</span>
                </div>
              </div>

              {/* Equipment Tags */}
              <div className="flex flex-wrap gap-1">
                {resp.equipment.map((eq, i) => (
                  <span
                    key={i}className="px-1.5 py-0.5 rounded bg-app-2/80 text-[10px] text-ink-3 border border-line">
                    {eq}
                  </span>
                ))}
              </div>

              {/* Assignment or Comms Toggle */}
              <div className="pt-1 flex items-center justify-between gap-2 border-t border-line text-xs">
                {resp.assignedIncidentId ? (
                  <button
                    onClick={() => onFocusIncident && onFocusIncident(resp.assignedIncidentId)}
                    className="flex items-center gap-1 text-[11px] font-mono text-rose-600 dark:text-rose-400 hover:text-rose-500 transition-colors"
                  >
                    <Flame className="w-3 h-3" />
                    <span>Assigned: {resp.assignedIncidentId}</span>
                  </button>
                ) : (
                  <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>
                    Ready for Tasking
                  </span>
                )}

                <button
                  onClick={() => setActiveCommsUnit(isCommsOpen ? null : resp.id)}
                  className={`px-2 py-1 rounded text-[11px] font-mono transition-all flex items-center gap-1 ${
                    isCommsOpen
                      ? 'bg-sky-600 dark:bg-sky-500 text-white dark:text-slate-950 font-bold'
                      : 'bg-app-2 text-ink-2 hover:text-ink'
                  }`}
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>{isCommsOpen ? 'Patching...' : 'Comms'}</span>
                </button>
              </div>

              {/* Live Comms Drawer */}
              {isCommsOpen && (
                <div className="p-2 rounded bg-sky-500/10 border border-sky-500/40 text-[11px] font-mono space-y-1 animate-fadeIn">
                  <div className="text-sky-300 font-bold">TACTICAL AUDIO CHANNEL OPEN</div>
                  <div className="text-ink-3 text-[10px]">Encrypted P25 trunking on {resp.radioChannel}. Ready for voice dispatch.</div>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}
