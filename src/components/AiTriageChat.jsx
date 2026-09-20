import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { REGION } from '../config/region';
import { 
  HeartPulse, 
  Sparkles, 
  Wifi, 
  WifiOff, 
  Send, 
  Trash2, 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  Key, 
  Check, 
  Copy, 
  Activity, 
  Minimize2, 
  Maximize2, 
  X
} from 'lucide-react';
import { aiTriageService } from '../services/aiTriageService';
import { startCprMetronome, stopCprMetronome } from '../utils/audio';

// Initial welcoming triage briefing
const INITIAL_MESSAGES = [
  {
    id: 'msg-welcome',
    role: 'assistant',
    source: 'system-init',
    timestamp: 'Command Live',
    content: `### 🚨 ResQ-MEDIC TRIAGE ASSISTANT ONLINE
**Tactical First-Aid & Emergency Medical Guidance Protocol v2.5**

I am ready to provide immediate, step-by-step triage guidance. State the emergency condition or tap a priority button below:

* **Airway & Resuscitation**: Adult/Infant CPR, Choking, Severe Asthma
* **Trauma & Hemorrhage**: Arterial Bleeds, Tourniquets, Compound Fractures
* **Environmental & Toxins**: Burns, Heat Stroke, Hypothermia, Snake Bites, Overdose

> [!NOTE]
> **Zero-Downtime Offline Resilience Active**: If connectivity drops, this terminal automatically fails over to pre-loaded clinical protocols stored in browser memory.`
  }
];

const QUICK_TRIAGE_CHIPS = [
  { label: '🚨 Adult CPR', query: 'How to perform CPR on an adult' },
  { label: '🩸 Severe Bleeding', query: 'Step-by-step guide to stop severe arterial bleeding' },
  { label: '🫁 Choking (Heimlich)', query: 'Choking adult Heimlich maneuver instructions' },
  { label: '🔥 Severe Burns', query: 'First aid for severe burns and scalds' },
  { label: '🦴 Bone Fracture', query: 'How to splint a broken bone and check for spinal injury' },
  { label: '⚡ Electric Shock', query: 'Emergency protocol for electrical shock victim' },
  { label: '🐍 Snake Bite', query: 'First aid steps for venomous snake bite' },
  { label: '💊 Poisoning / Overdose', query: 'Emergency steps for toxic chemical ingestion or overdose' },
  { label: '📋 All Offline Guides', query: 'Show all emergency protocols index' }
];

