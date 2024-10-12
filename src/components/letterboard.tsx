"use client"

import { useEffect, useCallback } from 'react'
import useLetterboardStore from '@/store/useLetterboardStore'
import useAudioStore from '@/store/useAudioStore'
import useTTSStore from '@/store/useTTSStore'
import analytics from '@/lib/analytics'

export function Letterboard() {
  const { 
    text, 
    predictions, 
    appendLetter, 
    backspace, 
    clear, 
    selectPrediction, 
    generatePredictions, 
    addWordSet,
    setCurrentWordSet
  } = useLetterboardStore()
  const { sendUserMessage, sendFullSentence } = useAudioStore()
  const { speak, isLoading } = useTTSStore()

  useEffect(() => {
    // Add a custom word set when the component mounts
    addWordSet('custom', ['hello', 'world', 'react', 'nextjs', 'typescript'])
    // Set it as the current word set
    setCurrentWordSet('custom')
  }, [addWordSet, setCurrentWordSet])

  const handleClick = (letter: string) => {
    appendLetter(letter)
    generatePredictions()
    analytics.trackInteraction('button_press', letter)
  }

  const handleSubmit = () => {
    if (text.trim()) {
      sendFullSentence(text.trim())
      analytics.trackInteraction('message_completion', text.trim(), text.length) // Assuming composition time is roughly equal to text length
    }
  }

  const handlePredictionSelect = (prediction: string) => {
    selectPrediction(prediction)
    analytics.trackInteraction('word_selection', prediction)
  }

  const handleSpeak = useCallback((word: string) => {
    speak(word)
    analytics.trackInteraction('word_spoken', word)
    // analytics.trackAudioTrace(Date.now().toString(), `Audio generated for: ${word}`)
  }, [speak])

  useEffect(() => {
    // Check if the last character is a space
    if (text.endsWith(' ')) {
      const words = text.trim().split(/\s+/)
      const lastWord = words[words.length - 1]
      if (lastWord) {
        handleSpeak(lastWord)
      }
    }
  }, [text, handleSpeak])

  useEffect(() => {
    generatePredictions();
  }, [text, generatePredictions]);

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
                onClick={() => handlePredictionSelect(prediction)}
                className="px-4 py-2 text-lg font-semibold rounded-lg bg-primary text-primary-foreground shadow-md hover:bg-primary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                {prediction}
              </button>
            ))
          ) : (
            <div className="text-card-foreground opacity-50 italic">No predictions available</div>
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
