"use client";

import { useState, useEffect } from "react";
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
import { supabase } from "@/lib/supabase";
import { getSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { UserSettings } from "@/lib/types";
import { defaultSettings } from "@/lib/constants";
import { fontOptions } from "@/lib/fonts";

// Add this function at the top of the file, outside of the component
async function fetchGoogleFonts() {
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_FONTS_API_KEY;
  const response = await fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${API_KEY}`);
  const data = await response.json();
  return data.items.map((font: any) => ({
    family: font.family,
    variants: font.variants,
    files: font.files,
  }));
}

export function CustomizationOptions() {
  const [userSettings, setUserSettings] = useState<UserSettings>({
    theme: "light",
    inputMode: "letter",
    textToSpeech: false,
    autoCompletion: false,
    textColor: "#000000",
    buttonColor: "#000000",
    keyboardDelay: 0,
    fontSize: 18,
    keyboardLayout: "QWERTY",
    font: "inter", // Set default font to 'inter'
    letterCase: "lowercase",
  });

  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserSettings();
  }, []);

  const fetchUserSettings = async () => {
    const session = await getSession();
    if (session && session.user) {
      const { data, error } = await supabase
        .from("app_user")
        .select("settings")
        .eq("user_id", session.user.id)
        .single();

      setUserSettings(data?.settings || {});
    }
  };

  const updateSetting = (key: keyof UserSettings, value: any) => {
    setUserSettings((prev) => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    setIsSaving(true);
    const session = await getSession();
    if (session && session.user) {
      try {
        await supabase
          .from("app_user")
          .update({ settings: userSettings })
          .eq("user_id", session.user.id);

        toast({
          title: "Settings saved",
          description: "Your customization options have been updated.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to save settings. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSaving(false);
      }
    }
  };

  const resetToDefault = async () => {
    setIsSaving(true);
    const session = await getSession();
    if (session && session.user) {
      try {
        await supabase
          .from("app_user")
          .update({ settings: defaultSettings })
          .eq("user_id", session.user.id);

        setUserSettings(defaultSettings);

        toast({
          title: "Settings reset",
          description: "Your customization options have been reset to default.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to reset settings. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Customization Options</CardTitle>
        <CardDescription>Customize your input experience</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Input Mode</Label>
          <RadioGroup
            value={userSettings.inputMode}
            onValueChange={(value) => updateSetting("inputMode", value)}
            className="flex space-x-4"
          >
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
          <Switch
            id="text-to-speech"
            checked={userSettings.textToSpeech}
            onCheckedChange={(value) => updateSetting("textToSpeech", value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="auto-completion">Auto Completion</Label>
          <Switch
            id="auto-completion"
            checked={userSettings.autoCompletion}
            onCheckedChange={(value) => updateSetting("autoCompletion", value)}
          />
        </div>

        {/* <div className="space-y-2">
          <Label>Theme</Label>
          <div className="flex space-x-2">
            <Button
              variant={userSettings.theme === "light" ? "default" : "outline"}
              size="icon"
              onClick={() => updateSetting("theme", "light")}
            >
              <Sun className="h-4 w-4" />
            </Button>
            <Button
              variant={userSettings.theme === "dark" ? "default" : "outline"}
              size="icon"
              onClick={() => updateSetting("theme", "dark")}
            >
              <Moon className="h-4 w-4" />
            </Button>
          </div>
        </div> */}

        <div className="space-y-2">
          <Label htmlFor="text-color">Text Color</Label>
          <Input
            id="text-color"
            type="color"
            value={userSettings.textColor}
            onChange={(e) => updateSetting("textColor", e.target.value)}
            className="h-10 w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="button-color">Button Color</Label>
          <Input
            id="button-color"
            type="color"
            value={userSettings.buttonColor}
            onChange={(e) => updateSetting("buttonColor", e.target.value)}
            className="h-10 w-full"
          />
        </div>

        {/* <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="keyboard-delay">Keyboard action delay (ms)</Label>
            <span className="text-sm text-muted-foreground">{userSettings.keyboardDelay}ms</span>
          </div>
          <Slider
            id="keyboard-delay"
            min={0}
            max={1000}
            step={10}
            value={[userSettings.keyboardDelay]}
            onValueChange={(value) => updateSetting("keyboardDelay", value[0])}
            className="w-full"
          />
        </div> */}

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="font-size">Font Size (px)</Label>
            <span className="text-sm text-muted-foreground">{userSettings.fontSize}px</span>
          </div>
          <Slider
            id="font-size"
            min={12}
            max={48}
            step={1}
            value={[userSettings.fontSize]}
            onValueChange={(value) => updateSetting("fontSize", value[0])}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="keyboard-layout">Keyboard Layout</Label>
          <Select
            value={userSettings.keyboardLayout}
            onValueChange={(value) => updateSetting("keyboardLayout", value)}
          >
            <SelectTrigger id="keyboard-layout">
              <SelectValue placeholder="Select layout" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="qwerty">QWERTY</SelectItem>
              <SelectItem value="abcd">ABCD</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="font">Font</Label>
          <Select value={userSettings.font} onValueChange={(value) => updateSetting("font", value)}>
            <SelectTrigger id="font">
              <SelectValue placeholder="Select font" />
            </SelectTrigger>
            <SelectContent>
              {fontOptions.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  {font.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="letter-case">Letter Case</Label>
          <Select
            value={userSettings.letterCase}
            onValueChange={(value) => updateSetting("letterCase", value)}
          >
            <SelectTrigger id="letter-case">
              <SelectValue placeholder="Select case" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lowercase">lowercase</SelectItem>
              <SelectItem value="uppercase">UPPERCASE</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={resetToDefault} disabled={isSaving}>
          Reset to Default
        </Button>
        <Button onClick={saveSettings} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
}
