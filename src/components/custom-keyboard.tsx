"use client";

import React, { useState } from "react";
import KeyboardBase from "./keyboard-base";

const CustomKeyboard: React.FC = () => {
  const [isNumeric, setIsNumeric] = useState(false);

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
    const keys = isNumeric ? numericKeys : alphaKeys;
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

  const handleKeyPress = (key: string) => {
    // This function will be called by KeyboardBase
  };

  const handleSubmit = (text: string) => {
    console.log(text);
    // Add your submit logic here
  };

  const extraButtons = (
    <>
      <button
        onClick={() => setIsNumeric((prev) => !prev)}
        className="flex-1 mx-0.5 text-sm bg-white rounded-lg shadow flex items-center justify-center"
      >
        {isNumeric ? "ABC" : "123"}
      </button>
      <button
        onClick={() => handleKeyPress(" ")}
        className="flex-grow-[3] mx-0.5 text-sm bg-white rounded-lg shadow flex items-center justify-center"
      >
        Space
      </button>
    </>
  );

  return <KeyboardBase renderKeys={renderKeys} onSubmit={handleSubmit} extraButtons={extraButtons} />;
};

export default CustomKeyboard;
