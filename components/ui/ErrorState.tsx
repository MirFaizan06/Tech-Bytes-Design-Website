import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = 'Something went wrong loading the data.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center justify-center mb-4">
        <FiAlertTriangle className="w-8 h-8 text-red-500 dark:text-red-400" />
      </div>
      <h3 className="text-lg font-semibold text-secondary mb-1">Error</h3>
      <p className="text-sm text-muted max-w-xs mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 rounded-lg glass text-sm text-secondary hover:text-primary transition-colors"
        >
          <FiRefreshCw className="w-4 h-4" />
          Try again
        </button>
      )}
    </div>
  );
}
