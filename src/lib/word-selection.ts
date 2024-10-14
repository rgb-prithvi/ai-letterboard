import { Word } from "@/lib/types";
import commonWords from "common-words";

// Convert common words to our Word type and sort by rank
const COMMON_WORDS: Word[] = commonWords
  .map((item) => ({
    text: item.word,
    topicRelevance: 0,
    frequency: 1 / parseInt(item.rank), // Convert rank to a frequency-like value
  }))
  .sort((a, b) => b.frequency - a.frequency);

export function selectWords(wordBank: Word[], topicName: string, wordCount: number): Word[] {
  const topicWords = wordBank.filter((word) => word.topicRelevance > 0);
  const generalWords = wordBank.filter((word) => word.topicRelevance === 0);

  // Sort topic words by a combination of relevance and frequency
  const sortedTopicWords = topicWords.sort(
    (a, b) => b.topicRelevance * 2 + b.frequency - (a.topicRelevance * 2 + a.frequency),
  );

  // Sort general words by frequency
  const sortedGeneralWords = generalWords.sort((a, b) => b.frequency - a.frequency);

  const selectedWords: Word[] = [];
  const commonWordCount = Math.floor(wordCount * 0.3); // 30% of words are common

  // Add common words
  for (let i = 0; i < commonWordCount && i < COMMON_WORDS.length; i++) {
    selectedWords.push(COMMON_WORDS[i]);
  }

  // Calculate remaining slots for topic and general words
  const remainingSlots = wordCount - selectedWords.length;
  const topicWordCount = Math.min(Math.ceil(remainingSlots * 0.7), sortedTopicWords.length);
  const generalWordCount = remainingSlots - topicWordCount;

  // Add topic words
  for (let i = 0; i < topicWordCount; i++) {
    if (!selectedWords.some((word) => word.text === sortedTopicWords[i].text)) {
      selectedWords.push(sortedTopicWords[i]);
    }
  }

  // Add general words
  for (let i = 0; i < generalWordCount; i++) {
    if (!selectedWords.some((word) => word.text === sortedGeneralWords[i].text)) {
      selectedWords.push(sortedGeneralWords[i]);
    }
  }

  // If we still have empty slots, fill them with common words
  while (selectedWords.length < wordCount && selectedWords.length < COMMON_WORDS.length) {
    const nextCommonWord = COMMON_WORDS[selectedWords.length];
    if (!selectedWords.some((word) => word.text === nextCommonWord.text)) {
      selectedWords.push(nextCommonWord);
    }
  }

  return selectedWords;
}
