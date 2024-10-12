"use client";

import { useEffect, useCallback, useMemo } from "react";
import useLetterboardStore from "@/store/useLetterboardStore";
import useAudioStore from "@/store/useAudioStore";
import useTTSStore from "@/store/useTTSStore";
import analytics from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { UserSettings } from "@/lib/types";

interface LetterboardProps {
  userSettings: UserSettings;
}

export function Letterboard({ userSettings }: LetterboardProps) {
  const {
    text,
    predictions,
    appendLetter,
    backspace,
    clear,
    selectPrediction,
    generatePredictions,
    addWordSet,
    setCurrentWordSet,
  } = useLetterboardStore();
  const { sendUserMessage, sendFullSentence } = useAudioStore();
  const { speak, isLoading } = useTTSStore();

  useEffect(() => {
    // Add a custom word set when the component mounts
    addWordSet("custom", ["hello", "world", "react", "nextjs", "typescript"]);
    // Set it as the current word set
    setCurrentWordSet("custom");
  }, [addWordSet, setCurrentWordSet]);

  const handleClick = async (letter: string) => {
    appendLetter(letter);
    generatePredictions();
    await analytics.trackInteraction("button_press", letter);
  };

  const handleSubmit = async () => {
    if (text.trim()) {
      sendFullSentence(text.trim());
      await analytics.trackInteraction("message_completion", text.trim(), text.length);
    }
  };

  const handlePredictionSelect = async (prediction: string) => {
    selectPrediction(prediction);
    await analytics.trackPredictionSelect(prediction);
  };

  const handleSpeak = useCallback(
    (word: string) => {
      speak(word);
      analytics.trackInteraction("word_spoken", word);
      // analytics.trackAudioTrace(Date.now().toString(), `Audio generated for: ${word}`)
    },
    [speak],
  );

  useEffect(() => {
    // Check if the last character is a space
    if (text.endsWith(" ")) {
      const words = text.trim().split(/\s+/);
      const lastWord = words[words.length - 1];
      if (lastWord) {
        handleSpeak(lastWord);
      }
    }
  }, [text, handleSpeak]);

  useEffect(() => {
    generatePredictions();
  }, [text, generatePredictions]);

  const getKeyboardLayout = () => {
    if (userSettings.keyboardLayout.toLowerCase() === "qwerty") {
      return "QWERTYUIOPASDFGHJKLZXCVBNM".split("");
    } else {
      return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    }
  };

  const keyboardLayout = getKeyboardLayout();

  // Calculate button size based on font size
  const buttonSize = useMemo(() => {
    const baseSize = 48; // Base size for 18px font
    const scaleFactor = userSettings.fontSize / 18;
    return Math.max(baseSize * scaleFactor, 40); // Minimum size of 40px
  }, [userSettings.fontSize]);

  // Calculate grid columns based on keyboard layout
  const gridColumns = userSettings.keyboardLayout === "QWERTY" ? 10 : 9;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-screen p-4",
        userSettings.theme === "dark" ? "bg-gray-900" : "bg-gray-100",
        userSettings.font,
      )}
    >
      <div className="w-full max-w-4xl mb-4">
        <div
          className={cn(
            "rounded-lg p-4 shadow-lg",
            userSettings.theme === "dark" ? "bg-gray-800" : "bg-white",
          )}
        >
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
        </div>
      </div>
      {/* Predictions area */}
      {userSettings.autoCompletion && (
        <div
          className={cn(
            "w-full max-w-4xl p-4 rounded-lg shadow-md mb-4 overflow-x-auto",
            userSettings.theme === "dark" ? "bg-gray-800" : "bg-gray-200",
          )}
        >
          <div className="flex justify-start gap-4 items-center">
            {predictions.length > 0 ? (
              predictions.map((prediction, index) => (
                <button
                  key={index}
                  onClick={() => handlePredictionSelect(prediction)}
                  className={cn(
                    "px-4 py-2 text-lg font-semibold rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
                    userSettings.theme === "dark"
                      ? "text-white hover:bg-opacity-80 focus:ring-opacity-50"
                      : "text-white hover:bg-opacity-80 focus:ring-opacity-50",
                  )}
                  style={{
                    backgroundColor: userSettings.buttonColor,
                    fontSize: `${userSettings.fontSize * 0.75}px`,
                  }}
                >
                  {prediction}
                </button>
              ))
            ) : (
              <div
                className={cn(
                  "opacity-50 italic",
                  userSettings.theme === "dark" ? "text-gray-300" : "text-gray-600",
                )}
              >
                No predictions available
              </div>
            )}
          </div>
        </div>
      )}
      {/* Keyboard area */}
      <div
        className={`grid gap-2 mb-4`}
        style={{
          gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`,
          width: `${buttonSize * gridColumns + (gridColumns - 1) * 8}px`, // 8px for gap
        }}
      >
        {keyboardLayout.map((letter, i) => (
          <button
            key={i}
            onClick={() => handleClick(letter)}
            className={cn(
              "aspect-square text-2xl font-bold rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
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
            {userSettings.letterCase === "uppercase" ? letter : letter.toLowerCase()}
          </button>
        ))}
      </div>
      {/* Action buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        {["Space", "Backspace", "Clear", "Submit"].map((action) => (
          <button
            key={action}
            onClick={() => {
              if (action === "Space") handleClick(" ");
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
          </button>
        ))}
      </div>
      {/* Loading spinner */}
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
}
