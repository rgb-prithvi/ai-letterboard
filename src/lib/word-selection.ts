import commonWords from "common-words";
import { supabase } from "./supabase";

type Word = {
  word: string;
  is_highlighted: boolean;
};

type CommonWord = {
  rank: string;
  word: string;
};

async function fetchWordBank(): Promise<Word[]> {
  const { data: bankWords, error } = await supabase
    .from("word_banks")
    .select(
      `
      id,
      words (
        id,
        word,
        is_highlighted
      )
    `,
    )
    .eq("is_selected", true)
    .single();

  if (error) {
    console.error("Error fetching word bank:", error);
    return [];
  }

  return bankWords.words;
}

function getCommonWordsList(): string[] {
  return (commonWords as CommonWord[])
    .sort((a, b) => parseInt(a.rank) - parseInt(b.rank))
    .map((cw) => cw.word);
}

function generateWordBoard(
  wordBank: Word[],
  limit: number = 30,
  numCommonWords: number = 8,
): string[] {
  const highlightedWords = wordBank.filter((w) => w.is_highlighted);
  const nonHighlightedWords = wordBank.filter((w) => !w.is_highlighted);

  // Prioritize highlighted words
  let selectedWords: string[] = highlightedWords.slice(0, limit).map((w) => w.word);

  // Add non-highlighted words if there's space left
  if (selectedWords.length < limit - numCommonWords) {
    const remainingSlots = limit - numCommonWords - selectedWords.length;
    selectedWords = selectedWords.concat(
      nonHighlightedWords.slice(0, remainingSlots).map((w) => w.word),
    );
  }

  const commonWordsList = getCommonWordsList();

  // Ensure at least 8 words from commonWords
  selectedWords = selectedWords.concat(commonWordsList.slice(0, numCommonWords));

  // Fill the remaining slots with common words if needed
  if (selectedWords.length < limit) {
    const remainingSlots = limit - selectedWords.length;
    selectedWords = selectedWords.concat(
      commonWordsList.slice(numCommonWords, numCommonWords + remainingSlots),
    );
  }

  return selectedWords.slice(0, limit);
}

export async function fetchAndGenerateWordBoard(
  limit: number = 30,
  numCommonWords: number = 8,
): Promise<string[]> {
  const wordBank = await fetchWordBank();
  return generateWordBoard(wordBank, limit, numCommonWords);
}

export async function fetchWordSet(): Promise<string[]> {
  const wordBank = await fetchWordBank();
  const allWords = wordBank.map(w => w.word);
  
  // Combine custom words with common words
  const commonWordsList = getCommonWordsList();

  return Array.from(new Set([...allWords, ...commonWordsList]));
}
