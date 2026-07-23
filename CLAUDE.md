# CLAUDE.md — Mirra AI Interview Platform

> **Context file for AI coding assistants.** This document contains everything needed to understand, build, and extend Mirra without external research.

---

## Project Identity

**Mirra** — AI Interview Practice Platform. The name reflects the core idea: Mirra mirrors your interview performance back to you so you can see yourself the way an interviewer does and improve.

**Mission:** Build a fully self-hosted, AI-powered interview practice platform with no third-party AI APIs. Everything runs locally — LLM, STT, TTS, NLP, face analysis.

**Key Insight:** Speaking to a face (even a 3D avatar) triggers the same anxiety as a real interview. That is the training value. Most tools are either human-based (expensive, inconsistent) or generic chatbots (no visual presence, no body language feedback). Mirra bridges this gap.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│  MARKETING SITE (Static HTML/CSS/JS)                         │
│  Landing page → redirects to app.mirra.local                  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  FRONTEND (React 19 + Vite + TypeScript)                    │
│  ├─ Auth pages (login/register)                             │
│  ├─ Dashboard (resume upload, session history)              │
│  ├─ Interview Session (3D avatar, real-time metrics)        │
│  └─ Reports (charts, scores, progress)                      │
└─────────────────────────────────────────────────────────────┘
                              ↕ HTTP + WebSocket
┌─────────────────────────────────────────────────────────────┐
│  BACKEND (FastAPI + Python 3.12)                            │
│  ├─ Auth (JWT + bcrypt)                                     │
│  ├─ Resume API (upload, parse, analyze)                     │
│  ├─ Interview API (sessions, questions, scores)            │
│  ├─ WebSocket Manager (real-time session orchestration)     │
│  └─ Celery Workers (heavy NLP, audio processing)            │
└─────────────────────────────────────────────────────────────┘
                              ↕ Local IPC / Shared Memory
┌─────────────────────────────────────────────────────────────┐
│  VOICE BOT MODULE (Existing, needs refinement)                │
│  ├─ Mic capture → faster-whisper (STT)                      │
│  ├─ Local LLM (Llama 3.1 / Mistral) → response generation  │
│  ├─ Coqui TTS / Piper → speech output                       │
│  └─ Turn-taking logic                                       │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│  FACE ANALYSIS MODULE (Existing, needs integration)          │
│  ├─ MediaPipe Face Mesh → per-frame landmarks               │
│  ├─ Confidence scoring (eye contact, posture)               │
│  └─ Stream to WebSocket                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Tech Stack (100% Self-Hosted — NO Third-Party AI APIs)

### Backend
| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | FastAPI 0.115 | Async-native, auto OpenAPI docs |
| Python | 3.12 | Latest stable |
| ASGI | Uvicorn + Gunicorn | Production server |
| Database | PostgreSQL 16 | JSONB for flexible schemas |
| ORM | SQLAlchemy 2.0 | Async support, type annotations |
| Migrations | Alembic | Standard SQLAlchemy tool |
| Auth | python-jose + bcrypt | JWT access + refresh tokens |
| Real-time | python-socketio + Redis | Rooms, namespaces, reconnections |
| Task Queue | Celery + Redis | Background NLP/audio jobs |
| File Storage | Local filesystem / MinIO | Resume PDFs, session recordings |
| Vector DB | ChromaDB (local) | Resume semantic search |

### AI/ML (All Local — No OpenAI, No ElevenLabs, No Cloud APIs)
| Module | Technology | Model/Approach |
|--------|-----------|----------------|
| LLM | llama.cpp / vLLM / Ollama | Llama 3.1 8B or Mistral 7B (quantized) |
| STT | faster-whisper | Whisper Medium or Large-v3 (local) |
| TTS | Coqui TTS or Piper | Local voice models, multiple voices |
| Resume NLP | spaCy 3.7 | en_core_web_trf (transformer-based) |
| Embeddings | sentence-transformers | all-MiniLM-L6-v2 (local) |
| Resume Parsing | PyMuPDF + python-docx | Native Python |
| Audio Analysis | librosa | Pitch, tempo, spectral features |
| Face Analysis | MediaPipe Face Mesh | Existing module, per-frame metrics |
| Keyword Extraction | KeyBERT | Local transformer-based |

