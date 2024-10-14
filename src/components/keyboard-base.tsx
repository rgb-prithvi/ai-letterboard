"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Eraser, Check } from "lucide-react";

interface KeyboardBaseProps {
  renderKeys: (props: {
    handleKeyPress: (key: string) => void;
    handleBackspace: () => void;
    handleClear: () => void;
    handleSubmit: () => void;
  }) => ReactNode;
  onSubmit: (text: string) => void;
  extraButtons?: ReactNode;
  isLetterBoard: boolean;
  onToggleBoard: () => void;
}

const KeyboardBase: React.FC<KeyboardBaseProps> = ({ 
  renderKeys, 
  onSubmit, 
  extraButtons, 
  isLetterBoard, 
  onToggleBoard 
}) => {
  const [inputText, setInputText] = useState("");

  const handleKeyPress = (key: string) => {
    setInputText((prevText) => prevText + key);
  };

  const handleBackspace = () => {
    setInputText((prevText) => prevText.slice(0, -1));
  };

  const handleClear = () => {
    setInputText("");
  };

  const handleSubmit = () => {
    onSubmit(inputText);
    setInputText("");
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <div className="flex-grow overflow-auto p-4">
        <Textarea
          value={inputText}
          readOnly
          className="w-full h-full p-2 text-2xl sm:text-3xl md:text-4xl border border-gray-300 rounded"
        />
      </div>
      <div className="flex-shrink-0 flex flex-col bg-gray-200 p-2 overflow-hidden">
        <div className="flex-grow overflow-y-auto">
          {renderKeys({ handleKeyPress, handleBackspace, handleClear, handleSubmit })}
        </div>
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleBackspace}
            className="flex-1 h-12 text-sm bg-white rounded-lg shadow flex items-center justify-center"
          >
            <ArrowLeft size={20} />
          </button>
          <button
            onClick={handleClear}
            className="flex-1 h-12 text-sm bg-white rounded-lg shadow flex items-center justify-center"
          >
            <Eraser size={20} />
          </button>
          {isLetterBoard && (
            <button
              onClick={onToggleBoard}
              className="flex-1 h-12 text-sm bg-white rounded-lg shadow flex items-center justify-center"
            >
              123
            </button>
          )}
          {extraButtons}
          <button
            onClick={handleSubmit}
            className="flex-1 h-12 text-sm bg-blue-600 text-white rounded-lg shadow flex items-center justify-center"
          >
            <Check size={20} />
          </button>
        </div>
        <button
          onClick={() => handleKeyPress(" ")}
          className="w-full h-12 text-sm bg-white rounded-lg shadow flex items-center justify-center mt-2"
        >
          Space
        </button>
      </div>
    </div>
  );
};

export default KeyboardBase;
