export interface UserSettings {
  theme: "light" | "dark";
  inputMode: "letter" | "word";
  textToSpeech: boolean;
  autoCompletion: boolean;
  textColor: string;
  buttonColor: string;
  keyboardDelay: number;
  fontSize: number;
  keyboardLayout: string;
  font: string;
  letterCase: string;
}

export interface Word {
  word: string;
  is_highlighted: boolean;
}

export interface WordBank {
  id: number;
  name: string;
  words: Word[];
}

export type CommonWord = {
  rank: string;
  word: string;
};