### Frontend
| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | React 19 | Latest features, concurrent rendering |
| Build Tool | Vite 6 | Fast HMR, modern tooling |
| Language | TypeScript 5.7 | Strict mode enabled |
| 3D Engine | Three.js + React Three Fiber | Declarative 3D in React |
| 3D Helpers | Drei | R3F utilities |
| Avatar | Ready Player Me | GLB format, customizable |
| Lip Sync | Rhubarb (server-side) | Viseme JSON → R3F morph targets |
| State | Zustand 5 | Minimal boilerplate |
| UI | Tailwind CSS 4 + shadcn/ui | Utility-first, accessible |
| Forms | React Hook Form + Zod | Type-safe validation |
| Charts | Recharts | React-native charts |
| HTTP | Axios + TanStack Query | Caching, refetching |
| Real-time | Socket.io-client 4 | Auto-reconnect, binary support |
| PDF | react-pdf | Client-side PDF preview |

### Marketing Site
| Layer | Technology | Notes |
|-------|-----------|-------|
| Type | Static HTML/CSS/JS | No framework needed |
| Styling | Tailwind CSS (CDN) | Or vanilla CSS |
| Animations | GSAP or vanilla CSS | Scroll animations, transitions |
| Hosting | Same domain or subdomain | Serves as entry point |

---

## Repository Structure

