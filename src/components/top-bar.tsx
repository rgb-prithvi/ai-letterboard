"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Settings, Keyboard, BookOpen, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { signOut } from "next-auth/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { WordBanksSection } from "@/components/WordBanksSection";
import { CustomizationOptions } from "@/components/customization-options";

export function TopBarComponent() {
  const { toast } = useToast();
  const pathname = usePathname();
  const router = useRouter();
  const [isWordBanksOpen, setIsWordBanksOpen] = useState(false);
  const [isUserSettingsOpen, setIsUserSettingsOpen] = useState(false);

  const handleSignOut = () => {
    signOut();
    toast({
      description: "You have been signed out.",
    });
  };

  const handleIconClick = () => {
    if (pathname === "/") {
      router.push("/settings");
    } else if (pathname === "/settings") {
      router.push("/");
    }
  };

  return (
    <>
      <div className="w-full h-14 bg-gray-100 border-b flex items-center justify-between px-4">
        <div className="text-xl font-semibold">Prithvi</div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => setIsWordBanksOpen(true)}>
            <BookOpen className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsUserSettingsOpen(true)}>
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleIconClick}>
            {pathname === "/" ? <Settings className="h-5 w-5" /> : <Keyboard className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={handleSignOut}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <Dialog open={isWordBanksOpen} onOpenChange={setIsWordBanksOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Word Banks</DialogTitle>
          </DialogHeader>
          <WordBanksSection />
        </DialogContent>
      </Dialog>

      <Dialog open={isUserSettingsOpen} onOpenChange={setIsUserSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Settings</DialogTitle>
          </DialogHeader>
          <CustomizationOptions />
        </DialogContent>
      </Dialog>
    </>
  );
}
