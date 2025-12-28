
'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/ops/auth/logout', { method: 'POST' });
        router.refresh(); // Clear Router cache
        window.location.href = '/ops/login'; // Hard navigation to clear client state
    };

    return (
        <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-red-300 hover:text-red-200 hover:bg-red-900/20 rounded-lg text-sm transition-colors"
        >
            <LogOut className="h-4 w-4" />
            Sign Out
        </button>
    );
}
