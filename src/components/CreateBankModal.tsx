import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle, X, Edit2 } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CreateBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBank: (name: string, words: string[]) => void;
}

export function CreateBankModal({ isOpen, onClose, onCreateBank }: CreateBankModalProps) {
  const [name, setName] = useState('');
  const [words, setWords] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'input' | 'review'>('input');
  const [reviewWords, setReviewWords] = useState<string[]>([]);
  const [highlightedWords, setHighlightedWords] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingWord, setEditingWord] = useState<string | null>(null);
  const [editedWord, setEditedWord] = useState('');

  const processWords = (input: string): string[] => {
    return input
      .split(/[,\n]/)
      .map(word => word.trim())
      .filter(word => word !== '');
  };

  const handleNextStep = () => {
    const wordList = processWords(words);
    if (wordList.length === 0) {
      setError('Please enter at least one word.');
      return;
    }
    setReviewWords(wordList);
    setStep('review');
    setError(null);
  };

  const handleCreate = () => {
    const finalWords = reviewWords.filter(word => highlightedWords.has(word));
    onCreateBank(name, finalWords);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName('');
    setWords('');
    setError(null);
    setStep('input');
    setReviewWords([]);
    setHighlightedWords(new Set());
  };

  const handleRemoveWord = (wordToRemove: string) => {
    setReviewWords(reviewWords.filter(word => word !== wordToRemove));
    setHighlightedWords(prev => {
      const newSet = new Set(prev);
      newSet.delete(wordToRemove);
      return newSet;
    });
  };

  const handleToggleHighlight = (word: string) => {
    setHighlightedWords(prev => {
      const newSet = new Set(prev);
      if (newSet.has(word)) {
        newSet.delete(word);
      } else {
        newSet.add(word);
      }
      return newSet;
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setWords(content);
      };
      reader.readAsText(file);
    }
  };

  const handleEditWord = (word: string) => {
    setEditingWord(word);
    setEditedWord(word);
  };

  const handleSaveEdit = () => {
    if (editingWord && editedWord.trim() !== '') {
      setReviewWords(prevWords => 
        prevWords.map(w => w === editingWord ? editedWord.trim() : w)
      );
      setHighlightedWords(prev => {
        const newSet = new Set(prev);
        if (newSet.has(editingWord)) {
          newSet.delete(editingWord);
          newSet.add(editedWord.trim());
        }
        return newSet;
      });
      setEditingWord(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{step === 'input' ? 'Create New Word Bank' : 'Review Words'}</DialogTitle>
        </DialogHeader>
        {step === 'input' ? (
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
                value={words}
                onChange={(e) => setWords(e.target.value)}
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
            <p className="text-sm text-gray-500">
              Click the highlight button to include a word in your word bank. 
              Use the edit button to modify a word, or the X button to remove it from the list.
            </p>
            <div className="max-h-60 overflow-y-auto">
              {reviewWords.map((word, index) => (
                <div key={index} className="flex items-center justify-between py-1">
                  {editingWord === word ? (
                    <Input
                      value={editedWord}
                      onChange={(e) => setEditedWord(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                      className="flex-grow mr-2"
                    />
                  ) : (
                    <span className="flex-grow">{word}</span>
                  )}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={highlightedWords.has(word) ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => handleToggleHighlight(word)}
                    >
                      {highlightedWords.has(word) ? "Highlighted" : "Highlight"}
                    </Button>
                    {editingWord === word ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSaveEdit}
                      >
                        Save
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditWord(word)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveWord(word)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('input')}>Back</Button>
              <Button onClick={handleCreate}>Create Bank</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
