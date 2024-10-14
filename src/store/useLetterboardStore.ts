import { create } from "zustand";
import { fetchWordSet } from "@/lib/word-selection";
import { DEFAULT_VOICE_ID } from "@/lib/constants";

interface WordSets {
  [key: string]: string[];
}

interface LetterboardStore {
  text: string;
  predictions: string[];
  wordSets: WordSets;
  currentWordSet: string;
  appendLetter: (letter: string) => Promise<void>;
  backspace: () => Promise<void>;
  clear: () => void;
  selectPrediction: (prediction: string) => void;
  setText: (newText: string) => void;
  addWordSet: (name: string, customWords: string[]) => void;
  setCurrentWordSet: (name: string) => void;
  generatePredictions: () => void;
  selectedWords: string[];
  setSelectedWords: (words: string[]) => void;
  isLetterBoard: boolean;
  toggleBoard: () => void;
  initializeWordSet: () => Promise<void>;
  currentSentence: string;
  playAudio: (text: string) => Promise<void>;
}

const useLetterboardStore = create<LetterboardStore>((set, get) => ({
  text: "",
  predictions: [],
  wordSets: { default: [] },
  currentWordSet: "default",
  selectedWords: [],
  isLetterBoard: true,
  currentSentence: "",
  appendLetter: async (letter: string) => {
    set((state) => {
      const newText = state.text + letter;
      const newSentence = state.currentSentence + letter;
      setTimeout(() => get().generatePredictions(), 0);
      return { text: newText, currentSentence: newSentence };
    });

    if (letter === " " || letter === "." || letter === "!" || letter === "?") {
      const { currentSentence, playAudio } = get();
      await playAudio(currentSentence.trim());
      set({ currentSentence: "" });
    } else {
      await get().playAudio(letter);
    }
  },
  backspace: async () => {
    set((state) => {
      const newText = state.text.slice(0, -1);
      const newSentence = state.currentSentence.slice(0, -1);
      setTimeout(() => get().generatePredictions(), 0);
      return { text: newText, currentSentence: newSentence };
    });
  },
  clear: () => set({ text: "" }),
  selectPrediction: (prediction) =>
    set((state) => {
      const words = state.text.split(" ");
      words[words.length - 1] = prediction;
      const newText = words.join(" ") + " ";
      setTimeout(() => get().generatePredictions(), 0);
      return { text: newText };
    }),
  setText: (newText) => set({ text: newText }),
  addWordSet: (name, customWords) =>
    set((state) => {
      const newWordSet = Array.from(new Set([...customWords, ...state.wordSets.default]));
      return {
        wordSets: { ...state.wordSets, [name]: newWordSet },
        currentWordSet: name,
      };
    }),
  setCurrentWordSet: (name) => set({ currentWordSet: name }),
  generatePredictions: () => {
    const { text, wordSets, currentWordSet } = get();
    const words = text.split(" ");
    const currentWord = words[words.length - 1].toLowerCase();

    const currentSetWords = wordSets[currentWordSet] || [];

    const predictions = currentSetWords
      .filter((word) => word.toLowerCase().startsWith(currentWord))
      .sort((a, b) => a.length - b.length)
      .slice(0, 5);

    set({ predictions });
  },
  setSelectedWords: (words) => set({ selectedWords: words }),
  toggleBoard: () => set((state) => ({ isLetterBoard: !state.isLetterBoard })),
  initializeWordSet: async () => {
    const words = await fetchWordSet();
    set({ wordSets: { default: words } });
    get().generatePredictions();
  },
  playAudio: async (text: string) => {
    const response = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, voice_id: DEFAULT_VOICE_ID }),
    });

    if (!response.ok) {
      console.error("TTS request failed");
      return;
    }

    const reader = response.body?.getReader();
    if (!reader) return;

    const audio = new Audio();
    audio.src = URL.createObjectURL(new Blob([], { type: "audio/mpeg" }));

    const pump = async () => {
      const { done, value } = await reader.read();
      if (done) return;

      const blob = new Blob([value], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);
      audio.src = url;
      await audio.play();

      URL.revokeObjectURL(url);
      await pump();
    };

    await pump();
  },
}));

export default useLetterboardStore;
