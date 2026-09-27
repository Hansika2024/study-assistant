export default function Question({
  question,
  selectedAnswer,
  isAnswered,
  onAnswerSelect,
}) {
  return (
    <div>
      <h3 className="question-text">
        {question.question}
      </h3>

      <div
        className="options"
        role="radiogroup"
        aria-label="Answer options"
      >
        {question.options.map((option, index) => {
          const isSelected =
            selectedAnswer === index;

          const isCorrect =
            index === question.correct_answer;

          let optionClass = "option-button";

          if (isAnswered && isCorrect) {
            optionClass += " correct";
          } else if (
            isAnswered &&
            isSelected &&
            !isCorrect
          ) {
            optionClass += " incorrect";
          } else if (isSelected) {
            optionClass += " selected";
          }

          return (
            <button
              key={index}
              type="button"
              className={optionClass}
              onClick={() => onAnswerSelect(index)}
              disabled={isAnswered}
              role="radio"
              aria-checked={isSelected}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}