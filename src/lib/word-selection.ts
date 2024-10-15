import { commonWords } from "@/lib/constants";
import { supabase } from "./supabase";
import { Word, CommonWord } from "@/lib/types";

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
  limit: number = 20,
  numCommonWords: number = 10,
): string[] {
  const commonWordsList = commonWords
    .sort((a, b) => parseInt(a.rank) - parseInt(b.rank))
    .map((cw) => cw.word);

  // Add common words first
  let selectedWords: string[] = commonWordsList.slice(0, numCommonWords);

  // Add highlighted words
  const highlightedWords = wordBank.filter((w) => w.is_highlighted);
  selectedWords = selectedWords.concat(
    highlightedWords.slice(0, limit - selectedWords.length).map((w) => w.word),
  );

  // Add non-highlighted words if there's space left
  if (selectedWords.length < limit) {
    const nonHighlightedWords = wordBank.filter((w) => !w.is_highlighted);
    const remainingSlots = limit - selectedWords.length;
    selectedWords = selectedWords.concat(
      nonHighlightedWords.slice(0, remainingSlots).map((w) => w.word),
    );
  }

  return selectedWords.slice(0, limit);
}

export async function fetchAndGenerateWordBoard(
  limit: number = 20,
  numCommonWords: number = 10,
): Promise<string[]> {
  const wordBank = await fetchWordBank();
  return generateWordBoard(wordBank, limit, numCommonWords);
}

export async function fetchWordSet(): Promise<string[]> {
  const wordBank = await fetchWordBank();
  const allWords = wordBank.map((w) => w.word);

  // Combine custom words with common words
  const commonWordsList = getCommonWordsList();

  return Array.from(new Set([...allWords, ...commonWordsList]));
}
