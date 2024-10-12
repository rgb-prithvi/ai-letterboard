import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ManageBanksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock data for demonstration
const mockBanks = [
  { id: '1', name: 'Default', words: ['apple', 'banana', 'cherry'] },
  { id: '2', name: 'Medical Terms', words: ['stethoscope', 'diagnosis', 'prescription'] },
];

export function ManageBanksModal({ isOpen, onClose }: ManageBanksModalProps) {
  const [banks, setBanks] = useState(mockBanks);

  const handleDeleteBank = (id: string) => {
    setBanks(banks.filter(bank => bank.id !== id));
  };

  const handleUpdateBank = (id: string, newName: string) => {
    setBanks(banks.map(bank => bank.id === id ? { ...bank, name: newName } : bank));
  };

  const handleAddWord = (bankId: string, word: string) => {
    setBanks(banks.map(bank => 
      bank.id === bankId ? { ...bank, words: [...bank.words, word] } : bank
    ));
  };

  const handleDeleteWord = (bankId: string, word: string) => {
    setBanks(banks.map(bank => 
      bank.id === bankId ? { ...bank, words: bank.words.filter(w => w !== word) } : bank
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Manage Word Banks</DialogTitle>
          <DialogDescription>
            View and edit your word banks.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          <Accordion type="single" collapsible className="w-full">
            {banks.map((bank) => (
              <AccordionItem key={bank.id} value={bank.id}>
                <AccordionTrigger>
                  <div className="flex justify-between w-full pr-4">
                    <span>{bank.name}</span>
                    <div>
                      <Button variant="outline" size="sm" className="mr-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          const newName = prompt('Enter new name', bank.name);
                          if (newName) handleUpdateBank(bank.id, newName);
                        }}
                      >
                        Rename
                      </Button>
                      <Button variant="destructive" size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Are you sure you want to delete this bank?')) {
                            handleDeleteBank(bank.id);
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {bank.words.map((word, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span>{word}</span>
                        <Button variant="outline" size="sm"
                          onClick={() => handleDeleteWord(bank.id, word)}
                        >
                          Delete
                        </Button>
                      </div>
                    ))}
                    <div className="flex space-x-2 mt-4">
                      <Input placeholder="New word" id={`new-word-${bank.id}`} />
                      <Button onClick={() => {
                        const input = document.getElementById(`new-word-${bank.id}`) as HTMLInputElement;
                        if (input.value) {
                          handleAddWord(bank.id, input.value);
                          input.value = '';
                        }
                      }}>
                        Add Word
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </DialogContent>
    </Dialog>
  );
}
