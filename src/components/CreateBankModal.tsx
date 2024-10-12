import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CreateBankModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateBankModal({ isOpen, onClose }: CreateBankModalProps) {
  const [bankName, setBankName] = useState('');
  const [words, setWords] = useState('');
  const [creationMethod, setCreationMethod] = useState<'upload' | 'manual' | 'ai'>('manual');

  const handleCreate = () => {
    // Implement bank creation logic here
    console.log('Creating bank:', bankName, words, creationMethod);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Word Bank</DialogTitle>
          <DialogDescription>
            Create a new word bank for autocomplete suggestions.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="bank-name">Bank Name</Label>
            <Input
              id="bank-name"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="Enter bank name"
            />
          </div>
          <div>
            <Label>Creation Method</Label>
            <div className="flex space-x-2 mt-2">
              <Button
                variant={creationMethod === 'upload' ? 'default' : 'outline'}
                onClick={() => setCreationMethod('upload')}
              >
                Upload
              </Button>
              <Button
                variant={creationMethod === 'manual' ? 'default' : 'outline'}
                onClick={() => setCreationMethod('manual')}
              >
                Manual
              </Button>
              <Button
                variant={creationMethod === 'ai' ? 'default' : 'outline'}
                onClick={() => setCreationMethod('ai')}
              >
                AI Generate
              </Button>
            </div>
          </div>
          {creationMethod === 'manual' && (
            <div>
              <Label htmlFor="words">Enter Words</Label>
              <Textarea
                id="words"
                value={words}
                onChange={(e) => setWords(e.target.value)}
                placeholder="Enter words separated by commas"
              />
            </div>
          )}
          {creationMethod === 'upload' && (
            <div>
              <Label htmlFor="file-upload">Upload Word List</Label>
              <Input id="file-upload" type="file" />
            </div>
          )}
          {creationMethod === 'ai' && (
            <div>
              <Label>AI Generation</Label>
              <p>AI word generation will be implemented here.</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">Cancel</Button>
          <Button onClick={handleCreate}>Create Bank</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
