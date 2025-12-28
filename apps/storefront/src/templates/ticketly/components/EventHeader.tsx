import React from 'react';
import { Calendar, MapPin, User, Ticket } from 'lucide-react';
import Link from 'next/link';

interface EventHeaderProps {
    storeName?: string;
}

export const EventHeader = ({ storeName }: EventHeaderProps) => {
    return (
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Brand */}
                <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tighter text-gray-900">
                    <div className="bg-purple-600 text-white p-1 rounded-lg">
                        <Ticket size={18} strokeWidth={2.5} />
                    </div>
                    {storeName?.toUpperCase() || 'TICKETLY'}
                </Link>

                {/* Nav */}
                <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-gray-500">
                    <Link href="#" className="hover:text-purple-600 transition-colors">Upcoming Events</Link>
                    <Link href="#" className="hover:text-purple-600 transition-colors">Past Events</Link>
                    <Link href="#" className="hover:text-purple-600 transition-colors">Venues</Link>
                </nav>

                {/* Account */}
                <div className="flex items-center gap-3">
                    <button className="hidden sm:flex items-center gap-2 text-sm font-bold text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors">
                        <User size={16} /> My Tickets
                    </button>
                </div>
            </div>
        </header>
    );
};
