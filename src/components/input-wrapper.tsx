"use client";

import React from "react";
import WordBoard from "@/components/word-board";
import CustomKeyboard from "@/components/custom-keyboard";
import { UserSettings } from "@/lib/types";
import useLetterboardStore from "@/store/useLetterboardStore";

interface InputWrapperProps {
  userSettings: UserSettings;
}

const InputWrapper: React.FC<InputWrapperProps> = ({ userSettings }) => {
  const isLetterBoard = useLetterboardStore((state) => state.isLetterBoard);

  return userSettings.inputMode === "word" ? <WordBoard /> : <CustomKeyboard isLetterBoard={isLetterBoard} />;
};

export default InputWrapper;
