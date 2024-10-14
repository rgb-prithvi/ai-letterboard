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

  const handleGenerate = async () => {
    // TODO: Implement AI generation logic here
    // For now, we'll use placeholder data
    const generatedWords: Word[] = Array.from({ length: wordCount }, (_, i) => ({
      word: `Word ${i + 1}`,
      is_highlighted: false,
    }));
    setWords(generatedWords);
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
              <Label htmlFor="bank-description">Description (optional)</Label>
              <Textarea
                id="bank-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter a description for the AI to use"
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
              />
            </div>
            <Button onClick={handleGenerate}>Generate Words</Button>
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
