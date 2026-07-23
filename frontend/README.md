# Mirra Frontend

React 19 + Vite + JavaScript (JSX) + Tailwind CSS v4 + Zustand + Axios. No
TypeScript anywhere - every component is a `.jsx` file.

## Structure

- `src/pages/` — `LoginPage`, `RegisterPage`, `DashboardPage`, `InterviewSessionPage`
- `src/components/auth/` — `LoginForm`, `RegisterForm`
- `src/components/resume/` — `UploadForm`, `Preview`, `Suggestions`
- `src/components/interview/` — `Session`, `Controls`, `QuestionDisplay`
- `src/components/layout/` — `Navbar`, `ProtectedRoute` (route guard against `authStore`)
- `src/stores/` — `authStore` (persisted to localStorage), `resumeStore`, `interviewStore`
- `src/services/` — `api.js` (Axios instance, JWT interceptor, 401 → logout), `authApi`, `resumeApi`, `interviewApi`
- `src/hooks/useWebSocket.js` — connects to the backend's `/ws/interview` socket

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Requires the backend running (`cd ../backend && uvicorn app.main:app --reload`)
for auth to work. `VITE_API_URL` / `VITE_WS_URL` point at it.

## What's live vs. stubbed on the backend

- **Auth** (register/login/me) is fully wired and tested against the real
  backend — this is the one flow you can exercise end-to-end today.
- **Resume upload/list/analyze** and **interview session create/start/end**
  call the endpoints CLAUDE.md defines, but those routers are still TODO
  stubs on the backend (`resume-pipeline` / `interview-session` branches).
  Calls 404 gracefully — the dashboard shows "not available yet" instead of
  crashing, and starting an interview falls through to a local session id so
  the session UI is still reachable for review.
- **`useWebSocket`** talks to the backend's `/ws/interview` endpoint, which
  *is* live (built on the `backend` branch) — `join_session` → `session_joined`
  → event relay all work today, verified with a raw WebSocket script mirroring
  what the hook does.

## Known limitation

No browser was available while building this, so the auth/dashboard/session
UI is verified by clean build + lint + direct API/WebSocket calls matching
the exact contracts the store/hook code uses - not by clicking through it in
a real browser. Worth a manual pass before shipping.
