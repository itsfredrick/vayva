'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AuthShell } from '@/components/auth-shell';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsLoading(false);
    };

    const isFormValid = email.length > 0 && password.length > 0;

    return (
        <AuthShell>
            <GlassPanel className="w-full max-w-[440px] p-8 md:p-10 flex flex-col gap-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">Log in to Vayva</h2>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <Input
                        label="Email or Phone"
                        placeholder="name@domain.com or +234 801 234 5678"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        // Error state example
                        error={email === 'error@test.com' ? "This account doesn't exist." : undefined}
                    />

                    <div className="relative">
                        <Input
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-[38px] text-text-secondary hover:text-white transition-colors"
                        >
                            <Icon name={showPassword ? "visibility_off" : "visibility"} size={20} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 cursor-pointer text-text-secondary hover:text-white transition-colors">
                            <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-white/5 text-primary focus:ring-primary" />
                            Remember me
                        </label>
                        <Link href="/auth/forgot-password" className="text-primary hover:text-primary-hover font-medium">
                            Forgot password?
                        </Link>
                    </div>

                    <div className="flex flex-col gap-4 mt-2">
                        <Button type="submit" disabled={!isFormValid} isLoading={isLoading}>
                            Log in
                        </Button>
                        <Button type="button" variant="outline">
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                            Continue with Google
                        </Button>
                    </div>
                </form>

                <div className="text-center pt-4 border-t border-border-subtle">
                    <p className="text-text-secondary text-sm">
                        New to Vayva? <Link href="/auth/signup" className="text-primary hover:text-primary-hover font-bold">Create an account</Link>
                    </p>
                </div>
            </GlassPanel>
        </AuthShell>
    );
}
