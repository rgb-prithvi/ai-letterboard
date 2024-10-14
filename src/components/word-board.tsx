"use client";

import React, { useState, useEffect } from "react";
import KeyboardBase from "./keyboard-base";
import { Word } from "@/lib/types";
import { selectWords, TOTAL_WORD_COUNT } from "@/lib/word-selection";
import { RotateCcw } from "lucide-react";

interface WordBoardProps {
  wordBank: Word[];
  topic: string;
  onWordSelect: (word: string) => void;
}

const WordBoard: React.FC<WordBoardProps> = ({ wordBank, topic, onWordSelect }) => {
  const [selectedWords, setSelectedWords] = useState<Word[]>([]);

  useEffect(() => {
    refreshWords();
  }, [wordBank, topic]);

  const refreshWords = () => {
    const newWords = selectWords(wordBank, topic);
    setSelectedWords(newWords);
  };

  const renderKeys = ({ handleKeyPress }) => {
    return (
      <div className="grid grid-cols-3 gap-2 h-full">
        {selectedWords.map((word, index) => (
          <button
            key={index}
            onClick={() => {
              handleKeyPress(word.text + " ");
              onWordSelect(word.text);
            }}
            className={`text-sm bg-white rounded-lg shadow flex items-center justify-center ${
              word.isHighlighted ? "bg-yellow-200" : word.isCommon ? "bg-gray-100" : "bg-white"
            }`}
          >
            {word.text}
          </button>
        ))}
      </div>
    );
  };

  return (
    <KeyboardBase 
      renderKeys={renderKeys} 
      onSubmit={(text) => console.log(text)} 
      extraButtons={
        <button
          onClick={refreshWords}
          className="flex-1 h-12 text-sm bg-white rounded-lg shadow flex items-center justify-center"
        >
          <RotateCcw size={20} />
        </button>
      }
      isLetterBoard={false}
      onToggleBoard={() => {}}
    />
  );
};

export default WordBoard;
