import { useState } from "react";
import Question from "./Question";
import QuizResult from "./QuizResult";

export default function Quiz({ quiz, onRestart }) {
  const [questions, setQuestions] = useState(quiz.questions);
  const [currentQuestionIndex, setCurrentQuestionIndex] =
    useState(0);

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const [score, setScore] = useState(0);
  const [wrongQuestions, setWrongQuestions] = useState([]);

  const [showResult, setShowResult] = useState(false);

  const currentQuestion =
    questions[currentQuestionIndex];

  const handleSelect = (answerIndex) => {
    if (isAnswered) {
      return;
    }

    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = () => {
    if (
      selectedAnswer === null ||
      isAnswered
    ) {
      return;
    }

    const isCorrect =
      selectedAnswer ===
      currentQuestion.correct_answer;

    if (isCorrect) {
      setScore((previous) => previous + 1);
    } else {
      setWrongQuestions((previous) => [
        ...previous,
        currentQuestion,
      ]);
    }

    setIsAnswered(true);
  };

  const handleNext = () => {
    const nextIndex =
      currentQuestionIndex + 1;

    if (nextIndex >= questions.length) {
      setShowResult(true);
      return;
    }

    setCurrentQuestionIndex(nextIndex);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setWrongQuestions([]);
    setShowResult(false);
  };

  const handleReviewWrong = () => {
    setQuestions(wrongQuestions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setWrongQuestions([]);
    setShowResult(false);
  };

  if (showResult) {
    return (
      <QuizResult
        score={score}
        total={questions.length}
        wrongQuestions={wrongQuestions}
        onRetry={handleRetry}
        onReviewWrong={handleReviewWrong}
      />
    );
  }

  return (
    <section>
      <h2>{quiz.title}</h2>

      <p>
        Question {currentQuestionIndex + 1} of{" "}
        {questions.length}
      </p>

      <Question
        question={currentQuestion}
        selectedAnswer={selectedAnswer}
        isAnswered={isAnswered}
        onSelect={handleSelect}
        onSubmit={handleSubmit}
      />

      {isAnswered && (
        <button
          type="button"
          onClick={handleNext}
        >
          {currentQuestionIndex ===
          questions.length - 1
            ? "Finish Quiz"
            : "Next Question"}
        </button>
      )}

      <button
        type="button"
        onClick={onRestart}
      >
        Exit Quiz
      </button>
    </section>
  );
}