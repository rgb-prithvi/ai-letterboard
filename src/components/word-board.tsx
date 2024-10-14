"use client";

import React from "react";
import KeyboardBase from "./keyboard-base";
import { Word } from "@/lib/types";

interface WordBoardProps {
  words: Word[];
  onWordSelect: (word: string) => void;
}

const WordBoard: React.FC<WordBoardProps> = ({ words, onWordSelect }) => {
  const renderKeys = () => (
    <div className="grid grid-cols-3 gap-2">
      {words.map((word, index) => (
        <button
          key={index}
          onClick={() => handleKeyPress(word.text)}
          className="w-full text-sm bg-white rounded-lg shadow flex items-center justify-center p-2"
        >
          {word.text}
        </button>
      ))}
    </div>
  );

  const handleKeyPress = (word: string) => {
    // This function will be called by KeyboardBase
    onWordSelect(word);
  };

  const handleSubmit = (text: string) => {
    console.log(text);
    // Add your submit logic here
  };

  return <KeyboardBase renderKeys={renderKeys} onSubmit={handleSubmit} />;
};

export default WordBoard;
