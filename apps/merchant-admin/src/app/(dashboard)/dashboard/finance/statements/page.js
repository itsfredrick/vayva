"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FileText, Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@vayva/ui";
export default function StatementsPage() {
    const statements = generatePastMonths(12);
    const handleDownload = (statement) => {
        toast.success(`Generating statement for ${statement.month} ${statement.year}...`);
        // In a real app, this would trigger a server-side PDF generation job
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold tracking-tight text-slate-900", children: "Statements" }), _jsx("p", { className: "text-slate-500", children: "Monthly financial statements for accounting." })] }) }), _jsx("div", { className: "bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm text-left", children: [_jsx("thead", { className: "bg-slate-50 text-slate-600 font-medium border-b border-slate-100", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3", children: "Period" }), _jsx("th", { className: "px-6 py-3", children: "Format" }), _jsx("th", { className: "px-6 py-3 text-right", children: "Action" })] }) }), _jsx("tbody", { className: "divide-y divide-slate-100", children: statements.map((stmt, idx) => (_jsxs("tr", { className: "hover:bg-slate-50/50", children: [_jsxs("td", { className: "px-6 py-4 flex items-center gap-3", children: [_jsx("div", { className: "h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600", children: _jsx(FileText, { className: "h-4 w-4" }) }), _jsxs("span", { className: "font-medium text-slate-900", children: [stmt.month, " ", stmt.year] })] }), _jsx("td", { className: "px-6 py-4 text-slate-500", children: "PDF, CSV" }), _jsx("td", { className: "px-6 py-4 text-right", children: _jsxs(Button, { onClick: () => handleDownload(stmt), variant: "ghost", size: "sm", className: "text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-medium h-8", children: [_jsx(Download, { className: "h-4 w-4 mr-2" }), "Download"] }) })] }, idx))) })] }) }) })] }));
}
function generatePastMonths(count) {
    const result = [];
    const date = new Date();
    // Start from previous month
    date.setDate(1);
    date.setMonth(date.getMonth() - 1);
    for (let i = 0; i < count; i++) {
        result.push({
            month: date.toLocaleString('default', { month: 'long' }),
            year: date.getFullYear()
        });
        date.setMonth(date.getMonth() - 1);
    }
    return result;
}
