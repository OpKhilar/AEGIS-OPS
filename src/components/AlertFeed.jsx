import React, { useState, useEffect } from 'react';
import { REGION } from '../config/region';
import { 
  Bell, 
  AlertOctagon, 
  AlertTriangle, 
  Info, 
  Search, 
  Plus, 
  Play, 
  Pause, 
  Radio, 
  ChevronRight,
  Filter,
  CheckCircle,
  Clock,
  HeartPulse
} from 'lucide-react';
import { playAlertSound } from '../utils/audio';

export default function AlertFeed({
  alerts = [],
  onSelectAlert,
  onAddAlert,
  onAskAiTriage,
  soundEnabled = true
}) {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [autoSimulate, setAutoSimulate] = useState(false);

  // Simulation pool of realistic live emergency alerts
  const SIMULATED_POOL = [
    {
      severity: 'critical',
      source: 'RAPID TRIAGE SQUAD',
      title: 'Structural Shoring Failure: Kalbadevi Chawl Block',
      message: 'Creaking detected in north masonry wall. Secondary collapse danger. Pulling crews out of sector 2.',
      zone: 'Kalbadevi Ward'
    },
    {
      severity: 'warning',
      source: 'COAST GUARD MUMBAI',
      title: 'High Tide Storm Surge Advisory',
      message: 'Low-lying shoreline roadways will experience 1.5ft coastal overwash within the next 45 minutes.',
      zone: 'Marine Drive Front'
    },
    {
      severity: 'advisory',
      source: 'CIVIC POWER DISPATCH',
      title: 'Mobile Microgrid Deployed to Bhatia Hospital',
      message: 'Mobile trailer generator operational. Critical ICU telemetry powered independently of grid failure.',
      zone: 'Tardeo Corridor'
    },
    {
      severity: 'critical',
      source: 'HAZMAT SENSOR DRONE',
      title: 'Chlorine Gas Sensor Spike at Bhandup Water Plant',
      message: 'Continuous alarm at 12 ppm. Automatic isolation valve triggered. Decontamination team on standby.',
      zone: 'Eastern Suburbs'
    }
  ];

  // Auto simulation timer
  useEffect(() => {
    if (!autoSimulate) return;
    const interval = setInterval(() => {
      const randomItem = SIMULATED_POOL[Math.floor(Math.random() * SIMULATED_POOL.length)];
      const newAlert = {
        id: `ALT-${Math.floor(1000 + Math.random() * 9000)}`,
        ...randomItem,
        timestamp: 'Just now',
        time: Date.now()
      };
      if (onAddAlert) onAddAlert(newAlert);
      if (soundEnabled) playAlertSound(randomItem.severity);
    }, 18000);

    return () => clearInterval(interval);
  }, [autoSimulate, soundEnabled, onAddAlert]);

  const handleManualSimulate = () => {
    const randomItem = SIMULATED_POOL[Math.floor(Math.random() * SIMULATED_POOL.length)];
    const newAlert = {
      id: `ALT-${Math.floor(1000 + Math.random() * 9000)}`,
      ...randomItem,
      timestamp: 'Just now',
      time: Date.now()
    };
    if (onAddAlert) onAddAlert(newAlert);
    if (soundEnabled) playAlertSound(randomItem.severity);
  };

  // Filter and search
  const filteredAlerts = alerts.filter(alert => {
    const matchesFilter = filter === 'all' || alert.severity === filter;
    const matchesSearch = 
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.zone.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex flex-col h-full bg-surface backdrop-blur-md rounded-2xl border border-line shadow-2xl overflow-hidden">
      
      {/* Feed Header */}
      <div className="p-4 border-b border-line space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30">
              <Bell className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-ink flex items-center gap-2">
                <span>Real-Time Alert Feed</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-300 font-bold">
                  LIVE
                </span>
              </h2>
              <p className="text-[10px] text-ink-3 font-mono">EAS Broadcast & Field Telemetry</p>
            </div>
          </div>

          {/* Quick Simulation Trigger */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setAutoSimulate(!autoSimulate)}
              title={autoSimulate ? 'Pause Auto-Telemetry' : 'Enable Auto-Telemetry Stream'}
              className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono border transition-all ${
                autoSimulate 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                  : 'bg-elevated text-ink-3 border-line hover:text-ink'
              }`}
            >
              {autoSimulate ? <Pause className="w-3 h-3 text-emerald-400" /> : <Play className="w-3 h-3 text-ink-3" />}
              <span className="hidden sm:inline">{autoSimulate ? 'Streaming' : 'Stream'}</span>
            </button>

            <button
              onClick={handleManualSimulate}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 text-[11px] font-mono font-bold transition-all shadow-sm"
            >
              <Plus className="w-3 h-3 text-rose-400" />
              <span>Simulate</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-ink-3 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search alerts, zones, keywords..."
            className="w-full bg-elevated/90 text-ink text-xs pl-8 pr-3 py-1.5 rounded-lg border border-line focus:outline-none focus:border-rose-500/60 transition-colors placeholder:text-ink-3/70 font-sans"
          />
        </div>

        {/* Severity Filter Chips */}
        <div className="flex items-center gap-1.5 text-xs font-mono overflow-x-auto pb-0.5">
          <button
            onClick={() => setFilter('all')}
            className={`px-2 py-0.5 rounded-md transition-all ${
              filter === 'all' 
                ? 'bg-line-strong text-ink font-bold border border-line-strong' 
                : 'text-ink-3 hover:text-ink'
            }`}
          >
            All ({alerts.length})
          </button>
          <button
            onClick={() => setFilter('critical')}
            className={`px-2 py-0.5 rounded-md transition-all flex items-center gap-1 ${
              filter === 'critical' 
                ? 'bg-rose-600/30 text-rose-300 font-bold border border-rose-500/50' 
                : 'text-rose-400/70 hover:text-rose-300'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Critical
          </button>
          <button
            onClick={() => setFilter('warning')}
            className={`px-2 py-0.5 rounded-md transition-all flex items-center gap-1 ${
              filter === 'warning' 
                ? 'bg-amber-600/30 text-amber-300 font-bold border border-amber-500/50' 
                : 'text-amber-400/70 hover:text-amber-300'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Warning
          </button>
          <button
            onClick={() => setFilter('advisory')}
            className={`px-2 py-0.5 rounded-md transition-all flex items-center gap-1 ${
              filter === 'advisory' 
                ? 'bg-sky-600/30 text-sky-300 font-bold border border-sky-500/50' 
                : 'text-sky-400/70 hover:text-sky-300'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
            Advisory
          </button>
        </div>
      </div>

      {/* Alert Feed Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 max-h-[500px]">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-10 text-ink-3 text-xs font-mono">
            No matching broadcast alerts found.
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCritical = alert.severity === 'critical';
            const isWarning = alert.severity === 'warning';

            return (
              <div
                key={alert.id}
                onClick={() => onSelectAlert && onSelectAlert(alert)}
                className={`p-3 rounded-xl border transition-all cursor-pointer group hover:scale-[1.01] ${
                  isCritical
                    ? 'bg-rose-950/30 border-rose-900/60 hover:border-rose-500/80 hover:bg-rose-950/50 shadow-lg shadow-rose-950/30'
                    : isWarning
                    ? 'bg-amber-950/20 border-amber-900/40 hover:border-amber-500/60 hover:bg-amber-950/30'
                    : 'bg-elevated/50 border-line hover:border-sky-500/50 hover:bg-elevated/80'
                }`}
              >
                {/* Header Row */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    {isCritical ? (
                      <AlertOctagon className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 animate-pulse" />
                    ) : isWarning ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                    ) : (
                      <Info className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                    )}
                    <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-ink-3">
                      {alert.source}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-ink-3/80">
                    <Clock className="w-2.5 h-2.5" />
                    <span>{alert.timestamp}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xs font-bold text-ink group-hover:text-rose-600 dark:group-hover:text-rose-300 transition-colors leading-snug">
                  {alert.title}
                </h3>

                {/* Message */}
                <p className="text-[11px] text-ink-2 mt-1 line-clamp-2 leading-relaxed">
                  {alert.message}
                </p>

                {/* Footer Tag */}
                <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono">
                  <span className="px-1.5 py-0.5 rounded bg-app-2 border border-line text-ink-2">
                    📍 {alert.zone}
                  </span>
                  <div className="flex items-center gap-2">
                    {onAskAiTriage && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAskAiTriage(alert);
                        }}
                        title="Consult AEGIS-MEDIC for emergency triage instructions"
                        className="px-2 py-0.5 rounded bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 flex items-center gap-1 transition-all"
                      >
                        <HeartPulse className="w-2.5 h-2.5 text-rose-400 animate-pulse" />
                        <span>AI Protocol</span>
                      </button>
                    )}
                    <div className="flex items-center gap-1 text-ink-3 group-hover:text-ink-2 transition-colors">
                      <span>Track</span>
                      <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
