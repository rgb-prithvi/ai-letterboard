import type { Metadata } from "next";
import "./globals.css";
import NextAuthProvider from "@/components/SessionProvider";
import { TopBarComponent as TopBar } from "@/components/top-bar";
import { CSPostHogProvider } from "@/lib/posthog-provider";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Letterboard",
  description: "AI-powered letterboard app",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: true,
    viewportFit: "cover",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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
