import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface WordBank {
  id: number;
  name: string;
  words: string[];
}

interface ManageBanksModalProps {
  isOpen: boolean;
  onClose: () => void;
  wordBanks: WordBank[];
  onUpdateBank: (id: number, name: string, words: string[]) => void;
  onDeleteBank: (id: number) => void;
}

export function ManageBanksModal({ isOpen, onClose, wordBanks, onUpdateBank, onDeleteBank }: ManageBanksModalProps) {
  const [editingBank, setEditingBank] = useState<WordBank | null>(null);

  const handleEdit = (bank: WordBank) => {
    setEditingBank(bank);
  };

  const handleSave = () => {
    if (editingBank) {
      onUpdateBank(editingBank.id, editingBank.name, editingBank.words);
      setEditingBank(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Manage Word Banks</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {wordBanks.map((bank) => (
            <div key={bank.id} className="flex items-center justify-between p-2 border rounded">
              <span>{bank.name}</span>
              <div>
                <Button variant="outline" onClick={() => handleEdit(bank)} className="mr-2">Edit</Button>
                <Button variant="destructive" onClick={() => onDeleteBank(bank.id)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
        {editingBank && (
          <div className="space-y-4 mt-4">
            <Label htmlFor="edit-bank-name">Bank Name</Label>
            <Input
              id="edit-bank-name"
              value={editingBank.name}
              onChange={(e) => setEditingBank({ ...editingBank, name: e.target.value })}
            />
            <Label htmlFor="edit-bank-words">Words (comma-separated)</Label>
            <Textarea
              id="edit-bank-words"
              value={editingBank.words.join(', ')}
              onChange={(e) => setEditingBank({ ...editingBank, words: e.target.value.split(',').map(word => word.trim()) })}
              rows={5}
            />
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
