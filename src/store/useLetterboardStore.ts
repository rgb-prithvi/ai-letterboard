import { create } from 'zustand'
import Fuse from 'fuse.js'
import commonWords from 'common-words'

interface WordSets {
  [key: string]: string[];
}

interface LetterboardStore {
  text: string
  predictions: string[]
  wordSets: WordSets
  currentWordSet: string
  appendLetter: (letter: string) => void
  backspace: () => void
  clear: () => void
  selectPrediction: (prediction: string) => void
  setText: (newText: string) => void
  addWordSet: (name: string, customWords: string[]) => void
  setCurrentWordSet: (name: string) => void
  generatePredictions: () => void
}

const commonWordList = commonWords.map((word: { word: string }) => word.word)

let fuseInstances: { [key: string]: Fuse<string> } = {};

const createFuseInstance = (words: string[]) => {
  const options = {
    includeScore: true,
    threshold: 0.3,
  };
  return new Fuse(words, options);
};

const useLetterboardStore = create<LetterboardStore>((set, get) => ({
  text: '',
  predictions: [],
  wordSets: { default: commonWordList },
  currentWordSet: 'default',
  appendLetter: (letter) => set((state) => ({ text: state.text + letter })),
  backspace: () => set((state) => ({ text: state.text.slice(0, -1) })),
  clear: () => set({ text: '' }),
  selectPrediction: (prediction) => set((state) => ({ text: state.text.trimEnd() + ' ' + prediction + ' ' })),
  setText: (newText) => set({ text: newText }),
  addWordSet: (name, customWords) => set((state) => {
    const newWordSet = Array.from(new Set([...customWords, ...commonWordList]))
    fuseInstances[name] = createFuseInstance(newWordSet);
    return { 
      wordSets: { ...state.wordSets, [name]: newWordSet },
      currentWordSet: name
    }
  }),
  setCurrentWordSet: (name) => set({ currentWordSet: name }),
  generatePredictions: () => {
    const { text, wordSets, currentWordSet } = get()
    const words = text.split(' ')
    const currentWord = words[words.length - 1].toLowerCase()

    if (!fuseInstances[currentWordSet]) {
      const currentSetWords = wordSets[currentWordSet] || wordSets.default
      fuseInstances[currentWordSet] = createFuseInstance(currentSetWords);
    }

    const fuse = fuseInstances[currentWordSet];
    
    if (currentWord.length > 1) {
      const searchResults = fuse.search(currentWord, { limit: 5 });
      const predictions = searchResults.map(result => result.item);
      set({ predictions });
    } else {
      set({ predictions: [] });
    }
  },
}))

export default useLetterboardStore
