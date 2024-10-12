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
import { AlertCircle } from 'lucide-react';
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processWords = (input: string): string[] => {
    return input
      .split(/[,\n]/)
      .map(word => word.trim())
      .filter(word => word !== '');
  };

  const handleCreate = () => {
    const wordList = processWords(words);
    if (wordList.length === 0) {
      setError('Please enter at least one word.');
      return;
    }
    onCreateBank(name, wordList);
    setName('');
    setWords('');
    setError(null);
    onClose();
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Word Bank</DialogTitle>
        </DialogHeader>
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
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button onClick={handleCreate}>Create Bank</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
