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

## Run against the backend (real interview, with avatar lip-sync)

In this mode the backend owns question generation and scoring
(`backend/app/websocket/interview_handler.py`); this process just speaks each
question with a real, audio-synced viseme schedule (so the browser avatar can
lip-sync it) and reports the transcript back for scoring.

1. Start the backend: `uvicorn app.main:app --reload` from `backend/`.
2. In the frontend, upload a resume, click "Start interview with this
   resume", and copy the session id from the resulting `/interview/<id>` URL.
3. Connect the voice bot to that session **before** clicking "Start interview"
   in the frontend (it needs to be in the room to catch the first question):

   ```bash
   set BACKEND_WS_URL=ws://localhost:8000/ws/interview
   set MIRRA_SESSION_ID=<the session id from step 2>
   python -m src.main
   ```
4. Click "Start interview" in the frontend. The voice bot receives the
   `question` event, synthesizes it with Piper, and streams `tts_audio` +
   `viseme_data` (an RMS-amplitude envelope of the actual audio, not a canned
   animation) over the socket so the avatar's jaw/mouth morphs move in time
   with real speech. It then records your mic answer, transcribes it with
   Whisper, and sends the final `transcript` — which the backend scores and
   uses to generate the next question, repeating for 5 questions before
   auto-completing the session.

If the backend/session isn't reachable, it logs a warning and falls back to
the fully standalone loop above instead of crashing.

## Known environment issue

`faster-whisper` depends on `ctranslate2`'s native DLL. On machines with
Windows Smart App Control / WDAC enabled, that DLL can get blocked at import
time with `OSError: [WinError 4551] An Application Control policy has blocked
this file`. This is a machine security policy, not a code bug — if you hit it,
allow the DLL through your Application Control policy (or run on a machine
without that policy enabled).
