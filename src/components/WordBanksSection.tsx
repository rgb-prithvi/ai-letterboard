import React, { useState, useEffect } from 'react';
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
import { CreateBankModal } from "./CreateBankModal";
import { ManageBanksModal } from "./ManageBanksModal";
import { supabase } from "@/lib/supabase";
import { getSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";

interface WordBank {
  id: number;
  name: string;
  words: string[];
}

export function WordBanksSection() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [wordBanks, setWordBanks] = useState<WordBank[]>([]);
  const [currentWordBank, setCurrentWordBank] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchWordBanks();
  }, []);

  const fetchWordBanks = async () => {
    const session = await getSession();
    if (session && session.user) {
      const { data, error } = await supabase
        .from("word_banks")
        .select("*")
        .eq("user_id", session.user.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch word banks. Please try again.",
          variant: "destructive",
        });
      } else if (data) {
        setWordBanks(data);
        if (data.length > 0 && !currentWordBank) {
          setCurrentWordBank(data[0].id);
        }
      }
    }
  };

  const handleCreateBank = async (name: string, words: string[]) => {
    const session = await getSession();
    if (session && session.user) {
      const { data, error } = await supabase
        .from("word_banks")
        .insert({ user_id: session.user.id, name, words })
        .select()
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create word bank. Please try again.",
          variant: "destructive",
        });
      } else if (data) {
        setWordBanks([...wordBanks, data]);
        toast({
          title: "Success",
          description: "Word bank created successfully.",
        });
      }
    }
  };

  const handleUpdateBank = async (id: number, name: string, words: string[]) => {
    const { data, error } = await supabase
      .from("word_banks")
      .update({ name, words })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update word bank. Please try again.",
        variant: "destructive",
      });
    } else if (data) {
      setWordBanks(wordBanks.map(bank => bank.id === id ? data : bank));
      toast({
        title: "Success",
        description: "Word bank updated successfully.",
      });
    }
  };

  const handleDeleteBank = async (id: number) => {
    const { error } = await supabase
      .from("word_banks")
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete word bank. Please try again.",
        variant: "destructive",
      });
    } else {
      setWordBanks(wordBanks.filter(bank => bank.id !== id));
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
    <Card>
      <CardHeader>
        <CardTitle>Word Banks</CardTitle>
        <CardDescription>Manage your word banks for autocomplete</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="word-bank-select">Select Word Bank</Label>
          <Select value={currentWordBank?.toString()} onValueChange={(value) => setCurrentWordBank(Number(value))}>
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
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setIsCreateModalOpen(true)}>Create New Bank</Button>
          <Button onClick={() => setIsManageModalOpen(true)}>Manage Banks</Button>
        </div>
      </CardContent>
      <CreateBankModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
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
