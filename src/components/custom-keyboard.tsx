"use client";

import React from "react";
import KeyboardBase from "./keyboard-base";
import useLetterboardStore from "@/store/useLetterboardStore";

interface CustomKeyboardProps {
  isLetterBoard: boolean;
}

const CustomKeyboard: React.FC<CustomKeyboardProps> = ({ isLetterBoard }) => {
  const { appendLetter, toggleBoard } = useLetterboardStore();

  const alphaKeys = [
    ["A", "B", "C", "D", "E"],
    ["F", "G", "H", "I", "J"],
    ["K", "L", "M", "N", "O"],
    ["P", "Q", "R", "S", "T"],
    ["U", "V", "W", "X", "Y"],
    ["Z", "!", "#", "&", "?"],
  ];

  const numericKeys = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["0", "+", "-"],
    ["*", "/", "%"],
    ["(", ")", "."],
  ];

  const renderKeys = () => {
    const keys = isLetterBoard ? alphaKeys : numericKeys;
    return (
      <div className="flex flex-col h-full">
        {keys.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-between mb-2 flex-1">
            {row.map((key) => (
              <button
                key={key}
                onClick={() => appendLetter(key)}
                className="flex-1 mx-0.5 text-lg bg-white rounded-lg shadow flex items-center justify-center h-full"
              >
                {key}
              </button>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const handleSubmit = (text: string) => {
    console.log(text);
    // Add your submit logic here
  };

  return (
    <KeyboardBase 
      renderKeys={renderKeys} 
      onSubmit={handleSubmit} 
      isLetterBoard={isLetterBoard}
      onToggleBoard={toggleBoard}
    />
  );
};

export default CustomKeyboard;
