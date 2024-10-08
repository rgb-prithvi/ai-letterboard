import { create } from 'zustand'

interface LetterboardStore {
  text: string
  predictions: string[]
  appendLetter: (letter: string) => void
  backspace: () => void
  clear: () => void
  selectPrediction: (prediction: string) => void
  setText: (newText: string) => void // Add this new action
}

const useLetterboardStore = create<LetterboardStore>((set) => ({
  text: '',
  predictions: [],
  appendLetter: (letter) => set((state) => ({ text: state.text + letter })),
  backspace: () => set((state) => ({ text: state.text.slice(0, -1) })),
  clear: () => set({ text: '' }),
  selectPrediction: (prediction) => set((state) => ({ text: state.text + prediction + ' ' })),
  setText: (newText) => set({ text: newText }), // Add this new action
}))

export default useLetterboardStore