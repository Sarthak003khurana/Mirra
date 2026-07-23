import logging

import numpy as np
import sounddevice as sd

logger = logging.getLogger(__name__)


def record_until_silence(
    samplerate: int = 16000,
    chunk_duration: float = 0.3,
    start_threshold: float = 0.0008,
    silence_threshold: float = 0.0003,
    silence_duration: float = 1.5,
) -> np.ndarray:
    """Block until speech starts, then record until `silence_duration` seconds
    of near-silence. Returns mono float32 samples at `samplerate`."""

    chunk_size = int(samplerate * chunk_duration)
    audio_chunks: list[np.ndarray] = []
    silence_time = 0.0
    speaking_started = False

    stream = sd.InputStream(samplerate=samplerate, channels=1, dtype="float32")
    stream.start()

    try:
        while True:
            chunk, _ = stream.read(chunk_size)
            chunk = chunk.flatten()
            volume = float(np.linalg.norm(chunk) / len(chunk))

            if not speaking_started:
                if volume > start_threshold:
                    speaking_started = True
                    logger.info("Recording started...")
                    audio_chunks.append(chunk)
                continue

            audio_chunks.append(chunk)
            silence_time = silence_time + chunk_duration if volume < silence_threshold else 0.0

            if silence_time > silence_duration:
                logger.info("Silence detected, stopping recording.")
                break
    finally:
        stream.stop()
        stream.close()

    if not audio_chunks:
        return np.zeros(0, dtype=np.float32)

    return np.concatenate(audio_chunks)
