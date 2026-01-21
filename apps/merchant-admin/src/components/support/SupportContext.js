"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useContext, useState } from "react";
import { SupportDrawer } from "./SupportDrawer";
const SupportContext = createContext(undefined);
export const SupportProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [context, setContext] = useState(undefined);
    const openSupport = (ctx) => {
        setContext(ctx);
        setIsOpen(true);
    };
    const closeSupport = () => {
        setIsOpen(false);
        setContext(undefined);
    };
    return (_jsxs(SupportContext.Provider, { value: { openSupport, closeSupport }, children: [children, _jsx(SupportDrawer, { isOpen: isOpen, onClose: closeSupport, initialContext: context })] }));
};
export const useSupport = () => {
    const context = useContext(SupportContext);
    if (!context) {
        throw new Error("useSupport must be used within a SupportProvider");
    }
    return context;
};
