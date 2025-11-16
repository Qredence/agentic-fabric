'use client';

import { useEffect } from 'react';
import { log } from '@/lib/logger';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    log.error('App error boundary:', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-8">
      <div className="max-w-md rounded-xl border border-border/50 bg-card p-6 text-center shadow">
        <h2 className="mb-2 text-xl font-semibold">Something went wrong</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          An unexpected error occurred. You can try reloading the page.
        </p>
        <button
          className="rounded bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
          onClick={() => reset()}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