```
mirra/
├── voice-bot/                    # EXISTING — needs refinement
│   ├── src/
│   │   ├── audio_capture.py      # Mic input handling
│   │   ├── stt_engine.py         # CURRENT: API-based → REPLACE with faster-whisper
│   │   ├── tts_engine.py         # CURRENT: API-based → REPLACE with Coqui/Piper
│   │   ├── llm_bridge.py         # CURRENT: API-based → REPLACE with local LLM
│   │   ├── turn_manager.py       # Turn-taking logic
│   │   └── main.py               # Entry point
│   ├── models/                   # Downloaded model weights
│   │   ├── whisper/
│   │   ├── tts/
│   │   └── llm/
│   ├── requirements.txt
│   └── README.md                 # Voice bot setup guide
│
├── backend/                        # FastAPI backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py               # FastAPI app, middleware, routers
│   │   ├── config.py             # Pydantic-Settings, env vars
│   │   ├── database.py           # Async SQLAlchemy engine + session
│   │   ├── models/               # SQLAlchemy ORM models
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── resume.py
│   │   │   ├── session.py
│   │   │   ├── answer.py
│   │   │   ├── score.py
│   │   │   └── interview_dna.py  # Mirra Memory
│   │   ├── routers/              # API endpoints
│   │   │   ├── __init__.py
│   │   │   ├── auth.py           # Register, login, JWT
│   │   │   ├── resume.py         # Upload, parse, analyze
│   │   │   ├── interview.py      # Session CRUD
│   │   │   └── report.py         # Scores, history
│   │   ├── schemas/              # Pydantic request/response
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── resume.py
│   │   │   └── session.py
│   │   ├── services/             # Business logic
│   │   │   ├── __init__.py
│   │   │   ├── auth_service.py
│   │   │   ├── resume_parser.py  # PyMuPDF, python-docx
│   │   │   ├── resume_analyzer.py # spaCy, ATS scoring
│   │   │   ├── suggestion_engine.py
│   │   │   ├── question_generator.py # Local LLM prompts
│   │   │   ├── answer_scorer.py    # STAR detection, relevance
│   │   │   ├── audio_analyzer.py   # librosa integration
│   │   │   └── report_generator.py
│   │   ├── core/                 # Shared utilities
│   │   │   ├── __init__.py
│   │   │   ├── security.py       # JWT, bcrypt helpers
│   │   │   ├── exceptions.py
│   │   │   └── dependencies.py   # Auth deps, DB deps
│   │   └── websocket/            # Real-time handlers
│   │       ├── __init__.py
│   │       ├── connection_manager.py
│   │       └── interview_handler.py
│   ├── alembic/                  # Database migrations
│   │   ├── versions/
│   │   └── env.py
│   ├── tests/
│   ├── requirements.txt
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── frontend/                     # React + Vite app
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── index.css             # Tailwind directives
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── RegisterForm.tsx
│   │   │   ├── resume/
│   │   │   │   ├── UploadForm.tsx
│   │   │   │   ├── Preview.tsx
│   │   │   │   └── Suggestions.tsx
│   │   │   ├── interview/
│   │   │   │   ├── Session.tsx
│   │   │   │   ├── Controls.tsx
│   │   │   │   └── QuestionDisplay.tsx
│   │   │   ├── avatar/
│   │   │   │   ├── AvatarScene.tsx      # R3F canvas + scene
│   │   │   │   ├── AvatarModel.tsx      # GLB loading
│   │   │   │   ├── LipSync.tsx          # Viseme-driven morphs
│   │   │   │   └── Expressions.tsx      # Mood/emotion morphs
│   │   │   ├── analysis/
│   │   │   │   └── LiveMetrics.tsx      # Real-time overlay
│   │   │   └── report/
│   │   │       ├── ScoreBreakdown.tsx
│   │   │       ├── ProgressChart.tsx
│   │   │       └── SessionHistory.tsx
│   │   ├── hooks/
│   │   │   ├── useWebSocket.ts
│   │   │   ├── useAudioCapture.ts
│   │   │   ├── useAvatarAnimation.ts
│   │   │   └── useFaceAnalysis.ts
│   │   ├── stores/
│   │   │   ├── authStore.ts
│   │   │   ├── interviewStore.ts
│   │   │   └── resumeStore.ts
│   │   ├── services/
│   │   │   ├── api.ts            # Axios instance
│   │   │   ├── authApi.ts
│   │   │   └── resumeApi.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── utils/
│   │       └── helpers.ts
│   ├── public/
│   │   └── avatar/
│   │       └── interviewer.glb   # Ready Player Me model
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── tsconfig.json
│   └── Dockerfile
│
├── marketing/                    # Landing page (static)
│   ├── index.html
│   ├── about.html
│   ├── pricing.html
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── main.js
│   ├── assets/
│   │   ├── images/
│   │   └── videos/
│   └── README.md
│
├── models/                       # Downloaded AI models (not in git)
│   ├── llm/
│   │   └── llama-3.1-8b-Q4_K_M.gguf
│   ├── whisper/
│   │   └── whisper-medium/
│   ├── tts/
│   │   └── coqui-voice/
│   └── embeddings/
│       └── all-MiniLM-L6-v2/
│
├── docker-compose.yml            # Full stack orchestration
├── .env.example                  # Template for env vars
├── .gitignore
├── CLAUDE.md                     # This file
└── README.md                     # Project README
```

---

## Git Branch Strategy

### Protected Branches
| Branch | Purpose |
|--------|---------|
| `main` | Production-ready. Only merge from `develop` via PR. |
| `develop` | Integration branch. Feature branches merge here. |

### Feature Branches (create from `develop`)
| Branch | What to Build | Priority |
|--------|--------------|----------|
| `backend` | FastAPI, DB, auth, all API endpoints | P0 |
| `voice-bot` | Refine existing voice module (local STT/TTS/LLM) | P0 |
| `avatar` | 3D avatar, lip-sync, expressions | P1 |
| `marketing` | Landing page, about, pricing, CTA to app | P1 |
| `frontend` | React app, dashboard, interview UI, reports | P1 |
| `integration` | Connect voice-bot + backend + frontend + avatar | P2 |
| `resume-pipeline` | Upload, parse, analyze, suggest | P1 |
| `interview-session` | WebSocket session, question flow, scoring | P2 |
| `reports` | Charts, history, progress tracking | P2 |
| `mirra-memory` | Longitudinal profile, Interview DNA | P3 |
| `interviewer-forge` | Custom personas, community sharing | P3 |

