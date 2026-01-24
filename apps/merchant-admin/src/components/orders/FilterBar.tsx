import React, { useState } from "react";
import { Search, Filter, CreditCard, RefreshCw, Calendar } from "lucide-react";
import { Button, Icon } from "@vayva/ui";

interface FilterBarProps {
  onFilterChange: (filters: any) => void;
  onSearch: (query: string) => void;
  onRefresh: () => void;
}

export const FilterBar = ({
  onFilterChange,
  onSearch,
  onRefresh,
}: FilterBarProps) => {
  const [status, setStatus] = useState("ALL");
  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8 p-1">
      <div className="flex-1 relative group">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors"
          size={18}
        />
        <input
          type="text"
          placeholder="Search by order ID, customer or ref..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-4 focus:ring-vayva-green/10 focus:border-vayva-green transition-all font-medium text-sm placeholder:text-gray-400"
          value={(search as any)}
          onChange={(e: any) => {
            setSearch(e.target.value);
            onSearch(e.target.value);
          }}
        />
      </div>

      <div className="flex gap-2 text-sm">
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
          <select
            aria-label="Filter by Status"
            className="pl-9 pr-8 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-4 focus:ring-vayva-green/10 focus:border-vayva-green appearance-none font-bold text-gray-700 cursor-pointer min-w-[120px]"
            value={(status as any)}
            onChange={(e: any) => {
              setStatus(e.target.value);
              onFilterChange({ status: e.target.value });
            }}
          >
            <option value="ALL">Status</option>
            <option value="NEW">New</option>
            <option value="PROCESSING">Processing</option>
            <option value="READY">Ready</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
          <select
            aria-label="Filter by Time"
            className="pl-9 pr-8 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-4 focus:ring-vayva-green/10 focus:border-vayva-green appearance-none font-bold text-gray-700 cursor-pointer min-w-[120px]"
          >
            <option value="ALL">Any Time</option>
            <option value="today">Today</option>
            <option value="7d">7 Days</option>
            <option value="30d">30 Days</option>
          </select>
        </div>

        <div className="relative">
          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
          <select
            aria-label="Filter by Payment"
            className="pl-9 pr-8 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-4 focus:ring-vayva-green/10 focus:border-vayva-green appearance-none font-bold text-gray-700 cursor-pointer min-w-[120px]"
            onChange={(e: any) => onFilterChange({ paymentStatus: e.target.value })}
          >
            <option value="ALL">Payment</option>
            <option value="PAID">Paid</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={onRefresh}
          className="border-gray-200 hover:bg-gray-50 text-gray-500 w-11 h-11 rounded-xl shadow-sm transition-all active:scale-90"
        >
          <RefreshCw size={18} />
        </Button>
      </div>
    </div>
  );
};
