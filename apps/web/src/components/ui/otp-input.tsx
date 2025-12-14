'use client';

import React, { useRef, useState, useEffect } from 'react';
import { cn } from './glass-panel';

interface OTPInputProps {
    length?: number;
    value: string;
    onChange: (value: string) => void;
    error?: boolean;
}

export const OTPInput = ({ length = 6, value, onChange, error }: OTPInputProps) => {
    const [localValue, setLocalValue] = useState<string[]>(new Array(length).fill(''));
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        const valMap = value.split('').concat(new Array(length).fill('')).slice(0, length);
        setLocalValue(valMap);
    }, [value, length]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const val = e.target.value;
        if (isNaN(Number(val))) return;

        const newValues = [...localValue];
        // Handle paste or single char
        const chars = val.split('');
        if (chars.length > 1) {
            // Paste logic
            const pasted = val.slice(0, length).split('');
            for (let i = 0; i < length; i++) {
                newValues[i] = pasted[i] || '';
            }
            onChange(newValues.join(''));
            inputsRef.current[length - 1]?.focus();
            return;
        }

        newValues[index] = val;
        setLocalValue(newValues);
        onChange(newValues.join(''));

        // Auto advance
        if (val && index < length - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !localValue[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    return (
        <div className={cn("flex gap-2 justify-center", error && "animate-shake")}>
            {localValue.map((digit, idx) => (
                <input
                    key={idx}
                    ref={el => { if (el) inputsRef.current[idx] = el; }}
                    type="text"
                    maxLength={length} // Allow paste length to be captured initially
                    value={digit}
                    onChange={(e) => handleChange(e, idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    className={cn(
                        "w-12 h-14 rounded-xl bg-white/5 border border-white/10 text-center text-xl font-bold text-white transition-all outline-none",
                        "focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white/10",
                        error && "border-state-danger text-state-danger"
                    )}
                />
            ))}
        </div>
    );
};
