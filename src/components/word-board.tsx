"use client";

import React, { useEffect } from "react";
import KeyboardBase from "./keyboard-base";
import { RotateCcw } from "lucide-react";
import { fetchAndGenerateWordBoard } from "@/lib/word-selection";
import useLetterboardStore from "@/store/useLetterboardStore";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { UserSettings } from "@/lib/types";
import { fonts } from "@/lib/fonts";

interface WordBoardProps {
  userSettings: UserSettings;
}

const WordBoard: React.FC<WordBoardProps> = ({ userSettings }) => {
  const { selectedWords, setSelectedWords, appendLetter } = useLetterboardStore();
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useToast();

  const refreshWords = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const words = await fetchAndGenerateWordBoard();
      console.log("Fetched words:", words);
      if (words.length === 0) {
        setError("No words found. Please make sure you have a selected word bank with words.");
      }
      setSelectedWords(words);
    } catch (error) {
      console.error("Error fetching words:", error);
      toast({
        title: "Error",
        description: "Failed to fetch words. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshWords();
  }, []);

  const onWordSelect = (word: string) => {
    appendLetter(word + " ");
  };

  const renderKeys = () => {
    const fontClass = fonts[userSettings.font as keyof typeof fonts]?.className || "";

    if (isLoading) {
      return (
        <div className={`flex items-center justify-center h-full ${fontClass}`}>
          <Skeleton className="w-full h-full" />
        </div>
      );
    }

    if (error) {
      return (
        <div className={`flex items-center justify-center h-full ${fontClass}`}>
          <p className="text-red-500">{error}</p>
        </div>
      );
    }

    if (selectedWords.length === 0) {
      return (
        <div className={`flex items-center justify-center h-full ${fontClass}`}>
          <p>No words available. Please refresh or check your word bank.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-3 gap-2 h-full">
        {selectedWords.map((word, index) => (
          <button
            key={index}
            onClick={() => onWordSelect(word)}
            className={`rounded-lg shadow flex items-center justify-center ${fontClass}`}
            style={{
              backgroundColor: userSettings.buttonColor,
              color: userSettings.textColor,
              fontSize: `${userSettings.fontSize}px`,
            }}
          >
            {userSettings.letterCase === "uppercase" ? word.toUpperCase() : word.toLowerCase()}
          </button>
        ))}
      </div>
    );
  };

  return isLoading ? (
    <Skeleton className="w-full h-full" />
  ) : (
    <KeyboardBase
      renderKeys={renderKeys}
      onSubmit={(text) => console.log(text)}
      isLetterBoard={false}
      onToggleBoard={() => {}}
      userSettings={userSettings}
    />
  );
};

export default WordBoard;
