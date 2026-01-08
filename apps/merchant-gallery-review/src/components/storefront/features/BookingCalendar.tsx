"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Clock, Loader2 } from "lucide-react";

interface BookingCalendarProps {
    storeSlug?: string;
    onSelectDate?: (date: Date) => void;
    onSelectTime?: (time: string) => void;
    className?: string;
}

export function BookingCalendar({ storeSlug, onSelectDate, onSelectTime, className = "" }: BookingCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);

    const daysInMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
    ).getDate();

    const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
    ).getDay();

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleDateClick = (day: number) => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setSelectedDate(date);
        setSelectedTime(null); // Reset time when date changes
        if (onSelectDate) onSelectDate(date);
    };

    const handleTimeClick = (time: string) => {
        setSelectedTime(time);
        if (onSelectTime) onSelectTime(time);
    };

    // Fetch availability when selectedDate changes
    useEffect(() => {
        if (!selectedDate || !storeSlug) {
            // If no storeSlug provided (e.g. preview mode), use mock data
            if (!storeSlug && selectedDate) {
                setAvailableSlots(["09:00", "10:00", "11:30", "14:00", "15:30"]);
            }
            return;
        }

        setIsLoadingSlots(true);
        setAvailableSlots([]);

        // Format date as YYYY-MM-DD
        const dateStr = selectedDate.toLocaleDateString('en-CA'); // YYYY-MM-DD

        fetch(`/api/storefront/${storeSlug}/availability?date=${dateStr}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.availableSlots) {
                    setAvailableSlots(data.availableSlots);
                } else {
                    setAvailableSlots([]);
                }
            })
            .catch((err) => {
                console.error("Failed to fetch slots", err);
                setAvailableSlots([]); // Fallback
            })
            .finally(() => {
                setIsLoadingSlots(false);
            });
    }, [selectedDate, storeSlug]);

    return (
        <div className={`bg-white rounded-xl shadow-lg border border-gray-100 p-6 ${className}`}>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">
                    {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </h3>
                <div className="flex gap-2">
                    <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-full">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-full">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 mb-6 text-center">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                        {day}
                    </div>
                ))}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const isSelected = selectedDate?.getDate() === day && selectedDate?.getMonth() === currentDate.getMonth();
                    const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth();

                    return (
                        <button
                            key={day}
                            onClick={() => handleDateClick(day)}
                            className={`
                h-10 w-10 text-sm rounded-full flex items-center justify-center transition-all
                ${isSelected ? "bg-black text-white shadow-md scale-110" : "hover:bg-gray-100"}
                ${isToday && !isSelected ? "border border-black font-bold" : ""}
              `}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>

            {/* Time Slots */}
            {selectedDate && (
                <div className="animate-in slide-in-from-top-2 fade-in">
                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center justify-between">
                        <span>Available Times</span>
                        {isLoadingSlots && <Loader2 className="w-3 h-3 animate-spin" />}
                    </h4>

                    {!isLoadingSlots && availableSlots.length === 0 ? (
                        <div className="text-center py-4 text-gray-400 text-sm italic">
                            No slots available for this date.
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                            {availableSlots.map((time) => (
                                <button
                                    key={time}
                                    onClick={() => handleTimeClick(time)}
                                    className={`
                                        px-3 py-2 text-sm border rounded-lg transition-colors flex items-center justify-center gap-2
                                        ${selectedTime === time
                                            ? "bg-black text-white border-black"
                                            : "border-gray-200 hover:border-black hover:bg-gray-50 text-gray-700"}
                                    `}
                                >
                                    <Clock className="w-3 h-3" />
                                    {time}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
