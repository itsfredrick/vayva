"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { Button, Modal } from "@vayva/ui";
import { Plus } from "lucide-react";
import { BookingForm } from "./BookingForm";
export function CreateBookingModal({ services, customers }) {
    const [isOpen, setIsOpen] = useState(false);
    return (_jsxs(_Fragment, { children: [_jsxs(Button, { onClick: () => setIsOpen(true), children: [_jsx(Plus, { className: "mr-2", size: 16 }), " New Booking"] }), _jsx(Modal, { isOpen: isOpen, onClose: () => setIsOpen(false), title: "Create New Booking", className: "max-w-xl", children: _jsx(BookingForm, { services: services, customers: customers, onSuccess: () => setIsOpen(false) }) })] }));
}
