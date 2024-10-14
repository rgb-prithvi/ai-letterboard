import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
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
import { useToast } from "@/components/ui/use-toast";
import { DownloadModal } from "@/components/DownloadModal";
import { supabase } from "@/lib/supabase";

interface Document {
  id: string;
  content: string;
  timestamp: string;
}

export function HistoryDocumentsSection() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const { toast } = useToast();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.id) {
      fetchDocuments(session.user.id);
    }
  }, [session]);

  const fetchDocuments = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("interaction")
        .select(
          `
          interaction_id,
          content,
          timestamp,
          user_id
        `,
        )
        .eq("user_id", userId)
        .eq("type", "text_submit")
        .order("timestamp", { ascending: false });

      if (error) throw error;

      setDocuments(
        data?.map((item) => ({
          id: item.interaction_id,
          content: item.content,
          timestamp: item.timestamp,
        })) || [],
      );
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast({
        title: "Error",
        description: "Failed to fetch documents. Please try again.",
        variant: "destructive",
      });
    }
  };

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
    setSelectedDocument({
      id: "all",
      content: documents.map((d) => d.content).join("\n\n"),
      timestamp: new Date().toISOString(),
    });
    setIsDownloadModalOpen(true);
  };

  return (
    <Card>
      {session?.user?.id ? (
        <>
          <CardHeader>
            <CardTitle>History & Documents</CardTitle>
            <CardDescription>View and manage your completed messages</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-2 border rounded">
                <div className="flex flex-col">
                  <span className="truncate">{doc.content}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(doc.timestamp).toLocaleString()}
                  </span>
                </div>
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
          {/* <CardFooter>
            <Button variant="outline" onClick={handleDownloadAll}>
              Export All
            </Button>
          </CardFooter> */}
          <DownloadModal
            isOpen={isDownloadModalOpen}
            onClose={() => setIsDownloadModalOpen(false)}
            document={selectedDocument}
          />
        </>
      ) : (
        <CardContent>
          <p>Please sign in to view your documents.</p>
        </CardContent>
      )}
    </Card>
  );
}
