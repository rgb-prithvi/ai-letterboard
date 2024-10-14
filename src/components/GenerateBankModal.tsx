import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { WordBankReview } from "@/components/WordBankReview";
import { Word } from "@/lib/types";

interface GenerateBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBank: (name: string, words: Word[]) => void;
}

export function GenerateBankModal({ isOpen, onClose, onCreateBank }: GenerateBankModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [wordCount, setWordCount] = useState(20);
  const [words, setWords] = useState<Word[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"input" | "review">("input");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-words", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description, wordCount }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate words");
      }

      const data = await response.json();
      setWords(data.words);
      setStep("review");
    } catch (error) {
      console.error("Error generating words:", error);
      setError("Failed to generate words. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreate = () => {
    onCreateBank(name, words);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setWordCount(20);
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {step === "input" ? "Generate Word Bank with AI" : "Review Generated Words"}
          </DialogTitle>
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
              <Label htmlFor="bank-description">Description</Label>
              <Textarea
                id="bank-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter a description for the word bank"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="word-count">Number of Words: {wordCount}</Label>
              <Slider
                id="word-count"
                min={5}
                max={100}
                step={1}
                value={[wordCount]}
                onValueChange={(value) => setWordCount(value[0])}
                className="mt-4"
              />
            </div>
            <Button onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? "Generating..." : "Generate Words"}
            </Button>
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
