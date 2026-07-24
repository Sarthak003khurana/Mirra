import asyncio
import logging
from collections.abc import Callable

from src.audio_capture import record_until_silence
from src.llm_bridge import LLMBridge
from src.stt_engine import STTEngine
from src.tts_engine import TTSEngine
from src.viseme_utils import build_viseme_frames, encode_wav_base64
from src.websocket_client import VoiceBotWebSocketClient

logger = logging.getLogger(__name__)

WEAK_ANSWER_KEYWORDS = ("lack", "incorrect", "missing", "weak", "unclear")


class TurnManager:
    """Owns the speak -> listen -> analyze -> follow-up loop.

    Same flow as the original interview_manager.py, refined to be non-blocking
    (blocking model/audio calls run in worker threads) and to emit each turn
    over the backend WebSocket connection when one is attached.
    """

    def __init__(
        self,
        stt: STTEngine,
        tts: TTSEngine,
        llm: LLMBridge,
        ws: VoiceBotWebSocketClient | None = None,
        face_analyzer: Callable[..., float] | None = None,
    ):
        self.stt = stt
        self.tts = tts
        self.llm = llm
        self.ws = ws
        self.face_analyzer = face_analyzer
        self._eye_scores: list[float] = []

    def average_eye_score(self) -> float:
        return sum(self._eye_scores) / len(self._eye_scores) if self._eye_scores else 0.0

    async def _say(self, text: str, event: str = "question") -> None:
        logger.info("Bot: %s", text)
        if self.ws:
            await self.ws.send(event, {"text": text})
        await asyncio.to_thread(self.tts.speak, text)

    async def _listen(self, with_eye_contact: bool = False) -> tuple[str, float]:
        if with_eye_contact and self.face_analyzer:
            audio, eye_score = await asyncio.gather(
                asyncio.to_thread(record_until_silence),
                asyncio.to_thread(self.face_analyzer, 3),
            )
        else:
            audio = await asyncio.to_thread(record_until_silence)
            eye_score = 0.0

        text = await asyncio.to_thread(self.stt.transcribe_array, audio)
        logger.info("Candidate: %s", text)
        if self.ws:
            await self.ws.send("transcript", {"text": text, "is_final": True})
        return text, eye_score

    @staticmethod
    def _is_weak_answer(feedback: str) -> bool:
        return any(word in feedback.lower() for word in WEAK_ANSWER_KEYWORDS)

    async def run_intro_round(self) -> tuple[str, str]:
        await self._say("Please introduce yourself.")
        intro, _ = await self._listen()
        feedback = await asyncio.to_thread(self.llm.analyze_answer, "Introduce yourself", intro)
        return intro, feedback

    async def run_interview(self, resume_context: dict, num_questions: int = 3) -> list[dict]:
        await self._say("Welcome to your AI interview. We will begin with your introduction.")
        intro, intro_feedback = await self.run_intro_round()

        transcript = [{"question": "Introduce yourself", "answer": intro, "feedback": intro_feedback}]

        await self._say("Now we will begin the technical interview.")
        question = await asyncio.to_thread(self.llm.generate_question, resume_context)

        for i in range(num_questions):
            await self._say(question)
            answer, eye_score = await self._listen(with_eye_contact=True)
            self._eye_scores.append(eye_score)

            if self.ws:
                await self.ws.send("face_metrics", {"eye_contact": eye_score})

            feedback = await asyncio.to_thread(self.llm.analyze_answer, question, answer)

            if self._is_weak_answer(feedback):
                await self._say("Let me ask a follow-up question.")
                follow_up = await asyncio.to_thread(self.llm.generate_followup, question, answer)
                await self._say(follow_up)
                follow_answer, _ = await self._listen()
                follow_feedback = await asyncio.to_thread(self.llm.analyze_answer, follow_up, follow_answer)
                answer += f" | Follow-up: {follow_answer} ({follow_feedback})"

            transcript.append(
                {"question": question, "answer": answer, "feedback": feedback, "eye_score": eye_score}
            )

            if i < num_questions - 1:
                await self._say("Next question.")
                question = await asyncio.to_thread(self.llm.generate_question, resume_context)

        await self._say("Thank you for attending the interview.", event="session_complete")
        if self.ws:
            await self.ws.send("session_complete", {"redirect_url": None})

        return transcript

    # ------------------------------------------------------------------
    # Networked mode: the backend (app/websocket/interview_handler.py) owns
    # question generation and scoring. This loop just speaks each question
    # the backend pushes - with a real, audio-synced viseme schedule so the
    # browser avatar can lip-sync it - and reports the transcript back so the
    # backend can score it and advance to the next question.
    # ------------------------------------------------------------------

    async def run_networked_interview(self) -> None:
        if self.ws is None:
            raise RuntimeError("run_networked_interview requires an attached WebSocket client")

        while True:
            frame = await self.ws.receive()
            event = frame.get("event")
            payload = frame.get("payload") or {}

            if event == "question":
                await self._speak_with_lipsync(payload.get("text", ""))
                await self._listen_and_report()
            elif event == "session_complete":
                logger.info("Session complete.")
                break

    async def _speak_with_lipsync(self, text: str) -> None:
        logger.info("Bot: %s", text)
        audio = await asyncio.to_thread(self.tts.synthesize, text)

        if audio.size == 0:
            return

        frames = build_viseme_frames(audio, self.tts.sample_rate)
        await self.ws.send("tts_audio", {"audio_b64": encode_wav_base64(audio, self.tts.sample_rate), "format": "wav"})
        await self.ws.send("viseme_data", {"frames": frames})

        # The browser (avatar/frontend) plays the streamed audio and animates
        # in sync with it, so don't also play it out of this process's speakers.

    async def _listen_and_report(self) -> None:
        if self.face_analyzer:
            audio, eye_score = await asyncio.gather(
                asyncio.to_thread(record_until_silence),
                asyncio.to_thread(self.face_analyzer, 3),
            )
            await self.ws.send("face_metrics", {"confidence": eye_score, "eye_contact": eye_score, "posture": 0.7})
        else:
            audio = await asyncio.to_thread(record_until_silence)

        text = await asyncio.to_thread(self.stt.transcribe_array, audio)
        logger.info("Candidate: %s", text)
        await self.ws.send("transcript", {"text": text, "is_final": True})
