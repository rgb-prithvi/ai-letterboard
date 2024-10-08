'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import useAudioStore from '@/store/useAudioStore'

const words = [
  { text: 'I', icon: '👤' },
  { text: 'want', icon: '🙏' },
  { text: 'to', icon: '➡️' },
  { text: 'eat', icon: '🍽️' },
  { text: 'drink', icon: '🥤' },
  { text: 'play', icon: '🎮' },
  { text: 'sleep', icon: '😴' },
  { text: 'go', icon: '🚶' },
  { text: 'home', icon: '🏠' },
  { text: 'school', icon: '🏫' },
  { text: 'park', icon: '🌳' },
  { text: 'happy', icon: '😊' },
  { text: 'sad', icon: '😢' },
  { text: 'angry', icon: '😠' },
  { text: 'tired', icon: '😫' },
  { text: 'help', icon: '🆘' },
  { text: 'yes', icon: '✅' },
  { text: 'no', icon: '❌' },
  { text: 'please', icon: '🙏' },
  { text: 'thank you', icon: '🙏' },
]

export function CommunicationBoardComponent() {
  const [message, setMessage] = useState<string[]>([])
  const { sendUserMessage, sendFullSentence, initializeAudio, connectToRealtimeAPI, disconnectFromRealtimeAPI } = useAudioStore()

  useEffect(() => {
    initializeAudio()
    connectToRealtimeAPI()

    return () => {
      disconnectFromRealtimeAPI()
    }
  }, [initializeAudio, connectToRealtimeAPI, disconnectFromRealtimeAPI])

  const addWord = (word: string) => {
    setMessage([...message, word])
    sendUserMessage(word)
  }

  const clearMessage = () => {
    setMessage([])
  }

  const backspace = () => {
    setMessage(message.slice(0, -1))
  }

  const speakFullMessage = () => {
    const fullMessage = message.join(' ')
    sendFullSentence(fullMessage)
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="mb-4 p-4">
        <h2 className="text-2xl font-bold mb-2">Message:</h2>
        <p className="text-xl mb-2">{message.join(' ')}</p>
        <Button onClick={speakFullMessage} className="mr-2">
          Speak Message
        </Button>
        <Button onClick={clearMessage} variant="outline">
          Clear
        </Button>
      </Card>

      <div className="grid grid-cols-4 gap-2 mb-4">
        {words.map((word, index) => (
          <Button key={index} onClick={() => addWord(word.text)} className="h-20 text-lg">
            {word.icon} {word.text}
          </Button>
        ))}
      </div>

      <div className="flex justify-between">
        <Button onClick={() => addWord(' ')} className="flex-1 mr-2">
          Space
        </Button>
        <Button onClick={backspace} className="flex-1 mr-2">
          Backspace
        </Button>
        <Button onClick={clearMessage} className="flex-1">
          Clear
        </Button>
      </div>
    </div>
  )
}