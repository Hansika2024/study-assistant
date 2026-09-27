export default function LoadingState() {
  return (
    <div className="state-card loading-message" aria-live="polite">
      <div className="spinner" />
      <h2>Creating your study set...</h2>
      <p>
        The AI is preparing questions and explanations for you.
      </p>
    </div>
  );
}