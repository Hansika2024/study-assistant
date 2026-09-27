export default function PromptInput({ value, onChange }) {
  const maxLength = 10000;

  return (
    <div>
      <label className="field-label" htmlFor="study-input">
        What do you want to study?
      </label>

      <textarea
        id="study-input"
        className="prompt-input"
        value={value}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Example: Explain binary search, including its time complexity and use cases."
      />

      <div className="input-footer">
        <span>Enter a topic or learning goal.</span>
        <span>
          {value.length}/{maxLength}
        </span>
      </div>
    </div>
  );
}