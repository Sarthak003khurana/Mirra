# Voice Bot

Local, self-hosted voice interview loop. No third-party AI APIs — STT, TTS, and
the LLM all run on your machine.

| Stage | Engine | Module |
|-------|--------|--------|
| STT | faster-whisper | `src/stt_engine.py` |
| TTS | Piper (ONNX, CPU) | `src/tts_engine.py` |
| LLM | Ollama (local) | `src/llm_bridge.py` |
| Turn-taking | - | `src/turn_manager.py` |
| Backend link | WebSocket | `src/websocket_client.py` |

## Setup

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt

# Pull a local model for llm_bridge.py (default is "llama3" - override with
# the OLLAMA_MODEL env var to use whatever you've pulled)
ollama pull llama3.1:8b
```

Piper's voice model (`en_US-lessac-medium` by default) auto-downloads into
`models/tts/` on first run, same as faster-whisper's Whisper weights.

## Run standalone

```bash
python -m src.main
```

Prompts for a resume file, then runs the intro + 3-question interview loop
through your mic and speakers. If the backend isn't running, it falls back to
standalone mode automatically (logged as a warning, not a crash). If no
camera/mediapipe is available, eye-contact scoring is skipped the same way.

## Run against the backend

Start the backend first (`uvicorn app.main:app --reload` from `backend/`), then:

```bash
set BACKEND_WS_URL=ws://localhost:8000/ws/interview
set MIRRA_SESSION_ID=<a session id>
python -m src.main
```

Every turn (`question`, `transcript`, `face_metrics`, `session_complete`) is
sent over `/ws/interview` as it happens, matching the event table in
`CLAUDE.md`.

## Known environment issue

`faster-whisper` depends on `ctranslate2`'s native DLL. On machines with
Windows Smart App Control / WDAC enabled, that DLL can get blocked at import
time with `OSError: [WinError 4551] An Application Control policy has blocked
this file`. This is a machine security policy, not a code bug — if you hit it,
allow the DLL through your Application Control policy (or run on a machine
without that policy enabled).
