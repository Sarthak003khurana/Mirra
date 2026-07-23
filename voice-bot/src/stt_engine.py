import logging
import tempfile
from pathlib import Path

import numpy as np
import scipy.io.wavfile as wav
from faster_whisper import WhisperModel

logger = logging.getLogger(__name__)


class STTEngine:
    """Local speech-to-text via faster-whisper. No third-party STT API."""

    def __init__(self, model_size: str = "base", device: str = "cpu", compute_type: str = "int8"):
        logger.info("Loading Whisper model '%s' (%s/%s)...", model_size, device, compute_type)
        self.model = WhisperModel(model_size, device=device, compute_type=compute_type)
        logger.info("Whisper model loaded.")

    def transcribe_array(self, audio: np.ndarray, samplerate: int = 16000) -> str:
        if audio.size == 0:
            return "No speech detected."

        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
            wav.write(f.name, samplerate, audio)
            tmp_path = f.name

        try:
            return self.transcribe_file(tmp_path)
        finally:
            Path(tmp_path).unlink(missing_ok=True)

    def transcribe_file(self, path: str) -> str:
        segments, _ = self.model.transcribe(path, beam_size=5, language="en")
        text = " ".join(segment.text for segment in segments).strip()
        return text or "No response detected."
