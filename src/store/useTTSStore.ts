import { create } from 'zustand';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

interface TTSStore {
  isLoading: boolean;
  speak: (text: string) => Promise<void>;
}

const useTTSStore = create<TTSStore>((set) => ({
  isLoading: false,

  speak: async (text: string) => {
    set({ isLoading: true });

    try {
      const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "echo",
        input: text,
      });

      const arrayBuffer = await mp3.arrayBuffer();
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start(0);

    } catch (error) {
      console.error('Error in text-to-speech:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useTTSStore;