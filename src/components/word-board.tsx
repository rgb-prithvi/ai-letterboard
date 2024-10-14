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
      <div className="flex flex-col flex-grow">
        {chunk(selectedWords, 3).map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-between mb-2 flex-1">
            {row.map((word) => (
              <button
                key={word.text}
                onClick={() => {
                  handleKeyPress(word.text + " ");
                  onWordSelect(word.text);
                }}
                className={`flex-1 mx-0.5 text-sm bg-white rounded-lg shadow flex items-center justify-center ${
                  word.isHighlighted ? "bg-yellow-200" : word.isCommon ? "bg-gray-100" : "bg-white"
                }`}
              >
                {word.text}
              </button>
            ))}
          </div>
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

// Helper function to chunk the array into rows
function chunk<T>(array: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
    array.slice(index * size, index * size + size)
  );
}

export default WordBoard;
