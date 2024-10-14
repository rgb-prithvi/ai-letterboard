import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertCircle, X, Edit2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Word {
  id: number;
  word: string;
  is_highlighted: boolean;
}

interface WordBank {
  id: number;
  name: string;
  words: Word[];
}

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
  const [editingWordIndex, setEditingWordIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleEdit = (bank: WordBank) => {
    setEditingBank({ ...bank, words: [...bank.words] });
    setError(null);
  };

  const handleSave = () => {
    if (editingBank) {
      if (editingBank.words.filter(w => w.is_highlighted).length === 0) {
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
        is_highlighted: !updatedWords[index].is_highlighted
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

  const handleEditWord = (index: number) => {
    setEditingWordIndex(index);
  };

  const handleSaveEdit = (index: number, newWord: string) => {
    if (editingBank && newWord.trim() !== "") {
      const updatedWords = [...editingBank.words];
      updatedWords[index] = { ...updatedWords[index], word: newWord.trim() };
      setEditingBank({ ...editingBank, words: updatedWords });
      setEditingWordIndex(null);
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
            <div className="max-h-60 overflow-y-auto border rounded p-2">
              {editingBank.words.map((word, index) => (
                <div key={index} className="flex items-center justify-between py-1">
                  {editingWordIndex === index ? (
                    <Input
                      value={word.word}
                      onChange={(e) => handleSaveEdit(index, e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSaveEdit(index, (e.target as HTMLInputElement).value)}
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
                    {editingWordIndex === index ? (
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
            <Button onClick={handleSave}>Save Changes</Button>
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
