
import React, { useState } from 'react';
import { Icon, Button } from '@vayva/ui';

interface FilterBarProps {
    onFilterChange: (filters: any) => void;
    onSearch: (query: string) => void;
    onRefresh: () => void;
}

export const FilterBar = ({ onFilterChange, onSearch, onRefresh }: FilterBarProps) => {
    const [status, setStatus] = useState('ALL');
    const [search, setSearch] = useState('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearch(val);
        // Debounce handled by parent or simple timeout here
        const timeoutId = setTimeout(() => onSearch(val), 400);
        return () => clearTimeout(timeoutId);
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setStatus(val);
        onFilterChange({ status: val });
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-6 p-1">
            <div className="flex-1 relative">
                <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                    type="text"
                    placeholder="Search by order ID, customer or ref..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        onSearch(e.target.value);
                    }}
                />
            </div>

            <div className="flex gap-2 text-sm">
                <select
                    className="pl-3 pr-8 py-2 border border-gray-200 rounded-lg bg-white focus:ring-black focus:border-black"
                    value={status}
                    onChange={handleStatusChange}
                >
                    <option value="ALL">All Status</option>
                    <option value="NEW">New</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="FULFILLED">Fulfilled</option>
                    {/* Add more from config */}
                </select>

                <select className="pl-3 pr-8 py-2 border border-gray-200 rounded-lg bg-white focus:ring-black focus:border-black">
                    <option value="ALL">All Time</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                </select>

                <select
                    className="pl-3 pr-8 py-2 border border-gray-200 rounded-lg bg-white focus:ring-black focus:border-black"
                    onChange={(e) => onFilterChange({ paymentStatus: e.target.value })}
                >
                    <option value="ALL">Payment</option>
                    <option value="PAID">Paid</option>
                    <option value="PENDING">Pending</option>
                    <option value="FAILED">Failed</option>
                </select>

                <button onClick={onRefresh} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500">
                    <Icon name="RefreshCw" size={16} />
                </button>
            </div>
        </div>
    );
};
