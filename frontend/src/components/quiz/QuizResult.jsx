export default function QuizResult({
  score,
  total,
  wrongQuestions,
  onRetry,
  onReviewWrong,
}) {
  return (
    <section>
      <h2>Quiz Complete</h2>

      <p>
        Score: {score} / {total}
      </p>

      <p>
        {total > 0
          ? `${Math.round((score / total) * 100)}%`
          : "0%"}
      </p>

      {wrongQuestions.length > 0 && (
        <button
          type="button"
          onClick={onReviewWrong}
        >
          Review Wrong Answers
        </button>
      )}

      <button
        type="button"
        onClick={onRetry}
      >
        Retry Quiz
      </button>
    </section>
  );
}