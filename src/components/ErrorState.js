const ErrorState = ({ message = "Something went wrong.", onRetry }) => (
  <div
    role="alert"
    className="flex flex-col items-center justify-center py-16 text-center"
  >
    <p className="text-red-600 font-semibold mb-4">{message}</p>
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
      >
        Retry
      </button>
    )}
  </div>
);

export default ErrorState;
