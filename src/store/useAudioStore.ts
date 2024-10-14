// @ts-nocheck
import { create } from "zustand";
import { RealtimeClient } from "@openai/realtime-api-beta";

const SAMPLE_RATE = 24000;
const DEBOUNCE_TIME = 200;

interface AudioStore {
  isPlaying: boolean;
  audioContext: AudioContext | null;
  realtimeClient: RealtimeClient | null;
  audioBuffer: Record<string, number>;
  audioTimeout: NodeJS.Timeout | null;
  initializeAudio: () => void;
  connectToRealtimeAPI: () => Promise<void>;
  disconnectFromRealtimeAPI: () => void;
  sendUserMessage: (text: string) => void;
  handleAudioData: (audioData: Record<string, number>) => void;
  playAudioBuffer: () => void;
  sendFullSentence: (text: string) => void;
}

const useAudioStore = create<AudioStore>((set, get) => ({
  isPlaying: false,
  audioContext: null,
  realtimeClient: null,
  audioBuffer: {},
  audioTimeout: null,

  initializeAudio: () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    set({ audioContext });
  },

  connectToRealtimeAPI: async () => {
    const client = new RealtimeClient({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      dangerouslyAllowAPIKeyInBrowser: true, // Be cautious with this in production
    });

    client.updateSession({
      instructions:
        'You are a great, upbeat friend. You are a text to speech agent assisting a person with autism. The person is typing words on a letterboard, and needs your help to read them. Read the words out loud, EXACTLY AS THEY ARE TYPED, with no other commentary. For example, if the user types "I", just say "I". If the user types "I love you", just say "I love you".',
      voice: "echo",
      turn_detection: { type: "server_vad" },
      input_audio_transcription: { model: "whisper-1" },
    });

    client.on("conversation.updated", async (event) => {
      const { item } = event;
      if (item.role === "assistant" && item.formatted && item.formatted.audio) {
        get().handleAudioData(item.formatted.audio);
      }
    });

    await client.connect();
    set({ realtimeClient: client });
  },

  disconnectFromRealtimeAPI: () => {
    const { realtimeClient, audioTimeout } = get();
    if (realtimeClient) {
      realtimeClient.disconnect();
      set({ realtimeClient: null });
    }
    if (audioTimeout) {
      clearTimeout(audioTimeout);
      set({ audioTimeout: null });
    }
  },

  sendUserMessage: (text: string) => {
    const { realtimeClient } = get();
    if (realtimeClient) {
      const prompt = `The user has typed the word "${text}". Please read it out loud.`;
      realtimeClient.sendUserMessageContent([{ type: "input_text", text: prompt }]);
    }
  },

  handleAudioData: (audioData: Record<string, number>) => {
    const { audioBuffer, audioTimeout } = get();

    // Merge new audio data with existing buffer
    const newBuffer = { ...audioBuffer, ...audioData };
    set({ audioBuffer: newBuffer });

    // Clear existing timeout if there is one
    if (audioTimeout) {
      clearTimeout(audioTimeout);
    }

    // Set new timeout
    const newTimeout = setTimeout(() => {
      get().playAudioBuffer();
    }, DEBOUNCE_TIME);

    set({ audioTimeout: newTimeout });
  },

  playAudioBuffer: () => {
    const { audioContext, audioBuffer } = get();
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

    const normalizedData = normalizeAudio(audioBuffer);

    // Create audio buffer
    const dataLength = Object.keys(normalizedData).length;
    const buffer = audioContext.createBuffer(1, dataLength, SAMPLE_RATE);
    const channelData = buffer.getChannelData(0);

    // Fill the buffer
    for (let i = 0; i < dataLength; i++) {
      // Convert from 16-bit integer to float
      channelData[i] = normalizedData[i] / 32768;
    }

    // Play audio
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start();
    set({ isPlaying: true });

    source.onended = () => {
      set({ isPlaying: false, audioBuffer: {} }); // Clear the buffer after playing
    };

    console.log(`Playing audio with sample rate: ${SAMPLE_RATE} Hz`);
    console.log(`Audio duration: ${dataLength / SAMPLE_RATE} seconds`);
  },

  sendFullSentence: (text: string) => {
    const { realtimeClient } = get();
    if (realtimeClient) {
      const prompt = `The user has typed the following sentence: "${text}". Please read it out loud. Note that the user is autistic, and may not type in full sentences. If they don't type a proper sentence, please fix it for them. For example, if they type "I want drive", please read it as "I want to go for a drive".`;
      realtimeClient.sendUserMessageContent([{ type: "input_text", text: prompt }]);
    }
  },
}));

export default useAudioStore;
