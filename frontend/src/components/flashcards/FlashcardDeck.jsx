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
      <section>
        <h2>Flashcards Complete</h2>

        <p>Known: {knownCards.length}</p>
        <p>Missed: {missedCards.length}</p>

        {missedCards.length > 0 && (
          <button
            type="button"
            onClick={handleReviewMissed}
          >
            Review Missed Cards
          </button>
        )}

        <button
          type="button"
          onClick={handleRestart}
        >
          Start Again
        </button>

        <button
          type="button"
          onClick={onRestart}
        >
          Exit Flashcards
        </button>
      </section>
    );
  }

  return (
    <section>
      <h2>{deck.title}</h2>

      <p>
        Card {currentIndex + 1} of {deck.cards.length}
      </p>

      <Flashcard
        card={currentCard}
        isFlipped={isFlipped}
        onFlip={handleFlip}
      />

      {isFlipped && (
        <div>
          <button
            type="button"
            onClick={() => handleRating(true)}
          >
            I Know This
          </button>

          <button
            type="button"
            onClick={() => handleRating(false)}
          >
            I Didn't Know
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={onRestart}
      >
        Exit Flashcards
      </button>
    </section>
  );
}