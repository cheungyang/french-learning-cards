// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Flashcard } from './Flashcard';
import type { Card } from '../hooks/useFlashcards';

const mockCard: Card = {
  id: 'test-card-99',
  french_word: 'bonjour',
  english_translation: 'hello',
  gender: null,
  part_of_speech: 'phrase',
  example_sentence_fr: 'Bonjour le monde!',
};

class MockSpeechSynthesisUtterance {
  text: string;
  lang: string = '';
  constructor(text: string) {
    this.text = text;
  }
}

describe('Flashcard Component', () => {
  const speakMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('SpeechSynthesisUtterance', MockSpeechSynthesisUtterance);
    vi.stubGlobal('speechSynthesis', {
      speak: speakMock,
    });
    speakMock.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders front of flashcard with French word and speaker button', () => {
    render(<Flashcard card={mockCard} />);

    expect(screen.getByText('bonjour')).toBeDefined();
    expect(screen.getAllByTestId('speaker-icon')).toHaveLength(1);
  });

  it('flips the card when clicking the card body', () => {
    render(<Flashcard card={mockCard} />);

    const cardElement = screen.getByTestId('flashcard');
    expect(cardElement.className).not.toContain('flipped');

    const container = screen.getByTestId('flashcard-container');
    fireEvent.click(container);

    expect(cardElement.className).toContain('flipped');
    expect(screen.getByText('hello')).toBeDefined();
    expect(screen.getByText('phrase')).toBeDefined();
    expect(screen.getByText('Bonjour le monde!')).toBeDefined();

    // Clicking again flips it back
    fireEvent.click(container);
    expect(cardElement.className).not.toContain('flipped');
  });

  it('triggers speech synthesis with fr-FR voice and french_word when speaker icon is clicked', () => {
    render(<Flashcard card={mockCard} />);

    const speakerBtn = screen.getByTestId('speaker-icon');
    fireEvent.click(speakerBtn);

    expect(speakMock).toHaveBeenCalledTimes(1);
    const utterance = speakMock.mock.calls[0][0];
    expect(utterance.text).toBe('bonjour');
    expect(utterance.lang).toBe('fr-FR');
  });

  it('does not flip the card when clicking the speaker icon', () => {
    render(<Flashcard card={mockCard} />);

    const cardElement = screen.getByTestId('flashcard');
    expect(cardElement.className).not.toContain('flipped');

    const speakerBtn = screen.getByTestId('speaker-icon');
    fireEvent.click(speakerBtn);

    expect(cardElement.className).not.toContain('flipped');
  });
});
