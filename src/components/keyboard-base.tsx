"use client";

import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Eraser, Check } from "lucide-react";
import useLetterboardStore from "@/store/useLetterboardStore";

interface KeyboardBaseProps {
  renderKeys: () => React.ReactNode;
  onSubmit: (text: string) => void;
  extraButtons?: React.ReactNode;
  isLetterBoard: boolean;
  onToggleBoard: () => void;
}

const KeyboardBase: React.FC<KeyboardBaseProps> = ({
  renderKeys,
  onSubmit,
  extraButtons,
  isLetterBoard,
  onToggleBoard,
}) => {
  const { text, appendLetter, backspace, clear, setText } = useLetterboardStore();

  const handleSubmit = () => {
    onSubmit(text);
    setText("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="h-[20vh] p-4">
        <Textarea
          value={text}
          readOnly
          className="w-full h-full p-2 text-2xl sm:text-3xl md:text-4xl border border-gray-300 rounded resize-none"
        />
      </div>
      <div className="flex flex-col flex-grow bg-gray-200 p-2">
        <div className="flex-grow overflow-y-auto">{renderKeys()}</div>
        <div className="mt-2 space-y-2">
          <button
            onClick={() => appendLetter(" ")}
            className="w-full h-10 text-sm bg-white rounded-lg shadow flex items-center justify-center"
          >
            Space
          </button>
          <div className="flex gap-2">
            <button
              onClick={backspace}
              className="flex-1 h-10 text-sm bg-white rounded-lg shadow flex items-center justify-center"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              onClick={clear}
              className="flex-1 h-10 text-sm bg-white rounded-lg shadow flex items-center justify-center"
            >
              <Eraser size={18} />
            </button>
            {isLetterBoard && (
              <button
                onClick={onToggleBoard}
                className="flex-1 h-10 text-sm bg-white rounded-lg shadow flex items-center justify-center"
              >
                123
              </button>
            )}
            {extraButtons}
            <button
              onClick={handleSubmit}
              className="flex-1 h-10 text-sm bg-blue-600 text-white rounded-lg shadow flex items-center justify-center"
            >
              <Check size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyboardBase;
