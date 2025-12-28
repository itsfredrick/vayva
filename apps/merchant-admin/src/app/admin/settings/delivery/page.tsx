'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DeliverySettingsPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/admin/control-center/delivery');
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            <p className="text-gray-500">Redirecting to Delivery Control Center...</p>
        </div>
    );
}
