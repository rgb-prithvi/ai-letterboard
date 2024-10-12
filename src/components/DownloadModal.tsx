"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { jsPDF } from "jspdf";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: { id: string; content: string } | null;
}

export function DownloadModal({ isOpen, onClose, document }: DownloadModalProps) {
  const [fileName, setFileName] = useState("");

  const handleDownload = () => {
    if (!document) return;

    const finalFileName = fileName || `document-${document.id}`;

    const pdf = new jsPDF();
    pdf.text(document.content, 10, 10);
    pdf.save(`${finalFileName}.pdf`);

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Download PDF</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fileName" className="text-right">
              File Name
            </Label>
            <Input
              id="fileName"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="col-span-3"
              placeholder="Enter file name"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleDownload}>Download PDF</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
