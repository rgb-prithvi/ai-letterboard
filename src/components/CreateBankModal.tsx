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

interface Word {
  word: string;
  is_highlighted: boolean;
}

interface CreateBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBank: (name: string, words: Word[]) => void;
}

export function CreateBankModal({ isOpen, onClose, onCreateBank }: CreateBankModalProps) {
  const [name, setName] = useState('');
  const [rawInput, setRawInput] = useState('');
  const [words, setWords] = useState<Word[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'input' | 'review'>('input');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processWords = (input: string): Word[] => {
    return input
      .split(/[,\n]/)
      .map(word => word.trim())
      .filter(word => word !== '')
      .map(word => ({ word, is_highlighted: false }));
  };

  const handleNextStep = () => {
    const processedWords = processWords(rawInput);
    if (processedWords.length === 0) {
      setError('Please enter at least one word.');
      return;
    }
    setWords(processedWords);
    setStep('review');
    setError(null);
  };

  const handleCreate = () => {
    console.log('Creating word bank...');
    console.log('Final words:', words);
    onCreateBank(name, words);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName('');
    setRawInput('');
    setWords([]);
    setError(null);
    setStep('input');
    setEditingIndex(null);
  };

  const handleRemoveWord = (indexToRemove: number) => {
    setWords(words.filter((_, index) => index !== indexToRemove));
  };

  const handleToggleHighlight = (index: number) => {
    setWords(words.map((word, i) => 
      i === index ? { ...word, is_highlighted: !word.is_highlighted } : word
    ));
  };

  const handleEditWord = (index: number) => {
    setEditingIndex(index);
  };

  const handleSaveEdit = (index: number, newWord: string) => {
    if (newWord.trim() !== '') {
      setWords(words.map((word, i) => 
        i === index ? { ...word, word: newWord.trim() } : word
      ));
      setEditingIndex(null);
    }
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
            <p className="text-sm text-gray-500">
              Click the highlight button to include a word in your word bank. 
              Use the edit button to modify a word, or the X button to remove it from the list.
            </p>
            <div className="max-h-60 overflow-y-auto">
              {words.map((word, index) => (
                <div key={index} className="flex items-center justify-between py-1">
                  {editingIndex === index ? (
                    <Input
                      value={word.word}
                      onChange={(e) => handleSaveEdit(index, e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit(index, (e.target as HTMLInputElement).value)}
                      className="flex-grow mr-2"
                    />
                  ) : (
                    <span className="flex-grow">{word.word}</span>
                  )}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={word.is_highlighted ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => handleToggleHighlight(index)}
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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditWord(index)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveWord(index)}
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
