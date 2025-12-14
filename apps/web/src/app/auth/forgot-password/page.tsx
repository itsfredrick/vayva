'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthShell } from '@/components/auth-shell';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [contact, setContact] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        // Route to reset password with query param
        router.push('/auth/reset-password?contact=' + encodeURIComponent(contact));
    };

    return (
        <AuthShell>
            <GlassPanel className="w-full max-w-[440px] p-10 flex flex-col gap-8">
                <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                        <Icon name="lock_reset" className="text-white text-2xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Forgot password?</h2>
                    <p className="text-text-secondary text-sm">
                        Enter your email or phone number and we’ll send you a code to reset your password.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <Input
                        label="Email or Phone"
                        placeholder="name@domain.com"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                    />

                    <div className="flex flex-col gap-3">
                        <Button type="submit" disabled={!contact} isLoading={isLoading}>
                            Send reset code
                        </Button>
                        <Link href="/auth/login" className="block w-full">
                            <Button type="button" variant="ghost" className="w-full">
                                Back to login
                            </Button>
                        </Link>
                    </div>
                </form>
            </GlassPanel>
        </AuthShell>
    );
}
