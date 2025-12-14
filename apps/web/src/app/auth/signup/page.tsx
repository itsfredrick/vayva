'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthShell } from '@/components/auth-shell';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

export default function SignupPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        businessName: '',
        contact: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            // Show validation error (in real implementation)
            return;
        }

        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);

        // Simulate success route to verify
        router.push('/auth/verify?contact=' + encodeURIComponent(formData.contact));
    };

    const isFormValid =
        formData.fullName &&
        formData.businessName &&
        formData.contact &&
        formData.password.length >= 8 &&
        formData.password === formData.confirmPassword &&
        formData.agreeTerms;

    return (
        <AuthShell>
            <GlassPanel className="w-full max-w-[480px] p-8 md:p-10 flex flex-col gap-6">
                <div className="text-center mb-2">
                    <span className="text-xs font-bold text-primary uppercase tracking-widest mb-2 block">Step 1 of 2</span>
                    <h2 className="text-2xl font-bold text-white">Create your Vayva account</h2>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <Input
                        label="Full Name"
                        placeholder="e.g. Amina Yusuf"
                        value={formData.fullName}
                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    />

                    <Input
                        label="Business Name"
                        placeholder="e.g. Amina Beauty Store"
                        value={formData.businessName}
                        onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                    />

                    <Input
                        label="Email or Phone"
                        placeholder="name@email.com or +234..."
                        value={formData.contact}
                        onChange={e => setFormData({ ...formData, contact: e.target.value })}
                    />

                    <div className="relative">
                        <Input
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Min 8 characters"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-[38px] text-text-secondary hover:text-white transition-colors"
                        >
                            <Icon name={showPassword ? "visibility_off" : "visibility"} size={20} />
                        </button>
                    </div>

                    <Input
                        label="Confirm Password"
                        type="password"
                        placeholder="Re-enter password"
                        value={formData.confirmPassword}
                        onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                        error={formData.confirmPassword && formData.password !== formData.confirmPassword ? "Passwords do not match" : undefined}
                    />

                    <div className="flex flex-col gap-2 mt-2">
                        <label className="flex items-start gap-3 cursor-pointer text-sm text-text-secondary hover:text-white transition-colors">
                            <input
                                type="checkbox"
                                className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-primary focus:ring-primary"
                                checked={formData.agreeTerms}
                                onChange={e => setFormData({ ...formData, agreeTerms: e.target.checked })}
                            />
                            <span>I agree to the Terms & Privacy Policy</span>
                        </label>
                    </div>

                    <Button type="submit" disabled={!isFormValid} isLoading={isLoading} className="mt-2">
                        Create account
                    </Button>
                </form>

                <div className="text-center pt-4 border-t border-border-subtle">
                    <p className="text-text-secondary text-sm">
                        Already have an account? <Link href="/auth/login" className="text-primary hover:text-primary-hover font-bold">Log in</Link>
                    </p>
                </div>
            </GlassPanel>
        </AuthShell>
    );
}
