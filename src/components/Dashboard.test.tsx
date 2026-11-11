// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Dashboard } from './Dashboard';
import type { Card } from '../hooks/useFlashcards';

const mockTestCards: Card[] = [
  {
    id: 'test-card-101',
    french_word: 'pomme',
    english_translation: 'apple',
    gender: 'f',
    part_of_speech: 'noun',
    example_sentence_fr: 'Je mange une pomme.',
  },
  {
    id: 'test-card-102',
    french_word: 'chat',
    english_translation: 'cat',
    gender: 'm',
    part_of_speech: 'noun',
    example_sentence_fr: 'Le chat dort sur le lit.',
  },
];

class MockSpeechSynthesisUtterance {
  text: string;
  lang: string = '';
  constructor(text: string) {
    this.text = text;
  }
}

describe('Dashboard Component', () => {
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

  it('renders Flashcard component with currentCard data when cards are available', () => {
    render(<Dashboard initialCards={mockTestCards} />);

    const dashboardContent = screen.getByTestId('dashboard-content');
    expect(dashboardContent).toBeDefined();

    const flashcard = screen.getByTestId('flashcard');
    expect(flashcard).toBeDefined();

    const nextBtn = screen.getByTestId('next-card-button');
    expect(nextBtn).toBeDefined();
    expect(nextBtn.textContent).toBe('Next Card');
  });

  it('invokes nextCard and advances card when Next Card button is clicked', () => {
    render(<Dashboard initialCards={mockTestCards} />);

    const initialWord = screen.getByTestId('flashcard-front').textContent;
    const nextBtn = screen.getByTestId('next-card-button');

    fireEvent.click(nextBtn);

    const nextWord = screen.getByTestId('flashcard-front').textContent;
    expect(nextWord).not.toBe(initialWord);
  });

  it('displays celebratory empty state with "You finished the deck!" and "Start Over" button when hasNext is false', () => {
    const singleCard: Card[] = [mockTestCards[0]];
    render(<Dashboard initialCards={singleCard} />);

    const nextBtn = screen.getByTestId('next-card-button');
    fireEvent.click(nextBtn);

    expect(screen.queryByTestId('flashcard')).toBeNull();
    expect(screen.getByText('You finished the deck!')).toBeDefined();
    expect(screen.getByTestId('start-over-button')).toBeDefined();
    expect(screen.getByTestId('start-over-button').textContent).toBe('Start Over');
  });

  it('resets the flashcards state when Start Over button is clicked', () => {
    const singleCard: Card[] = [mockTestCards[0]];
    render(<Dashboard initialCards={singleCard} />);

    // Advance past end
    fireEvent.click(screen.getByTestId('next-card-button'));
    expect(screen.getByText('You finished the deck!')).toBeDefined();

    // Click Start Over
    fireEvent.click(screen.getByTestId('start-over-button'));

    // Should return to displaying the flashcard and Next Card button
    expect(screen.getByTestId('flashcard')).toBeDefined();
    expect(screen.getByTestId('next-card-button')).toBeDefined();
  });

  it('renders empty state directly when initialCards is empty', () => {
    render(<Dashboard initialCards={[]} />);

    expect(screen.getByText('You finished the deck!')).toBeDefined();
    expect(screen.getByTestId('start-over-button')).toBeDefined();
  });
});
