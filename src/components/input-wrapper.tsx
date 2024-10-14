"use client";

import React from "react";
import WordBoard from "@/components/word-board";
import CustomKeyboard from "@/components/custom-keyboard";
import { UserSettings } from "@/lib/types";

interface InputWrapperProps {
  userSettings: UserSettings;
}

const InputWrapper: React.FC<InputWrapperProps> = ({ userSettings }) => {
  return userSettings.inputMode === "word" ? <WordBoard /> : <CustomKeyboard />;
};

export default InputWrapper;