### Branch Workflow
```bash
# Start new feature
git checkout develop
git pull origin develop
git checkout -b feature/name

# Work, commit, push
git add .
git commit -m "feat: description"
git push -u origin feature/name

# Open PR to develop on GitHub
# After review and approval, merge
# Delete branch: git branch -d feature/name
```

---

## Voice Bot Refinement Plan

### Current State (Existing Module)
- Mic capture works
- STT uses external API → **REPLACE**
- TTS uses external API → **REPLACE**
- LLM uses external API → **REPLACE**
- Turn-taking logic exists → **REFINE**

### Target State (100% Local)

#### STT: faster-whisper
```python
from faster_whisper import WhisperModel

model = WhisperModel("medium", device="cuda", compute_type="float16")
segments, info = model.transcribe(audio_path, beam_size=5)
# Returns: text, timestamps, confidence
```
- **Latency target:** < 1s for 10s audio
- **Model:** Whisper Medium (faster-whisper quantized)
- **Output:** Transcript + word-level timestamps (for filler word detection)

#### TTS: Coqui TTS or Piper
```python
# Coqui TTS
from TTS.api import TTS
tts = TTS("tts_models/en/vctk/vits")
wav = tts.tts(text="Hello, let us begin your interview.")

# Piper (lighter, faster)
# Uses ONNX models, very fast on CPU
```
- **Latency target:** < 500ms for short responses
- **Multiple voices:** Different voices for different interviewer personalities
- **Emotion control:** Speed/pitch variation for personality modes

#### LLM: llama.cpp or Ollama
```python
# Ollama (easiest local setup)
import ollama
response = ollama.chat(model='llama3.1:8b', messages=[
    {'role': 'system', 'content': 'You are a technical interviewer...'},
    {'role': 'user', 'content': 'Tell me about yourself'}
])

# llama.cpp (more control, lower-level)
from llama_cpp import Llama
llm = Llama(model_path="models/llm/llama-3.1-8b-Q4_K_M.gguf", n_ctx=4096)
```
- **Model:** Llama 3.1 8B (Q4_K_M quantized, ~5GB VRAM or CPU)
- **Context:** 4096 tokens minimum
- **System prompt:** Defines interviewer personality, question generation rules
- **Streaming:** Stream tokens for faster perceived response

#### Turn-Taking Refinement
```
Current flow: User speaks → STT → LLM → TTS → Avatar speaks
Target flow:
  1. User speaks → STT (faster-whisper) → transcript
  2. Detect end-of-speech (pause > 1.5s or explicit signal)
  3. Send transcript to backend → LLM (local) generates response
  4. Stream LLM tokens → accumulate → send to TTS
  5. TTS generates audio → stream to frontend
  6. Frontend: audio playback + lip-sync + avatar animation
  7. Detect avatar speech end → listen for user again
```

#### Integration with Backend
- Voice bot runs as a **separate service** (not inside FastAPI)
- Communicates with backend via:
  - **WebSocket** for real-time audio/text streaming
  - **HTTP** for session configuration, model loading
- Backend orchestrates: tells voice bot which personality to use, receives transcripts

---

## Backend Development Guide

### Database Models

#### User
```python
class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(unique=True, index=True)
    hashed_password: Mapped[str]
    full_name: Mapped[str | None]
    is_active: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())

    resumes: Mapped[list["Resume"]] = relationship(back_populates="user")
    sessions: Mapped[list["Session"]] = relationship(back_populates="user")
```

