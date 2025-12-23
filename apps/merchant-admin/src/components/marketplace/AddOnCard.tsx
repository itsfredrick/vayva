'use client';

import React from 'react';
import Link from 'next/link';
import { AddOnMetadata } from '@vayva/extensions/addon-types';
import { CompatibilityCheck } from '@vayva/extensions/compatibility';

interface AddOnCardProps {
    addon: AddOnMetadata;
    compatibility: CompatibilityCheck;
    isEnabled?: boolean;
    onPreview?: () => void;
    onEnable?: () => void;
}

export function AddOnCard({ addon, compatibility, isEnabled, onPreview, onEnable }: AddOnCardProps) {
    const getTypeColor = (type: string) => {
        switch (type) {
            case 'capability': return 'bg-blue-100 text-blue-800';
            case 'integration': return 'bg-purple-100 text-purple-800';
            case 'automation': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPlanBadge = (plan: string) => {
        switch (plan) {
            case 'free': return 'bg-gray-100 text-gray-800';
            case 'growth': return 'bg-blue-100 text-blue-800';
            case 'pro': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className={`bg-white border rounded-lg p-6 ${!compatibility.isCompatible ? 'opacity-60' : ''}`}>
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-[#0F172A] mb-1">
                        {addon.name}
                    </h3>
                    <div className="flex gap-2">
                        <span className={`text-xs px-2 py-1 rounded ${getTypeColor(addon.type)}`}>
                            {addon.type}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${getPlanBadge(addon.requiredPlan)}`}>
                            {addon.requiredPlan}
                        </span>
                    </div>
                </div>
                {isEnabled && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Enabled
                    </span>
                )}
            </div>

            {/* Description */}
            <p className="text-sm text-[#64748B] mb-4">
                {addon.description}
            </p>

            {/* Compatibility */}
            {!compatibility.isCompatible && (
                <div className="mb-4 bg-amber-50 border border-amber-200 rounded p-3">
                    <p className="text-sm text-amber-900">
                        {compatibility.reasons.join('. ')}
                    </p>
                </div>
            )}

            {/* Compatible templates */}
            <div className="mb-4">
                <p className="text-xs text-[#64748B] mb-2">Compatible templates:</p>
                <div className="flex flex-wrap gap-1">
                    {addon.compatibleTemplates.slice(0, 3).map((templateId, i) => (
                        <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {templateId}
                        </span>
                    ))}
                    {addon.compatibleTemplates.length > 3 && (
                        <span className="text-xs text-[#64748B]">
                            +{addon.compatibleTemplates.length - 3} more
                        </span>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                {onPreview && (
                    <button
                        onClick={onPreview}
                        className="flex-1 text-sm text-[#0F172A] border border-gray-300 rounded px-4 py-2 hover:bg-gray-50"
                    >
                        Preview
                    </button>
                )}
                {compatibility.isCompatible && onEnable && !isEnabled && (
                    <button
                        onClick={onEnable}
                        className="flex-1 text-sm bg-[#22C55E] hover:bg-[#16A34A] text-white rounded px-4 py-2 font-semibold"
                    >
                        Enable
                    </button>
                )}
                {compatibility.requiredPlanUpgrade && (
                    <Link href="/pricing" className="flex-1">
                        <button className="w-full text-sm bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 font-semibold">
                            Upgrade to {compatibility.requiredPlanUpgrade}
                        </button>
                    </Link>
                )}
            </div>
        </div>
    );
}
