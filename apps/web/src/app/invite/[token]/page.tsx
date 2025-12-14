'use client';

import React from 'react';
import Link from 'next/link';
import { AuthShell } from '@/components/auth-shell';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function AcceptInvitePage({ params }: { params: { token: string } }) {
    // Mock logic: token 'valid' shows form, 'invalid' shows error
    const isValid = params.token !== 'invalid';

    return (
        <AuthShell>
            <GlassPanel className="w-full max-w-[500px] p-10 flex flex-col gap-8">
                {isValid ? (
                    <>
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-white mb-2">Join Amina Beauty Store</h2>
                            <p className="text-text-secondary">
                                You&apos;ve been invited as <span className="text-primary font-bold">Admin</span>
                            </p>
                        </div>

                        <form className="flex flex-col gap-5">
                            <Input label="Full Name" placeholder="Your Name" />
                            <Input label="Create Password" type="password" />
                            <Input label="Confirm Password" type="password" />

                            <Button>Accept Invite</Button>
                        </form>

                        <div className="text-center border-t border-border-subtle pt-4">
                            <p className="text-xs text-text-secondary">
                                Already have an account? <Link href="/auth/login" className="text-white hover:underline">Log in</Link> instead.
                            </p>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-8">
                        <h2 className="text-xl font-bold text-state-danger mb-2">Invite Expired</h2>
                        <p className="text-text-secondary mb-6">This invitation link has expired or is invalid.</p>
                        <Link href="/auth/login">
                            <Button variant="outline">Go to Login</Button>
                        </Link>
                    </div>
                )}
            </GlassPanel>
        </AuthShell>
    );
}
