'use client';

import React from 'react';
import { Button , Icon } from '@vayva/ui';
import { StepShell } from './StepShell';

const STORE_TYPES = [
    { id: 'fashion', label: 'Fashion & Clothing', icon: 'Shirt' },
    { id: 'beauty', label: 'Health & Beauty', icon: 'Sparkles' },
    { id: 'electronics', label: 'Electronics & Gadgets', icon: 'Smartphone' },
    { id: 'food', label: 'Food & Dining', icon: 'Utensils' },
    { id: 'home', label: 'Home & Decor', icon: 'Home' }, // Assuming 'home' icon exists or map to another
    { id: 'other', label: 'Other', icon: 'Store' },
];

interface StoreTypeStepProps {
    value: string;
    onChange: (value: string) => void;
    onNext: () => void;
    onBack: () => void;
}

export function StoreTypeStep({ value, onChange, onNext, onBack }: StoreTypeStepProps) {
    return (
        <StepShell
            title="What do you plan to sell?"
            description="We'll tailor your experience based on your industry."
        >
            <div className="grid grid-cols-2 gap-3 mb-8">
                {STORE_TYPES.map((type) => (
                    <button
                        key={type.id}
                        onClick={() => onChange(type.id)}
                        className={`p-4 rounded-xl border text-left transition-all duration-200 flex flex-col gap-2
              ${value === type.id
                                ? 'border-[#46EC13] bg-[#46EC13]/5 ring-1 ring-[#46EC13]'
                                : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                            }`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center
               ${value === type.id ? 'bg-[#46EC13] text-black' : 'bg-gray-100 text-gray-500'}
            `}>
                            {/* Fallback icon handling if needed, assuming Icon component handles these names */}
                            <Icon name={type.icon as any} size={16} />
                        </div>
                        <span className={`font-medium ${value === type.id ? 'text-black' : 'text-gray-600'}`}>
                            {type.label}
                        </span>
                    </button>
                ))}
            </div>

            <div className="flex gap-3">
                <Button variant="outline" onClick={onBack} className="flex-1 h-12 rounded-xl">
                    Back
                </Button>
                <Button
                    onClick={onNext}
                    disabled={!value}
                    className="flex-[2] h-12 bg-[#1d1d1f] hover:bg-[#1d1d1f]/90 text-white font-bold rounded-xl"
                >
                    Continue
                </Button>
            </div>
        </StepShell>
    );
}
