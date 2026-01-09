"use client";

import React, { useState, useEffect } from "react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays } from "date-fns";
import { Icon, Button, GlassPanel } from "@vayva/ui";
import { toast } from "sonner";

// Placeholder types until we have shared types
interface Booking {
    id: string;
    startsAt: string;
    endsAt: string;
    customer?: { firstName: string; lastName: string };
    service?: { title: string };
    status: string;
}

export default function BookingsPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, [currentDate]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const dateStr = format(currentDate, "yyyy-MM-dd");
            const res = await fetch(`/api/bookings?date=${dateStr}`);
            const data = await res.json();
            if (data.bookings) {
                setBookings(data.bookings);
            }
        } catch (error) {
            toast.error("Failed to load bookings");
        } finally {
            setLoading(false);
        }
    };

    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekDays = eachDayOfInterval({
        start: weekStart,
        end: endOfWeek(currentDate, { weekStartsOn: 1 })
    });

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
                    <p className="text-gray-500">Manage your appointments and availability.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><Icon name="Settings" size={16} className="mr-2" /> Automation</Button>
                    <Button><Icon name="Plus" size={16} className="mr-2" /> New Appointment</Button>
                </div>
            </div>

            <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
                {/* Calendar Header */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={() => setCurrentDate(addDays(currentDate, -7))}>
                            <Icon name="ChevronLeft" size={16} />
                        </Button>
                        <h2 className="font-bold text-lg">{format(currentDate, "MMMM yyyy")}</h2>
                        <Button variant="ghost" size="sm" onClick={() => setCurrentDate(addDays(currentDate, 7))}>
                            <Icon name="ChevronRight" size={16} />
                        </Button>
                    </div>
                    <div className="flex bg-white rounded-lg p-1 border border-gray-200">
                        <button className="px-3 py-1 text-xs font-medium rounded bg-gray-100 text-gray-900">Week</button>
                        <button className="px-3 py-1 text-xs font-medium rounded text-gray-500 hover:text-gray-900">Day</button>
                        <button className="px-3 py-1 text-xs font-medium rounded text-gray-500 hover:text-gray-900">List</button>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="flex-1 overflow-auto flex">
                    {/* Time Column */}
                    <div className="w-16 border-r border-gray-100 bg-gray-50/30 flex-shrink-0">
                        {Array.from({ length: 13 }).map((_, i) => (
                            <div key={i} className="h-20 text-xs text-gray-400 text-center pt-2 border-b border-gray-50">
                                {i + 8}:00
                            </div>
                        ))}
                    </div>

                    {/* Days Columns */}
                    <div className="flex-1 grid grid-cols-7 divide-x divide-gray-100 min-w-[800px]">
                        {weekDays.map((day) => (
                            <div key={day.toString()} className="flex flex-col">
                                <div className={`p-2 text-center border-b border-gray-100 ${format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? 'bg-blue-50' : ''
                                    }`}>
                                    <div className="text-xs text-gray-500 uppercase">{format(day, 'EEE')}</div>
                                    <div className={`font-bold ${format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? 'text-blue-600' : 'text-gray-900'
                                        }`}>{format(day, 'd')}</div>
                                </div>

                                {/* Slots */}
                                <div className="flex-1 relative bg-white">
                                    {/* Render bookings here roughly based on time */}
                                    {bookings
                                        .filter(b => format(new Date(b.startsAt), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'))
                                        .map(booking => (
                                            <div key={booking.id} className="mx-1 mt-2 p-2 rounded bg-blue-100 border border-blue-200 text-blue-800 text-xs cursor-pointer hover:bg-blue-200 transition-colors">
                                                <div className="font-bold truncate">{booking.service?.title || "Service"}</div>
                                                <div className="truncate">{booking.customer?.firstName} {booking.customer?.lastName}</div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