#### Resume
```python
class Resume(Base):
    __tablename__ = "resumes"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    filename: Mapped[str]
    file_path: Mapped[str]
    parsed_text: Mapped[str | None]
    analysis: Mapped[dict | None] = mapped_column(JSONB)
    version: Mapped[int] = mapped_column(default=1)
    created_at: Mapped[datetime]

    user: Mapped["User"] = relationship(back_populates="resumes")
    sessions: Mapped[list["Session"]] = relationship(back_populates="resume")
```

#### Session
```python
class Session(Base):
    __tablename__ = "sessions"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    resume_id: Mapped[int] = mapped_column(ForeignKey("resumes.id"))
    status: Mapped[str]
    config: Mapped[dict] = mapped_column(JSONB)
    started_at: Mapped[datetime | None]
    ended_at: Mapped[datetime | None]

    user: Mapped["User"] = relationship(back_populates="sessions")
    resume: Mapped["Resume"] = relationship(back_populates="sessions")
    answers: Mapped[list["Answer"]] = relationship(back_populates="session")
    score: Mapped["Score | None"] = relationship(back_populates="session")
```

#### Answer
```python
class Answer(Base):
    __tablename__ = "answers"
    id: Mapped[int] = mapped_column(primary_key=True)
    session_id: Mapped[int] = mapped_column(ForeignKey("sessions.id"))
    question_id: Mapped[int]
    question_text: Mapped[str]
    transcript: Mapped[str]
    audio_path: Mapped[str | None]
    face_metrics: Mapped[list[dict]] = mapped_column(JSONB)
    audio_metrics: Mapped[dict | None] = mapped_column(JSONB)
    nlp_score: Mapped[dict | None] = mapped_column(JSONB)
    duration_seconds: Mapped[float | None]

    session: Mapped["Session"] = relationship(back_populates="answers")
```

#### Score
```python
class Score(Base):
    __tablename__ = "scores"
    id: Mapped[int] = mapped_column(primary_key=True)
    session_id: Mapped[int] = mapped_column(ForeignKey("sessions.id"), unique=True)
    confidence: Mapped[float]
    communication: Mapped[float]
    technical: Mapped[float]
    structure: Mapped[float]
    overall: Mapped[float]
    breakdown: Mapped[dict] = mapped_column(JSONB)
    suggestions: Mapped[list[str]] = mapped_column(JSONB)

    session: Mapped["Session"] = relationship(back_populates="score")
```

### API Endpoints

#### Auth (/api/v1/auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /register | Create account |
| POST | /login | Get JWT token |
| POST | /refresh | Refresh access token |
| GET | /me | Get current user |

#### Resume (/api/v1/resumes)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | / | Upload resume (PDF/DOCX) |
| GET | / | List user resumes |
| GET | /{id} | Get resume with analysis |
| POST | /{id}/analyze | Trigger/re-run analysis |
| GET | /{id}/suggestions | Get improvement suggestions |
| DELETE | /{id} | Delete resume |

#### Interview (/api/v1/interviews)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /sessions | Create new session |
| GET | /sessions | List sessions |
| GET | /sessions/{id} | Get session details |
| POST | /sessions/{id}/start | Start interview |
| POST | /sessions/{id}/end | End interview |
| GET | /sessions/{id}/report | Get final report |

#### WebSocket (/ws/interview)
| Event | Direction | Payload |
|-------|-----------|---------|
| join_session | C→S | { session_id, token } |
| session_joined | S→C | { status, config } |
| question | S→C | { id, text, type, difficulty } |
| answer_start | C→S | { session_id } |
| answer_chunk | C→S | { audio_blob } (binary) |
| answer_end | C→S | { session_id } |
| transcript | S→C | { text, is_final } |
| tts_audio | S→C | Binary audio chunk |
| viseme_data | S→C | { visemes: [...] } |
| face_metrics | S→C | { confidence, eye_contact, posture } |
| audio_metrics | S→C | { wpm, pitch, fillers, pauses } |
| session_complete | S→C | { redirect_url } |

