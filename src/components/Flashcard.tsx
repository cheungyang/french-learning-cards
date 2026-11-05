import React, { useState } from 'react';
import { Card } from '../hooks/useFlashcards';
import './Flashcard.css';

export interface FlashcardProps {
  card: Card;
}

export const Flashcard: React.FC<FlashcardProps> = ({ card }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleSpeakerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(card.french_word);
      utterance.lang = 'fr-FR';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div
      className="flashcard-container"
      onClick={handleCardClick}
      data-testid="flashcard-container"
    >
      <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} data-testid="flashcard">
        {/* Front */}
        <div className="flashcard-front" data-testid="flashcard-front">
          <button
            type="button"
            className="speaker-button"
            onClick={handleSpeakerClick}
            aria-label="Listen to pronunciation"
            data-testid="speaker-icon"
          >
            🔊
          </button>
          <div className="french-word">{card.french_word}</div>
        </div>

        {/* Back */}
        <div className="flashcard-back" data-testid="flashcard-back">
          <button
            type="button"
            className="speaker-button"
            onClick={handleSpeakerClick}
            aria-label="Listen to pronunciation"
            data-testid="speaker-icon-back"
          >
            🔊
          </button>
          <div className="english-translation">{card.english_translation}</div>
          <div className="part-of-speech">{card.part_of_speech}</div>
          {card.example_sentence_fr && (
            <div className="example-sentence">{card.example_sentence_fr}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
