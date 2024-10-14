"use client";

import React from "react";
import KeyboardBase from "./keyboard-base";
import useLetterboardStore from "@/store/useLetterboardStore";
import { UserSettings } from "@/lib/types";

interface CustomKeyboardProps {
  isLetterBoard: boolean;
  userSettings: UserSettings;
}

const CustomKeyboard: React.FC<CustomKeyboardProps> = ({ isLetterBoard, userSettings }) => {
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
                onClick={() => appendLetter(userSettings.letterCase === "uppercase" ? key.toUpperCase() : key.toLowerCase())}
                className="flex-1 mx-0.5 rounded-lg shadow flex items-center justify-center h-full"
                style={{
                  backgroundColor: userSettings.buttonColor,
                  color: userSettings.textColor,
                  fontSize: `${userSettings.fontSize}px`,
                }}
              >
                {userSettings.letterCase === "uppercase" ? key.toUpperCase() : key.toLowerCase()}
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
      userSettings={userSettings}
    />
  );
};

export default CustomKeyboard;
