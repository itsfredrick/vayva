"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { WalletService } from "@/services/wallet";
const WalletContext = createContext(undefined);
export const WalletProvider = ({ children }) => {
    const { user, merchant } = useAuth();
    const [summary, setSummary] = useState(null);
    const [ledger, setLedger] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLocked, setIsLocked] = useState(true);
    const [hasPin, setHasPin] = useState(false);
    const refreshWallet = async () => {
        setIsLoading(true);
        try {
            const s = await WalletService.getSummary();
            setSummary(s);
            setHasPin(s.pinSet);
            setIsLocked(s.status === "locked");
            const l = await WalletService.getLedger({});
            setLedger(l);
        }
        catch (error) {
            console.error("Failed to load wallet", error);
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        if (user) {
            refreshWallet();
        }
    }, [user]);
    const unlockWallet = async (pin) => {
        const isValid = await WalletService.verifyPin(pin);
        if (isValid) {
            setIsLocked(false);
            refreshWallet();
            return true;
        }
        return false;
    };
    const handleSetPin = async (pin) => {
        await WalletService.setPin(pin);
        setHasPin(true);
        setIsLocked(false);
        refreshWallet();
    };
    return (_jsx(WalletContext.Provider, { value: {
            summary,
            ledger,
            isLoading,
            isLocked,
            hasPin,
            unlockWallet,
            setPin: handleSetPin,
            refreshWallet,
        }, children: children }));
};
export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context)
        throw new Error("useWallet must be used within WalletProvider");
    return context;
};
