import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { WordBankReview } from "@/components/WordBankReview";
import { Word } from "@/lib/types";

interface CreateBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBank: (name: string, words: Word[]) => void;
}

export function CreateBankModal({ isOpen, onClose, onCreateBank }: CreateBankModalProps) {
  const [name, setName] = useState("");
  const [rawInput, setRawInput] = useState("");
  const [words, setWords] = useState<Word[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"input" | "review">("input");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processWords = (input: string): Word[] => {
    return input
      .split(/[,\n]/)
      .map((word) => word.trim())
      .filter((word) => word !== "")
      .map((word) => ({ word, is_highlighted: false }));
  };

  const handleNextStep = () => {
    const processedWords = processWords(rawInput);
    if (processedWords.length === 0) {
      setError("Please enter at least one word.");
      return;
    }
    setWords(processedWords);
    setStep("review");
    setError(null);
  };

  const handleCreate = () => {
    onCreateBank(name, words);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName("");
    setRawInput("");
    setWords([]);
    setError(null);
    setStep("input");
  };

  const handleToggleHighlight = (index: number) => {
    setWords(
      words.map((word, i) =>
        i === index ? { ...word, is_highlighted: !word.is_highlighted } : word,
      ),
    );
  };

  const handleRemoveWord = (index: number) => {
    setWords(words.filter((_, i) => i !== index));
  };

  const handleEditWord = (index: number, newWord: string) => {
    setWords(words.map((word, i) => (i === index ? { ...word, word: newWord } : word)));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setRawInput(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{step === "input" ? "Create New Word Bank" : "Review Words"}</DialogTitle>
        </DialogHeader>
        {step === "input" ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="bank-name">Bank Name</Label>
              <Input
                id="bank-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter bank name"
              />
            </div>
            <div>
              <Label htmlFor="bank-words">Words (comma-separated or one per line)</Label>
              <Textarea
                id="bank-words"
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                placeholder="Enter words, separated by commas or new lines"
                rows={5}
              />
            </div>
            <div>
              <Label htmlFor="file-upload">Upload TXT or CSV file</Label>
              <Input
                id="file-upload"
                type="file"
                accept=".txt,.csv"
                onChange={handleFileUpload}
                ref={fileInputRef}
              />
            </div>
            <Button onClick={handleNextStep}>Next</Button>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <WordBankReview
              words={words}
              onToggleHighlight={handleToggleHighlight}
              onRemoveWord={handleRemoveWord}
              onEditWord={handleEditWord}
            />
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep("input")}>
                Back
              </Button>
              <Button onClick={handleCreate}>Create Bank</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
