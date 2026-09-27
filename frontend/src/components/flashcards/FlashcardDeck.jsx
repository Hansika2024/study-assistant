import { useState } from "react";
import Flashcard from "./Flashcard";

export default function FlashcardDeck({
  flashcards,
  onRestart,
}) {
  const [deck, setDeck] = useState(flashcards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState([]);
  const [missedCards, setMissedCards] = useState([]);
  const [showResult, setShowResult] = useState(false);

  const currentCard = deck.cards[currentIndex];

  const progress =
    ((currentIndex + 1) / deck.cards.length) * 100;

  const handleFlip = () => {
    setIsFlipped((previous) => !previous);
  };

  const handleRating = (known) => {
    if (known) {
      setKnownCards((previous) => [
        ...previous,
        currentIndex,
      ]);
    } else {
      setMissedCards((previous) => [
        ...previous,
        currentIndex,
      ]);
    }

    const nextIndex = currentIndex + 1;

    if (nextIndex >= deck.cards.length) {
      setShowResult(true);
      return;
    }

    setCurrentIndex(nextIndex);
    setIsFlipped(false);
  };

  const handleRestart = () => {
    setDeck(flashcards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownCards([]);
    setMissedCards([]);
    setShowResult(false);
  };

  const handleReviewMissed = () => {
    const missed = missedCards.map(
      (index) => deck.cards[index]
    );

    if (missed.length === 0) {
      return;
    }

    setDeck({
      ...deck,
      cards: missed,
    });

    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownCards([]);
    setMissedCards([]);
    setShowResult(false);
  };

  if (showResult) {
    return (
      <section
        className="result-card result-summary"
        aria-live="polite"
      >
        <h2>Flashcards Complete</h2>

        <p className="score">
          {knownCards.length}/{deck.cards.length}
        </p>

        <p>
          You knew {knownCards.length} of{" "}
          {deck.cards.length} cards.
        </p>

        <p>
          Missed: {missedCards.length}
        </p>

        {missedCards.length > 0 && (
          <button
            type="button"
            className="primary-button"
            onClick={handleReviewMissed}
          >
            Review Missed Cards
          </button>
        )}

        <div className="quiz-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={handleRestart}
          >
            Start Again
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={onRestart}
          >
            Exit Flashcards
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="result-card">
      <div className="quiz-header">
        <h2>{deck.title}</h2>

        <span>
          Card {currentIndex + 1} of{" "}
          {deck.cards.length}
        </span>
      </div>

      <div
        className="flashcard-progress"
        aria-label={`Card ${
          currentIndex + 1
        } of ${deck.cards.length}`}
      >
        <div className="quiz-progress">
          <div
            className="quiz-progress-bar"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      <Flashcard
        card={currentCard}
        isFlipped={isFlipped}
        onFlip={handleFlip}
      />

      {isFlipped && (
        <div
          className="flashcard-actions"
          aria-live="polite"
        >
          <button
            type="button"
            className="know-button"
            onClick={() => handleRating(true)}
          >
            I Know This
          </button>

          <button
            type="button"
            className="missed-button"
            onClick={() => handleRating(false)}
          >
            I Didn't Know
          </button>
        </div>
      )}

      <button
        type="button"
        className="secondary-button exit-button"
        onClick={onRestart}
      >
        Exit Flashcards
      </button>
    </section>
  );
}