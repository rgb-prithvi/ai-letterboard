import { create } from 'zustand';
import { RealtimeClient } from '@openai/realtime-api-beta';

const SAMPLE_RATE = 24000; // Matching the sample rate from play-audio.js

interface AudioStore {
  isPlaying: boolean;
  audioContext: AudioContext | null;
  realtimeClient: RealtimeClient | null;
  initializeAudio: () => void;
  connectToRealtimeAPI: () => Promise<void>;
  disconnectFromRealtimeAPI: () => void;
  sendUserMessage: (text: string) => void;
  handleAudioData: (audioData: Record<string, number>) => void;
}

const useAudioStore = create<AudioStore>((set, get) => ({
  isPlaying: false,
  audioContext: null,
  realtimeClient: null,

  initializeAudio: () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    set({ audioContext });
  },

  connectToRealtimeAPI: async () => {
    const client = new RealtimeClient({ 
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      dangerouslyAllowAPIKeyInBrowser: true // Be cautious with this in production
    });

    client.updateSession({
      instructions: 'You are a great, upbeat friend.',
      voice: 'alloy',
      turn_detection: { type: 'none' },
      input_audio_transcription: { model: 'whisper-1' },
    });

    client.on('conversation.updated', async (event) => {
      const { item } = event;
      if (item.role === 'assistant' && item.formatted && item.formatted.audio) {
        get().handleAudioData(item.formatted.audio);
      }
    });

    await client.connect();
    set({ realtimeClient: client });
  },

  disconnectFromRealtimeAPI: () => {
    const { realtimeClient } = get();
    if (realtimeClient) {
      realtimeClient.disconnect();
      set({ realtimeClient: null });
    }
  },

  sendUserMessage: (text: string) => {
    const { realtimeClient } = get();
    if (realtimeClient) {
      realtimeClient.sendUserMessageContent([{ type: 'input_text', text }]);
    }
  },

  handleAudioData: (audioData: Record<string, number>) => {
    const { audioContext } = get();
    if (!audioContext) return;

    // Normalize audio data
    const normalizeAudio = (data: Record<string, number>) => {
      const values = Object.values(data);
      const maxValue = Math.max(...values.map(Math.abs));
      const scaleFactor = 32767 / maxValue;

      const normalizedData: Record<string, number> = {};
      for (const [key, value] of Object.entries(data)) {
        normalizedData[key] = Math.round(value * scaleFactor);
      }

      return normalizedData;
    };

    const normalizedData = normalizeAudio(audioData);

    // Create audio buffer
    const buffer = audioContext.createBuffer(1, Object.keys(normalizedData).length, SAMPLE_RATE);
    const channelData = buffer.getChannelData(0);

    for (let i = 0; i < channelData.length; i++) {
      channelData[i] = normalizedData[i] / 32767; // Convert to float
    }

    // Play audio
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start();
    set({ isPlaying: true });

    source.onended = () => {
      set({ isPlaying: false });
    };

    console.log(`Playing audio with sample rate: ${SAMPLE_RATE} Hz`);
    console.log(`Audio duration: ${buffer.duration} seconds`);
  },
}));

export default useAudioStore;
