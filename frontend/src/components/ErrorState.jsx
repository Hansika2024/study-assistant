export default function ErrorState({ message, onRetry }) {
  return (
    <div className="state-card">
      <div className="error-message" role="alert">
        <strong>Something went wrong.</strong>
        <p>{message}</p>

        <button
          type="button"
          className="secondary-button"
          onClick={onRetry}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}