
import React from 'react';

// Simplified modal without specialized UI components for portability
// Assuming parent provides styling or uses a portal if needed.
// This is a direct inline implementation for specific modal behavior.

interface Props {
    isOpen: boolean;
    onClose: () => void;
    currentPlan: string;
    requiredPlan: string;
}

export function UpgradePlanModal({ isOpen, onClose, currentPlan, requiredPlan }: Props) {
    if (!isOpen) return null;

    // Display formatted name (e.g. growth -> Growth)
    const reqCap = requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <span className="sr-only">Close</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div className="text-center pt-2">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Upgrade to {reqCap}</h2>
                    <p className="text-gray-600 mb-8 px-4">
                        To use this premium template, you need to be on the <strong>{reqCap}</strong> plan.
                    </p>

                    <div className="space-y-3">
                        <button
                            onClick={() => window.location.href = '/admin/settings/billing'}
                            className="w-full py-3.5 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            Upgrade Now
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full py-3 text-gray-500 font-semibold hover:text-gray-800 transition-colors"
                        >
                            Maybe Later
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
