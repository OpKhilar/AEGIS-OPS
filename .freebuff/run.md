# Run Doc — AEGIS-OPS (Emergency Response App)

Vite 8 + React 19 + Tailwind 4 PWA with a dev-only `/api/chat` middleware (Gemini via AI SDK) defined inline in `vite.config.js`.

## Reproduce the artifacts a fresh checkout needs

1. **Install dependencies** with npm (lockfile is `package-lock.json`):
   ```
   npm install
   ```
2. **Copy `.env` from the main checkout** (`C:\Users\khila\OneDrive\Desktop\AWS Hackathon 2\.env`) into the worktree — never symlink, ports/values may need adapting. `.env.example` lists the keys the app reads (Gemini / Supabase). The dev-server AI proxy needs `VITE_GEMINI_API_KEY` or `GEMINI_API_KEY` to be non-empty; the app renders without it, only AI triage chat is degraded.
3. Nothing else is generated — the PWA service worker and `dist/` are build outputs, not dev-server prerequisites.

## Run the dev server

Default Vite port is **5173**. If it is already taken (another worktree/thread may hold it — check with `netstat -ano | findstr :5173`), pick the next free port (5174, 5175, …) and pass it explicitly.

Start detached (Windows, PowerShell) with stdout and stderr in **different** files:

```
powershell -NoProfile -Command "(Start-Process -FilePath 'npm.cmd' -ArgumentList 'run','dev','--','--port','5174','--strictPort' -WorkingDirectory 'C:\Users\khila\OneDrive\Desktop\AWS Hackathon 2' -RedirectStandardOutput '<log>' -RedirectStandardError '<log>.err' -WindowStyle Hidden -PassThru).Id"
```

- `--strictPort` makes Vite fail instead of silently hopping ports, so the registered URL stays valid.
- Confirm the pid is alive: `powershell -NoProfile -Command "Get-Process -Id <pid>"`.
- Wait until `http://localhost:5174` answers before registering the preview.

Production build for reference: `npm run build` (also emits the PWA service worker into `dist/`).
