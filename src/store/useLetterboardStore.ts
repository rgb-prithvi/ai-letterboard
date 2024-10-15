import { create } from "zustand";
import { fetchWordSet } from "@/lib/word-selection";
import { DEFAULT_VOICE_ID } from "@/lib/constants";
import { logInteraction } from "@/lib/log-interaction";
import debounce from "lodash/debounce";
import { supabase } from "@/lib/supabase";

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
  userId: string | null;
  setUserId: (id: string | null) => void;
  fetchPredictions: (query: string) => Promise<void>;
}

const useLetterboardStore = create<LetterboardStore>((set, get) => ({
  text: "",
  predictions: [],
  wordSets: { default: [] },
  currentWordSet: "default",
  selectedWords: [],
  isLetterBoard: true,
  currentSentence: "",
  userId: null,
  appendLetter: async (letter: string) => {
    const { userId } = get();
    if (userId) {
      await logInteraction("key_press", letter, userId);
    }
    set((state) => {
      const newText = state.text + letter;
      const newSentence = state.currentSentence + letter;
      setTimeout(() => get().generatePredictions(), 0);
      return { text: newText, currentSentence: newSentence };
    });

    if (letter === " " || letter === "." || letter === "!" || letter === "?") {
      const { currentSentence } = get();
      set({ currentSentence: "" });
    }
  },
  backspace: async () => {
    const { userId } = get();
    if (userId) {
      await logInteraction("key_press", "backspace", userId);
    }
    set((state) => {
      const newText = state.text.slice(0, -1);
      const newSentence = state.currentSentence.slice(0, -1);
      setTimeout(() => get().generatePredictions(), 0);
      return { text: newText, currentSentence: newSentence };
    });
  },
  clear: () => {
    const { userId } = get();
    if (userId) {
      logInteraction("key_press", "clear", userId);
    }
    set({ text: "" });
  },
  selectPrediction: (prediction) => {
    const { userId } = get();
    if (userId) {
      logInteraction("prediction_selected", prediction, userId);
    }
    set((state) => {
      const words = state.text.split(" ");
      words[words.length - 1] = prediction;
      const newText = words.join(" ") + " ";
      setTimeout(() => get().generatePredictions(), 0);
      return { text: newText };
    });
  },
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
    const { text } = get();
    const words = text.split(" ");
    const currentWord = words[words.length - 1].toLowerCase();
    get().fetchPredictions(currentWord);
  },
  setSelectedWords: (words) => set({ selectedWords: words }),
  toggleBoard: () => set((state) => ({ isLetterBoard: !state.isLetterBoard })),
  initializeWordSet: async () => {
    const words = await fetchWordSet();
    set({ wordSets: { default: words } });
    get().generatePredictions();
  },
  playAudio: async (text: string) => {
    const { userId } = get();
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
      const audio = new Audio(audioUrl);

      await audio.play();

      // Clean up the object URL after playback
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
      };
    } catch (error) {
      console.error("Error playing audio:", error);
      // You might want to add some user-facing error handling here
    }
  },
  setUserId: (id: string | null) => set({ userId: id }),
  fetchPredictions: debounce(async (query: string) => {
    const { userId } = get();
    if (!userId || query.length === 0) {
      set({ predictions: [] });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("words")
        .select("word")
        .in('word_bank_id', (sb) =>
          sb.from('word_banks')
            .select('id')
            .eq('user_id', userId)
        )
        .ilike("word", `%${query}%`)
        .order("word", { ascending: true })
        .limit(5);

      if (error) throw error;

      const predictions = data.map((item) => item.word);
      set({ predictions });
    } catch (error) {
      console.error("Error fetching predictions:", error);
      set({ predictions: [] });
    }
  }, 300), // 300ms debounce
}));

export default useLetterboardStore;
