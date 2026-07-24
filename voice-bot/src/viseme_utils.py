"""Turns synthesized TTS audio into a lightweight, amplitude-driven "viseme"
schedule the avatar can lip-sync against.

We don't have a phoneme/G2P aligner in this pipeline, so rather than fake
precise mouth shapes we stream the real RMS envelope of the audio Piper just
produced (t -> amp in [0, 1]). The avatar maps `amp` onto its jaw/mouth morph
targets, which reads as natural mouth movement synced exactly to the audio
that's actually playing - simpler and more honest than a canned viseme demo.
"""

import base64
import io
import wave

import numpy as np

AMPLITUDE_GAIN = 6.0


def build_viseme_frames(audio: np.ndarray, sample_rate: int, hop_ms: int = 50) -> list[dict]:
    hop = max(1, int(sample_rate * hop_ms / 1000))
    frames = []
    for start in range(0, len(audio), hop):
        window = audio[start : start + hop]
        if window.size == 0:
            continue
        rms = float(np.sqrt(np.mean(window.astype(np.float64) ** 2)))
        amp = min(1.0, rms * AMPLITUDE_GAIN)
        frames.append({"t": round(start / sample_rate, 3), "amp": round(amp, 3)})
    return frames


def encode_wav_base64(audio: np.ndarray, sample_rate: int) -> str:
    buffer = io.BytesIO()
    with wave.open(buffer, "wb") as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)
        pcm16 = (np.clip(audio, -1.0, 1.0) * 32767).astype(np.int16)
        wav_file.writeframes(pcm16.tobytes())
    return base64.b64encode(buffer.getvalue()).decode("ascii")
