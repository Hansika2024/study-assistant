export default function ModeSelector({ mode, onChange }) {
  return (
    <div className="mode-section">
      <span className="field-label">Choose a study mode</span>

      <div className="mode-options">
        <button
          type="button"
          className={`mode-button ${
            mode === "quiz" ? "active" : ""
          }`}
          onClick={() => onChange("quiz")}
        >
          Quiz
        </button>

        <button
          type="button"
          className={`mode-button ${
            mode === "flashcards" ? "active" : ""
          }`}
          onClick={() => onChange("flashcards")}
        >
          Flashcards
        </button>
      </div>
    </div>
  );
}