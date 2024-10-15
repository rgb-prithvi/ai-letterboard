import audioData from "./conversation-output.json";
import { DEFAULT_VOICE_ID } from "@/lib/constants";
import { logInteraction } from "./log-interaction";

const SAMPLE_RATE = 24000; // Matching the sample rate from play-audio.js

function normalizeAudio(audioData: Record<string, number>): Record<string, number> {
  const values = Object.values(audioData);
  const maxValue = Math.max(...values.map(Math.abs));
  const scaleFactor = 32767 / maxValue;

  const normalizedData: Record<string, number> = {};
  for (const [key, value] of Object.entries(audioData)) {
    normalizedData[key] = Math.round(value * scaleFactor);
  }

  return normalizedData;
}

export function createAudioBuffer(audioContext: AudioContext, audioData: Record<string, number>) {
  const normalizedData = normalizeAudio(audioData);
  const buffer = audioContext.createBuffer(1, Object.keys(normalizedData).length, SAMPLE_RATE);
  const channelData = buffer.getChannelData(0);

  for (let i = 0; i < channelData.length; i++) {
    // Convert from 16-bit integer to float
    channelData[i] = (normalizedData[i] || 0) / 32767;
  }

  return buffer;
}

export function playAudioBuffer(audioContext: AudioContext, buffer: AudioBuffer) {
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start();
  return source;
}

export async function playAudio(text: string, userId: string | null) {
  if (userId) {
    await logInteraction("word_spoken", text, userId);
  }

  try {
    const response = await fetch(`/api/tts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, voice_id: DEFAULT_VOICE_ID }),
    });

    if (!response.ok) {
      throw new Error(`TTS request failed: ${response.statusText}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    const audio = new Audio();

    audio.addEventListener("canplaythrough", () => {
      audio.play().catch((e) => console.error("Playback failed:", e));
    });

    audio.addEventListener("ended", () => {
      URL.revokeObjectURL(audioUrl);
    });

    audio.addEventListener("error", (e) => {
      console.error("Audio playback error:", e);
      URL.revokeObjectURL(audioUrl);
    });

    audio.src = audioUrl;
    audio.load();
  } catch (error) {
    console.error("Error playing audio:", error);
    // You might want to add some user-facing error handling here
  }
}

export function getAudioDataFromJson(): Record<string, number> {
  return audioData.item.formatted.audio;
}
