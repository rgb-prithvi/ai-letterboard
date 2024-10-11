"use client"

import { useState } from "react"
import { History, User, Moon, Sun, Volume2, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { CustomizationSettingsComponent } from "./customization-settings"

export function TopBarComponent() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const { toast } = useToast()

  const historyItems = [
    "I want to drive",
    "Show me the weather",
    "What's the capital of France?",
    "How do I make pasta?",
    "Tell me a joke",
  ]

  const handleSignOut = () => {
    // Implement sign out logic here
    toast({
      description: "You have been signed out.",
    })
  }

  return (
    <>
      <div className="w-full h-14 bg-gray-100 border-b flex items-center justify-between px-4">
        <div className="text-xl font-semibold">Prithvi</div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => setIsHistoryOpen(true)}>
            <History className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(true)}>
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleSignOut}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          <CustomizationSettingsComponent />
        </DialogContent>
      </Dialog>

      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white" style={{ backgroundColor: "white" }}>
          <DialogHeader>
            <DialogTitle>History</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            <div className="space-y-2">
              {historyItems.map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start text-left font-normal"
                  onClick={() => {
                    navigator.clipboard.writeText(item);
                    toast({
                      description: "Copied to clipboard",
                    })
                  }}
                >
                  {item}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
}