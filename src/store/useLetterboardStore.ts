import { create } from 'zustand'

interface LetterboardState {
  text: string
  predictions: string[]
  setText: (text: string) => void
  appendLetter: (letter: string) => void
  backspace: () => void
  clear: () => void
  updatePredictions: () => void
  selectPrediction: (prediction: string) => void
}

const useLetterboardStore = create<LetterboardState>((set, get) => ({
  text: '',
  predictions: [],
  setText: (text) => set({ text }),
  appendLetter: (letter) => {
    set((state) => ({ text: state.text + letter }))
    get().updatePredictions()
  },
  backspace: () => {
    set((state) => ({ text: state.text.slice(0, -1) }))
    get().updatePredictions()
  },
  clear: () => {
    set({ text: '', predictions: [] })
  },
  updatePredictions: () => {
    // This is a simple prediction logic. You might want to replace this with a more sophisticated algorithm or API call.
    const currentText = get().text.toLowerCase()
    const possibleWords = ['the', 'quick', 'brown', 'fox', 'jumps', 'over', 'lazy', 'dog']
    const newPredictions = possibleWords
      .filter(word => word.startsWith(currentText.split(' ').pop() || ''))
      .slice(0, 3)
    set({ predictions: newPredictions })
  },
  selectPrediction: (prediction) => {
    set((state) => {
      const words = state.text.split(' ')
      words.pop()
      words.push(prediction)
      const newText = words.join(' ') + ' '
      return { text: newText, predictions: [] }
    })
  },
}))

export default useLetterboardStore