import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export function HistoryDocumentsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>History & Documents</CardTitle>
        <CardDescription>View and manage your text snippets</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-2 border rounded">
          <span className="truncate">Sample text 1</span>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              Copy
            </Button>
            <Button variant="outline" size="sm">
              Export
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between p-2 border rounded">
          <span className="truncate">Sample text 2</span>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              Copy
            </Button>
            <Button variant="outline" size="sm">
              Export
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline">Export All</Button>
      </CardFooter>
    </Card>
  );
}
