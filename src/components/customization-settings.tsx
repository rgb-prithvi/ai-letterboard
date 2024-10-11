'use client'

import { useState } from "react"
import { Moon, Sun } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function CustomizationSettingsComponent() {
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [textColor, setTextColor] = useState("#000000")
  const [buttonColor, setButtonColor] = useState("#ffffff")
  const [keyboardDelay, setKeyboardDelay] = useState(0)
  const [fontSize, setFontSize] = useState(12)
  const [inputMode, setInputMode] = useState<"letter" | "word">("letter")

  return (
    <div className="space-y-6 p-4">
      <div className="space-y-2 mb-6">
        <Label>Input Mode</Label>
        <ToggleGroup type="single" value={inputMode} onValueChange={(value) => setInputMode(value as "letter" | "word")}>
          <ToggleGroupItem value="letter" aria-label="Toggle letter mode">
            Letter Mode
          </ToggleGroupItem>
          <ToggleGroupItem value="word" aria-label="Toggle word mode">
            Word Mode
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="text-to-speech">Text to speech</Label>
          <Switch id="text-to-speech" />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="auto-completion">Auto Completion</Label>
          <Switch id="auto-completion" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Theme</Label>
        <div className="flex space-x-2">
          <button
            className={`p-2 rounded-md ${theme === "light" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => setTheme("light")}
          >
            <Sun className="h-5 w-5" />
          </button>
          <button
            className={`p-2 rounded-md ${theme === "dark" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => setTheme("dark")}
          >
            <Moon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="text-color">Text Color</Label>
        <Input
          id="text-color"
          type="color"
          value={textColor}
          onChange={(e) => setTextColor(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="button-color">Button Color</Label>
        <Input
          id="button-color"
          type="color"
          value={buttonColor}
          onChange={(e) => setButtonColor(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="keyboard-delay">Keyboard action delay (ms)</Label>
        <Slider
          id="keyboard-delay"
          min={0}
          max={500}
          step={10}
          value={[keyboardDelay]}
          onValueChange={(value) => setKeyboardDelay(value[0])}
        />
        <div className="text-right text-sm text-gray-500">{keyboardDelay}ms</div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="font-size">Font Size (px)</Label>
        <Slider
          id="font-size"
          min={8}
          max={24}
          step={1}
          value={[fontSize]}
          onValueChange={(value) => setFontSize(value[0])}
        />
        <div className="text-right text-sm text-gray-500">{fontSize}px</div>
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
            <SelectItem value="courier">Courier</SelectItem>
            <SelectItem value="arial">Arial</SelectItem>
            <SelectItem value="times">Times New Roman</SelectItem>
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
            <SelectItem value="uppercase">Uppercase</SelectItem>
            <SelectItem value="lowercase">Lowercase</SelectItem>
            <SelectItem value="titlecase">Title Case</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}