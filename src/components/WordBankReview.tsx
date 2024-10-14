import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, X } from "lucide-react";
import { Word } from "@/lib/types";

interface WordBankReviewProps {
  words: Word[];
  onToggleHighlight: (index: number) => void;
  onRemoveWord: (index: number) => void;
  onEditWord: (index: number, newWord: string) => void;
}

export function WordBankReview({
  words,
  onToggleHighlight,
  onRemoveWord,
  onEditWord,
}: WordBankReviewProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleEditWord = (index: number) => {
    setEditingIndex(index);
  };

  const handleSaveEdit = (index: number, newWord: string) => {
    if (newWord.trim() !== "") {
      onEditWord(index, newWord.trim());
      setEditingIndex(null);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Click the highlight button to include a word in your word bank. Use the edit button to
        modify a word, or the X button to remove it from the list.
      </p>
      <div className="max-h-60 overflow-y-auto">
        {words.map((word, index) => (
          <div key={index} className="flex items-center justify-between py-1">
            {editingIndex === index ? (
              <Input
                value={word.word}
                onChange={(e) => handleSaveEdit(index, e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && handleSaveEdit(index, (e.target as HTMLInputElement).value)
                }
                className="flex-grow mr-2"
              />
            ) : (
              <span className="flex-grow">{word.word}</span>
            )}
            <div className="flex items-center space-x-2">
              <Button
                variant={word.is_highlighted ? "secondary" : "outline"}
                size="sm"
                onClick={() => onToggleHighlight(index)}
              >
                {word.is_highlighted ? "Highlighted" : "Highlight"}
              </Button>
              {editingIndex === index ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSaveEdit(index, word.word)}
                >
                  Save
                </Button>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => handleEditWord(index)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => onRemoveWord(index)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
