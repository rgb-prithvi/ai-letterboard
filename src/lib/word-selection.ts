import { Word } from "@/lib/types";
import commonWords from "common-words";

const TOTAL_WORD_COUNT = 30;
const COMMON_WORD_PROPORTION = 0.3; // 30% common words

interface CommonWord {
  word: string;
  rank: number;
}

export function selectWords(wordBank: Word[] | undefined, topic: string): Word[] {
  const selectedWords: Word[] = [];
  const commonWordCount = Math.round(TOTAL_WORD_COUNT * COMMON_WORD_PROPORTION);
  const wordBankCount = TOTAL_WORD_COUNT - commonWordCount;

  // Step 1: Add words from the word bank
  if (wordBank && wordBank.length > 0) {
    const sortedWordBank = wordBank.sort((a, b) => {
      if (a.isHighlighted && !b.isHighlighted) return -1;
      if (!a.isHighlighted && b.isHighlighted) return 1;
      return 0; // Maintain original order if both are highlighted or not highlighted
    });

    const selectedBankWords = sortedWordBank.slice(0, wordBankCount);
    selectedWords.push(...selectedBankWords);
  }

  // Step 2: Add common words
  const availableCommonWords = commonWords.filter(
    (cw: CommonWord) =>
      !selectedWords.some((sw) => sw.text.toLowerCase() === cw.word.toLowerCase()),
  );

  const selectedCommonWords = availableCommonWords
    .slice(0, TOTAL_WORD_COUNT - selectedWords.length)
    .map((cw: CommonWord) => ({
      text: cw.word,
      isCommon: true,
      rank: cw.rank,
    }));

  selectedWords.push(...selectedCommonWords);

  // Step 3: If we still have space and words in the bank, add more words from the word bank
  if (selectedWords.length < TOTAL_WORD_COUNT && wordBank && wordBank.length > 0) {
    const remainingBankWords = wordBank.slice(wordBankCount)
      .filter((w) => !selectedWords.some((sw) => sw.text.toLowerCase() === w.text.toLowerCase()));

    const additionalBankWords = remainingBankWords.slice(
      0,
      TOTAL_WORD_COUNT - selectedWords.length,
    );
    selectedWords.push(...additionalBankWords);
  }

  // Shuffle the selected words to mix common words and word bank words
  return shuffleArray(selectedWords);
}

function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
