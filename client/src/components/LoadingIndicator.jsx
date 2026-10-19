function LoadingIndicator({ variant = 'grid' }) {
  if (variant === 'detail') {
    return (
      <div className="animate-pulse space-y-4 py-8" role="status" aria-label="Loading">
        <div className="h-6 w-1/2 bg-gray-200 rounded" />
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-5/6 bg-gray-200 rounded" />
        <div className="h-4 w-2/3 bg-gray-200 rounded" />
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-4"
      role="status"
      aria-label="Loading skills"
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="animate-pulse rounded-lg border border-gray-200 p-5 space-y-3">
          <div className="h-5 w-3/4 bg-gray-200 rounded" />
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-2/3 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );
}

export default LoadingIndicator;
