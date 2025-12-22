'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Icon } from '@vayva/ui';
import { Input } from '@vayva/ui';
import { PhoneInput } from '@/components/ui/PhoneInput';
import { PasswordStrengthIndicator } from '@/components/ui/PasswordStrengthIndicator';
import { AuthService } from '@/services/auth';
import { SplitAuthLayout } from '@/components/auth/SplitAuthLayout';

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<'STARTER' | 'GROWTH' | 'PRO'>('STARTER');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showGoogleModal, setShowGoogleModal] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!agreedToTerms) {
            setError('Please agree to the Terms of Service and Privacy Policy');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await AuthService.register({
                ...formData,
                plan: selectedPlan,
            });
            // Redirect to verify page
            router.push(`/verify?email=${encodeURIComponent(formData.email)}`);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignUp = () => {
        setShowGoogleModal(true);
    };

    const plans = [
        { id: 'STARTER', name: 'Starter', price: 'Free' },
        { id: 'GROWTH', name: 'Growth', price: '₦5,000/mo' },
        { id: 'PRO', name: 'Pro', price: '₦15,000/mo' },
    ];


    return (
        <SplitAuthLayout
            stepIndicator="Step 1/2"
            title="Create your account"
            subtitle="Start your store in minutes"
            showSignInLink
        >
            {/* Google Sign Up */}
            <button
                onClick={handleGoogleSignUp}
                className="w-full h-12 flex items-center justify-center gap-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-black font-medium transition-all mb-6"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span>Continue with Google</span>
            </button>

            <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-3 text-gray-400 font-medium">or</span>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="First Name"
                        type="text"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                    />
                    <Input
                        label="Last Name"
                        type="text"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        required
                    />
                </div>


                <Input
                    label="Business Email"
                    type="email"
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    data-testid="auth-signup-email"
                />

                <PhoneInput
                    label="Phone Number"
                    value={formData.phone}
                    onChange={(phone) => setFormData({ ...formData, phone })}
                    required
                />

                <div>
                    <div className="relative">
                        <Input
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Create a strong password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            data-testid="auth-signup-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-[38px] text-gray-400 hover:text-black transition-colors"
                        >
                            <Icon name={(showPassword ? 'EyeOff' : 'Eye') as any} className="w-5 h-5" />
                        </button>
                    </div>
                    <PasswordStrengthIndicator password={formData.password} />
                </div>

                {/* Plan Selection */}
                <div>
                    <label className="block text-sm font-medium text-black mb-3">
                        Choose your plan
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {plans.map((plan) => (
                            <button
                                key={plan.id}
                                type="button"
                                onClick={() => setSelectedPlan(plan.id as any)}
                                className={`p-3 rounded-xl border-2 transition-all text-left ${selectedPlan === plan.id
                                    ? 'border-black bg-black text-white'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div className="text-xs font-semibold">{plan.name}</div>
                                <div className="text-xs mt-0.5 opacity-70">{plan.price}</div>
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">You can change your plan later</p>
                </div>

                {/* Terms Checkbox */}
                <label className="flex items-start gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="w-4 h-4 mt-0.5 rounded border-gray-300 text-black focus:ring-2 focus:ring-black"
                    />
                    <span className="text-sm text-gray-600">
                        I agree to the{' '}
                        <Link href="/legal/terms" target="_blank" className="text-[#0D1D1E] hover:text-black font-medium underline">
                            Terms of Service
                        </Link>
                        {' '}and{' '}
                        <Link href="/legal/privacy" target="_blank" className="text-[#0D1D1E] hover:text-black font-medium underline">
                            Privacy Policy
                        </Link>
                    </span>
                </label>

                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full !bg-black !text-white hover:!bg-black/90 !rounded-xl !h-12"
                    disabled={loading || !agreedToTerms}
                    data-testid="auth-signup-submit"
                >
                    {loading ? (
                        <>
                            <Icon name={"Loader2" as any} className="w-5 h-5 animate-spin" />
                            Creating account...
                        </>
                    ) : (
                        'Create account'
                    )}
                </Button>
            </form>

            {/* Sign In Link */}
            <div className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/signin" className="text-[#0D1D1E] hover:text-black font-semibold transition-colors">
                    Sign in
                </Link>
            </div>

            {/* Google OAuth Placeholder Modal */}
            {showGoogleModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-fade-in">
                        <div className="text-center mb-4">
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Icon name={"Info" as any} className="w-6 h-6 text-yellow-600" />
                            </div>
                            <h3 className="text-lg font-heading font-semibold text-black mb-2">
                                Google Sign-Up Not Configured
                            </h3>
                            <p className="text-sm text-gray-600">
                                Google OAuth is not yet configured for this environment. Please sign up with your email.
                            </p>
                        </div>
                        <Button
                            variant="primary"
                            className="w-full !bg-black !text-white"
                            onClick={() => setShowGoogleModal(false)}
                        >
                            Got it
                        </Button>
                    </div>
                </div>
            )}
        </SplitAuthLayout>
    );
}
