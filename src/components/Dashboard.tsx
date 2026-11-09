import { useState, type FC } from 'react';
import { useFlashcards, type Card } from '../hooks/useFlashcards';
import { Flashcard } from './Flashcard';

export interface DashboardProps {
  initialCards?: Card[];
}

interface DashboardContentProps {
  initialCards?: Card[];
  onStartOver: () => void;
}

const DashboardContent: FC<DashboardContentProps> = ({ initialCards, onStartOver }) => {
  const { currentCard, hasNext, nextCard } = useFlashcards(initialCards);

  if (!hasNext || !currentCard) {
    return (
      <div className="dashboard-empty-state" data-testid="dashboard-empty-state">
        <h2 className="empty-title">You finished the deck!</h2>
        <button
          type="button"
          className="start-over-button"
          onClick={onStartOver}
          data-testid="start-over-button"
        >
          Start Over
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-content" data-testid="dashboard-content">
      <Flashcard card={currentCard} />
      <div className="dashboard-actions">
        <button
          type="button"
          className="next-card-button"
          onClick={nextCard}
          data-testid="next-card-button"
        >
          Next Card
        </button>
      </div>
    </div>
  );
};

export const Dashboard: FC<DashboardProps> = ({ initialCards }) => {
  const [resetKey, setResetKey] = useState(0);

  const handleStartOver = () => {
    setResetKey((prev) => prev + 1);
  };

  return (
    <main className="dashboard-container" data-testid="dashboard-container">
      <DashboardContent
        key={resetKey}
        initialCards={initialCards}
        onStartOver={handleStartOver}
      />
    </main>
  );
};

export default Dashboard;
