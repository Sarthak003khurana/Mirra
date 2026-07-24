import asyncio
import logging
import os
from tkinter import Tk
from tkinter.filedialog import askopenfilename

from resume.extractor import extract_resume_text
from resume.parser import parse_resume
from src.llm_bridge import LLMBridge
from src.stt_engine import STTEngine
from src.tts_engine import TTSEngine
from src.turn_manager import TurnManager
from src.websocket_client import VoiceBotWebSocketClient

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
logger = logging.getLogger(__name__)

BACKEND_WS_URL = os.environ.get("BACKEND_WS_URL", "ws://localhost:8000/ws/interview")
SESSION_ID = os.environ.get("MIRRA_SESSION_ID", "local-dev-session")


def pick_resume() -> str:
    Tk().withdraw()
    path = askopenfilename(title="Upload Resume", filetypes=[("Resume Files", "*.pdf *.jpg *.jpeg *.png")])
    if not path:
        raise SystemExit("No resume selected.")
    return path


def load_face_analyzer():
    try:
        from analysis.eye_contact import check_eye_contact

        return check_eye_contact
    except Exception as exc:  # camera/mediapipe unavailable - degrade gracefully
        logger.warning("Face analysis unavailable (%s) - eye contact scoring disabled.", exc)
        return None


async def connect_backend() -> VoiceBotWebSocketClient | None:
    ws = VoiceBotWebSocketClient(BACKEND_WS_URL, SESSION_ID)
    try:
        await ws.connect()
        return ws
    except Exception as exc:
        logger.warning("Backend WebSocket unavailable (%s) - continuing in standalone mode.", exc)
        return None


async def main() -> None:
    resume_path = pick_resume()
    logger.info("Selected resume: %s", resume_path)

    resume_context = parse_resume(extract_resume_text(resume_path))

    stt = STTEngine()
    tts = TTSEngine()
    llm = LLMBridge()
    ws = await connect_backend()
    face_analyzer = load_face_analyzer()

    manager = TurnManager(stt=stt, tts=tts, llm=llm, ws=ws, face_analyzer=face_analyzer)

    try:
        if ws is not None:
            # A backend interview session is live (created from the frontend
            # dashboard) - let it drive question generation and scoring; this
            # process just speaks each question with lip-synced audio and
            # reports transcripts back. Requires MIRRA_SESSION_ID to match the
            # session id shown in the frontend's /interview/{id} URL, and the
            # session must already be started (POST .../sessions/{id}/start)
            # so the first question exists before this loop starts listening.
            logger.info("Connected to backend session %s - waiting for questions.", SESSION_ID)
            await manager.run_networked_interview()
        else:
            transcript = await manager.run_interview(resume_context, num_questions=3)

            report = "\n\n".join(
                f"Question: {t['question']}\nAnswer: {t['answer']}" for t in transcript
            )
            verdict = await asyncio.to_thread(llm.final_verdict, report, manager.average_eye_score())

            logger.info("===== FINAL RESULT =====")
            logger.info(verdict)
            await asyncio.to_thread(tts.speak, "Here is your final result.")
            await asyncio.to_thread(tts.speak, verdict)
    finally:
        if ws:
            await ws.close()


if __name__ == "__main__":
    asyncio.run(main())
