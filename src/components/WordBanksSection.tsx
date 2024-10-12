import React, { useState } from 'react';
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

export function WordBanksSection() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Word Banks</CardTitle>
        <CardDescription>Manage your word banks for autocomplete</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="word-bank-select">Select Word Bank</Label>
          <Select>
            <SelectTrigger id="word-bank-select">
              <SelectValue placeholder="Choose a word bank" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="medical">Medical Terms</SelectItem>
              <SelectItem value="legal">Legal Terms</SelectItem>
              <SelectItem value="tech">Tech Jargon</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setIsCreateModalOpen(true)}>Create New Bank</Button>
          <Button onClick={() => setIsManageModalOpen(true)}>Manage Banks</Button>
        </div>
      </CardContent>
      <CreateBankModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      <ManageBanksModal isOpen={isManageModalOpen} onClose={() => setIsManageModalOpen(false)} />
    </Card>
  );
}
