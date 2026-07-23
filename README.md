# Mirra — AI Interview Practice Platform

> **Mirra mirrors your interview performance back to you.**
> 
> An AI-powered interview practice platform with a 3D avatar interviewer, real-time voice interaction, body language analysis, and personalized feedback — built entirely self-hosted with no third-party AI APIs.

---

## 🎬 What is Mirra?

Mirra is a full-stack platform where users:

1. **Upload their resume** — Mirra analyzes it for weaknesses, gaps, and ATS compatibility
2. **Get personalized suggestions** — Specific rewrites, not generic advice
3. **Practice with a 3D AI interviewer** — Real-time voice conversation with a lifelike avatar
4. **Receive multi-modal feedback** — Body language, voice analysis, and answer quality scoring
5. **Improve over time** — Longitudinal tracking of interview skills

### The Problem We Solve

> *"People know what to say in interviews, but they don't know how to say it under pressure."*

Most interview prep tools are either:
- **Human-based** (expensive, scheduling friction, inconsistent quality)
- **Generic AI chatbots** (no visual presence, no body language feedback, static questions)

Mirra bridges this gap with a **reactive, visual AI** that triggers real interview anxiety — the key to genuine preparation.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│  React 19 + Vite + TypeScript + Tailwind CSS                   │
│  ├─ 3D Avatar: Three.js + React Three Fiber                     │
│  ├─ State: Zustand                                              │
│  ├─ Real-time: Socket.io-client                                 │
│  └─ Charts: Recharts                                            │
└─────────────────────────────────────────────────────────────────┘
                              ↕ WebSocket + HTTP
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                  │
│  FastAPI (Python 3.12) + PostgreSQL 16 + SQLAlchemy 2.0         │
│  ├─ Auth: JWT + bcrypt                                          │
│  ├─ Real-time: Socket.io + Redis                                │
│  ├─ Tasks: Celery + Redis                                       │
│  └─ File Storage: Local (MinIO-compatible)                        │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                      AI/ML ENGINE (Self-Hosted)                  │
│  ├─ LLM: Local LLM (Llama 3.1 / Mistral / DeepSeek)             │
│  ├─ STT: Whisper (faster-whisper, local)                        │
│  ├─ TTS: Coqui TTS / Piper (local)                              │
│  ├─ NLP: spaCy + sentence-transformers                          │
│  ├─ Face: MediaPipe Face Mesh (existing module)                 │
│  └─ Audio: librosa                                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🌿 Branch Strategy

| Branch | Purpose | Status |
|--------|---------|--------|
| `main` | Production-ready code | Protected |
| `develop` | Integration branch | Protected |
| `backend` | FastAPI, DB, auth, business logic | Active |
| `voice-bot` | Voice capture, TTS, STT, turn-taking | Active (refinement) |
| `avatar` | 3D avatar, lip-sync, expressions | Active |
| `marketing` | Landing page, marketing website | Active |
| `frontend` | React app, dashboard, UI | Active |
| `integration` | Connecting all modules together | Later |

---

## 📁 Repository Structure

```
mirra/
├── voice-bot/              # Existing voice module (needs refinement)
│   ├── src/
│   ├── models/             # Whisper, TTS models
│   └── README.md
│
├── backend/                # FastAPI backend
│   ├── app/
│   │   ├── main.py
│   │   ├── models/
│   │   ├── routers/
│   │   ├── services/
│   │   ├── schemas/
│   │   ├── core/
│   │   └── websocket/
│   ├── alembic/
│   ├── tests/
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/               # React + Vite app
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── stores/
│   │   ├── services/
│   │   └── types/
│   ├── public/
│   └── package.json
│
├── marketing/              # Landing page website
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── assets/
│
├── models/                 # Downloaded AI models (git-lfs or local)
│   ├── llm/
│   ├── whisper/
│   ├── tts/
│   └── embeddings/
│
├── docker-compose.yml      # Full stack orchestration
├── CLAUDE.md              # AI assistant context
├── README.md              # This file
└── .gitignore
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Python 3.12+
- Node.js 20+
- PostgreSQL 16
- Redis 7
- Git

### 1. Clone & Setup

```bash
git clone https://github.com/YOUR_USERNAME/mirra.git
cd mirra
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Setup database
# Create PostgreSQL database 'mirra'
# Update .env with your DB credentials

# Run migrations
alembic upgrade head

