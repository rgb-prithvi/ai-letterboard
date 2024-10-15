import { CommonWord } from "@/lib/types";

export const defaultSettings = {
  font: "inter",
  theme: "light",
  fontSize: 32,
  inputMode: "letter",
  buttonColor: "#ffffff",
  letterCase: "uppercase",
  textColor: "#000000",
  textToSpeech: true,
  keyboardDelay: 0,
  autoCompletion: true,
  keyboardLayout: "abcd",
};

export const commonWords: CommonWord[] = [
  { rank: "1", word: "I" },
  { rank: "2", word: "want" },
  { rank: "3", word: "to" },
  { rank: "4", word: "eat" },
  { rank: "5", word: "drink" },
  { rank: "6", word: "play" },
  { rank: "7", word: "help" },
  { rank: "8", word: "go" },
  { rank: "9", word: "come" },
  { rank: "10", word: "yes" },
  { rank: "11", word: "no" },
  { rank: "12", word: "please" },
  { rank: "13", word: "thank" },
  { rank: "14", word: "you" },
  { rank: "15", word: "more" },
  { rank: "16", word: "all" },
  { rank: "17", word: "done" },
  { rank: "18", word: "like" },
  { rank: "19", word: "love" },
  { rank: "20", word: "happy" },
  { rank: "21", word: "sad" },
  { rank: "22", word: "tired" },
  { rank: "23", word: "okay" },
  { rank: "24", word: "stop" },
  { rank: "25", word: "help" },
  { rank: "26", word: "need" },
  { rank: "27", word: "look" },
  { rank: "28", word: "see" },
  { rank: "29", word: "hear" },
  { rank: "30", word: "feel" },
];

export const ELEVENLABS_API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || "";
export const DEFAULT_VOICE_ID = "D4MpD0Mi4O2qLZb4h0eC";
