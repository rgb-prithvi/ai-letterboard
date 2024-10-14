"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Eraser, Check } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const CustomKeyboard = () => {
  const [inputText, setInputText] = useState("");
  const [isLandscape, setIsLandscape] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState("60%");
  const [isNumeric, setIsNumeric] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkOrientation = () => {
      const landScapeView = window.innerWidth > window.innerHeight && window.innerHeight < 700;
      setIsLandscape(landScapeView);
      setKeyboardHeight(landScapeView ? "80%" : "60%");
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);

    return () => window.removeEventListener("resize", checkOrientation);
  }, []);

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

  const handleKeyPress = (key: string) => {
    setInputText((prevText) => prevText + key);
  };

  const handleBackspace = () => {
    setInputText((prevText) => prevText.slice(0, -1));
  };

  const handleSpace = () => {
    setInputText((prevText) => prevText + " ");
  };

  const toggleKeyboard = () => {
    setIsNumeric((prev) => !prev);
  };

  const renderKeys = (keys: string[][]) => {
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

  const handleClear = () => {
    setInputText("");
  };

  const handleSubmit = () => {
    console.log(inputText);
  };

  return (
    <div ref={containerRef} className="flex flex-col h-full bg-gray-100">
      <div className="flex-grow overflow-auto p-4">
        <Textarea
          value={inputText}
          readOnly
          className="w-full h-full p-2 text-4xl border border-gray-300 rounded"
        />
      </div>
      <div
        className="flex-shrink-0 flex flex-col bg-gray-200 p-2"
        style={{ height: keyboardHeight }}
      >
        <div className="flex-1 flex flex-col justify-between">
          {isNumeric ? renderKeys(numericKeys) : renderKeys(alphaKeys)}
          <div className="flex justify-between flex-1">
            <button
              onClick={handleBackspace}
              className="flex-1 mx-0.5 text-lg bg-white rounded-lg shadow flex items-center justify-center"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              onClick={handleClear}
              className="flex-1 mx-0.5 text-lg bg-white rounded-lg shadow flex items-center justify-center"
            >
              <Eraser size={20} />
            </button>
            <button
              onClick={toggleKeyboard}
              className="flex-1 mx-0.5 text-sm bg-white rounded-lg shadow flex items-center justify-center"
            >
              {isNumeric ? "ABC" : "123"}
            </button>
            <button
              onClick={handleSpace}
              className="flex-grow-[3] mx-0.5 text-sm bg-white rounded-lg shadow flex items-center justify-center"
            >
              Space
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 mx-0.5 text-sm bg-blue-600 text-white rounded-lg shadow flex items-center justify-center"
            >
              <Check size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomKeyboard;
