import audioData from './conversation-output.json';

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

export function getAudioDataFromJson(): Record<string, number> {
  return audioData.item.formatted.audio;
}