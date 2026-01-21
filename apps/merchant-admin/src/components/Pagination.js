"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@vayva/ui";
import { ChevronLeft, ChevronRight } from "lucide-react";
export function Pagination({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange, onItemsPerPageChange, showItemsPerPage = true, }) {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    const canGoPrevious = currentPage > 1;
    const canGoNext = currentPage < totalPages;
    const handlePrevious = () => {
        if (canGoPrevious) {
            onPageChange(currentPage - 1);
        }
    };
    const handleNext = () => {
        if (canGoNext) {
            onPageChange(currentPage + 1);
        }
    };
    const handlePageClick = (page) => {
        onPageChange(page);
    };
    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 7;
        if (totalPages <= maxPagesToShow) {
            // Show all pages
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        }
        else {
            // Show first page
            pages.push(1);
            if (currentPage > 3) {
                pages.push("...");
            }
            // Show pages around current page
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            if (currentPage < totalPages - 2) {
                pages.push("...");
            }
            // Show last page
            pages.push(totalPages);
        }
        return pages;
    };
    if (totalPages <= 1) {
        return null;
    }
    return (_jsxs("div", { className: "flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6", children: [_jsxs("div", { className: "flex flex-1 justify-between sm:hidden", children: [_jsx(Button, { onClick: handlePrevious, disabled: !canGoPrevious, variant: "outline", size: "sm", children: "Previous" }), _jsx(Button, { onClick: handleNext, disabled: !canGoNext, variant: "outline", size: "sm", children: "Next" })] }), _jsxs("div", { className: "hidden sm:flex sm:flex-1 sm:items-center sm:justify-between", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("p", { className: "text-sm text-gray-700", children: ["Showing ", _jsx("span", { className: "font-medium", children: startItem }), " to", " ", _jsx("span", { className: "font-medium", children: endItem }), " of", " ", _jsx("span", { className: "font-medium", children: totalItems }), " results"] }), showItemsPerPage && onItemsPerPageChange && (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("label", { htmlFor: "items-per-page", className: "text-sm text-gray-700", children: "Per page:" }), _jsxs("select", { id: "items-per-page", value: itemsPerPage, onChange: (e) => onItemsPerPageChange(Number(e.target.value)), className: "rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary", children: [_jsx("option", { value: 10, children: "10" }), _jsx("option", { value: 25, children: "25" }), _jsx("option", { value: 50, children: "50" }), _jsx("option", { value: 100, children: "100" })] })] }))] }), _jsxs("nav", { className: "isolate inline-flex -space-x-px rounded-md shadow-sm", "aria-label": "Pagination", children: [_jsxs(Button, { variant: "ghost", onClick: handlePrevious, disabled: !canGoPrevious, className: "relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-none h-auto min-w-[36px]", children: [_jsx("span", { className: "sr-only", children: "Previous" }), _jsx(ChevronLeft, { className: "h-5 w-5", "aria-hidden": "true" })] }), getPageNumbers().map((page, index) => {
                                if (page === "...") {
                                    return (_jsx("span", { className: "relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300", children: "..." }, `ellipsis-${index}`));
                                }
                                const pageNumber = page;
                                const isCurrentPage = pageNumber === currentPage;
                                return (_jsx(Button, { variant: isCurrentPage ? "primary" : "ghost", onClick: () => handlePageClick(pageNumber), className: `relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 rounded-none h-auto min-w-[40px] ${isCurrentPage
                                        ? "z-10 bg-primary text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary hover:bg-primary/90"
                                        : "text-gray-900 hover:bg-gray-50 bg-white"}`, children: pageNumber }, pageNumber));
                            }), _jsxs(Button, { variant: "ghost", onClick: handleNext, disabled: !canGoNext, className: "relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-none h-auto min-w-[36px]", children: [_jsx("span", { className: "sr-only", children: "Next" }), _jsx(ChevronRight, { className: "h-5 w-5", "aria-hidden": "true" })] })] })] })] }));
}
