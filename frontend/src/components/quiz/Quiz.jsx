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

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (index) => {
    if (isAnswered) {
      return;
    }

    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || isAnswered) {
      return;
    }

    setIsAnswered(true);

    if (
      selectedAnswer ===
      currentQuestion.correct_answer
    ) {
      setScore((previous) => previous + 1);
    } else {
      setWrongQuestions((previous) => [
        ...previous,
        currentQuestion,
      ]);
    }
  };

  const handleNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex >= questions.length) {
      setShowResult(true);
      return;
    }

    setCurrentQuestionIndex(nextIndex);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  const handleReviewWrong = () => {
    if (wrongQuestions.length === 0) {
      return;
    }

    setQuestions(wrongQuestions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setWrongQuestions([]);
    setShowResult(false);
  };

  const handleRestartQuiz = () => {
    setQuestions(quiz.questions);
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
        onReviewWrong={handleReviewWrong}
        onRestart={handleRestartQuiz}
        onExit={onRestart}
      />
    );
  }

  const progress =
    ((currentQuestionIndex + 1) /
      questions.length) *
    100;

  return (
    <section className="result-card">
      <div className="quiz-header">
        <h2>{quiz.title}</h2>

        <span>
          Question {currentQuestionIndex + 1} of{" "}
          {questions.length}
        </span>
      </div>

      <div
        className="quiz-progress"
        aria-label={`Question ${
          currentQuestionIndex + 1
        } of ${questions.length}`}
      >
        <div
          className="quiz-progress-bar"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <Question
        question={currentQuestion}
        selectedAnswer={selectedAnswer}
        isAnswered={isAnswered}
        onAnswerSelect={handleAnswerSelect}
      />

      {isAnswered && (
        <div
          className={`feedback ${
            selectedAnswer ===
            currentQuestion.correct_answer
              ? "correct-feedback"
              : "incorrect-feedback"
          }`}
          aria-live="polite"
        >
          <strong>
            {selectedAnswer ===
            currentQuestion.correct_answer
              ? "Correct!"
              : "Incorrect"}
          </strong>

          <p>
            {currentQuestion.explanation}
          </p>
        </div>
      )}

      <div className="quiz-actions">
        {!isAnswered ? (
          <button
            type="button"
            className="primary-button"
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === null}
          >
            Submit Answer
          </button>
        ) : (
          <button
            type="button"
            className="primary-button"
            onClick={handleNextQuestion}
          >
            {currentQuestionIndex ===
            questions.length - 1
              ? "Finish Quiz"
              : "Next Question"}
          </button>
        )}

        <button
          type="button"
          className="secondary-button"
          onClick={onRestart}
        >
          Exit Quiz
        </button>
      </div>
    </section>
  );
}