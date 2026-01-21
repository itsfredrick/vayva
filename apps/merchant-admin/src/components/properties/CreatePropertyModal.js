"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { Button, Modal } from "@vayva/ui";
import { Plus } from "lucide-react";
import { RealEstateForm } from "./RealEstateForm";
export function CreatePropertyModal({ isFirst = false }) {
    const [isOpen, setIsOpen] = useState(false);
    return (_jsxs(_Fragment, { children: [_jsxs(Button, { onClick: () => setIsOpen(true), children: [_jsx(Plus, { className: "mr-2", size: 16 }), " ", isFirst ? "Add First Property" : "Add Property"] }), _jsx(Modal, { isOpen: isOpen, onClose: () => setIsOpen(false), title: "List New Property", className: "max-w-xl", children: _jsx(RealEstateForm, { onSuccess: () => setIsOpen(false) }) })] }));
}
