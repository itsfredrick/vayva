"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button, Icon } from "@vayva/ui";
import { motion } from "framer-motion";
import { WalletService } from "@/services/wallet";
export const AddBankModal = ({ isOpen, onClose, onSuccess, }) => {
    const [bankName, setBankName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [accountName, setAccountName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    if (!isOpen)
        return null;
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await WalletService.addBank({
                bankName,
                accountNumber,
                accountName,
                bankCode: "000", // Test code
                isDefault: true,
            });
            onSuccess();
            onClose();
        }
        catch (err) {
            setError(err.response?.data?.error || "Failed to add bank account");
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm", onClick: (e) => e.target === e.currentTarget && onClose(), children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, className: "bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden", children: [_jsxs("div", { className: "flex items-center justify-between p-4 border-b border-gray-100", children: [_jsx("h3", { className: "font-bold text-black", children: "Add Bank Account" }), _jsx(Button, { variant: "ghost", size: "icon", onClick: onClose, className: "p-1 hover:bg-gray-100 rounded-full text-gray-400 h-auto w-auto", children: _jsx(Icon, { name: "X", size: 18 }) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "p-6 flex flex-col gap-4", children: [_jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("label", { className: "text-xs font-bold text-[#525252]", children: "Bank Name" }), _jsx("input", { required: true, className: "h-10 px-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5", value: bankName, onChange: (e) => setBankName(e.target.value), placeholder: "e.g. GTBank" })] }), _jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("label", { className: "text-xs font-bold text-[#525252]", children: "Account Number" }), _jsx("input", { required: true, maxLength: 10, className: "h-10 px-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5", value: accountNumber, onChange: (e) => setAccountNumber(e.target.value.replace(/\D/g, "")), placeholder: "0123456789" })] }), _jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("label", { className: "text-xs font-bold text-[#525252]", children: "Account Holder Name" }), _jsx("input", { required: true, className: "h-10 px-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5", value: accountName, onChange: (e) => setAccountName(e.target.value), placeholder: "John Doe" })] }), error && _jsx("p", { className: "text-red-500 text-xs", children: error }), _jsx(Button, { type: "submit", disabled: loading, className: "w-full mt-2", children: loading ? "Adding..." : "Add Account" })] })] }) }));
};
