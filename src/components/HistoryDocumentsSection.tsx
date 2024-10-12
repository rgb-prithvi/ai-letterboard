import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Copy, Download } from "lucide-react";
import { jsPDF } from "jspdf";
import { useToast } from "@/hooks/use-toast";
import { DownloadModal } from "@/components/DownloadModal";

interface Document {
  id: string;
  content: string;
}

export function HistoryDocumentsSection() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // TODO: Fetch documents from your data source (e.g., API or local storage)
    const fetchedDocuments = [
      { id: "1", content: "Sample text 1" },
      { id: "2", content: "Sample text 2" },
    ];
    setDocuments(fetchedDocuments);
  }, []);

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "The text has been copied to your clipboard.",
      });
    });
  };

  const handleDownload = (doc: Document) => {
    setSelectedDocument(doc);
    setIsDownloadModalOpen(true);
  };

  const handleDownloadAll = () => {
    setSelectedDocument({ id: "all", content: documents.map((d) => d.content).join("\n\n") });
    setIsDownloadModalOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>History & Documents</CardTitle>
        <CardDescription>View and manage your text snippets</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {documents.map((doc) => (
          <div key={doc.id} className="flex items-center justify-between p-2 border rounded">
            <span className="truncate">{doc.content}</span>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" onClick={() => copyToClipboard(doc.content)}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDownload(doc)}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={handleDownloadAll}>
          Export All
        </Button>
      </CardFooter>
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        document={selectedDocument}
      />
    </Card>
  );
}
