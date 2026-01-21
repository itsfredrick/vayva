"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useOnboarding } from "../OnboardingContext";
import { Button, Input, Label } from "@vayva/ui"; // Removed Select, SelectContent, SelectItem, SelectTrigger, SelectValue
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, CheckCircle2 } from "lucide-react";
export default function PaymentStep() {
    const { nextStep, prevStep, updateData, state, isSaving } = useOnboarding();
    const [accountNumber, setAccountNumber] = useState(state.finance?.accountNumber || "");
    const [selectedBankCode, setSelectedBankCode] = useState(state.finance?.bankCode || ""); // Initialize with existing state
    const [banks, setBanks] = useState([]);
    const [resolvedName, setResolvedName] = useState(state.finance?.accountName || ""); // Initialize with existing state
    const [resolving, setResolving] = useState(false);
    const [loadingBanks, setLoadingBanks] = useState(true);
    useEffect(() => {
        // Load Banks
        fetch("/api/payments/banks")
            .then(res => res.json())
            .then(data => {
            if (Array.isArray(data))
                setBanks(data);
        })
            .catch(() => toast.error("Failed to load banks"))
            .finally(() => setLoadingBanks(false));
    }, []);
    // Auto-resolve when account number is 10 digits and bank selected
    useEffect(() => {
        if (accountNumber.length === 10 && selectedBankCode) {
            resolveAccount();
        }
        else {
            // Only clear if it was previously resolved and conditions are no longer met
            if (resolvedName && (accountNumber.length !== 10 || !selectedBankCode)) {
                setResolvedName("");
            }
        }
    }, [accountNumber, selectedBankCode]);
    const resolveAccount = async () => {
        setResolving(true);
        try {
            const res = await fetch(`/api/payments/resolve?account_number=${accountNumber}&bank_code=${selectedBankCode}`);
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.error || "Could not resolve account");
            setResolvedName(data.account_name);
            toast.success("Account verified!");
        }
        catch (error) {
            setResolvedName("");
            toast.error(error.message);
        }
        finally {
            setResolving(false);
        }
    };
    const handleContinue = () => {
        if (!resolvedName) {
            toast.error("Please resolve the account name first.");
            return;
        }
        const bank = banks.find(b => b.code === selectedBankCode);
        updateData({
            finance: {
                bankCode: selectedBankCode,
                bankName: bank?.name || "",
                accountNumber,
                accountName: resolvedName,
                methods: {
                    bankTransfer: true,
                    cash: false,
                    pos: false
                }
            },
        });
        nextStep();
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Payout Details" }), _jsx("p", { className: "text-gray-500", children: "Where should we send your money?" })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "bankSelect", children: "Select Bank" }), _jsxs("select", { id: "bankSelect", value: selectedBankCode, onChange: (e) => setSelectedBankCode(e.target.value), disabled: loadingBanks, className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", title: "Select Bank", children: [_jsx("option", { value: "", disabled: true, children: "Select a bank" }), banks.map((bank) => (_jsx("option", { value: bank.code, children: bank.name }, bank.code)))] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "accountNumber", children: "Account Number" }), _jsxs("div", { className: "relative", children: [_jsx(Input, { id: "accountNumber", placeholder: "0123456789", value: accountNumber, onChange: (e) => setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 10)), maxLength: 10, className: resolvedName ? "border-green-500 pr-10" : "" }), resolving && (_jsx("div", { className: "absolute right-3 top-2.5", children: _jsx(Loader2, { className: "h-5 w-5 animate-spin text-gray-400" }) })), resolvedName && !resolving && (_jsx("div", { className: "absolute right-3 top-2.5", children: _jsx(CheckCircle2, { className: "h-5 w-5 text-green-500" }) }))] })] }), resolvedName && (_jsxs("div", { className: "p-3 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-100 flex items-center justify-between animate-in fade-in slide-in-from-top-2", children: [_jsx("span", { children: "Account Name:" }), _jsx("span", { className: "font-bold", children: resolvedName })] }))] }), _jsxs("div", { className: "pt-4 flex gap-3", children: [_jsx(Button, { variant: "outline", onClick: prevStep, disabled: isSaving, children: "Back" }), _jsx(Button, { className: "flex-1", onClick: handleContinue, disabled: !resolvedName || isSaving || resolving, children: "Continue" })] })] }));
}
