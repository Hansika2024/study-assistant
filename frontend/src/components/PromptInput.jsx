export default function PromptInput({
  value,
  onChange,
  disabled,
}) {
  return (
    <div>
      <label htmlFor="study-input">
        What do you want to study?
      </label>

      <textarea
        id="study-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Example: Explain binary search and its time complexity"
        rows={6}
        disabled={disabled}
      />

      <p>{value.length}/10000</p>
    </div>
  );
}