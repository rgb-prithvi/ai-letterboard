import React, { useState } from 'react';
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

interface CreateBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBank: (name: string, words: string[]) => void;
}

export function CreateBankModal({ isOpen, onClose, onCreateBank }: CreateBankModalProps) {
  const [name, setName] = useState('');
  const [words, setWords] = useState('');

  const handleCreate = () => {
    const wordList = words.split(',').map(word => word.trim()).filter(word => word !== '');
    onCreateBank(name, wordList);
    setName('');
    setWords('');
    onClose();
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
            <Label htmlFor="bank-words">Words (comma-separated)</Label>
            <Textarea
              id="bank-words"
              value={words}
              onChange={(e) => setWords(e.target.value)}
              placeholder="Enter words, separated by commas"
              rows={5}
            />
          </div>
          <Button onClick={handleCreate}>Create Bank</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
