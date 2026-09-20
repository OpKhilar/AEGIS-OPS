import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  ShieldAlert,
  ClipboardList,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  LogIn,
  Loader2,
  Users,
  FileText
} from 'lucide-react';

/**
 * Operator moderation queue — the human gate in the trust pipeline.
 *
 * Lists incident reports stuck at `pending` (fresh submissions that lack
 * corroboration), lets a signed-in moderator verify or reject each one, and
 * auto-expires stale reports (> 30 min) whenever the queue refreshes.
 * Verify/reject are single-column UPDATEs that RLS restricts to moderators.
 */
export default function ModerationQueuePanel({
  isOpen,
  onClose,
  queue,
  isLoading,
  moderatorEmail,
  onSignIn,
  onSignOut,
  onVerify,
  onReject,
  onRefresh,
  actionInProgress,
  soundEnabled = true
}) {
  const [busyId, setBusyId] = useState(null);
  const [showSignIn, setShowSignIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSignInSubmit = (e) => {
    e.preventDefault();
    onSignIn(email, password);
  };

  const handleAction = async (id, action) => {
    setBusyId(id + action);
    try {
      await (action === 'verify' ? onVerify(id) : onReject(id));
    } finally {
      setBusyId(null);
    }
  };

  const age = (ts) => {
    const mins = Math.max(0, Math.round((Date.now() - ts) / 60000));
    if (mins < 1) return 'just now';
    if (mins === 1) return '1 min old';
    return `${mins} mins old`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-app/80 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modq-title"
    >
      <div className="relative w-full max-w-2xl bg-elevated border border-line-strong rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-line bg-app-2/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h2 id="modq-title" className="text-base sm:text-lg font-bold text-ink flex items-center gap-2">
                Moderation Queue
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {queue.length} PENDING
                </span>
              </h2>
              <p className="text-xs text-ink-3 font-mono">
                {moderatorEmail
                  ? <>Moderator: <span className="text-emerald-400">{moderatorEmail}</span></>
                  : 'Moderator sign-in required to act on reports'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-3 hover:text-ink hover:bg-app-2 transition-colors"
            aria-label="Close moderation queue"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth bar */}
        <div className="px-4 sm:px-5 py-2.5 border-b border-line flex items-center justify-between gap-3 bg-app/40">
          {moderatorEmail ? (
            <>
              <span className="text-xs font-mono text-ink-3 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Unverified reports auto-expire after 30 minutes
              </span>
              <button
                onClick={onSignOut}
                className="text-xs font-mono text-ink-3 hover:text-ink transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <span className="text-xs font-mono text-ink-3">
                Anonymous reports await human verification here
              </span>
              {showSignIn ? (
                <form onSubmit={handleSignInSubmit} className="flex items-center gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="moderator@email"
                    aria-label="Moderator email"
                    className="w-40 px-2.5 py-1.5 rounded-lg bg-app-2 text-ink text-xs border border-line focus:outline-none focus:border-sky-500"
                  />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="password"
                    aria-label="Moderator password"
                    className="w-28 px-2.5 py-1.5 rounded-lg bg-app-2 text-ink text-xs border border-line focus:outline-none focus:border-sky-500"
                  />
                  <button
                    type="submit"
                    disabled={actionInProgress === 'signin'}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/40 hover:bg-sky-500/20 text-xs font-semibold transition-all disabled:opacity-50"
                  >
                    {actionInProgress === 'signin'
                      ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      : <LogIn className="w-3.5 h-3.5" />}
                    Sign In
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setShowSignIn(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/40 hover:bg-sky-500/20 text-xs font-semibold transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Moderator Sign In
                </button>
              )}
            </>
          )}
        </div>

        {/* Queue body */}
        <div className="p-4 sm:p-5 max-h-[55vh] overflow-y-auto">
          {isLoading ? (
            <div className="py-10 text-center text-ink-3 text-xs font-mono flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Fetching pending reports…
            </div>
          ) : !moderatorEmail ? (
            <div className="py-10 text-center space-y-2">
              <ShieldAlert className="w-10 h-10 text-ink-3/50 mx-auto" />
              <p className="text-sm text-ink-2 font-semibold">Sign in to review pending reports</p>
              <p className="text-xs text-ink-3 font-mono max-w-sm mx-auto">
                The queue contents are restricted to registered moderators by row-level security.
              </p>
            </div>
          ) : queue.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400/70 mx-auto" />
              <p className="text-sm text-ink-2 font-semibold">Queue clear — no pending reports</p>
              <p className="text-xs text-ink-3 font-mono">
                Fresh reports land here unless auto-verified by corroboration.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {queue.map((rep) => (
                <li
                  key={rep.id}
                  className="p-3.5 rounded-xl border border-line bg-app-2/60 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                          rep.severity === 'critical'
                            ? 'bg-rose-500/20 text-rose-400'
                            : rep.severity === 'warning'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-sky-500/20 text-sky-400'
                        }`}>
                          {rep.severity}
                        </span>
                        <h3 className="text-sm font-bold text-ink truncate">{rep.title}</h3>
                      </div>
                      <p className="text-xs text-ink-2 mt-1 line-clamp-2">
                        {rep.description || 'No description provided.'}
                      </p>
                    </div>
                    <span className="flex-shrink-0 flex items-center gap-1 text-[10px] font-mono text-ink-3">
                      <Clock className="w-3 h-3" />
                      {age(rep.timestamp)}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-[10px] font-mono text-ink-3 flex-wrap">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-sky-400" />
                      {rep.lat?.toFixed(4)}, {rep.long?.toFixed(4)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {rep.type}
                    </span>
                    {rep.corroboration_count > 0 && (
                      <span className="flex items-center gap-1 text-emerald-400">
                        <FileText className="w-3 h-3" />
                        {rep.corroboration_count} corroborating device(s)
                      </span>
                    )}
                    {rep.simulated_gps && (
                      <span className="flex items-center gap-1 text-amber-400">
                        <ShieldAlert className="w-3 h-3" />
                        SIMULATED GPS
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-line">
                    <button
                      onClick={() => handleAction(rep.id, 'reject')}
                      disabled={busyId === rep.id + 'reject'}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-rose-500/40 text-rose-400 hover:bg-rose-500/10 transition-all disabled:opacity-50"
                    >
                      {busyId === rep.id + 'reject'
                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        : <XCircle className="w-3.5 h-3.5" />}
                      Reject
                    </button>
                    <button
                      onClick={() => handleAction(rep.id, 'verify')}
                      disabled={busyId === rep.id + 'verify'}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 transition-all disabled:opacity-50"
                    >
                      {busyId === rep.id + 'verify'
                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        : <CheckCircle2 className="w-3.5 h-3.5" />}
                      Verify &amp; Publish
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-5 py-3 border-t border-line flex items-center justify-between">
          <span className="text-[10px] font-mono text-ink-3">
            Verify = publish to the live map · Reject = remove from queue
          </span>
          <button
            onClick={onRefresh}
            disabled={isLoading || !moderatorEmail}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-elevated text-ink-2 border border-line-strong hover:text-ink text-xs font-mono transition-all disabled:opacity-50"
          >
            <Loader2 className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
