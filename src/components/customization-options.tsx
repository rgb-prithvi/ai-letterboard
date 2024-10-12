"use client";

import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

export function CustomizationOptions() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [keyboardDelay, setKeyboardDelay] = useState(0);
  const [fontSize, setFontSize] = useState(18);

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Customization Options</CardTitle>
        <CardDescription>Customize your input experience</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Input Mode</Label>
          <RadioGroup defaultValue="letter" className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="letter" id="letter" />
              <Label htmlFor="letter">Letter Mode</Label>
            </div>
            <div className="flex items-center space-x-2">
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
          <div className="flex space-x-2">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              size="icon"
              onClick={() => setTheme("light")}
            >
              <Sun className="h-4 w-4" />
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              size="icon"
              onClick={() => setTheme("dark")}
            >
              <Moon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="text-color">Text Color</Label>
          <Input id="text-color" type="color" className="h-10 w-full" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="button-color">Button Color</Label>
          <Input id="button-color" type="color" className="h-10 w-full" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="keyboard-delay">Keyboard action delay (ms)</Label>
            <span className="text-sm text-muted-foreground">{keyboardDelay}ms</span>
          </div>
          <Slider
            id="keyboard-delay"
            min={0}
            max={1000}
            step={10}
            value={[keyboardDelay]}
            onValueChange={(value) => setKeyboardDelay(value[0])}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="font-size">Font Size (px)</Label>
            <span className="text-sm text-muted-foreground">{fontSize}px</span>
          </div>
          <Slider
            id="font-size"
            min={8}
            max={32}
            step={1}
            value={[fontSize]}
            onValueChange={(value) => setFontSize(value[0])}
            className="w-full"
          />
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
        <Button className="w-full">Save Changes</Button>
      </CardFooter>
    </Card>
  );
}
