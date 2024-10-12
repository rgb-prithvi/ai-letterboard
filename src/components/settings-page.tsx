"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { CircleUser, Menu, Package2, Search } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
            {activeTab === "customization" && (
              <Card>
                <CardHeader>
                  <CardTitle>Customization Options</CardTitle>
                  <CardDescription>Customize your input experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Input Mode</Label>
                    <RadioGroup defaultValue="letter" className="flex">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="letter" id="letter" />
                        <Label htmlFor="letter">Letter Mode</Label>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <RadioGroupItem value="word" id="word" />
                        <Label htmlFor="word">Word Mode</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="text-to-speech">Text to speech</Label>
                    <Switch id="text-to-speech" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-completion">Auto Completion</Label>
                    <Switch id="auto-completion" />
                  </div>
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="text-color">Text Color</Label>
                    <Input id="text-color" type="color" className="h-10" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="button-color">Button Color</Label>
                    <Input id="button-color" type="color" className="h-10" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="keyboard-delay">Keyboard action delay (ms)</Label>
                    <Slider id="keyboard-delay" min={0} max={1000} step={10} defaultValue={[0]} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="font-size">Font Size (px)</Label>
                    <Slider id="font-size" min={8} max={32} step={1} defaultValue={[12]} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="keyboard-layout">Keyboard Layout</Label>
                    <Select>
                      <SelectTrigger id="keyboard-layout">
                        <SelectValue placeholder="Select layout" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="qwerty">QWERTY</SelectItem>
                        <SelectItem value="azerty">AZERTY</SelectItem>
                        <SelectItem value="dvorak">Dvorak</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="font">Font</Label>
                    <Select>
                      <SelectTrigger id="font">
                        <SelectValue placeholder="Select font" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="arial">Arial</SelectItem>
                        <SelectItem value="times-new-roman">Times New Roman</SelectItem>
                        <SelectItem value="courier-new">Courier New</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="letter-case">Letter Case</Label>
                    <Select>
                      <SelectTrigger id="letter-case">
                        <SelectValue placeholder="Select case" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lowercase">lowercase</SelectItem>
                        <SelectItem value="UPPERCASE">UPPERCASE</SelectItem>
                        <SelectItem value="Sentence case">Sentence case</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>
            )}
            {activeTab === "wordbanks" && (
              <Card>
                <CardHeader>
                  <CardTitle>Word Banks</CardTitle>
                  <CardDescription>Manage your word banks for autocomplete</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Current Word Banks</Label>
                    <Button>Add New</Button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span>Default</span>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="word-input">Add Words</Label>
                    <Textarea id="word-input" placeholder="Enter words separated by commas" />
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline">Upload Words</Button>
                    <Button>Generate with AI</Button>
                  </div>
                </CardContent>
              </Card>
            )}
            {activeTab === "history" && (
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
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