### Services Implementation Notes

#### Resume Parser (services/resume_parser.py)
```python
import fitz  # PyMuPDF

def parse_pdf(file_path: str) -> str:
    doc = fitz.open(file_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text
```

#### Resume Analyzer (services/resume_analyzer.py)
```python
import spacy
from sentence_transformers import SentenceTransformer

nlp = spacy.load("en_core_web_trf")
embedder = SentenceTransformer("all-MiniLM-L6-v2")

def analyze_resume(text: str) -> dict:
    doc = nlp(text)
    skills = [ent.text for ent in doc.ents if ent.label_ == "SKILL"]
    weak_verbs = ["helped", "assisted", "worked on", "responsible for"]
    found_weak = [token.text for token in doc if token.lemma_ in weak_verbs]
    return {
        "skills_detected": skills,
        "weak_verbs": found_weak,
        "ats_score": calculate_ats_score(text),
        "gaps": identify_gaps(text, skills),
        "suggestions": generate_suggestions(text, found_weak)
    }
```

#### Question Generator (services/question_generator.py)
```python
# Uses local LLM via Ollama/llama.cpp
# System prompt defines interviewer role and rules

SYSTEM_PROMPT = """You are a technical interviewer.
Generate interview questions based on the candidate resume.
Rules:
1. Mix technical and behavioral questions
2. Ask about resume gaps
3. Difficulty: {difficulty}
4. Personality: {personality}
5. Keep questions concise
Resume: {resume_text}
Previous questions: {previous_questions}
Generate next question:"""
```

---

## Frontend Development Guide

### Component Patterns

#### Avatar Scene (R3F)
```tsx
import { Canvas } from '@react-three/fiber'
import { Environment, ContactShadows } from '@react-three/drei'
import { AvatarModel } from './AvatarModel'
import { LipSync } from './LipSync'

export default function AvatarScene() {
  return (
    <Canvas camera={{ position: [0, 1.5, 3], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 2]} intensity={1} />
      <Environment preset="studio" />
      <AvatarModel url="/avatar/interviewer.glb" />
      <LipSync />
      <ContactShadows position={[0, 0, 0]} opacity={0.4} />
    </Canvas>
  )
}
```

#### WebSocket Hook
```tsx
import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

export function useWebSocket(sessionId: string) {
  const socketRef = useRef<Socket>()

  useEffect(() => {
    const socket = io('ws://localhost:8000', {
      auth: { token: localStorage.getItem('token') }
    })
    socketRef.current = socket
    socket.emit('join_session', { session_id: sessionId })
    return () => { socket.disconnect() }
  }, [sessionId])

  return { socket: socketRef.current }
}
```

### State Management (Zustand)

```ts
import { create } from 'zustand'

interface InterviewState {
  sessionId: string | null
  status: 'idle' | 'connecting' | 'active' | 'completed'
  currentQuestion: string | null
  faceMetrics: { confidence: number; eyeContact: number; posture: number }
  audioMetrics: { wpm: number; fillers: number; pauses: number }
  isAvatarSpeaking: boolean
  isUserSpeaking: boolean

  setSessionId: (id: string) => void
  setStatus: (status: InterviewState['status']) => void
  setQuestion: (q: string) => void
  updateFaceMetrics: (m: Partial<InterviewState['faceMetrics']>) => void
  updateAudioMetrics: (m: Partial<InterviewState['audioMetrics']>) => void
  setAvatarSpeaking: (v: boolean) => void
  setUserSpeaking: (v: boolean) => void
}

export const useInterviewStore = create<InterviewState>((set) => ({
  sessionId: null,
  status: 'idle',
  currentQuestion: null,
  faceMetrics: { confidence: 0, eyeContact: 0, posture: 0 },
  audioMetrics: { wpm: 0, fillers: 0, pauses: 0 },
  isAvatarSpeaking: false,
  isUserSpeaking: false,

  setSessionId: (id) => set({ sessionId: id }),
  setStatus: (status) => set({ status }),
  setQuestion: (q) => set({ currentQuestion: q }),
  updateFaceMetrics: (m) => set((s) => ({ faceMetrics: { ...s.faceMetrics, ...m } })),
  updateAudioMetrics: (m) => set((s) => ({ audioMetrics: { ...s.audioMetrics, ...m } })),
  setAvatarSpeaking: (v) => set({ isAvatarSpeaking: v }),
  setUserSpeaking: (v) => set({ isUserSpeaking: v }),
}))
```