# Start server
uvicorn app.main:app --reload --port 8000
```

### 3. Voice Bot Setup

```bash
cd voice-bot
# Follow voice-bot/README.md for model downloads
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Start voice service
python src/main.py
```

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 5. Marketing Site

```bash
cd marketing
# Static site - open index.html or serve with any static server
npx serve .  # or python -m http.server 3000
```

---

## 🛠️ Tech Stack (100% Self-Hosted)

### Backend
| Component | Technology | Self-Hosted Alternative |
|-----------|-----------|------------------------|
| API Framework | FastAPI | Native |
| Database | PostgreSQL 16 | Native |
| ORM | SQLAlchemy 2.0 | Native |
| Auth | JWT + bcrypt | Native |
| Real-time | Socket.io + Redis | Native |
| Task Queue | Celery + Redis | Native |
| File Storage | MinIO | Self-hosted S3-compatible |

### AI/ML (No Third-Party APIs)
| Component | Technology | Model |
|-----------|-----------|-------|
| LLM | llama.cpp / vLLM | Llama 3.1 8B/70B or Mistral 7B |
| STT | faster-whisper | Whisper Medium/Large-v3 |
| TTS | Coqui TTS / Piper | Local voice models |
| NLP | spaCy | en_core_web_trf |
| Embeddings | sentence-transformers | all-MiniLM-L6-v2 |
| Face Analysis | MediaPipe | Face Mesh (existing) |
| Audio Analysis | librosa | Native |

### Frontend
| Component | Technology |
|-----------|-----------|
| Framework | React 19 + Vite + TypeScript |
| 3D | Three.js + React Three Fiber |
| Avatar | Ready Player Me GLB |
| Lip Sync | Rhubarb (local) |
| State | Zustand |
| UI | Tailwind CSS + shadcn/ui |
| Charts | Recharts |

---

## 🎯 Core Features

### Resume Pipeline
- PDF/DOCX parsing with PyMuPDF
- ATS compatibility scoring
- Weakness detection (weak verbs, missing skills, formatting)
- Specific rewrite suggestions (not generic advice)
- Gap analysis — identifies missing experience areas

### AI Interview Session
- **3D Avatar Interviewer** — Ready Player Me model with lip-sync and expressions
- **Real-time Voice** — STT → LLM → TTS pipeline, sub-2-second latency
- **Dynamic Questions** — Generated from resume content and gaps
- **Adaptive Difficulty** — Questions adjust based on performance
- **Interviewer Personalities** — Friendly, aggressive, silent, rapid-fire

### Real-Time Analysis
- **Face Analysis** — Eye contact, posture, confidence (MediaPipe)
- **Voice Analysis** — WPM, pitch variation, pause detection, filler words
- **Answer Scoring** — STAR method structure, relevance, technical keywords
- **Live Overlay** — Real-time metrics during the interview

### Post-Session Report
- Score breakdown: Confidence, Communication, Technical, Leadership, Overall
- Improvement suggestions
- Session history and progress tracking
- Replay with analysis overlay

---

## 🧠 Philosophy: Why Self-Hosted?

1. **Privacy** — User resumes and interview recordings never leave your infrastructure
2. **Cost** — No per-token API costs. Predictable hosting costs only
3. **Latency** — Local models = faster response times for real-time interaction
4. **Control** — Fine-tune models for your specific use case
5. **Reliability** — No dependency on third-party API uptime or rate limits

---

## 📋 Development Roadmap

### Phase 1: Foundation (Weeks 1-2)
- [ ] FastAPI + PostgreSQL setup
- [ ] JWT auth system
- [ ] Database models and migrations
- [ ] Docker Compose for local dev
- [ ] Marketing landing page

### Phase 2: Voice Bot Refinement (Weeks 3-4)
- [ ] Integrate existing voice module
- [ ] Replace API STT with local Whisper
- [ ] Replace API TTS with local Coqui TTS / Piper
- [ ] Optimize latency (< 2s round-trip)
- [ ] Turn-taking logic refinement

### Phase 3: Resume Pipeline (Weeks 5-6)
- [ ] PDF/DOCX upload and parsing
- [ ] spaCy NLP analysis
- [ ] ATS scoring algorithm
- [ ] Suggestion engine
- [ ] Frontend upload UI

### Phase 4: 3D Avatar (Weeks 7-8)
- [ ] Ready Player Me model loading
- [ ] React Three Fiber scene
- [ ] Idle animations and expressions
- [ ] Lip sync with local Rhubarb
- [ ] Connect to TTS audio stream

### Phase 5: Interview Session (Weeks 9-10)
- [ ] WebSocket session manager
- [ ] Question generation from resume
- [ ] Dynamic follow-ups
- [ ] Interviewer personality modes
- [ ] Session state management

### Phase 6: Real-Time Analysis (Weeks 11-12)
- [ ] Face analysis integration
- [ ] Audio analysis (librosa)
- [ ] Live metrics overlay
- [ ] Score aggregation

### Phase 7: Reports & Polish (Weeks 13-14)
- [ ] Report UI with charts
- [ ] Session history
- [ ] Progress tracking
- [ ] Performance optimization

### Phase 8: Advanced Features (Weeks 15-18)
- [ ] Shadow Interview (job description upload)
- [ ] Stress Inoculation mode
- [ ] Mirra Memory (longitudinal profile)
- [ ] Interviewer Forge (custom personas)

---

## 🤝 Contributing

1. Create a feature branch from `develop`
2. Follow branch naming: `feature/name`, `fix/name`, `refactor/name`
3. Commit with conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`
4. Open PR to `develop`
5. Require review before merge

---

## 📄 License

[Your License Here]

---

## 🙏 Acknowledgments

- Ready Player Me for avatar models
- MediaPipe for face analysis
- Whisper by OpenAI (model weights, self-hosted)
- Llama by Meta (model weights, self-hosted)
- Coqui TTS for open-source text-to-speech

---

> **Built with ❤️ for anyone who's ever been nervous in an interview.**
t e s t  
 