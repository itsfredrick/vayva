"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { Button } from "@vayva/ui";
import { ArrowUpRight } from "lucide-react";
import { WithdrawModal } from "./WithdrawModal";
export function WithdrawFundsTrigger() {
    const [isOpen, setIsOpen] = useState(false);
    return (_jsxs(_Fragment, { children: [_jsxs(Button, { onClick: () => setIsOpen(true), children: [_jsx(ArrowUpRight, { className: "mr-2 h-4 w-4" }), " Withdraw Funds"] }), _jsx(WithdrawModal, { isOpen: isOpen, onClose: () => setIsOpen(false) })] }));
}
