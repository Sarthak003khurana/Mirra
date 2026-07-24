import logging
import wave
from pathlib import Path

import numpy as np
import sounddevice as sd
from piper import PiperVoice
from piper.download_voices import download_voice

logger = logging.getLogger(__name__)

MODELS_DIR = Path(__file__).resolve().parent.parent / "models" / "tts"
DEFAULT_VOICE = "en_US-lessac-medium"


class TTSEngine:
    """Local text-to-speech via Piper (ONNX, CPU-friendly). No third-party TTS API.

    Downloads the requested voice into voice-bot/models/tts/ on first use, same
    "auto-download on first use" pattern as faster-whisper.
    """

    def __init__(self, voice_name: str = DEFAULT_VOICE, models_dir: Path = MODELS_DIR):
        models_dir.mkdir(parents=True, exist_ok=True)
        model_path = models_dir / f"{voice_name}.onnx"
        config_path = models_dir / f"{voice_name}.onnx.json"

        if not model_path.exists() or not config_path.exists():
            logger.info("Voice '%s' not found locally - downloading...", voice_name)
            download_voice(voice_name, models_dir)

        logger.info("Loading Piper voice '%s'...", voice_name)
        self.voice = PiperVoice.load(str(model_path), config_path=str(config_path))
        self.sample_rate = self.voice.config.sample_rate
        logger.info("Piper voice loaded (sample rate=%d).", self.sample_rate)

    def synthesize(self, text: str) -> np.ndarray:
        """Returns mono float32 PCM in [-1, 1] at self.sample_rate."""
        text = text.strip()
        if not text:
            return np.zeros(0, dtype=np.float32)

        chunks = [chunk.audio_float_array for chunk in self.voice.synthesize(text)]
        if not chunks:
            return np.zeros(0, dtype=np.float32)
        return np.concatenate(chunks)

    def synthesize_to_file(self, text: str, out_path: str | Path) -> Path:
        out_path = Path(out_path)
        with wave.open(str(out_path), "wb") as wav_file:
            self.voice.synthesize_wav(text.strip(), wav_file)
        return out_path

    def speak(self, text: str) -> None:
        audio = self.synthesize(text)
        if audio.size == 0:
            return
        logger.info("Bot: %s", text)
        sd.play(audio, samplerate=self.sample_rate)
        sd.wait()
