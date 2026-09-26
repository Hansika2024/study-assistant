export default function Flashcard({
  card,
  isFlipped,
  onFlip,
}) {
  return (
    <div>
      {!isFlipped ? (
        <>
          <h3>{card.question}</h3>

          <button
            type="button"
            onClick={onFlip}
          >
            Show Answer
          </button>
        </>
      ) : (
        <>
          <h3>Answer</h3>

          <p>{card.answer}</p>

          <button
            type="button"
            onClick={onFlip}
          >
            Show Question
          </button>
        </>
      )}
    </div>
  );
}