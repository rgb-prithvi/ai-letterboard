"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Eraser, Check, Loader2 } from "lucide-react";
import useLetterboardStore from "@/store/useLetterboardStore";
import { logInteraction } from "@/lib/log-interaction";
import { UserSettings } from "@/lib/types";
import { fonts } from "@/lib/fonts";

interface KeyboardBaseProps {
  renderKeys: () => React.ReactNode;
  onSubmit: (text: string) => void;
  extraButtons?: React.ReactNode;
  isLetterBoard: boolean;
  onToggleBoard: () => void;
  userSettings: UserSettings;
}

const KeyboardBase: React.FC<KeyboardBaseProps> = ({
  renderKeys,
  onSubmit,
  extraButtons,
  isLetterBoard,
  onToggleBoard,
  userSettings,
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
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );

  useEffect(() => {
    initializeWordSet();
    if (session?.user?.id) {
      setUserId(session.user.id);
    }
  }, [session]);

  const handleSubmit = async () => {
    if (text.trim()) {
      setSubmitStatus("submitting");
      if (userSettings.textToSpeech) {
        try {
          await playAudio(text.trim());
          if (session?.user?.id) {
            await logInteraction("text_submit", text.trim(), session.user.id);
          }
          onSubmit(text);
          setSubmitStatus("success");
        } catch (error) {
          console.error("Error submitting text:", error);
          setSubmitStatus("error");
        } finally {
          setTimeout(() => setSubmitStatus("idle"), 2000); // Reset status after 2 seconds
        }
      }
    }
  };

  const buttonStyle = {
    backgroundColor: userSettings.buttonColor,
    color: userSettings.textColor,
  };

  const getSubmitButtonContent = () => {
    switch (submitStatus) {
      case "submitting":
        return <Loader2 className="animate-spin text-white" size={18} />;
      case "success":
        return <Check className="text-white" size={18} />;
      case "error":
        return <span className="text-white">!</span>;
      default:
        return <Check className="text-white" size={18} />;
    }
  };

  const getSubmitButtonClass = () => {
    let baseClass = "flex-1 h-10 text-sm rounded-lg shadow flex items-center justify-center ";
    switch (submitStatus) {
      case "submitting":
        return baseClass + "bg-gray-400 cursor-not-allowed";
      case "success":
        return baseClass + "bg-green-600";
      case "error":
        return baseClass + "bg-red-600";
      default:
        return baseClass + "bg-blue-600";
    }
  };

  const fontClass = fonts[userSettings.font as keyof typeof fonts]?.className || "";

  return (
    <>
      <div className="h-36 lg:h-48 p-4">
        <Textarea
          value={text}
          readOnly
          className={`w-full h-full p-8 border border-gray-300 rounded resize-none ${fontClass}`}
          style={{ fontSize: `${userSettings.fontSize * 1.2}px` }}
        />
      </div>
      <div className="flex-shrink-0 p-2 bg-gray-200">
        {userSettings.autoCompletion && (
          <div className="flex justify-center space-x-2 my-1">
            {predictions.map((prediction, index) => (
              <button
                key={index}
                onClick={() => selectPrediction(prediction)}
                className="px-4 py-2 text-sm bg-white rounded-lg shadow"
              >
                {prediction}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="flex-grow px-4">{renderKeys()}</div>
      <div className="mt-2 space-y-2 h-24 px-4">
        <div className="flex gap-2">
          <button
            onClick={backspace}
            className="flex-1 h-10 rounded-lg shadow flex items-center justify-center"
            style={buttonStyle}
          >
            <ArrowLeft size={18} />
          </button>
          <button
            onClick={clear}
            className="flex-1 h-10 rounded-lg shadow flex items-center justify-center"
            style={buttonStyle}
          >
            <Eraser size={18} />
          </button>
          {isLetterBoard && (
            <button
              onClick={onToggleBoard}
              className="flex-1 h-10 rounded-lg shadow flex items-center justify-center"
              style={buttonStyle}
            >
              123
            </button>
          )}
          {extraButtons}
          <button
            onClick={handleSubmit}
            className={getSubmitButtonClass()}
            disabled={submitStatus === "submitting"}
          >
            {getSubmitButtonContent()}
          </button>
        </div>
        <button
          onClick={() => appendLetter(" ")}
          className="w-full h-10 rounded-lg shadow flex items-center justify-center"
          style={buttonStyle}
        />
      </div>
    </>
  );
};

export default KeyboardBase;
