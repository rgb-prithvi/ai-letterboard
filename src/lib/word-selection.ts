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

  // Ensure at least 8 words from commonWords
  const commonWordsList = (commonWords as CommonWord[])
    .sort((a, b) => parseInt(a.rank) - parseInt(b.rank))
    .map((cw) => cw.word);
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

  const wordBank: Word[] = bankWords.words;

  return generateWordBoard(wordBank, limit, numCommonWords);
}
