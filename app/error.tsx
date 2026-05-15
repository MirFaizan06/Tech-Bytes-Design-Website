'use client';

import { useEffect } from 'react';
import { FiRefreshCw } from 'react-icons/fi';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-4xl mb-4">⚠️</div>
      <h2 className="text-xl font-bold text-primary mb-2">Something went wrong</h2>
      <p className="text-muted mb-6 max-w-sm text-sm">{error.message}</p>
      <button
        onClick={reset}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm transition-colors"
      >
        <FiRefreshCw className="w-4 h-4" /> Try again
      </button>
    </div>
  );
}
