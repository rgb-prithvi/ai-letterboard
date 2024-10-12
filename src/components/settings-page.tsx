"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

import { CustomizationOptions } from "./customization-options";
import { WordBanksSection } from "./WordBanksSection";
import { HistoryDocumentsSection } from "./HistoryDocumentsSection";

export function SettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("customization");

  // If there's no session, we shouldn't render the settings page
  if (!session) {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold">Settings</h1>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <nav className="grid gap-4 text-sm text-muted-foreground">
            <Link
              href="#"
              className={`font-semibold ${activeTab === "customization" ? "text-primary" : ""}`}
              onClick={() => setActiveTab("customization")}
            >
              Customization
            </Link>
            <Link
              href="#"
              className={`font-semibold ${activeTab === "wordbanks" ? "text-primary" : ""}`}
              onClick={() => setActiveTab("wordbanks")}
            >
              Word Banks
            </Link>
            <Link
              href="#"
              className={`font-semibold ${activeTab === "history" ? "text-primary" : ""}`}
              onClick={() => setActiveTab("history")}
            >
              History & Documents
            </Link>
          </nav>
          <div className="grid gap-6">
            {activeTab === "customization" && <CustomizationOptions />}
            {activeTab === "wordbanks" && <WordBanksSection />}
            {activeTab === "history" && <HistoryDocumentsSection />}
          </div>
        </div>
      </main>
    </div>
  );
}
