'use client';

import React, { useState } from 'react';
import { Button, Icon, GlassPanel } from '@vayva/ui';
import { useOnboarding } from '@/context/OnboardingContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ReviewPage() {
    const { state, completeOnboarding, goToStep } = useOnboarding();
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const isKycPending = (state?.kyc?.status as string) === 'pending' || (state?.kyc?.status as string) === 'PENDING';
    const isKYCVerified = (state?.kyc?.status as string) === 'verified' || (state?.kyc?.status as string) === 'VERIFIED';

    const handleFinish = async () => {
        setLoading(true);
        // Save status
        await completeOnboarding();
        // Logic inside completeOnboarding redirects to dashboard or we do it here
    };

    if (!state) return null;

    return (
        <div className="max-w-2xl mx-auto pb-20">
            <div className="mb-8 text-center">
                <div className="w-16 h-16 bg-[#46EC13] rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
                    <Icon name="Check" className="text-black" size={32} />
                </div>
                <h1 className="text-3xl font-bold text-black mb-2">You're almost there!</h1>
                <p className="text-gray-600">Review your details before we launch your store.</p>
            </div>

            <div className="space-y-6">
                {/* Store Summary */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-black">Store Profile</h3>
                        <Button variant="ghost" size="sm" onClick={() => goToStep('store-details')}>Edit</Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-500">Store Name</p>
                            <p className="font-medium text-black">{state.storeDetails?.storeName}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Store URL</p>
                            <p className="font-medium text-black">vayva.shop/{state.storeDetails?.slug}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Contact</p>
                            <p className="font-medium text-black">{state.identity?.fullName}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Phone</p>
                            <p className="font-medium text-black">{state.identity?.phone}</p>
                        </div>
                    </div>
                </div>

                {/* Operations */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-black">Operations</h3>
                        <Button variant="ghost" size="sm" onClick={() => goToStep('delivery')}>Edit</Button>
                    </div>
                    <div className="text-sm space-y-2">
                        <div>
                            <p className="text-gray-500">Pickup Address</p>
                            <p className="font-medium text-black">{state.pickupLocation?.address}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Primary Channel</p>
                            <p className="font-medium text-black">Online Storefront {state.enabledChannels?.market ? '+ One Market' : ''}</p>
                        </div>
                    </div>
                </div>

                {/* Verification Status */}
                <div className={`p-6 rounded-2xl border ${isKycPending ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}>
                    <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isKycPending ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                            <Icon name={isKycPending ? 'Clock' : 'ShieldCheck'} />
                        </div>
                        <div>
                            <h3 className={`font-bold ${isKYCVerified ? 'text-green-900' : 'text-yellow-900'}`}>
                                {isKYCVerified ? 'Identity Verified' : (isKycPending ? 'Verification Pending' : 'Submission Required')}
                            </h3>
                            <p className={`text-sm mt-1 ${isKYCVerified ? 'text-green-700' : 'text-yellow-700'}`}>
                                {isKYCVerified
                                    ? "Your identity has been verified. Your store will be live immediately after setup."
                                    : (isKycPending
                                        ? "Your store will be launched soon after verification. You can proceed to your dashboard now."
                                        : "Please complete the identity verification step to launch your store.")
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 lg:static lg:bg-transparent lg:border-none lg:p-0 lg:mt-8">
                <div className="max-w-2xl mx-auto flex gap-4">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => goToStep('kyc')}
                        className="flex-1 text-gray-500 hover:text-black hidden lg:flex"
                    >
                        Back
                    </Button>
                    <Button
                        onClick={handleFinish}
                        className="w-full !bg-black !text-white h-14 text-lg rounded-xl shadow-xl hover:scale-[1.02] transition-transform"
                        isLoading={loading}
                    >
                        {isKycPending ? 'Go to Dashboard' : 'Launch My Store'}
                        <Icon name="Rocket" className="ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
