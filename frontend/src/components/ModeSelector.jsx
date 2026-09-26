export default function ModeSelector({
  mode,
  onChange,
  disabled,
}) {
  return (
    <div>
      <label htmlFor="mode-select">
        Study mode
      </label>

      <select
        id="mode-select"
        value={mode}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
      >
        <option value="quiz">Quiz</option>
        <option value="flashcards">Flashcards</option>
      </select>
    </div>
  );
}