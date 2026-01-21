"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { PinEntryModal } from "@/components/security/PinEntryModal";
const SecurityContext = createContext(undefined);
// Routes that ALWAYS require PIN session
const PROTECTED_ROUTES = [
    "/admin/orders",
    "/admin/finance",
    "/admin/settings", // General settings access
];
export const SecurityProvider = ({ children, }) => {
    const [isPinVerified, setIsPinVerified] = useState(false);
    const [showPinModal, setShowPinModal] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);
    const [hasPinSet, setHasPinSet] = useState(true); // Assume true initially, check later
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useAuth(); // Assume we can get pin status from user/wallet eventually
    // Reset verification on hard refresh or long timeout?
    // For now, simple state is enough (per session).
    const requirePin = (onSuccess) => {
        if (isPinVerified) {
            onSuccess();
        }
        else {
            setPendingAction(() => onSuccess);
            setShowPinModal(true);
        }
    };
    const resetPinSession = () => setIsPinVerified(false);
    const handleSuccess = () => {
        setIsPinVerified(true);
        setShowPinModal(false);
        if (pendingAction) {
            pendingAction();
            setPendingAction(null);
        }
    };
    // Route Guard Effect
    useEffect(() => {
        // Check if current route is protected
        const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
        if (isProtected && !isPinVerified) {
            // Trigger PIN modal immediately
            // But verify if they even HAVE a PIN set first?
            // For MVP remediation, assume if not set, we force setup or allow.
            // Let's force PIN check.
            setShowPinModal(true);
        }
    }, [pathname, isPinVerified]);
    return (_jsxs(SecurityContext.Provider, { value: { isPinVerified, requirePin, resetPinSession }, children: [children, _jsx(PinEntryModal, { isOpen: showPinModal, onSuccess: handleSuccess, isSetupMode: false, 
                // If on protected route, cannot close without going back?
                onClose: () => {
                    setShowPinModal(false);
                    // If on protected route, redirect to dashboard or safe zone
                    const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
                    if (isProtected) {
                        router.push("/admin/dashboard");
                    }
                } })] }));
};
export const useSecurity = () => {
    const context = useContext(SecurityContext);
    if (!context)
        throw new Error("useSecurity must be used within SecurityProvider");
    return context;
};
