import { create } from 'zustand'

interface LetterboardState {
  text: string
  setText: (text: string) => void
  appendLetter: (letter: string) => void
  backspace: () => void
  clear: () => void
}

const useLetterboardStore = create<LetterboardState>((set) => ({
  text: '',
  setText: (text) => set({ text }),
  appendLetter: (letter) => set((state) => ({ text: state.text + letter })),
  backspace: () => set((state) => ({ text: state.text.slice(0, -1) })),
  clear: () => set({ text: '' }),
}))

export default useLetterboardStore