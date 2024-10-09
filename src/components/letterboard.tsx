"use client"

import { useEffect } from 'react'
import useLetterboardStore from '@/store/useLetterboardStore'
import useAudioStore from '@/store/useAudioStore'
import useTTSStore from '@/store/useTTSStore'

export function Letterboard() {
  const { text, predictions, appendLetter, backspace, clear, selectPrediction } = useLetterboardStore()
  const { sendUserMessage, sendFullSentence } = useAudioStore()
  const { speak, isLoading } = useTTSStore()

  const handleClick = (letter: string) => {
    appendLetter(letter)
  }

  const handleSubmit = () => {
    if (text.trim()) {
      sendFullSentence(text.trim())
    }
  }

  useEffect(() => {
    // Check if the last character is a space
    if (text.endsWith(' ')) {
      const words = text.trim().split(/\s+/)
      const lastWord = words[words.length - 1]
      if (lastWord) {
        // sendUserMessage(lastWord)
        speak(lastWord)
      }
    }
  }, [text, sendUserMessage, speak])

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <div className="w-full max-w-4xl p-4">
        <div className="bg-card rounded-lg p-4 shadow-lg">
          <textarea
            value={text}
            readOnly
            rows={3}
            className="w-full text-6xl font-bold text-card-foreground bg-transparent resize-none outline-none"
          />
        </div>
      </div>
      {/* Dedicated area for predictions with fixed height */}
      <div className="w-full max-w-4xl p-4 bg-secondary rounded-lg shadow-md mt-4 h-24 overflow-y-auto">
        <div className="flex justify-start gap-4 h-full items-center">
          {predictions.length > 0 ? (
            predictions.map((prediction, index) => (
              <button
                key={index}
                onClick={() => selectPrediction(prediction)}
                className="px-4 py-2 text-lg font-semibold rounded-lg bg-primary text-primary-foreground shadow-md hover:bg-primary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                {prediction}
              </button>
            ))
          ) : (
            <div className="text-card-foreground opacity-50 italic">No predictions yet</div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-7 gap-4 p-4 mt-4">
        {Array.from(Array(26)).map((_, i) => (
          <button
            key={i}
            onClick={() => handleClick(String.fromCharCode(65 + i))}
            className="w-16 h-16 text-4xl font-bold rounded-lg bg-primary text-primary-foreground shadow-md hover:bg-primary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            {String.fromCharCode(65 + i)}
          </button>
        ))}
      </div>
      {/* Row for Space, Backspace, Clear, and Submit buttons */}
      <div className="flex justify-center gap-4 p-4">
        <button
          onClick={() => handleClick(" ")}
          className="w-32 h-16 text-2xl font-bold rounded-lg bg-primary text-primary-foreground shadow-md hover:bg-primary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          Space
        </button>
        <button
          onClick={backspace}
          className="w-32 h-16 text-2xl font-bold rounded-lg bg-primary text-primary-foreground shadow-md hover:bg-primary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          Backspace
        </button>
        <button
          onClick={clear}
          className="w-32 h-16 text-2xl font-bold rounded-lg bg-primary text-primary-foreground shadow-md hover:bg-primary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          Clear
        </button>
        <button
          onClick={handleSubmit}
          className="w-32 h-16 text-2xl font-bold rounded-lg bg-green-500 text-white shadow-md hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          Submit
        </button>
      </div>
      
      {/* Add a loading spinner */}
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  )
}
