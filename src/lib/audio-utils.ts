import audioData from './conversation-output.json';

export function createAudioBuffer(audioContext: AudioContext, audioData: Record<string, number>) {
  const buffer = audioContext.createBuffer(1, Object.keys(audioData).length, audioContext.sampleRate);
  const channelData = buffer.getChannelData(0);

  for (let i = 0; i < channelData.length; i++) {
    channelData[i] = audioData[i] || 0;
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