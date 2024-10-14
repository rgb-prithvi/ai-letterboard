import type { Metadata } from "next";
import "./globals.css";
import NextAuthProvider from "@/components/SessionProvider";
import { TopBarComponent as TopBar } from "@/components/top-bar";
import { CSPostHogProvider } from "@/lib/posthog-provider";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Letterboard",
  description: "AI-powered letterboard app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="flex flex-col h-full">
        <NextAuthProvider>
          <CSPostHogProvider>
            <TopBar />
            <main className="flex-1 overflow-hidden">{children}</main>
          </CSPostHogProvider>
        </NextAuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
