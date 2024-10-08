import { create } from 'zustand';

interface TTSStore {
  isLoading: boolean;
  speak: (text: string) => Promise<void>;
}

const useTTSStore = create<TTSStore>((set) => ({
  isLoading: false,

  speak: async (text: string) => {
    set({ isLoading: true });

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const arrayBuffer = await response.arrayBuffer();
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