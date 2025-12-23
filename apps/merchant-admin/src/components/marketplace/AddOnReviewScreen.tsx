'use client';

import React from 'react';
import { Button } from '@vayva/ui';
import { AddOnMetadata } from '@vayva/extensions/addon-types';

interface AddOnReviewScreenProps {
    addon: AddOnMetadata;
    onEnable: () => void;
    onCancel: () => void;
}

export function AddOnReviewScreen({ addon, onEnable, onCancel }: AddOnReviewScreenProps) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
            <div className="max-w-2xl w-full bg-white rounded-lg border border-gray-200 p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#0F172A] mb-2">
                        Review Add-On
                    </h1>
                    <p className="text-[#64748B]">
                        {addon.name} • {addon.version}
                    </p>
                </div>

                {/* Description */}
                <div className="mb-8">
                    <p className="text-[#0F172A]">{addon.description}</p>
                </div>

                {/* This add-on will */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-[#0F172A] mb-4">
                        This add-on will:
                    </h2>
                    <ul className="space-y-2">
                        {addon.whatItAdds.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                                <span className="text-[#22C55E] mt-1">✓</span>
                                <span className="text-[#0F172A]">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* This add-on will not */}
                <div className="mb-8 bg-gray-50 rounded-lg p-6">
                    <h3 className="text-sm font-semibold text-[#0F172A] mb-3">
                        This add-on will not:
                    </h3>
                    <ul className="space-y-2">
                        {addon.whatItDoesNotChange.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                                <span className="text-[#64748B] mt-1">○</span>
                                <span className="text-[#64748B] text-sm">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Non-destructive notice */}
                <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900">
                        This add-on is <strong>non-destructive</strong> and can be disabled at any time.
                        Your existing data will remain intact.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <Button
                        onClick={onCancel}
                        variant="outline"
                        className="flex-1 border-2 border-gray-300 py-4 text-lg font-semibold"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onEnable}
                        className="flex-1 bg-[#22C55E] hover:bg-[#16A34A] text-white py-4 text-lg font-semibold"
                    >
                        Enable add-on
                    </Button>
                </div>
            </div>
        </div>
    );
}
