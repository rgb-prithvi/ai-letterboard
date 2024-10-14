"use client";

import React, { useState } from "react";
import KeyboardBase from "./keyboard-base";

const CustomKeyboard: React.FC = () => {
  const [isLetterBoard, setIsLetterBoard] = useState(true);

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

  const renderKeys = ({ handleKeyPress }) => {
    const keys = isLetterBoard ? alphaKeys : numericKeys;
    return keys.map((row, rowIndex) => (
      <div key={rowIndex} className="flex justify-between mb-2 flex-1">
        {row.map((key) => (
          <button
            key={key}
            onClick={() => handleKeyPress(key)}
            className="flex-1 mx-0.5 text-lg bg-white rounded-lg shadow flex items-center justify-center"
          >
            {key}
          </button>
        ))}
      </div>
    ));
  };

  const handleSubmit = (text: string) => {
    console.log(text);
    // Add your submit logic here
  };

  const handleToggleBoard = () => {
    setIsLetterBoard((prev) => !prev);
  };

  return (
    <KeyboardBase 
      renderKeys={renderKeys} 
      onSubmit={handleSubmit} 
      isLetterBoard={isLetterBoard}
      onToggleBoard={handleToggleBoard}
    />
  );
};

export default CustomKeyboard;
