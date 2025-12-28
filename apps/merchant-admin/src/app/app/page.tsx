'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkAppLaunchStatus } from './actions';
import Image from 'next/image';

export default function AppLaunchPage() {
    const router = useRouter();
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        // Trigger check immediately
        const runCheck = async () => {
            try {
                // Minimum splash time (aesthetic)
                const start = Date.now();

                const result = await checkAppLaunchStatus();

                const elapsed = Date.now() - start;
                const remaining = Math.max(0, 1500 - elapsed); // Ensure at least 1.5s splash

                setTimeout(() => {
                    if (result.status === 'unauthenticated') {
                        router.replace('/signin');
                    } else if (result.onboardingCompleted) {
                        router.replace('/admin');
                    } else {
                        router.replace('/onboarding');
                    }
                }, remaining);

            } catch (e) {
                console.error("Launch check failed", e);
                router.replace('/signin');
            }
        };

        runCheck();
    }, [router]);

    return (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
            <div className="animate-pulse">
                {/* Use manifest icon as logo */}
                <Image
                    src="/icons/icon-192.png" // Fallback to raster if svg issues, or just use vector
                    alt="Vayva"
                    width={100}
                    height={100}
                    className="w-24 h-24 mb-4"
                    priority
                />
            </div>
            <div className="mt-8 flex space-x-2">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
            </div>
        </div>
    );
}
