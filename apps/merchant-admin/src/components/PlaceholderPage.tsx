'use client';

import { AppShell, GlassPanel, Button, Icon } from '@vayva/ui'; // Assuming these are exported
import { useRouter } from 'next/navigation';

export default function PlaceholderPage({ title = "Coming Soon" }: { title?: string }) {
    const router = useRouter();

    return (
        <AppShell sidebar={<></>} header={<></>}>
            <div className="flex items-center justify-center h-[50vh]">
                <GlassPanel className="p-12 text-center max-w-md mx-auto">
                    <div className="bg-white/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Icon name="Construction" className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
                    <p className="text-gray-400 mb-8">This feature is currently under development. Check back later!</p>
                    <Button onClick={() => router.back()} variant="secondary">
                        Go Back
                    </Button>
                </GlassPanel>
            </div>
        </AppShell>
    );
}
