"use client";

import { usePathname, useRouter } from "next/navigation";
import { LogOut, Settings, Keyboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { signOut } from "next-auth/react";

export function TopBarComponent() {
  const { toast } = useToast();
  const pathname = usePathname();
  const router = useRouter();

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
    <div className="w-full h-14 bg-gray-100 border-b flex items-center justify-between px-4">
      <div className="text-xl font-semibold">Prithvi</div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={handleIconClick}>
          {pathname === "/" ? <Settings className="h-5 w-5" /> : <Keyboard className="h-5 w-5" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={handleSignOut}>
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
