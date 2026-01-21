"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Clock, Loader2 } from "lucide-react";
import { Button } from "@vayva/ui";
export function BookingCalendar({ storeSlug, onSelectDate, onSelectTime, className = "" }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };
    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };
    const handleDateClick = (day) => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setSelectedDate(date);
        setSelectedTime(null); // Reset time when date changes
        if (onSelectDate)
            onSelectDate(date);
    };
    const handleTimeClick = (time) => {
        setSelectedTime(time);
        if (onSelectTime)
            onSelectTime(time);
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
            }
            else {
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
    return (_jsxs("div", { className: `bg-white rounded-xl shadow-lg border border-gray-100 p-6 ${className}`, children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h3", { className: "text-lg font-bold", children: currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" }) }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: "ghost", size: "icon", onClick: handlePrevMonth, className: "hover:bg-gray-100 rounded-full", "aria-label": "Previous month", children: _jsx(ChevronLeft, { className: "w-5 h-5" }) }), _jsx(Button, { variant: "ghost", size: "icon", onClick: handleNextMonth, className: "hover:bg-gray-100 rounded-full", "aria-label": "Next month", children: _jsx(ChevronRight, { className: "w-5 h-5" }) })] })] }), _jsxs("div", { className: "grid grid-cols-7 gap-2 mb-6 text-center", children: [["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (_jsx("div", { className: "text-xs font-bold text-gray-400 uppercase tracking-wide", children: day }, day))), Array.from({ length: firstDayOfMonth }).map((_, i) => (_jsx("div", {}, `empty-${i}`))), Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const isSelected = selectedDate?.getDate() === day && selectedDate?.getMonth() === currentDate.getMonth();
                        const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth();
                        return (_jsx(Button, { variant: "ghost", onClick: () => handleDateClick(day), className: `
                h-10 w-10 text-sm rounded-full flex items-center justify-center transition-all p-0
                ${isSelected ? "bg-black text-white shadow-md scale-110 hover:bg-black" : "hover:bg-gray-100"}
                ${isToday && !isSelected ? "border border-black font-bold" : ""}
              `, "aria-label": `Select ${day} ${currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}`, children: day }, day));
                    })] }), selectedDate && (_jsxs("div", { className: "animate-in slide-in-from-top-2 fade-in", children: [_jsxs("h4", { className: "text-sm font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center justify-between", children: [_jsx("span", { children: "Available Times" }), isLoadingSlots && _jsx(Loader2, { className: "w-3 h-3 animate-spin" })] }), !isLoadingSlots && availableSlots.length === 0 ? (_jsx("div", { className: "text-center py-4 text-gray-400 text-sm italic", children: "No slots available for this date." })) : (_jsx("div", { className: "grid grid-cols-3 gap-2 max-h-48 overflow-y-auto custom-scrollbar", children: availableSlots.map((time) => (_jsxs(Button, { variant: "outline", onClick: () => handleTimeClick(time), className: `
                                        px-3 py-2 text-sm border rounded-lg transition-colors flex items-center justify-center gap-2 h-auto
                                        ${selectedTime === time
                                ? "bg-black text-white border-black hover:bg-black hover:text-white"
                                : "border-gray-200 hover:border-black hover:bg-gray-50 text-gray-700"}
                                    `, "aria-label": `Select time ${time}`, children: [_jsx(Clock, { className: "w-3 h-3" }), time] }, time))) }))] }))] }));
}
