import { useState, useCallback } from 'react';
import cardsData from '../data/cards.json';

export interface Card {
  id: string;
  french_word: string;
  english_translation: string;
  gender: 'm' | 'f' | null;
  part_of_speech: 'noun' | 'verb' | 'adjective' | 'phrase';
  example_sentence_fr: string;
}

export function shuffleCards<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function useFlashcards(initialCards: Card[] = cardsData as unknown as Card[]) {
  const [cards] = useState<Card[]>(() => shuffleCards(initialCards));
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentCard = currentIndex < cards.length ? cards[currentIndex] : null;
  const hasNext = currentIndex < cards.length;

  const nextCard = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, cards.length));
  }, [cards.length]);

  return {
    currentCard,
    hasNext,
    nextCard,
    cards,
  };
}