export default function AiTriageChat({ 
  isOpen = true, 
  onClose = null, 
  prefillQuery = null 
}) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOfflineSimulated, setIsOfflineSimulated] = useState(aiTriageService.isSimulatedOffline());
  const [isDeviceOnline, setIsDeviceOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [activeSpeechId, setActiveSpeechId] = useState(null);
  const [isMetronomeActive, setIsMetronomeActive] = useState(false);
  const [metronomeBeat, setMetronomeBeat] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [customKeyInput, setCustomKeyInput] = useState(aiTriageService.getApiKey());
  const [copiedId, setCopiedId] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const isActuallyOffline = isOfflineSimulated || !isDeviceOnline;

  const handleToggleOfflineSimulation = () => {
    const next = !isOfflineSimulated;
    setIsOfflineSimulated(next);
    aiTriageService.setSimulatedOffline(next);
  };

  const handleSaveApiKey = (e) => {
    e.preventDefault();
    aiTriageService.setApiKey(customKeyInput);
    setShowKeyModal(false);
  };

  const handleSend = React.useCallback(async (textToSend = null) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    setInput('');

    const userMessageId = `usr-${Date.now()}`;
    const newMessages = [
      ...messages,
      {
        id: userMessageId,
        role: 'user',
        content: query,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];

    setMessages(newMessages);
    setIsLoading(true);

    const botMessageId = `bot-${Date.now()}`;
    let accumulatedText = '';

    // Add empty placeholder for streaming response
    setMessages(prev => [
      ...prev,
      {
        id: botMessageId,
        role: 'assistant',
        content: '',
        source: isActuallyOffline ? 'local-protocol' : 'gemini-live',
        isFallback: isActuallyOffline,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    await aiTriageService.streamTriageResponse({
      messages: newMessages.map(m => ({ role: m.role, content: m.content })),
      onChunk: (chunk, fullText) => {
        accumulatedText = fullText;
        setMessages(prev => prev.map(m => m.id === botMessageId ? { ...m, content: fullText } : m));
      },
      onComplete: ({ text, isFallback, source, triageLevel }) => {
        setIsLoading(false);
        setMessages(prev => prev.map(m => 
          m.id === botMessageId 
            ? { 
                ...m, 
                content: text || accumulatedText, 
                isFallback, 
                source, 
                triageLevel 
              } 
            : m
        ));
      },
      onError: (err) => {
        console.warn('Triage stream error caught:', err);
      }
    });

    setIsLoading(false);
  }, [input, isLoading, isActuallyOffline, messages]);

  // Monitor network online/offline events
  useEffect(() => {
    const handleOnline = () => setIsDeviceOnline(true);
    const handleOffline = () => setIsDeviceOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      stopCprMetronome();
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Handle external prefilled queries (e.g., clicking on an incident)
  useEffect(() => {
    if (prefillQuery) {
      const timer = setTimeout(() => {
        handleSend(prefillQuery);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [prefillQuery, handleSend]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Text-To-Speech read aloud
  const handleToggleSpeak = (msgId, text) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (activeSpeechId === msgId) {
      window.speechSynthesis.cancel();
      setActiveSpeechId(null);
      return;
    }

    window.speechSynthesis.cancel();
    
    // Clean markdown tags for natural speech
    const cleanSpeechText = text
      .replace(/###/g, '')
      .replace(/\*\*/g, '')
      .replace(/>/g, '')
      .replace(/\[!.*?\]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanSpeechText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setActiveSpeechId(null);
    utterance.onerror = () => setActiveSpeechId(null);

    setActiveSpeechId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // CPR Metronome toggle
  const handleToggleMetronome = () => {
    if (isMetronomeActive) {
      stopCprMetronome();
      setIsMetronomeActive(false);
    } else {
      setIsMetronomeActive(true);
      startCprMetronome(110, () => {
        setMetronomeBeat(prev => !prev);
      });
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    stopCprMetronome();
    setIsMetronomeActive(false);
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setMessages(INITIAL_MESSAGES);
  };

  if (!isOpen) return null;

  return (
    <div className={`flex flex-col bg-app/95 border border-line backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
      isExpanded 
        ? 'fixed inset-4 z-50 sm:inset-10' 
        : 'w-full h-[620px]'
    }`}>
      
      {/* 1. Tactical Command Header */}
      <header className="px-4 py-3 bg-elevated/70 border-b border-line flex items-center justify-between gap-2 shrink-0">
        
        {/* Identity & Status */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-400">
            <HeartPulse className="w-4 h-4 animate-pulse" />
            <span className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
              isActuallyOffline ? 'bg-amber-400' : 'bg-emerald-400 animate-ping'
            }`} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono tracking-wider text-ink">
                ResQ<span className="text-rose-500">-MEDIC</span>
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/30">
                TRIAGE AI
              </span>
            </div>

            {/* Network / Model Mode Badge */}
            <div className="flex items-center gap-1.5 text-[10px] font-mono mt-0.5">
              {isActuallyOffline ? (
                <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
                  <WifiOff className="w-2.5 h-2.5" />
                  <span>LOCAL MESH (OFFLINE FALLBACK)</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <Wifi className="w-2.5 h-2.5" />
                  <span>LIVE (GEMINI 1.5 FLASH)</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tactical Controls & Metronome */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Metronome Indicator / Toggle */}
          <button
            onClick={handleToggleMetronome}
            title={isMetronomeActive ? 'Stop CPR Metronome' : 'Start 110 BPM CPR Metronome'}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-mono font-bold transition-all ${
              isMetronomeActive 
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40 ring-2 ring-rose-400 animate-pulse' 
                : 'bg-app-2 text-ink-2 border border-line hover:text-ink'
            }`}
          >
            <Activity className={`w-3.5 h-3.5 ${metronomeBeat ? 'scale-125 text-white' : ''}`} />
            <span className="hidden sm:inline">110 BPM</span>
          </button>

          {/* Simulate Offline Fallback Switch */}
          <button
            onClick={handleToggleOfflineSimulation}
            title={isOfflineSimulated ? 'Disable offline simulation' : 'Simulate network failure to test local fallback'}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-mono transition-all border ${
              isOfflineSimulated 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' 
                : 'bg-app-2 text-ink-3 border-line hover:text-ink-2'
            }`}
          >
            {isOfflineSimulated ? <WifiOff className="w-3 h-3 text-amber-600 dark:text-amber-400" /> : <Wifi className="w-3 h-3" />}
            <span className="hidden md:inline">{isOfflineSimulated ? 'OFFLINE SIM ON' : 'SIM OFFLINE'}</span>
          </button>

          {/* Gemini API Key Config */}
          <button
            onClick={() => setShowKeyModal(true)}
            title="Configure Google Gemini API Key"
            className="p-1.5 rounded-md bg-app-2 text-ink-3 border border-line hover:text-ink-2 hover:border-line-strong"
          >
            <Key className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          </button>

          {/* Clear History */}
          <button
            onClick={handleClearChat}
            title="Clear Chat Stream"
            className="p-1.5 rounded-md bg-app-2 text-ink-3 border border-line hover:text-rose-500 hover:border-rose-500/40"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          {/* Expand / Minimize */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Restore window size' : 'Expand terminal full size'}
            className="p-1.5 rounded-md bg-app-2 text-ink-3 border border-line hover:text-ink-2"
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Close Button if modal/drawer */}
          {onClose && (
            <button
              onClick={onClose}
              title="Close Triage Assistant"
              className="p-1.5 rounded-md bg-app-2 text-ink-3 border border-line hover:text-rose-500"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

        </div>

      </header>

      {/* 2. Active CPR Metronome HUD Banner (if active) */}
      {isMetronomeActive && (
        <div className="bg-gradient-to-r from-rose-100 via-rose-50 to-app border-b border-rose-300 dark:from-rose-950 dark:via-rose-900 dark:to-slate-950 dark:border-rose-800/80 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className={`w-3 h-3 rounded-full bg-rose-500 shadow-md shadow-rose-500 transition-transform ${
              metronomeBeat ? 'scale-150 bg-white ring-4 ring-rose-400/50' : 'scale-90 opacity-75'
            }`} />
            <div>
              <div className="text-xs font-bold text-ink font-mono">
                CPR PACEMAKER: 110 BPM RHYTHM
              </div>
              <div className="text-[10px] text-rose-600 dark:text-rose-300 font-mono">
                Push at least 2 inches deep. Allow chest to fully recoil.
              </div>
            </div>
          </div>
          <button
            onClick={handleToggleMetronome}
            className="px-2 py-0.5 rounded bg-rose-800 hover:bg-rose-700 text-white text-[10px] font-mono font-bold"
          >
            HALT CADENCE
          </button>
        </div>
      )}

      {/* 3. Priority Quick-Triage Buttons Bar */}
      <div className="px-3 py-2 bg-elevated/60 border-b border-line overflow-x-auto no-scrollbar flex items-center gap-1.5 shrink-0">
        <span className="text-[10px] font-mono text-ink-3 whitespace-nowrap uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-rose-400" />
          <span>Rapid Triage:</span>
        </span>
        {QUICK_TRIAGE_CHIPS.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip.query)}
            disabled={isLoading}
            className="px-2.5 py-1 rounded-lg text-xs font-mono whitespace-nowrap bg-app-2/90 text-ink-2 hover:text-ink hover:bg-rose-500/20 hover:border-rose-500/50 border border-line transition-all shadow-sm active:scale-95 disabled:opacity-50"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* 4. Chat Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans text-ink-2 text-sm">
        {messages.map((msg) => {
          const isAssistant = msg.role === 'assistant';
          const isUser = msg.role === 'user';
          const isSpeaking = activeSpeechId === msg.id;

          return (
            <div 
              key={msg.id} 
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-full`}
            >
              {/* Message Header Label */}
              <div className="flex items-center gap-2 mb-1 px-1 text-[10px] font-mono text-ink-3">
                {isUser ? (
                  <>
                    <span className="text-ink-3">{msg.timestamp}</span>
                    <span className="text-rose-400 font-bold">RESCUER COMMAND</span>
                  </>
                ) : (
                  <>
                    <span className="text-cyan-400 font-bold flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3 text-rose-500" />
                      <span>ResQ-MEDIC</span>
                    </span>

                    {msg.source === 'local-protocol' || msg.isFallback ? (
                      <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/40 text-[9px]">
                        LOCAL FALLBACK PROTOCOL
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 text-[9px]">
                        GEMINI 1.5 FLASH
                      </span>
                    )}

                    <span className="text-ink-3/80">{msg.timestamp}</span>
                  </>
                )}
              </div>

              {/* Message Body Bubble */}
              <div className={`relative group p-4 rounded-2xl max-w-2xl w-full border shadow-xl ${
                isUser 
                  ? 'bg-app-2 border-line-strong text-ink rounded-tr-sm' 
                  : 'bg-elevated border-line text-ink-2 rounded-tl-sm'
              }`}>
                
                {/* Markdown Formatted Content */}
                <div className="prose prose-sm dark:prose-invert max-w-none space-y-3 leading-relaxed">
                  <ReactMarkdown
                    components={{
                      h3: ({ ...props }) => (
                        <h3 className="text-base font-bold tracking-tight text-ink border-b border-line pb-1 mt-2 mb-2 flex items-center gap-2" {...props} />
                      ),
                      h4: ({ ...props }) => (
                        <h4 className="text-sm font-semibold text-rose-600 dark:text-rose-300 mt-2 mb-1" {...props} />
                      ),
                      ol: ({ ...props }) => (
                        <ol className="list-decimal pl-5 space-y-2 text-ink font-medium" {...props} />
                      ),
                      ul: ({ ...props }) => (
                        <ul className="list-disc pl-5 space-y-1.5 text-ink-2" {...props} />
                      ),
                      li: ({ ...props }) => (
                        <li className="leading-snug" {...props} />
                      ),
                      blockquote: ({ ...props }) => (
                        <div className="p-3 my-2 rounded-xl bg-app-2/80 border-l-4 border-rose-500 text-xs font-mono text-ink-2" {...props} />
                      ),
                      strong: ({ ...props }) => (
                        <strong className="font-bold text-ink tracking-wide" {...props} />
                      ),
                      code: ({ ...props }) => (
                        <code className="px-1.5 py-0.5 rounded bg-app-2 text-rose-600 dark:text-rose-300 font-mono text-xs" {...props} />
                      )
                    }}
                  >
                    {msg.content || 'Generating triage protocol...'}
                  </ReactMarkdown>
                </div>

                {/* Tactical Utility Actions (Read Aloud, Metronome, Copy) */}
                {isAssistant && msg.content && (
                  <div className="mt-3 pt-2.5 border-t border-line flex items-center justify-between gap-2 text-[11px] font-mono text-ink-3">
                    
                    <div className="flex items-center gap-2">
                      {/* Read Aloud Button */}
                      <button
                        onClick={() => handleToggleSpeak(msg.id, msg.content)}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded border transition-all ${
                          isSpeaking 
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/50' 
                            : 'bg-app-2 hover:text-ink border-line'
                        }`}
                      >
                        {isSpeaking ? <VolumeX className="w-3 h-3 text-rose-400" /> : <Volume2 className="w-3 h-3" />}
                        <span>{isSpeaking ? 'Stop Voice' : 'Read Aloud'}</span>
                      </button>

                      {/* CPR Metronome shortcut if CPR mentioned */}
                      {msg.content.toLowerCase().includes('cpr') && (
                        <button
                          onClick={handleToggleMetronome}
                          className="flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold transition-all"
                        >
                          <Activity className="w-3 h-3 text-rose-400 animate-pulse" />
                          <span>CPR Beat (110 BPM)</span>
                        </button>
                      )}
                    </div>

                    {/* Copy Protocol */}
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="flex items-center gap-1 px-2 py-0.5 rounded bg-app-2 hover:text-ink border border-line transition-all"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                  </div>
                )}

              </div>
            </div>
          );
        })}

        {/* Streaming / Loading indicator */}
        {isLoading && (
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-600 dark:text-cyan-400 animate-pulse py-2">
            <Activity className="w-4 h-4 animate-spin" />
            <span>Analyzing patient condition & synthesizing triage protocol...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 5. Input Bar & Dispatch Controls */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-app border-t border-line shrink-0"
      >
        <div className="relative flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isActuallyOffline 
                ? 'Mesh Offline: Ask CPR, bleeding, burns, choking, fractures...' 
                : 'Describe emergency triage scenario (e.g. unconscious adult, heavy bleeding)...'
            }
            disabled={isLoading}
            className="w-full bg-app-2 text-ink placeholder-ink-3 text-xs sm:text-sm rounded-xl pl-4 pr-12 py-3 border border-line-strong focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent font-sans shadow-inner"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 rounded-lg bg-gradient-to-r from-rose-600 to-rose-700 text-white disabled:opacity-30 disabled:pointer-events-none hover:brightness-110 active:scale-95 transition-all shadow-md shadow-rose-950/40"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Footer Subtext & Offline Resiliency Badge */}
        <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-ink-3 px-1">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Local Clinical Cache: 14 Offline Guides Armed</span>
          </div>

          <div className="hidden sm:block text-ink-3">
            Press [Enter] to submit • Emergency? Call {REGION.emergencyNumbers.unified} immediately
          </div>
        </div>
      </form>

      {/* 6. Google Gemini API Key Settings Popover / Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-elevated border border-line-strong rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                <h3 className="text-sm font-bold text-white font-mono">
                  GOOGLE GEMINI API CONFIGURATION
                </h3>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="p-1 rounded text-ink-3 hover:text-ink"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-ink-3 leading-relaxed">
              Enter your Google Gemini API key to enable live AI triage streaming. If no key is provided, the terminal automatically uses the project default key or seamlessly falls back to pre-loaded local first-aid guides.
            </p>

            <form onSubmit={handleSaveApiKey} className="space-y-3">
              <div>
                <label className="block text-[10px] font-mono text-ink-3 uppercase mb-1">
                  Gemini API Key
                </label>
                <input
                  type="password"
                  value={customKeyInput}
                  onChange={(e) => setCustomKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-app-2 border border-line-strong rounded-xl px-3 py-2 text-xs font-mono text-ink placeholder-ink-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setCustomKeyInput('');
                    aiTriageService.setApiKey('');
                    setShowKeyModal(false);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono text-ink-3 hover:text-ink"
                >
                  Clear Key
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-mono font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition-all shadow-md shadow-cyan-950/40"
                >
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
