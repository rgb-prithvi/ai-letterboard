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
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0"
      />
      <body className="flex flex-col h-full">
        <NextAuthProvider>
          <CSPostHogProvider>
            <TopBar />
            {children}
          </CSPostHogProvider>
        </NextAuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
