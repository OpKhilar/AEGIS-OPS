import React, { useState, useEffect } from 'react';
import { initSyncListener } from './utils/syncService';
import { registerSW } from 'virtual:pwa-register';

registerSW({ immediate: true });

import Navbar from './components/Navbar';
import SosBanner from './components/SosBanner';
import TacticalMap from './components/Map/TacticalMap';
import AlertFeed from './components/AlertFeed';
import ResponderDirectory from './components/ResponderDirectory';
import StatusCheckModal from './components/StatusCheckModal';
import NewIncidentModal from './components/NewIncidentModal';
import AiTriageChat from './components/AiTriageChat';
import { 
  fetchIncidents, 
  createIncident, 
  fetchResources, 
  submitUserStatus, 
  subscribeToIncidents 
} from './services/emergencyService';
import { isSupabaseConfigured } from './lib/supabaseClient';
import { 
  INITIAL_RESPONDERS, 
  INITIAL_ALERTS, 
  BROADCAST_TICKERS 
} from './data/mockEmergencyData';
import { 
  ShieldAlert, 
  CheckCircle, 
  Sparkles, 
  HeartPulse 
} from 'lucide-react';
import { playAlertSound } from './utils/audio';

export default function App() {
  const [incidents, setIncidents] = useState([]);
  const [resources, setResources] = useState([]);
  const [responders, setResponders] = useState(INITIAL_RESPONDERS);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [broadcastTickers, setBroadcastTickers] = useState(BROADCAST_TICKERS);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(isSupabaseConfigured);

  // Modal controls
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isNewIncidentModalOpen, setIsNewIncidentModalOpen] = useState(false);
  const [isAiTriageOpen, setIsAiTriageOpen] = useState(false);
  const [aiTriagePrefill, setAiTriagePrefill] = useState(null);

  // Tactical map interaction
  const [userBeacon, setUserBeacon] = useState(null);
  const [focusedItem, setFocusedItem] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleAskAiTriage = (alert) => {
    const query = `Urgent triage protocol needed for incident: ${alert.title}. Situation: ${alert.message}. Location: ${alert.zone}`;
    setAiTriagePrefill(query);
    setIsAiTriageOpen(true);
    if (soundEnabled) playAlertSound('advisory');
    showToast(`AEGIS-MEDIC dispatched for: ${alert.title}`);
  };

  const handleOpenAiTriageWithChip = (query) => {
    setAiTriagePrefill(query);
    setIsAiTriageOpen(true);
    if (soundEnabled) playAlertSound('advisory');
  };

  // Initial load from Supabase service
  useEffect(() => {
    async function loadData() {
      const incRes = await fetchIncidents();
      setIncidents(incRes.data);
      if (incRes.isRealtime) setIsSupabaseConnected(true);

      const rscRes = await fetchResources();
      setResources(rscRes.data);
    }
    loadData();
    initSyncListener();

    // Supabase Real-Time subscription for incoming incidents
    const unsubscribe = subscribeToIncidents((newInc) => {
      setIncidents(prev => [newInc, ...prev.filter(i => i.id !== newInc.id)]);
      const newAlert = {
        id: `ALT-RT-${newInc.id}`,
        severity: newInc.severity,
        source: 'SUPABASE REALTIME',
        title: `INCIDENT UPDATE: ${newInc.title}`,
        message: `${newInc.description} (${newInc.address})`,
        timestamp: 'Just now',
        time: Date.now(),
        zone: newInc.address
      };
      setAlerts(prev => [newAlert, ...prev]);
      if (soundEnabled) playAlertSound(newInc.severity);
      showToast(`Real-time update: ${newInc.title}`);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [soundEnabled]);

  // SOS Banner trigger
  const handleTriggerSos = (beaconData) => {
    setUserBeacon(beaconData);
    const newAlert = {
      id: `ALT-SOS-${Math.floor(1000 + Math.random() * 9000)}`,
      severity: 'critical',
      source: 'CITIZEN SOS BEACON',
      title: '🚨 PRIORITY SOS SIGNAL TRANSMITTED',
      message: 'Distress beacon active. Coords logged to Supabase user_status. Dispatching nearest rescue asset.',
      timestamp: 'Just now',
      time: Date.now(),
      zone: 'Sector 4-B'
    };
    setAlerts(prev => [newAlert, ...prev]);
    setFocusedItem(beaconData);
    showToast('EMERGENCY SOS BEACON BROADCASTED TO COMMAND.');

    // Write to Supabase user_status table
    submitUserStatus({
      id: `SOS-${Date.now()}`,
      status: 'CRITICAL',
      coordinates: beaconData.coordinates,
      address: 'Live Beacon Distress Ping',
      headcount: 1,
      medicalNotes: 'Emergency SOS Banner button triggered'
    });
  };

  // User Safety Status Check submission -> Supabase user_status table
  const handleSubmitStatus = async (report) => {
    setUserBeacon({
      coordinates: report.coordinates,
      status: report.status,
      timestamp: report.timestamp
    });

    const isCritical = report.status === 'CRITICAL';
    const newAlert = {
      id: `ALT-${report.id}`,
      severity: isCritical ? 'critical' : report.status === 'SUPPLIES' ? 'warning' : 'advisory',
      source: 'CITIZEN STATUS PING',
      title: `Citizen Triage: ${report.status} (${report.headcount} people)`,
      message: `${report.address}. ${report.medicalNotes ? 'Notes: ' + report.medicalNotes : 'No immediate injuries reported.'}`,
      timestamp: 'Just now',
      time: Date.now(),
      zone: 'Metro Sector'
    };

    setAlerts(prev => [newAlert, ...prev]);
    setFocusedItem({ location: report.coordinates });
    showToast(`Safety check-in recorded: ${report.status}`);

    // Insert into Supabase user_status
    await submitUserStatus(report);
  };

  // Dispatcher creates new incident -> Supabase incidents table
  const handleCreateIncident = async (newInc) => {
    setIncidents(prev => [newInc, ...prev]);
    const newAlert = {
      id: `ALT-${newInc.id}`,
      severity: newInc.severity,
      source: 'DISPATCH COMMAND',
      title: `NEW INCIDENT: ${newInc.title}`,
      message: `${newInc.description} (${newInc.address})`,
      timestamp: 'Just now',
      time: Date.now(),
      zone: newInc.address
    };
    setAlerts(prev => [newAlert, ...prev]);
    setFocusedItem(newInc);
    showToast(`Incident broadcasted to Supabase & tactical map.`);

    // Insert into Supabase
    await createIncident(newInc);
  };

  const handleSelectIncident = (inc) => {
    setFocusedItem(inc);
  };

  const handleSelectResponder = (resp) => {
    setFocusedItem(resp);
  };

  const handleSelectResource = (res) => {
    setFocusedItem(res);
  };

  const handleFocusIncidentById = (incId) => {
    const found = incidents.find(i => i.id === incId);
    if (found) {
      setFocusedItem(found);
    }
  };

  const shelterResources = resources.filter(r => r.type === 'shelter');
  const medicalResources = resources.filter(r => r.type === 'medical_center');
  const volunteerResources = resources.filter(r => r.type === 'volunteer_hub');

  const totalShelterCapacity = shelterResources.reduce((acc, s) => acc + (s.capacityMax || 0), 0);
  const currentSheltered = shelterResources.reduce((acc, s) => acc + (s.capacityCurrent || 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      
      {/* 1. Command Bar Navbar */}
      <Navbar
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onOpenStatusModal={() => setIsStatusModalOpen(true)}
        onOpenNewIncidentModal={() => setIsNewIncidentModalOpen(true)}
        onToggleAiTriage={() => setIsAiTriageOpen(prev => !prev)}
        isAiTriageOpen={isAiTriageOpen}
        threatLevel="DEFCON 2"
        activeIncidentsCount={incidents.length}
        activeRespondersCount={responders.length}
        isSupabaseConnected={isSupabaseConnected}
      />

      {/* 2. Urgent Flash Alert & SOS Banner */}
      <SosBanner
        broadcastMessages={broadcastTickers}
        onTriggerSos={handleTriggerSos}
        incidentsCount={incidents.length}
        respondersCount={responders.length}
        shelteredCount={currentSheltered || 816}
        soundEnabled={soundEnabled}
      />

      {/* 3. Main Command Dashboard Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
        
        {/* Upper Layout: Map & Live Alert Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Left / Center: Tactical Map (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <TacticalMap
              incidents={incidents}
              responders={responders}
              resources={resources}
              userBeacon={userBeacon}
              focusedItem={focusedItem}
              onSelectIncident={handleSelectIncident}
              onSelectResponder={handleSelectResponder}
              onSelectResource={handleSelectResource}
            />

            {/* Tactical Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 shadow-md">
                <div className="text-[10px] font-mono uppercase text-slate-400">Active Incidents</div>
                <div className="text-lg font-bold text-rose-400 mt-0.5">{incidents.length} Mapped</div>
                <div className="text-[10px] text-slate-500 font-mono">Pulsing Hazard Zones</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 shadow-md">
                <div className="text-[10px] font-mono uppercase text-slate-400">Emergency Shelters</div>
                <div className="text-lg font-bold text-emerald-400 mt-0.5">{shelterResources.length} Open</div>
                <div className="text-[10px] text-slate-500 font-mono">{currentSheltered} / {totalShelterCapacity || 1150} Beds</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 shadow-md">
                <div className="text-[10px] font-mono uppercase text-slate-400">Medical Centers</div>
                <div className="text-lg font-bold text-rose-500 mt-0.5">{medicalResources.length} Trauma Units</div>
                <div className="text-[10px] text-slate-500 font-mono">Helipads & ICU Ready</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 shadow-md">
                <div className="text-[10px] font-mono uppercase text-slate-400">Volunteer Depots</div>
                <div className="text-lg font-bold text-purple-400 mt-0.5">{volunteerResources.length} Staging Hubs</div>
                <div className="text-[10px] text-slate-500 font-mono">Sandbags & Food Supply</div>
              </div>
            </div>
          </div>

          {/* Right Column: Real-Time Alert Feed & Triage Summary (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <AlertFeed
              alerts={alerts}
              onSelectAlert={(alert) => {
                const matched = incidents.find(i => alert.title.includes(i.id) || alert.message.includes(i.id) || alert.zone.includes(i.address));
                if (matched) {
                  setFocusedItem(matched);
                } else if (alert.zone.includes('Mission')) {
                  setFocusedItem({ location: [37.7680, -122.4280] });
                } else if (alert.zone.includes('Waterfront') || alert.zone.includes('Downtown')) {
                  setFocusedItem({ location: [37.7950, -122.3980] });
                }
              }}
              onAddAlert={(newAlert) => setAlerts(prev => [newAlert, ...prev])}
              onAskAiTriage={handleAskAiTriage}
              soundEnabled={soundEnabled}
            />

            {/* AI First-Aid Triage Assistant Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-rose-950/20 to-slate-950 border border-rose-900/40 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-lg bg-rose-500/20 text-rose-400">
                    <HeartPulse className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      AEGIS-MEDIC AI TRIAGE
                    </span>
                    <div className="text-[9px] font-mono text-slate-400">
                      Vercel AI SDK • Gemini & Local Mesh
                    </div>
                  </div>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  ASSISTANT
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Emergency clinical triage guidance for CPR, severe hemorrhage, choking, and burns. Resilient zero-downtime offline fallback enabled.
              </p>

              {/* Fast triage chip buttons */}
              <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
                <button
                  onClick={() => handleOpenAiTriageWithChip('How to perform CPR on an adult')}
                  className="px-2 py-1.5 rounded-lg bg-slate-900/90 hover:bg-rose-500/20 hover:text-white text-slate-300 border border-slate-800 text-left transition-all flex items-center justify-between"
                >
                  <span>🚨 Adult CPR</span>
                  <span className="text-[9px] text-rose-400 font-bold">110 BPM</span>
                </button>
                <button
                  onClick={() => handleOpenAiTriageWithChip('Step-by-step guide to stop severe arterial bleeding')}
                  className="px-2 py-1.5 rounded-lg bg-slate-900/90 hover:bg-rose-500/20 hover:text-white text-slate-300 border border-slate-800 text-left transition-all flex items-center justify-between"
                >
                  <span>🩸 Bleeding</span>
                  <span className="text-[9px] text-amber-400 font-bold">CRIT</span>
                </button>
                <button
                  onClick={() => handleOpenAiTriageWithChip('Choking adult Heimlich maneuver instructions')}
                  className="px-2 py-1.5 rounded-lg bg-slate-900/90 hover:bg-rose-500/20 hover:text-white text-slate-300 border border-slate-800 text-left transition-all flex items-center justify-between"
                >
                  <span>🫁 Choking</span>
                  <span className="text-[9px] text-sky-400 font-bold">AIRWAY</span>
                </button>
                <button
                  onClick={() => handleOpenAiTriageWithChip('First aid for severe burns and scalds')}
                  className="px-2 py-1.5 rounded-lg bg-slate-900/90 hover:bg-rose-500/20 hover:text-white text-slate-300 border border-slate-800 text-left transition-all flex items-center justify-between"
                >
                  <span>🔥 Burns</span>
                  <span className="text-[9px] text-orange-400 font-bold">COOL</span>
                </button>
              </div>

              <button
                onClick={() => {
                  setAiTriagePrefill(null);
                  setIsAiTriageOpen(true);
                  if (soundEnabled) playAlertSound('advisory');
                }}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-rose-950/50 flex items-center justify-center gap-2"
              >
                <HeartPulse className="w-3.5 h-3.5" />
                <span>Open First-Aid AI Terminal</span>
              </button>
            </div>

            {/* Quick Action Triage Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 border border-slate-800/90 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Citizen Safety Check-In
                  </span>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-400">
                  ONLINE
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Check in your status or broadcast an urgent medical distress signal. Automatically updates the live map and logs to the Supabase database.
              </p>

              <button
                onClick={() => setIsStatusModalOpen(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2"
              >
                <span>Check In My Status</span>
              </button>
            </div>

          </div>

        </div>

        {/* Lower Layout: Responder Directory */}
        <section className="pt-2">
          <ResponderDirectory
            responders={responders}
            onSelectResponder={handleSelectResponder}
            onFocusIncident={handleFocusIncidentById}
          />
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950 py-4 text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>AEGIS-OPS • SUPABASE MULTI-LAYER EMERGENCY RESPONSE</div>
          <div className="text-slate-600">INCIDENTS • USER_STATUS • RESOURCES • LEAFLET OPENSTREETMAP</div>
        </div>
      </footer>

      {/* User Status Check Modal */}
      <StatusCheckModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onSubmitStatus={handleSubmitStatus}
        soundEnabled={soundEnabled}
      />

      {/* Log New Incident Modal */}
      <NewIncidentModal
        isOpen={isNewIncidentModalOpen}
        onClose={() => setIsNewIncidentModalOpen(false)}
        onCreateIncident={handleCreateIncident}
        soundEnabled={soundEnabled}
      />

      {/* Floating Tactical Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 p-3.5 rounded-xl bg-slate-900/95 border border-slate-700 text-xs font-mono text-slate-100 shadow-2xl flex items-center gap-2.5 animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Full Tactical AI First-Aid Triage Assistant Modal / Drawer */}
      {isAiTriageOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-3xl h-[88vh] max-h-[800px] flex flex-col">
            <AiTriageChat
              isOpen={true}
              onClose={() => {
                setIsAiTriageOpen(false);
                setAiTriagePrefill(null);
              }}
              soundEnabled={soundEnabled}
              prefillQuery={aiTriagePrefill}
            />
          </div>
        </div>
      )}

      {/* Floating Tactical AI Quick Trigger Button (When modal closed) */}
      {!isAiTriageOpen && (
        <button
          onClick={() => {
            setAiTriagePrefill(null);
            setIsAiTriageOpen(true);
            if (soundEnabled) playAlertSound('advisory');
          }}
          title="Open AEGIS-MEDIC AI First-Aid Triage Assistant"
          className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-700 to-slate-900 hover:from-rose-500 hover:to-rose-600 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 shadow-2xl shadow-rose-950/80 border border-rose-400/40 hover:scale-105 active:scale-95 transition-all group"
        >
          <div className="relative flex items-center justify-center w-6 h-6 rounded-lg bg-rose-500/30">
            <HeartPulse className="w-4 h-4 text-rose-300 animate-pulse group-hover:scale-110 transition-transform" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span>AI First-Aid</span>
          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] bg-black/50 text-emerald-300 font-mono border border-emerald-500/30">
            TRIAGE
          </span>
        </button>
      )}

    </div>
  );
}
