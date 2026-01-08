"use client";

import React, { useState, useEffect } from "react";

interface CountdownTimerProps {
    targetDate?: string; // ISO string
    labels?: [string, string, string, string]; // Days, Hours, Mins, Secs
    className?: string;
}

export function CountdownTimer({
    targetDate,
    labels = ["Days", "Hours", "Mins", "Secs"],
    className = ""
}: CountdownTimerProps) {
    // Default to 3 days from now if no date provided
    const [target] = useState(() => {
        if (targetDate) return new Date(targetDate).getTime();
        const d = new Date();
        d.setDate(d.getDate() + 3);
        return d.getTime();
    });

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(target));

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft(target));
        }, 1000);

        return () => clearInterval(timer);
    }, [target]);

    function calculateTimeLeft(targetTime: number) {
        const difference = targetTime - new Date().getTime();

        if (difference <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
    }

    return (
        <div className={`flex gap-4 md:gap-8 justify-center ${className}`}>
            {[
                { value: timeLeft.days, label: labels[0] },
                { value: timeLeft.hours, label: labels[1] },
                { value: timeLeft.minutes, label: labels[2] },
                { value: timeLeft.seconds, label: labels[3] },
            ].map((item, idx) => (
                <div key={idx} className="text-center">
                    <div className="text-3xl md:text-5xl font-bold font-mono leading-none mb-2">
                        {String(item.value).padStart(2, "0")}
                    </div>
                    <div className="text-xs uppercase tracking-widest opacity-50">
                        {item.label}
                    </div>
                </div>
            ))}
        </div>
    );
}
