export default function Flashcard({
  card,
  isFlipped,
  onFlip,
}) {
  return (
    <button
      type="button"
      className="flashcard"
      onClick={onFlip}
      aria-label={
        isFlipped
          ? "Flashcard answer. Click to show the question."
          : "Flashcard question. Click to reveal the answer."
      }
    >
      <div className="flashcard-content">
        {!isFlipped ? (
          <>
            <h3>Question</h3>
            <p>{card.question}</p>
            <small>
              Click the card to reveal the answer
            </small>
          </>
        ) : (
          <>
            <h3>Answer</h3>
            <p>{card.answer}</p>
            <small>
              Choose whether you knew this answer
            </small>
          </>
        )}
      </div>
    </button>
  );
}