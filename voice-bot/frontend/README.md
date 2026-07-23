# NexusAI — Interview Intelligence Platform

A premium, production-quality AI-powered mock interview platform frontend built with React.js, Tailwind CSS, and Framer Motion.

## Features

- 🧠 **AI Resume Analysis** — Parses your resume for targeted questions
- 🎙️ **Voice Interview** — Real-time speech recording & evaluation
- 👁️ **Eye Contact Detection** — Live gaze tracking score
- 📊 **Confidence Metering** — Multi-signal confidence score
- 🔁 **Dynamic Follow-ups** — AI-adaptive follow-up questions
- 📋 **Instant Report** — Full performance dashboard with charts

## Quick Start

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm start
```

## Pages

| Route | Page |
|-------|------|
| `/` | Landing Page |
| `/upload` | Resume Upload |
| `/interview` | Live Interview |
| `/report` | Final Report Dashboard |
| `/settings` | Platform Settings |

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── AIAvatar.jsx
│   ├── GlowCard.jsx
│   ├── ScoreCircle.jsx
│   ├── SoundWave.jsx
│   └── ParticleBackground.jsx
├── pages/
│   ├── LandingPage.jsx
│   ├── UploadPage.jsx
│   ├── InterviewPage.jsx
│   ├── ReportPage.jsx
│   └── SettingsPage.jsx
├── services/
│   └── api.js
├── hooks/
│   ├── useTypewriter.js
│   └── useTimer.js
├── layouts/
│   └── MainLayout.jsx
├── App.js
├── index.js
└── index.css
```

## Backend Integration

The frontend connects to a FastAPI backend. Configure in `.env`:
```
REACT_APP_API_URL=http://localhost:8000
```

### API Endpoints Expected

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/resume/upload` | Upload resume file |
| POST | `/api/interview/start` | Start an interview session |
| POST | `/api/interview/answer` | Submit an answer |
| GET | `/api/interview/report/:id` | Fetch final report |
| POST | `/api/interview/eye-contact` | Update eye contact score |
| GET | `/api/settings/voices` | Get available AI voices |

## Tech Stack

- **React 18** — UI framework
- **Tailwind CSS** — Utility-first styling
- **Framer Motion** — Animations
- **Axios** — HTTP client
- **React Router v6** — Routing
- **Recharts** — Data visualization
- **React Dropzone** — File upload
- **React CountUp** — Animated counters

## Design System

- **Colors**: Neon cyan (#00f5ff), Neon blue (#0066ff), Neon purple (#7b2fff), Neon green (#00ff88)
- **Fonts**: Orbitron (display), Syne (body), Space Mono (code/mono)
- **Theme**: Dark glassmorphism with animated gradients and particle effects
