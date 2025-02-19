import { create } from "zustand";
import { fetchWordSet } from "@/lib/word-selection";
import { DEFAULT_VOICE_ID } from "@/lib/constants";
import { logInteraction } from "@/lib/log-interaction";
import debounce from "lodash/debounce";
import { supabase } from "@/lib/supabase";
import { UserSettings } from "@/lib/types";

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
  userId: string | null;
  setUserId: (id: string | null) => void;
  fetchPredictions: (query: string) => Promise<void>;
  userWordBankIds: number[];
  fetchUserWordBankIds: () => Promise<void>;
  userSettings: UserSettings;
  setUserSettings: (settings: UserSettings) => void;
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
  userWordBankIds: [],
  userSettings: {} as UserSettings, // Initialize with empty object
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
  fetchPredictions: debounce(async (query: string) => {
    const { userId, userWordBankIds, userSettings } = get();
    if (!userId || query.length === 0) {
      set({ predictions: [] });
      return;
    }

    const COMMON_WORD_BANK_ID = 28;
    const wordBankIds = [...userWordBankIds, COMMON_WORD_BANK_ID];

    try {
      const { data, error } = await supabase
        .from("words")
        .select("word")
        .in("word_bank_id", wordBankIds)
        .ilike("word", `${query}%`)
        .order("word", { ascending: true })
        .limit(5);

      if (error) throw error;

      const predictions = data.map((item) => {
        const word = item.word;
        return userSettings.letterCase === "uppercase" ? word.toUpperCase() : word.toLowerCase();
      });

      set({ predictions });
    } catch (error) {
      console.error("Error fetching predictions:", error);
      set({ predictions: [] });
    }
  }, 100),
  fetchUserWordBankIds: async () => {
    const { userId } = get();
    if (!userId) return;

    try {
      const { data, error } = await supabase.from("word_banks").select("id").eq("user_id", userId);

      if (error) throw error;

      const ids = data.map((item) => item.id);
      set({ userWordBankIds: ids });
    } catch (error) {
      console.error("Error fetching user word bank IDs:", error);
    }
  },
  setUserSettings: (settings: UserSettings) => set({ userSettings: settings }),
  setUserId: (id: string | null) => set({ userId: id }),
}));

export default useLetterboardStore;
