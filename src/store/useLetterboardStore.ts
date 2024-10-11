import { create } from 'zustand'

interface LetterboardStore {
  text: string
  predictions: string[]
  appendLetter: (letter: string) => void
  backspace: () => void
  clear: () => void
  selectPrediction: (prediction: string) => void
  setText: (newText: string) => void
  generatePredictions: () => Promise<void> // New method
}

const useLetterboardStore = create<LetterboardStore>((set) => ({
  text: '',
  predictions: [],
  appendLetter: (letter) => set((state) => ({ text: state.text + letter })),
  backspace: () => set((state) => ({ text: state.text.slice(0, -1) })),
  clear: () => set({ text: '' }),
  selectPrediction: (prediction) => set((state) => ({ text: state.text + prediction + ' ' })),
  setText: (newText) => set({ text: newText }),
  generatePredictions: async () => {
    // Implement prediction generation logic here
    // For now, it's just a placeholder
    set((state) => ({
      predictions: [`john`, `jane`, `jim`, `joe`]
    }))
  },
}))

export default useLetterboardStore
