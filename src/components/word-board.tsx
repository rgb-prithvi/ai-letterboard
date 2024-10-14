"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Word } from "@/lib/types";

interface WordBoardProps {
  words: Word[];
  onWordSelect: (word: string) => void;
}

const WordBoard: React.FC<WordBoardProps> = ({ words, onWordSelect }) => {
  return (
    <div className="grid grid-cols-3 gap-2 p-2 bg-gray-100 rounded-lg">
      {words.map((word, index) => (
        <Button
          key={index}
          variant="outline"
          className="w-full text-sm"
          onClick={() => onWordSelect(word.text)}
        >
          {word.text}
        </Button>
      ))}
    </div>
  );
};

export default WordBoard;