---

## Marketing Site Structure

### Pages
| Page | Purpose | Key Sections |
|------|---------|-------------|
| index.html | Landing page | Hero, features, how it works, testimonials, CTA |
| about.html | About Mirra | Mission, team, technology |
| pricing.html | Plans | Free, Pro, Enterprise tiers |

### Design Direction
- Clean, professional, trustworthy
- Dark mode with accent color (teal/cyan)
- 3D avatar preview in hero section (lightweight, not full R3F)
- Smooth scroll animations (GSAP or Intersection Observer)
- Clear CTA: "Start Practicing" → links to app login

### CTA Flow
```
marketing/index.html
    ↓ "Start Practicing" button
app.mirra.local/login
    ↓ Auth
app.mirra.local/dashboard
    ↓ Upload resume / Start interview
```

---

## Docker Compose (Full Stack)

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: mirra
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql+asyncpg://postgres:password@postgres:5432/mirra
      - REDIS_URL=redis://redis:6379
    volumes:
      - ./models:/app/models:ro
      - ./uploads:/app/uploads
    depends_on:
      - postgres
      - redis

  voice-bot:
    build: ./voice-bot
    ports:
      - "8001:8001"
    volumes:
      - ./models:/app/models:ro
    environment:
      - BACKEND_URL=http://backend:8000
      - REDIS_URL=redis://redis:6379
    depends_on:
      - redis

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    depends_on:
      - backend

  marketing:
    image: nginx:alpine
    ports:
      - "3000:80"
    volumes:
      - ./marketing:/usr/share/nginx/html:ro

volumes:
  postgres_data:
```

---

## Environment Variables Template

Create .env from .env.example:

```bash
# Database
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/mirra

# Auth
SECRET_KEY=change-this-to-a-random-32-char-string
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Redis
REDIS_URL=redis://localhost:6379

# File Storage
UPLOAD_DIR=./uploads
MAX_UPLOAD_SIZE=10485760

# Models (local paths)
WHISPER_MODEL_PATH=./models/whisper/medium
TTS_MODEL_PATH=./models/tts/coqui
LLM_MODEL_PATH=./models/llm/llama-3.1-8b-Q4_K_M.gguf
EMBEDDINGS_MODEL_PATH=./models/embeddings/all-MiniLM-L6-v2

# LLM Config
LLM_CONTEXT_SIZE=4096
LLM_MAX_TOKENS=512
LLM_TEMPERATURE=0.7

# Voice Bot
VOICE_BOT_PORT=8001
AUDIO_SAMPLE_RATE=16000
AUDIO_CHUNK_SIZE=1024

# Frontend
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

---

## Model Download Guide

### Whisper (faster-whisper)
```bash
pip install faster-whisper
# Models auto-download on first use
```

### Llama 3.1 (Ollama)
```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama pull llama3.1:8b
```

### Coqui TTS
```bash
pip install TTS
# Models auto-download
```

### spaCy
```bash
pip install spacy
python -m spacy download en_core_web_trf
```

### sentence-transformers
```bash
pip install sentence-transformers
# Models auto-download on first use
```

---

## Coding Conventions

### Python (Backend)
- Async everywhere: All DB operations, API endpoints, external calls
- Type hints: Every function parameter and return type
- Pydantic v2: All request/response models
- SQLAlchemy 2.0: Mapped[], mapped_column(), select() syntax
- Service layer: Routers thin, services thick
- Error handling: Custom exceptions, consistent error responses
- Logging: Loguru, never print
- Docstrings: Google style for all public functions

