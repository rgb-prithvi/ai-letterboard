"use client";

import React from "react";
import WordBoard from "@/components/word-board";
import CustomKeyboard from "@/components/custom-keyboard";
import { UserSettings } from "@/lib/types";
import useLetterboardStore from "@/store/useLetterboardStore";
import { fonts } from "@/lib/fonts";

interface InputWrapperProps {
  userSettings: UserSettings;
}

const InputWrapper: React.FC<InputWrapperProps> = ({ userSettings }) => {
  const isLetterBoard = useLetterboardStore((state) => state.isLetterBoard);

  const fontClass = fonts[userSettings.font as keyof typeof fonts]?.className || "";

  const keyboardStyle = {
    fontSize: `${userSettings.fontSize}px`,
    color: userSettings.textColor,
    backgroundColor: userSettings.theme === "light" ? "#f3f4f6" : "#1f2937",
  };

  return (
    <div className={`flex flex-col flex-grow ${fontClass}`} style={keyboardStyle}>
      {userSettings.inputMode === "word" ? (
        <WordBoard userSettings={userSettings} />
      ) : (
        <CustomKeyboard isLetterBoard={isLetterBoard} userSettings={userSettings} />
      )}
    </div>
  );
};

export default InputWrapper;
