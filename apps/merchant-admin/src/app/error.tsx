'use client';

import { useEffect } from 'react';
import { ErrorState } from '@vayva/ui';
import { logger } from '@/lib/logger';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        logger.error('Client Error Boundary Caught Error', error, { digest: error.digest });
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
            <div className="w-full max-w-md">
                <ErrorState
                    title="Application Error"
                    message={error.message || "An unexpected error occurred."}
                    onRetry={reset}
                />
            </div>
        </div>
    );
}
