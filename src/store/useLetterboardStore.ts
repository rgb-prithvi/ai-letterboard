import { create } from 'zustand'
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

const useLetterboardStore = create<LetterboardStore>((set, get) => ({
  text: '',
  predictions: [],
  wordSets: { default: commonWordList },
  currentWordSet: 'default',
  appendLetter: (letter) => set((state) => {
    const newText = state.text + letter
    setTimeout(() => get().generatePredictions(), 0)
    return { text: newText }
  }),
  backspace: () => set((state) => {
    const newText = state.text.slice(0, -1)
    setTimeout(() => get().generatePredictions(), 0)
    return { text: newText }
  }),
  clear: () => set({ text: '' }),
  selectPrediction: (prediction) => set((state) => ({ text: state.text.trimEnd() + ' ' + prediction + ' ' })),
  setText: (newText) => set({ text: newText }),
  addWordSet: (name, customWords) => set((state) => {
    const newWordSet = Array.from(new Set([...customWords, ...commonWordList]))
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

    const currentSetWords = wordSets[currentWordSet] || wordSets.default

    const predictions = currentSetWords
      .filter(word => word.toLowerCase().startsWith(currentWord))
      .sort((a, b) => a.length - b.length)
      .slice(0, 5)

    set({ predictions })
  },
}))

export default useLetterboardStore
