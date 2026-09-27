import Quiz from "./quiz/Quiz";
import FlashcardDeck from "./flashcards/FlashcardDeck";

export default function ResultView({ data, onRestart }) {
  if (data.type === "quiz") {
    return (
      <Quiz
        quiz={data}
        onRestart={onRestart}
      />
    );
  }

  if (data.type === "flashcards") {
    return (
      <FlashcardDeck
        flashcards={data}
        onRestart={onRestart}
      />
    );
  }

  return null;
}