'use client'

import React, { useEffect, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import useLetterboardStore from '@/store/useLetterboardStore'
import useAudioStore from '@/store/useAudioStore'
import useTTSStore from '@/store/useTTSStore'
import analytics from "@/lib/analytics"
import { cn } from "@/lib/utils"
import { UserSettings } from "@/lib/types"
import { fonts } from '@/lib/fonts'

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

interface CommunicationBoardProps {
  userSettings: UserSettings;
}

export function CommunicationBoard({ userSettings }: CommunicationBoardProps) {
  const { text, appendLetter, backspace, clear, setText } = useLetterboardStore()
  const { sendFullSentence } = useAudioStore()
  const { speak, isLoading } = useTTSStore()

  useEffect(() => {
    // Add words to the custom word set
    useLetterboardStore.getState().addWordSet("communication_board", words.map(w => w.text))
    useLetterboardStore.getState().setCurrentWordSet("communication_board")
    // Clear the text when the component mounts
    clear()
  }, [])

  const handleWordClick = async (word: string) => {
    appendLetter(word + ' ')
    speak(word)
    await analytics.trackInteraction("word_press", word)
  }

  const handleSubmit = async () => {
    if (text.trim()) {
      sendFullSentence(text.trim())
      await analytics.trackInteraction("message_completion", text.trim(), text.length)
    }
  }

  const selectedFont = fonts[userSettings.font as keyof typeof fonts]
  const fontClass = selectedFont?.className || ''
  const fontStyle = fontClass ? {} : { fontFamily: userSettings.font }

  // Calculate button size based on font size
  const buttonSize = useMemo(() => {
    const baseSize = 80; // Base size for word buttons
    const scaleFactor = userSettings.fontSize / 18;
    return Math.max(baseSize * scaleFactor, 60); // Minimum size of 60px
  }, [userSettings.fontSize]);

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-screen p-4",
        userSettings.theme === "dark" ? "bg-gray-900" : "bg-gray-100",
        fontClass
      )}
      style={fontStyle}
    >
      <Card className={cn(
        "mb-4 p-4 w-full max-w-4xl",
        userSettings.theme === "dark" ? "bg-gray-800" : "bg-white",
      )}>
        <textarea
          value={text}
          readOnly
          rows={3}
          className={cn(
            "w-full font-bold bg-transparent resize-none outline-none",
            userSettings.theme === "dark" ? "text-white" : "text-black",
          )}
          style={{
            fontSize: `${userSettings.fontSize}px`,
            color: userSettings.textColor,
          }}
        />
      </Card>

      <div className="grid grid-cols-4 gap-2 mb-4 w-full max-w-4xl">
        {words.map((word, index) => (
          <Button
            key={index}
            onClick={() => handleWordClick(word.text)}
            className={cn(
              "text-2xl font-bold rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
              userSettings.theme === "dark"
                ? "text-white hover:bg-opacity-80 focus:ring-opacity-50"
                : "text-white hover:bg-opacity-80 focus:ring-opacity-50",
            )}
            style={{
              backgroundColor: userSettings.buttonColor,
              fontSize: `${userSettings.fontSize * 0.75}px`,
              color: userSettings.textColor,
              width: `${buttonSize}px`,
              height: `${buttonSize}px`,
            }}
          >
            {word.icon} {word.text}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {["Space", "Backspace", "Clear", "Submit"].map((action) => (
          <Button
            key={action}
            onClick={() => {
              if (action === "Space") appendLetter(" ");
              else if (action === "Backspace") backspace();
              else if (action === "Clear") clear();
              else if (action === "Submit") handleSubmit();
            }}
            className={cn(
              "text-2xl font-bold rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
              userSettings.theme === "dark"
                ? "text-white hover:bg-opacity-80 focus:ring-opacity-50"
                : "text-white hover:bg-opacity-80 focus:ring-opacity-50",
            )}
            style={{
              backgroundColor: userSettings.buttonColor,
              fontSize: `${userSettings.fontSize * 0.75}px`,
              color: userSettings.textColor,
              width: `${buttonSize * 2}px`,
              height: `${buttonSize}px`,
            }}
          >
            {action}
          </Button>
        ))}
      </div>

      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  )
}
