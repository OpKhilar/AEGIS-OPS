# 🚨 AEGIS-OPS — Emergency Preparedness & Response Platform

> **AWS Community Day Hackathon 2026 · Problem Statement 04**

AEGIS-OPS is a real-time emergency coordination platform that empowers citizens and responders during disasters. It connects affected individuals with shelters, medical centers, and volunteer hubs — and works even when the network goes down.

---

## ✨ Features

### 🗺️ Real-Time Tactical Map
An interactive Leaflet map showing active incidents with pulsing hazard zones, emergency shelters, medical centers, volunteer depots, and live responder positions — all synchronized via Supabase Realtime.

### 🆘 Priority SOS Beacon
One-tap broadcast for life-threatening emergencies. Instantly creates a distress alert visible to the entire command dashboard and logs coordinates to Supabase.

### 📋 Citizen Safety Check-In
A triage modal for affected individuals to report their status (`SAFE`, `NEEDS SUPPLIES`, `CRITICAL`), headcount, location, and medical notes — sent directly to the Supabase `user_status` table.

### 📡 Live Alert Feed
Supabase Realtime subscriptions push new incidents and citizen pings to the feed in real time, with optional audio alerts and severity-coded color coding.

### 📴 Offline-First (PWA)
Networks fail first in disasters. AEGIS-OPS is a **Progressive Web App** that:
- Caches the entire UI shell and Leaflet map tiles via a Service Worker
- Saves SOS submissions and status check-ins to **IndexedDB** when `navigator.onLine === false`
- **Auto-syncs** all queued data to Supabase the moment connectivity is restored

### 🏥 Resource Directory
A full-screen responder directory listing all active personnel, their roles, assignments, and equipment — with click-to-focus map integration.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8 |
| Styling | Tailwind CSS v4 |
| Mapping | Leaflet |
| Backend & Realtime | Supabase (PostgreSQL + Realtime) |
| Offline Storage | `idb` (IndexedDB) |
| Service Worker | `vite-plugin-pwa` (Workbox) |
| Icons | Lucide React |
| Linting | Oxlint |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18 or later
- A free [Supabase](https://supabase.com) project

### 1. Clone & Install
```bash
git clone https://github.com/your-username/aegis-ops.git
cd aegis-ops
npm install
```

### 2. Set Up Environment Variables
Copy the example file and fill in your Supabase credentials:
```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

> **Note:** If these variables are missing or invalid, the app automatically falls back to rich local mock data — no crashes, fully functional demo.

### 3. Set Up the Database
Run the SQL schema against your Supabase project:
1. Open the [Supabase SQL Editor](https://supabase.com/dashboard)
2. Paste and execute the contents of [`supabase/schema.sql`](./supabase/schema.sql)

### 4. Run Locally
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 📴 Testing Offline Mode

1. Open the app and launch **Developer Tools** (`F12`)
2. Go to **Network** tab → set to **Offline**
3. Submit a Status Check-In or trigger an SOS beacon
4. Navigate to **Application** → **IndexedDB** → `emergency-app-db`
   - `status-reports` — queued check-ins
   - `sos-incidents` — queued SOS broadcasts
5. Switch the Network back to **No Throttling** (Online)
6. Watch the background sync service flush all queued entries to Supabase automatically ✅

---

## ☁️ Deploying to Vercel

1. Push this repository to **GitHub**
2. Log in to [Vercel](https://vercel.com) and click **Add New Project**
3. Import your GitHub repository
4. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click **Deploy** — Vercel auto-detects Vite and runs `npm run build`

Your app will be live at `https://your-project.vercel.app` within ~60 seconds.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Map/          # TacticalMap (Leaflet integration)
│   ├── AlertFeed.jsx
│   ├── Navbar.jsx
│   ├── NewIncidentModal.jsx
│   ├── ResponderDirectory.jsx
│   ├── SosBanner.jsx
│   └── StatusCheckModal.jsx
├── data/
│   └── mockEmergencyData.js  # Resilient fallback seed data
├── lib/
│   └── supabaseClient.js
├── services/
│   └── emergencyService.js   # Supabase data access layer
├── utils/
│   ├── audio.js
│   ├── offlineStore.js       # IndexedDB helpers (idb)
│   └── syncService.js        # Online event → Supabase flush
└── App.jsx
```

---

## 📋 Problem Statement Deliverables Checklist

| Deliverable | Status |
|---|---|
| Real-time alerts or critical information during an emergency | ✅ Supabase Realtime alert feed |
| Coordination feature connecting responders, volunteers, and resources | ✅ Tactical map + responder directory |
| Simple way for users to report status, location, or needs | ✅ Status Check-In modal + SOS beacon |
| Low-bandwidth or offline-friendly use | ✅ PWA + IndexedDB offline queue + auto-sync |

---

## 🛡️ Report Trust Layer (anti-fake-incident protection)

AEGIS-OPS assumes the public can write incident reports and check-ins — and that some of
those writes will be fake. The trust pipeline hardens this without adding login friction:

```
citizen submits ──▶ identity stamp ──▶ rate limit + dedup ──▶ geofence + constraints
                        (anon auth)      (DB trigger)          (DB check)
       ──▶ pending queue ──▶ corroboration (2+ devices ≈ auto-verify) ──▶ live map
                                 └──▶ or human moderator verify / reject ──▶ live map
```

**Setup (one-time, ~5 minutes):**
1. Run `supabase/migrations/001_trust_layer.sql` in the Supabase SQL Editor.
2. Backfill existing rows so they don't flood the pending queue:
   ```sql
   update public.incidents   set verification_status = 'verified';
   update public.user_status set verification_status = 'verified';
   ```
3. Enable **Anonymous sign-ins** (Dashboard → Authentication → Providers) — every device
   then gets a stable `auth.uid()` used for rate limiting (5 reports / 10 min) and
   corroboration scoring.
4. Create your moderator user in Authentication → Users, then register yourself:
   ```sql
   insert into public.moderators (user_id)
   select id from auth.users where email = 'your-moderator@email';
   ```
5. Open the clipboard icon in the navbar (or Moderation Queue on mobile) → Moderator Sign In.

Pending reports never appear on the map or alert feed; unverified reports auto-expire
after 30 minutes. All enforcement is server-side (RLS + triggers) — a tampered client
cannot bypass it.

## 📄 License

MIT — Built for the AWS Community Day Hackathon 2026.

