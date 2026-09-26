export default function Question({
  question,
  selectedAnswer,
  isAnswered,
  onSelect,
  onSubmit,
}) {
  return (
    <section>
      <h3>{question.question}</h3>

      <div>
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;

          let className = "";

          if (isAnswered) {
            if (index === question.correct_answer) {
              className = "correct";
            } else if (isSelected) {
              className = "incorrect";
            }
          }

          return (
            <button
              key={index}
              type="button"
              className={className}
              disabled={isAnswered}
              onClick={() => onSelect(index)}
            >
              {option}
            </button>
          );
        })}
      </div>

      {!isAnswered && (
        <button
          type="button"
          disabled={selectedAnswer === null}
          onClick={onSubmit}
        >
          Submit Answer
        </button>
      )}

      {isAnswered && (
        <div>
          <p>
            {selectedAnswer === question.correct_answer
              ? "Correct!"
              : "Incorrect"}
          </p>

          <p>{question.explanation}</p>
        </div>
      )}
    </section>
  );
}