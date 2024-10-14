"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Eraser, Check } from "lucide-react";
import useLetterboardStore from "@/store/useLetterboardStore";
import { logInteraction } from "@/lib/log-interaction";

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
  const { data: session } = useSession();
  const {
    text,
    appendLetter,
    backspace,
    clear,
    setText,
    predictions,
    selectPrediction,
    initializeWordSet,
    playAudio,
    setUserId,
  } = useLetterboardStore();

  useEffect(() => {
    initializeWordSet();
    if (session?.user?.id) {
      setUserId(session.user.id);
    }
  }, [session]);

  const handleSubmit = async () => {
    if (text.trim()) {
      await playAudio(text.trim());
      if (session?.user?.id) {
        await logInteraction('text_submit', text.trim(), session.user.id);
      }
      onSubmit(text);
      setText("");
    }
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
      <div className="flex-shrink-0 p-2 bg-gray-200">
        <div className="flex justify-center space-x-2">
          {predictions.map((prediction, index) => (
            <button
              key={index}
              onClick={() => selectPrediction(prediction)}
              className="px-3 py-1 text-sm bg-white rounded-lg shadow"
            >
              {prediction}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col flex-grow bg-gray-200 p-2">
        <div className="flex-grow overflow-y-auto">{renderKeys()}</div>
        <div className="mt-2 space-y-2 h-40">
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
          <button
            onClick={() => appendLetter(" ")}
            className="w-full h-10 text-sm bg-white rounded-lg shadow flex items-center justify-center"
          >
            Space
          </button>
        </div>
      </div>
    </div>
  );
};

export default KeyboardBase;
