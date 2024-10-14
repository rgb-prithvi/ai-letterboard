"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { ArrowLeft, Eraser, Check } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface KeyboardBaseProps {
  renderKeys: () => ReactNode;
  onSubmit: (text: string) => void;
  extraButtons?: ReactNode;
}

const KeyboardBase: React.FC<KeyboardBaseProps> = ({ renderKeys, onSubmit, extraButtons }) => {
  const [inputText, setInputText] = useState("");
  const [isLandscape, setIsLandscape] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState("60%");

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
          className="w-full h-full p-2 text-4xl border border-gray-300 rounded"
        />
      </div>
      <div
        className="flex-shrink-0 flex flex-col bg-gray-200 p-2"
        style={{ height: keyboardHeight }}
      >
        <div className="flex-1 flex flex-col justify-between">
          {renderKeys()}
          <div className="flex justify-between flex-1 mt-2">
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
            {extraButtons}
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

export default KeyboardBase;
