export default function GenerateButton({
  onClick,
  disabled,
  loading,
}) {
  return (
    <button
      type="button"
      className="generate-button"
      onClick={onClick}
      disabled={disabled}
    >
      {loading ? "Generating..." : "Generate Study Set"}
    </button>
  );
}