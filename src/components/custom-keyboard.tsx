"use client";

import React, { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const CustomKeyboard = () => {
  const [inputText, setInputText] = useState("");
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      const landScapeView = window.innerWidth > window.innerHeight && window.innerHeight < 700;
      setIsLandscape(landScapeView);
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);

    return () => window.removeEventListener("resize", checkOrientation);
  }, []);

  const keys = [
    ["A", "B", "C", "D", "E"],
    ["F", "G", "H", "I", "J"],
    ["K", "L", "M", "N", "O"],
    ["P", "Q", "R", "S", "T"],
    ["U", "V", "W", "X", "Y"],
    ["Z", "!", "#", "&", "?"],
  ];

  const handleKeyPress = (key) => {
    setInputText((prevText) => prevText + key);
  };

  const handleBackspace = () => {
    setInputText((prevText) => prevText.slice(0, -1));
  };

  const handleSpace = () => {
    setInputText((prevText) => prevText + " ");
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <div className="flex-1 p-4 min-h-[20%] max-h-[40%] overflow-auto">
        <Textarea
          value={inputText}
          readOnly
          className="w-full h-full p-2 text-lg border border-gray-300 rounded"
        />
      </div>
      <div className={`flex flex-col bg-gray-200 p-2 ${isLandscape ? "h-[80%]" : "h-[60%]"}`}>
        <div className="flex-1 flex flex-col justify-between">
          {keys.map((row, rowIndex) => (
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
          ))}
          <div className="flex justify-between flex-1">
            <button
              onClick={handleBackspace}
              className="flex-1 mx-0.5 text-lg bg-white rounded-lg shadow flex items-center justify-center"
            >
              <X size={20} />
            </button>
            <button
              onClick={() => handleKeyPress("123")}
              className="flex-1 mx-0.5 text-sm bg-white rounded-lg shadow flex items-center justify-center"
            >
              123
            </button>
            <button
              onClick={handleSpace}
              className="flex-grow-[3] mx-0.5 text-sm bg-white rounded-lg shadow flex items-center justify-center"
            >
              Space
            </button>
            <button className="flex-1 mx-0.5 text-sm bg-blue-600 text-white rounded-lg shadow flex items-center justify-center">
              <Check size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomKeyboard;
