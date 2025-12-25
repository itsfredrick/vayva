'use client';

import React, { useState, useEffect } from 'react';
import { Button, Input, Icon } from '@vayva/ui';
import { PhoneInput } from '@/components/ui/PhoneInput';
import { useOnboarding } from '@/context/OnboardingContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function IdentityPage() {
    const { state, updateState, goToStep } = useOnboarding();
    const { user } = useAuth();
    const router = useRouter();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
    });

    useEffect(() => {
        // Pre-fill from Auth User or Onboarding State
        const initialData = {
            fullName: state?.identity?.fullName || (user as any)?.fullName || user?.email || '',
            email: state?.identity?.email || user?.email || '',
            phone: state?.identity?.phone || user?.phone || '',
        };
        setFormData(initialData);
    }, [user, state]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        await updateState({
            identity: {
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone
            }
        });

        await goToStep('business');
    };

    const handleBack = () => {
        goToStep('welcome');
    };

    return (
        <div className="max-w-xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-black mb-2">Tell us about yourself</h1>
                <p className="text-gray-600">This helps us personalize your experience and contact you about orders.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                <Input
                    label="Full Name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                    placeholder="e.g. Ali Adebayo"
                />

                <Input
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled // Email usually immutable or requires Verify flow
                    placeholder="you@company.com"
                    helperText="Contact support to change your email address"
                />

                <PhoneInput
                    label="Phone Number"
                    value={formData.phone}
                    onChange={(phone) => setFormData({ ...formData, phone })}
                    required
                />

                <div className="flex items-center gap-4 pt-4">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={handleBack}
                        className="flex-1 text-gray-500 hover:text-black"
                    >
                        Back
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        className="flex-[2] !bg-black !text-white h-12 rounded-xl"
                        disabled={!formData.fullName || !formData.phone}
                    >
                        Continue
                        <Icon name="ArrowRight" className="ml-2 w-4 h-4" />
                    </Button>
                </div>
            </form>
        </div>
    );
}
