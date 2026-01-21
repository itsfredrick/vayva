"use client";

import React from "react";
import { Card } from "@vayva/ui";

export interface Column<T> {
    key: string;
    label: string;
    render?: (item: T) => React.ReactNode;
    mobileLabel?: string; // Optional label for mobile card view
    priority?: "high" | "medium" | "low"; // Determines visibility on mobile
}

interface ResponsiveTableProps<T> {
    data: T[];
    columns: Column<T>[];
    keyExtractor: (item: T) => string;
    onRowClick?: (item: T) => void;
    loading?: boolean;
    emptyMessage?: string;
}

export function ResponsiveTable<T extends Record<string, any>>({
    data,
    columns,
    keyExtractor,
    onRowClick,
    loading,
    emptyMessage = "No data available"
}: ResponsiveTableProps<T>) {

    if (loading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
                ))}
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <Card className="p-8 text-center text-gray-500">
                {emptyMessage}
            </Card>
        );
    }

    return (
        <>
            {/* Desktop Table View (hidden on mobile) */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.map((item) => (
                            <tr
                                key={keyExtractor(item)}
                                onClick={() => onRowClick?.(item)}
                                className={`
                  hover:bg-gray-50 transition-colors
                  ${onRowClick ? "cursor-pointer" : ""}
                `}
                            >
                                {columns.map((col) => (
                                    <td key={col.key} className="px-4 py-4 text-sm text-gray-900">
                                        {col.render ? col.render(item) : item[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View (visible only on mobile) */}
            <div className="md:hidden space-y-3">
                {data.map((item) => (
                    <Card
                        key={keyExtractor(item)}
                        className={`
              p-4 space-y-2
              ${onRowClick ? "cursor-pointer active:scale-[0.98] transition-transform" : ""}
            `}
                        onClick={() => onRowClick?.(item)}
                    >
                        {columns
                            .filter((col) => col.priority !== "low") // Hide low-priority columns on mobile
                            .map((col) => (
                                <div key={col.key} className="flex justify-between items-start gap-2">
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide min-w-[80px]">
                                        {col.mobileLabel || col.label}
                                    </span>
                                    <span className="text-sm text-gray-900 text-right flex-1">
                                        {col.render ? col.render(item) : item[col.key]}
                                    </span>
                                </div>
                            ))}
                    </Card>
                ))}
            </div>
        </>
    );
}
