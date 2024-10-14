import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateBankModal } from "@/components/CreateBankModal";
import { ManageBanksModal } from "@/components/ManageBanksModal";
import { GenerateBankModal } from "@/components/GenerateBankModal";
import { supabase } from "@/lib/supabase";
import { getSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { Word, WordBank } from "@/lib/types";

export function WordBanksSection() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [wordBanks, setWordBanks] = useState<WordBank[]>([]);
  const [currentWordBank, setCurrentWordBank] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchWordBanks();
  }, []);

  const fetchWordBanks = async () => {
    const session = await getSession();
    if (session && session.user) {
      const { data: banks, error: banksError } = await supabase
        .from("word_banks")
        .select("*")
        .eq("user_id", session.user.id);

      if (banksError) {
        toast({
          title: "Error",
          description: "Failed to fetch word banks. Please try again.",
          variant: "destructive",
        });
        return;
      }

      const { data: words, error: wordsError } = await supabase
        .from("words")
        .select("*")
        .in(
          "word_bank_id",
          banks.map((bank) => bank.id),
        );

      if (wordsError) {
        toast({
          title: "Error",
          description: "Failed to fetch words. Please try again.",
          variant: "destructive",
        });
        return;
      }

      const wordBanksWithWords = banks.map((bank) => ({
        ...bank,
        words: words.filter((word) => word.word_bank_id === bank.id),
      }));

      setWordBanks(wordBanksWithWords);
      if (wordBanksWithWords.length > 0 && !currentWordBank) {
        setCurrentWordBank(wordBanksWithWords[0].id);
      }
    }
  };

  const handleCreateBank = async (name: string, words: Word[]) => {
    const session = await getSession();
    if (session && session.user) {
      const { data: bank, error: bankError } = await supabase
        .from("word_banks")
        .insert({ user_id: session.user.id, name })
        .select()
        .single();

      if (bankError) {
        toast({
          title: "Error",
          description: "Failed to create word bank. Please try again.",
          variant: "destructive",
        });
        return;
      }

      const wordsToInsert = words.map(({ word, is_highlighted }) => ({
        word_bank_id: bank.id,
        word,
        is_highlighted,
      }));

      const { data: insertedWords, error: wordsError } = await supabase
        .from("words")
        .insert(wordsToInsert)
        .select();

      if (wordsError) {
        toast({
          title: "Error",
          description: "Failed to add words to the bank. Please try again.",
          variant: "destructive",
        });
        return;
      }

      const newBank = { ...bank, words: insertedWords };
      setWordBanks([...wordBanks, newBank]);
      toast({
        title: "Success",
        description: "Word bank created successfully.",
      });
    }
  };

  const handleUpdateBank = async (id: number, name: string, words: Word[]) => {
    const { data: updatedBank, error: bankError } = await supabase
      .from("word_banks")
      .update({ name })
      .eq("id", id)
      .select()
      .single();

    if (bankError) {
      toast({
        title: "Error",
        description: "Failed to update word bank. Please try again.",
        variant: "destructive",
      });
      return;
    }

    const { error: deleteError } = await supabase.from("words").delete().eq("word_bank_id", id);

    if (deleteError) {
      toast({
        title: "Error",
        description: "Failed to update words. Please try again.",
        variant: "destructive",
      });
      return;
    }

    const wordsToInsert = words.map(({ word, is_highlighted }) => ({
      word_bank_id: id,
      word,
      is_highlighted,
    }));

    const { data: insertedWords, error: insertError } = await supabase
      .from("words")
      .insert(wordsToInsert)
      .select();

    if (insertError) {
      toast({
        title: "Error",
        description: "Failed to update words. Please try again.",
        variant: "destructive",
      });
      return;
    }

    const updatedBankWithWords = { ...updatedBank, words: insertedWords };
    setWordBanks(wordBanks.map((bank) => (bank.id === id ? updatedBankWithWords : bank)));
    toast({
      title: "Success",
      description: "Word bank updated successfully.",
    });
  };

  const handleDeleteBank = async (id: number) => {
    const { error } = await supabase.from("word_banks").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete word bank. Please try again.",
        variant: "destructive",
      });
    } else {
      setWordBanks(wordBanks.filter((bank) => bank.id !== id));
      if (currentWordBank === id) {
        setCurrentWordBank(wordBanks[0]?.id || null);
      }
      toast({
        title: "Success",
        description: "Word bank deleted successfully.",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Word Banks</CardTitle>
        <CardDescription>Manage your word banks for autocomplete</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="word-bank-select">Select Word Bank</Label>
          <Select
            value={currentWordBank?.toString()}
            onValueChange={(value) => setCurrentWordBank(Number(value))}
          >
            <SelectTrigger id="word-bank-select">
              <SelectValue placeholder="Choose a word bank" />
            </SelectTrigger>
            <SelectContent>
              {wordBanks.map((bank) => (
                <SelectItem key={bank.id} value={bank.id.toString()}>
                  {bank.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex-1 mr-2"
          >
            Create New
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsGenerateModalOpen(true)}
            className="flex-1 mr-2"
          >
            Generate with AI
          </Button>
          <Button
            size="sm"
            onClick={() => setIsManageModalOpen(true)}
            className="flex-1"
          >
            Manage Banks
          </Button>
        </div>
      </CardContent>
      <CreateBankModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateBank={handleCreateBank}
      />
      <GenerateBankModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        onCreateBank={handleCreateBank}
      />
      <ManageBanksModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        wordBanks={wordBanks}
        onUpdateBank={handleUpdateBank}
        onDeleteBank={handleDeleteBank}
      />
    </Card>
  );
}
