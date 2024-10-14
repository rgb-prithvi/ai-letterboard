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
  text: string;
  topicRelevance: number;
  frequency: number;
}
