import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { WordBankReview } from "@/components/WordBankReview";
import { Word, WordBank } from "@/lib/types";

interface ManageBanksModalProps {
  isOpen: boolean;
  onClose: () => void;
  wordBanks: WordBank[];
  onUpdateBank: (id: number, name: string, words: Word[]) => void;
  onDeleteBank: (id: number) => void;
}

export function ManageBanksModal({
  isOpen,
  onClose,
  wordBanks,
  onUpdateBank,
  onDeleteBank,
}: ManageBanksModalProps) {
  const [editingBank, setEditingBank] = useState<WordBank | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleEdit = (bank: WordBank) => {
    setEditingBank({ ...bank, words: [...bank.words] });
    setError(null);
  };

  const handleSave = () => {
    if (editingBank) {
      if (editingBank.words.filter((w) => w.is_highlighted).length === 0) {
        setError("Please include at least one highlighted word in the bank.");
        return;
      }
      onUpdateBank(editingBank.id, editingBank.name, editingBank.words);
      setEditingBank(null);
      setError(null);
    }
  };

  const handleToggleHighlight = (index: number) => {
    if (editingBank) {
      const updatedWords = [...editingBank.words];
      updatedWords[index] = {
        ...updatedWords[index],
        is_highlighted: !updatedWords[index].is_highlighted,
      };
      setEditingBank({ ...editingBank, words: updatedWords });
    }
  };

  const handleRemoveWord = (index: number) => {
    if (editingBank) {
      const updatedWords = editingBank.words.filter((_, i) => i !== index);
      setEditingBank({ ...editingBank, words: updatedWords });
    }
  };

  const handleEditWord = (index: number, newWord: string) => {
    if (editingBank) {
      const updatedWords = [...editingBank.words];
      updatedWords[index] = { ...updatedWords[index], word: newWord };
      setEditingBank({ ...editingBank, words: updatedWords });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-3xl">
        <DialogHeader>
          <DialogTitle>Manage Word Banks</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {wordBanks.map((bank) => (
            <div key={bank.id} className="flex items-center justify-between p-2 border rounded">
              <span>{bank.name}</span>
              <div>
                <Button variant="outline" onClick={() => handleEdit(bank)} className="mr-2">
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => onDeleteBank(bank.id)}>
                  Delete
                </Button>
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
            <Label>Words</Label>
            <WordBankReview
              words={editingBank.words}
              onToggleHighlight={handleToggleHighlight}
              onRemoveWord={handleRemoveWord}
              onEditWord={handleEditWord}
            />
            <div className="flex justify-end">
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
