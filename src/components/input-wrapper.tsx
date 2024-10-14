"use client";

import React, { useState, useEffect } from "react";
import WordBoard from "./word-board";
import CustomKeyboard from "./custom-keyboard";
import { UserSettings, Word } from "@/lib/types";
import { selectWords } from "@/lib/word-selection";

interface InputWrapperProps {
  userSettings: UserSettings;
}

const InputWrapper: React.FC<InputWrapperProps> = ({ userSettings }) => {
  const [words, setWords] = useState<Word[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testWordBank: Word[] = [
    { text: "hello", topicRelevance: 1, frequency: 1 },
    { text: "world", topicRelevance: 1, frequency: 1 },
    { text: "this", topicRelevance: 1, frequency: 1 },
    { text: "is", topicRelevance: 1, frequency: 1 },
    { text: "a", topicRelevance: 1, frequency: 1 },
    { text: "test", topicRelevance: 1, frequency: 1 },
  ];

  // useEffect(() => {
  //   const fetchWords = async () => {
  //     if (userSettings.inputMode !== "word") return;

  //     try {
  //       setIsLoading(true);
  //       // const response = await fetch("/api/words");
  //       // if (!response.ok) {
  //       //   throw new Error("Failed to fetch words");
  //       // }
  //       // const wordBank: Word[] = await response.json();
  //       const wordBank: Word[] = [
  //         { text: "hello", topicRelevance: 1, frequency: 1 },
  //         { text: "world", topicRelevance: 1, frequency: 1 },
  //         { text: "this", topicRelevance: 1, frequency: 1 },
  //         { text: "is", topicRelevance: 1, frequency: 1 },
  //         { text: "a", topicRelevance: 1, frequency: 1 },
  //         { text: "test", topicRelevance: 1, frequency: 1 },
  //       ];

  //       // Select words based on the current topic (you may want to make this dynamic)
  //       const selectedWords = selectWords(wordBank, "general", 30);
  //       setWords(selectedWords);
  //     } catch (err) {
  //       setError(err instanceof Error ? err.message : "An error occurred");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchWords();
  // }, [userSettings.inputMode]);

  const handleWordSelect = (word: string) => {
    console.log("Selected word:", word);
    // Implement word selection logic here
  };

  if (userSettings.inputMode === "word") {
    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    return <WordBoard words={testWordBank} onWordSelect={handleWordSelect} />;
  } else {
    return <CustomKeyboard />;
  }
};

export default InputWrapper;
