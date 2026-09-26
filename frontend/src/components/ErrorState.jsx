export default function ErrorState({ message, onRetry }) {
  return (
    <div>
      <p>{message}</p>

      {onRetry && (
        <button type="button" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
}