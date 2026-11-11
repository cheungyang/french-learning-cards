import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFlashcards } from './useFlashcards';
import cardsData from '../data/cards.json';

describe('cards.json', () => {
  it('contains exactly 10 hardcoded card objects matching Card interface', () => {
    expect(cardsData).toHaveLength(10);
    cardsData.forEach((card) => {
      expect(card).toHaveProperty('id');
      expect(typeof card.id).toBe('string');
      expect(card).toHaveProperty('french_word');
      expect(typeof card.french_word).toBe('string');
      expect(card).toHaveProperty('english_translation');
      expect(typeof card.english_translation).toBe('string');
      expect(card).toHaveProperty('gender');
      expect(['m', 'f', null]).toContain(card.gender);
      expect(card).toHaveProperty('part_of_speech');
      expect(['noun', 'verb', 'adjective', 'phrase']).toContain(card.part_of_speech);
      expect(card).toHaveProperty('example_sentence_fr');
      expect(typeof card.example_sentence_fr).toBe('string');
    });
  });
});

describe('useFlashcards', () => {
  it('initializes currentCard to first item in randomized list and hasNext to true', () => {
    const { result } = renderHook(() => useFlashcards());
    expect(result.current.currentCard).not.toBeNull();
    expect(result.current.currentCard).toEqual(result.current.cards[0]);
    expect(result.current.hasNext).toBe(true);
    expect(result.current.cardsViewed).toBe(0);
  });

  it('updates currentCard to next item when nextCard is called', () => {
    const { result } = renderHook(() => useFlashcards());
    const firstCard = result.current.currentCard;
    const secondCardInList = result.current.cards[1];

    act(() => {
      result.current.nextCard();
    });

    expect(result.current.currentCard).not.toEqual(firstCard);
    expect(result.current.currentCard).toEqual(secondCardInList);
    expect(result.current.hasNext).toBe(true);
    expect(result.current.cardsViewed).toBe(1);
  });

  it('sets currentCard to null and hasNext to false when nextCard is called on the last card', () => {
    const { result } = renderHook(() => useFlashcards());
    const totalCards = result.current.cards.length;

    // Advance through all cards to reach the last card
    for (let i = 0; i < totalCards - 1; i++) {
      act(() => {
        result.current.nextCard();
      });
      expect(result.current.currentCard).toEqual(result.current.cards[i + 1]);
      expect(result.current.hasNext).toBe(true);
    }

    // Now on the last card (index totalCards - 1)
    expect(result.current.currentCard).toEqual(result.current.cards[totalCards - 1]);

    // Call nextCard on the last card
    act(() => {
      result.current.nextCard();
    });

    // hasNext becomes false and currentCard becomes null
    expect(result.current.hasNext).toBe(false);
    expect(result.current.currentCard).toBeNull();
    expect(result.current.cardsViewed).toBe(totalCards);
  });
});
