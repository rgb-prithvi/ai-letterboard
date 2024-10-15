"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Eraser,
  Check,
  Loader2,
  ArrowBigUpDash,
  Volume2,
  CornerDownLeft,
} from "lucide-react";
import useLetterboardStore from "@/store/useLetterboardStore";
import { logInteraction } from "@/lib/log-interaction";
import { UserSettings } from "@/lib/types";
import { fonts } from "@/lib/fonts";

interface KeyboardBaseProps {
  renderKeys: () => React.ReactNode;
  extraButtons?: React.ReactNode;
  isLetterBoard: boolean;
  onToggleBoard: () => void;
  userSettings: UserSettings;
}

const KeyboardBase: React.FC<KeyboardBaseProps> = ({
  renderKeys,
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
  const [isNumericKeys, setIsNumericKeys] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const numericKeys = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["0", "+", "-"],
    ["*", "/", "%"],
    ["(", ")", "."],
  ];

  useEffect(() => {
    initializeWordSet();
    if (session?.user?.id) {
      setUserId(session.user.id);
    }
  }, [session]);

  const handleSubmit = async () => {
    setSubmitStatus("submitting");
    try {
      await playAudio(text);
      if (session?.user?.id) {
        await logInteraction("text_submit", text.trim(), session.user.id);
      }
      setSubmitStatus("success");
    } catch (error) {
      console.error("Error submitting text:", error);
      setSubmitStatus("error");
    } finally {
      setTimeout(() => setSubmitStatus("idle"), 2000); // Reset status after 2 seconds
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

  const onNumericKeyToggle = () => {
    setIsNumericKeys(!isNumericKeys);
  };

  // TODO: Lot of code duplication...refactor to clean this all up
  const renderNumericKeys = () => {
    const keys = numericKeys;

    const fontClass = fonts[userSettings.font as keyof typeof fonts]?.className || "";

    return (
      <div className="flex flex-col h-full">
        {keys.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-between mb-2 flex-1">
            {row.map((key) => (
              <button
                key={key}
                onClick={() =>
                  appendLetter(
                    userSettings.letterCase === "uppercase" ? key.toUpperCase() : key.toLowerCase(),
                  )
                }
                className={`flex-1 mx-0.5 rounded-lg shadow flex items-center justify-center h-full ${fontClass}`}
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

  const handlePlayAudio = async () => {
    setIsPlayingAudio(true);
    try {
      await playAudio(text);
    } catch (error) {
      console.error("Error playing audio:", error);
    } finally {
      setIsPlayingAudio(false);
    }
  };

  return (
    <>
      <div className="h-36 lg:h-48 p-4">
        <Textarea
          value={text}
          readOnly
          className={`w-full h-full p-8 border border-gray-300 rounded resize-none ${fontClass}`}
          style={{
            fontSize: `${userSettings.fontSize * 1.2}px`,
            lineHeight: "1.1", // Add this line
          }}
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
      <div className="flex-grow px-4">{isNumericKeys ? renderNumericKeys() : renderKeys()}</div>
      <div className="my-4 px-4">
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => appendLetter("\n")}
            className="h-10 rounded-lg shadow flex items-center justify-center"
            style={buttonStyle}
          >
            <CornerDownLeft size={18} />
          </button>
          <button
            onClick={onNumericKeyToggle}
            className="h-10 rounded-lg shadow flex items-center justify-center"
            style={buttonStyle}
          >
            <p className="text-lg">123</p>
          </button>
          <button
            onClick={clear}
            className="h-10 rounded-lg shadow flex items-center justify-center"
            style={buttonStyle}
          >
            <Eraser size={18} />
          </button>
          <button
            onClick={handlePlayAudio}
            className="h-10 rounded-lg shadow flex items-center justify-center bg-white"
            disabled={isPlayingAudio || submitStatus === "submitting"}
          >
            {isPlayingAudio ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Volume2 size={18} />
            )}
          </button>
          <button
            onClick={backspace}
            className="h-10 rounded-lg shadow flex items-center justify-center"
            style={buttonStyle}
          >
            <ArrowLeft size={18} />
          </button>
          <button
            onClick={() => appendLetter(" ")}
            className="col-span-2 h-10 rounded-lg shadow flex items-center justify-center"
            style={buttonStyle}
          />
          <button
            onClick={handleSubmit}
            className={getSubmitButtonClass()}
            disabled={submitStatus === "submitting"}
          >
            {getSubmitButtonContent()}
          </button>
        </div>
      </div>
    </>
  );
};

export default KeyboardBase;