### TypeScript (Frontend)
- Strict mode: strict: true in tsconfig
- Functional components: No class components
- Custom hooks: Reusable logic extracted to hooks
- Zustand stores: One store per domain (auth, interview, resume)
- Tailwind: No inline styles, use utility classes
- Props interfaces: Always defined, never any
- Error boundaries: Wrap 3D avatar component (it can crash renderer)

### Git
- Branch naming: feature/name, fix/name, refactor/name, docs/name
- Commit messages: Conventional commits
  - feat: add resume upload endpoint
  - fix: resolve JWT expiration bug
  - refactor: extract auth logic to service
  - docs: update API documentation
- PRs: Required before merging to develop
- No direct commits to main or develop

---

## Performance Targets

| Metric | Target | Notes |
|--------|--------|-------|
| STT latency | < 1s | faster-whisper on GPU, or CPU with tiny/base model |
| LLM response | < 2s | Streaming tokens, perceived faster |
| TTS latency | < 500ms | Coqui TTS on GPU, Piper on CPU |
| Total round-trip | < 3s | User speaks → avatar responds |
| WebSocket reconnect | < 2s | Socket.io auto-reconnect |
| Avatar FPS | > 30 | On mid-range hardware |
| Page load | < 2s | Code splitting, lazy loading |

---

## Security Checklist

- [ ] JWT tokens: short expiry (30min), refresh tokens (7 days)
- [ ] Passwords: bcrypt with 12+ rounds
- [ ] File uploads: size limits, type validation, scan for malware
- [ ] SQL injection: SQLAlchemy ORM only, no raw queries
- [ ] XSS: httpOnly cookies, sanitize user input
- [ ] CSRF: CORS whitelist, SameSite cookies
- [ ] Rate limiting: Per-IP and per-user limits on auth endpoints
- [ ] Session recordings: Encrypted at rest, access controlled
- [ ] LLM prompts: Sanitize to prevent prompt injection

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| ModuleNotFoundError | Activate venv, check requirements.txt |
| Database connection failed | Check PostgreSQL running, URL correct |
| CORS error | Verify allow_origins matches frontend port |
| WebSocket disconnects | Check Redis running, auth token valid |
| 3D avatar not loading | Check GLB file path, CORS for static files |
| STT slow | Use smaller Whisper model, or GPU |
| LLM OOM | Use smaller model, reduce context size, or add RAM |
| TTS garbled | Check sample rate matches (16kHz) |

---

## Development Workflow

1. Start infrastructure: docker-compose up postgres redis
2. Start backend: cd backend && uvicorn app.main:app --reload
3. Start voice-bot: cd voice-bot && python src/main.py
4. Start frontend: cd frontend && npm run dev
5. Open marketing: cd marketing && npx serve . (or any static server)
6. Test: Backend at localhost:8000/docs, Frontend at localhost:5173, Marketing at localhost:3000

---

## Next Steps (Priority Order)

1. Setup repository — Clone, create branches, add this CLAUDE.md and README.md
2. Voice bot refinement — Replace API STT/TTS/LLM with local models
3. Backend foundation — FastAPI, DB, auth, basic routers
4. Marketing site — Landing page with CTA to app
5. Frontend scaffold — React + Vite + Tailwind + basic routing
6. Resume pipeline — Upload, parse, analyze with spaCy
7. 3D avatar — R3F scene, Ready Player Me model, basic animation
8. Integration — Connect voice-bot + backend + frontend + avatar via WebSocket
9. Interview session — Full flow: question → answer → analysis → score
10. Reports — Charts, history, progress tracking

---

> **This file is the single source of truth.** When asking Claude Code (or any AI assistant) to implement features, reference sections from this file. All technical decisions, patterns, and conventions are documented here.
