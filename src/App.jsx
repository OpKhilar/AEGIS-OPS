import React, { useState, useEffect, lazy, Suspense } from 'react';
import QuickActionsCard from './components/QuickActionsCard';
import AiTriageModal from './components/AiTriageModal';
import AppFooter from './components/AppFooter';
import LoadingPanel from './components/LoadingPanel';
import ThemeToggle from './components/ThemeToggle';
import { useTheme } from './hooks/useTheme';
import { initSyncListener } from './utils/syncService';
import { registerSW } from 'virtual:pwa-register';

registerSW({ immediate: true });

// Code-split heavy, below-the-fold components: they load as separate chunks on demand
const TacticalMap = lazy(() => import('./components/Map/TacticalMap'));
import Navbar from './components/Navbar';
import SosBanner from './components/SosBanner';
import AlertFeed from './components/AlertFeed';
// Responder directory is below the fold — loads as its own chunk
const ResponderDirectory = lazy(() => import('./components/ResponderDirectory'));
// Modals load on demand — they're only mounted while open
const StatusCheckModal = lazy(() => import('./components/StatusCheckModal'));
const NewIncidentModal = lazy(() => import('./components/NewIncidentModal'));
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
  CheckCircle,
  HeartPulse
} from 'lucide-react';
import { playAlertSound } from './utils/audio';

export default function App() {
  const { theme, toggleTheme } = useTheme();
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
  const currentSheltered = shelterResources.reduce((acc, s) => acc + (s.capacityCurrent || 0), 0);

  return (
    <div className="min-h-screen bg-app text-ink flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      
      {/* 1. Command Bar Navbar */}
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
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
            <Suspense
              fallback={
                <LoadingPanel
                  label="Loading Tactical Map…"
                  className="w-full h-[460px] lg:h-[560px] rounded-2xl overflow-hidden border border-line bg-app-2 shadow-2xl flex items-center justify-center"
                />
              }
            >
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
            </Suspense>

          </div>

          {/* Right Column: Real-Time Alert Feed & Triage Summary (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <AlertFeed
              alerts={alerts}
              onSelectAlert={(alert) => {
                const matched = incidents.find(i => alert.title.includes(i.id) || alert.message.includes(i.id) || alert.zone.includes(i.address));
                if (matched) {
                  setFocusedItem(matched);
                } else if (alert.zone.includes('Parel') || alert.zone.includes('Hindmata')) {
                  setFocusedItem({ location: [18.9680, 72.8280] });
                } else if (alert.zone.includes('Wadala') || alert.zone.includes('Highway')) {
                  setFocusedItem({ location: [18.9250, 72.8330] });
                }
              }}
              onAddAlert={(newAlert) => setAlerts(prev => [newAlert, ...prev])}
              onAskAiTriage={handleAskAiTriage}
              soundEnabled={soundEnabled}
            />

            {/* Quick Actions: AI Triage + Citizen Check-In (consolidated) */}
            <QuickActionsCard
              onOpenTriageWithChip={handleOpenAiTriageWithChip}
              onOpenTriage={() => {
                setAiTriagePrefill(null);
                setIsAiTriageOpen(true);
                if (soundEnabled) playAlertSound('advisory');
              }}
              onCheckIn={() => setIsStatusModalOpen(true)}
            />

          </div>

        </div>

        {/* Lower Layout: Responder Directory */}
        <section className="pt-2">
          <Suspense
            fallback={
              <LoadingPanel
                label="Loading Responder Directory…"                  className="w-full bg-surface rounded-2xl border border-line shadow-2xl p-5 space-y-3"
              />
            }
          >
          <ResponderDirectory
            responders={responders}
            onSelectResponder={handleSelectResponder}
            onFocusIncident={handleFocusIncidentById}
          />
          </Suspense>
        </section>

      </main>

      {/* Footer */}
      <AppFooter />

      {/* User Status Check Modal */}
      {isStatusModalOpen && (
        <Suspense fallback={null}>
          <StatusCheckModal
            isOpen={isStatusModalOpen}
            onClose={() => setIsStatusModalOpen(false)}
            onSubmitStatus={handleSubmitStatus}
            soundEnabled={soundEnabled}
          />
        </Suspense>
      )}

      {/* Log New Incident Modal */}
      {isNewIncidentModalOpen && (
        <Suspense fallback={null}>
          <NewIncidentModal
            isOpen={isNewIncidentModalOpen}
            onClose={() => setIsNewIncidentModalOpen(false)}
            onCreateIncident={handleCreateIncident}
            soundEnabled={soundEnabled}
          />
        </Suspense>
      )}

      {/* Floating Tactical Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 p-3.5 rounded-xl bg-elevated border border-line-strong text-xs font-mono text-ink shadow-2xl flex items-center gap-2.5 animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Full Tactical AI First-Aid Triage Assistant Modal / Drawer */}
      <AiTriageModal
        isOpen={isAiTriageOpen}
        onClose={() => {
          setIsAiTriageOpen(false);
          setAiTriagePrefill(null);
        }}
        soundEnabled={soundEnabled}
        prefillQuery={aiTriagePrefill}
      />

      {/* Floating Tactical AI Quick Trigger Button (When modal closed) */}
      {!isAiTriageOpen && (
        <button
          onClick={() => {
            setAiTriagePrefill(null);
            setIsAiTriageOpen(true);
            if (soundEnabled) playAlertSound('advisory');
          }}
          title="Open AEGIS-MEDIC AI First-Aid Triage Assistant"
          className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 shadow-2xl shadow-rose-950/80 border border-rose-400/40 hover:scale-105 active:scale-95 transition-all group"
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
