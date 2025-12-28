'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        Sentry.captureException(error);
    }, [error]);

    return (
        <html>
            <body>
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem',
                    backgroundColor: '#F9FAFB',
                    fontFamily: 'system-ui, sans-serif'
                }}>
                    <div style={{ textAlign: 'center', maxWidth: '28rem', width: '100%' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Something went wrong!</h2>
                        <p style={{ marginBottom: '1.5rem', color: '#4B5563' }}>
                            A critical system error occurred. Our team has been notified.
                        </p>
                        <button
                            onClick={() => reset()}
                            style={{
                                backgroundColor: '#000',
                                color: '#fff',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.375rem',
                                fontWeight: 500,
                                cursor: 'pointer',
                                border: 'none'
                            }}
                        >
                            Try again
                        </button>
                    </div>
                </div>
            </body>
        </html>
    );
}
