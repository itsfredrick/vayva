"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/format";
import { toast } from "sonner";
import { Loader2, Plus, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@vayva/ui";
export default function PayoutsPage() {
    const [loading, setLoading] = useState(true);
    const [payouts, setPayouts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const [accountsLoading, setAccountsLoading] = useState(true);
    useEffect(() => {
        fetchPayouts();
        fetchAccounts();
    }, []);
    const fetchPayouts = async () => {
        try {
            const res = await fetch("/api/wallet/payouts");
            if (!res.ok)
                throw new Error("Failed to load payouts");
            const data = await res.json();
            setPayouts(data.payouts || []);
        }
        catch (error) {
            console.error(error);
            toast.error("Could not load payout history");
        }
        finally {
            setLoading(false);
        }
    };
    const fetchAccounts = async () => {
        try {
            const res = await fetch("/api/wallet/payout-accounts");
            if (!res.ok)
                throw new Error("Failed to load payout accounts");
            const data = await res.json();
            setAccounts(Array.isArray(data) ? data : []);
        }
        catch (error) {
            console.error(error);
            toast.error("Could not load payout accounts");
        }
        finally {
            setAccountsLoading(false);
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold tracking-tight text-slate-900", children: "Payouts" }), _jsx("p", { className: "text-slate-500", children: "View your withdrawal history and request new payouts." })] }), _jsxs(Button, { onClick: () => setIsModalOpen(true), className: "gap-2 bg-indigo-600 text-white hover:bg-indigo-700 font-medium text-sm", children: [_jsx(Plus, { className: "h-4 w-4" }), "Withdraw Funds"] })] }), _jsx("div", { className: "bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden", children: loading ? (_jsx("div", { className: "p-8 flex justify-center", children: _jsx(Loader2, { className: "h-6 w-6 animate-spin text-slate-400" }) })) : payouts.length === 0 ? (_jsxs("div", { className: "p-12 text-center text-slate-500", children: [_jsx("p", { className: "mb-2", children: "No payouts found." }), _jsx("p", { className: "text-sm", children: "Initiate a withdrawal to get started." })] })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm text-left", children: [_jsx("thead", { className: "bg-slate-50 text-slate-600 font-medium border-b border-slate-100", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3", children: "Reference" }), _jsx("th", { className: "px-6 py-3", children: "Date" }), _jsx("th", { className: "px-6 py-3", children: "Amount" }), _jsx("th", { className: "px-6 py-3", children: "Destination" }), _jsx("th", { className: "px-6 py-3", children: "Status" })] }) }), _jsx("tbody", { className: "divide-y divide-slate-100", children: payouts.map((payout) => (_jsxs("tr", { className: "hover:bg-slate-50/50", children: [_jsx("td", { className: "px-6 py-4 font-mono text-slate-500", children: payout.reference }), _jsx("td", { className: "px-6 py-4 text-slate-900", children: new Date(payout.createdAt).toLocaleDateString() }), _jsx("td", { className: "px-6 py-4 font-medium text-slate-900", children: formatCurrency(payout.amount, payout.currency) }), _jsx("td", { className: "px-6 py-4 text-slate-600", children: _jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: "font-medium text-slate-900", children: payout.destination.bankName }), _jsxs("span", { className: "text-xs text-slate-500", children: ["\u2022\u2022\u2022\u2022 ", payout.destination.accountNumber.slice(-4)] })] }) }), _jsx("td", { className: "px-6 py-4", children: _jsx(StatusBadge, { status: payout.status }) })] }, payout.id))) })] }) })) }), _jsx(WithdrawalModal, { isOpen: isModalOpen, onClose: () => setIsModalOpen(false), onSuccess: () => {
                    setIsModalOpen(false);
                    fetchPayouts();
                    toast.success("Withdrawal requested successfully");
                }, accounts: accounts, accountsLoading: accountsLoading })] }));
}
function StatusBadge({ status }) {
    const styles = {
        PENDING: "bg-amber-100 text-amber-700 border-amber-200",
        PROCESSING: "bg-blue-100 text-blue-700 border-blue-200",
        SUCCESS: "bg-emerald-100 text-emerald-700 border-emerald-200",
        FAILED: "bg-red-100 text-red-700 border-red-200",
    };
    const icons = {
        SUCCESS: CheckCircle2,
        FAILED: AlertCircle,
    };
    const Icon = icons[status];
    return (_jsxs("span", { className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status] || "bg-slate-100 text-slate-700 border-slate-200"}`, children: [Icon && _jsx(Icon, { className: "h-3 w-3" }), status] }));
}
function WithdrawalModal({ isOpen, onClose, onSuccess, accounts, accountsLoading, }) {
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState("");
    const [pin, setPin] = useState("");
    const [accountId, setAccountId] = useState("");
    const [showStepUp, setShowStepUp] = useState(false);
    const [pendingWithdrawal, setPendingWithdrawal] = useState(null);
    useEffect(() => {
        if (!accountId && accounts.length > 0) {
            const preferred = accounts.find((a) => a.isDefault) || accounts[0];
            setAccountId(preferred.id);
        }
    }, [accounts, accountId]);
    if (!isOpen)
        return null;
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!accountId) {
                toast.error("Select a payout account first");
                return;
            }
            const res = await fetch("/api/wallet/withdraw", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: parseFloat(amount),
                    bankAccountId: accountId,
                    pin
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                if (data.code === "STEP_UP_REQUIRED") {
                    // Trigger step-up authentication flow
                    setPendingWithdrawal({
                        amount: parseFloat(amount),
                        bankAccountId: accountId,
                        pin
                    });
                    setShowStepUp(true);
                    return;
                }
                throw new Error(data.error || "Withdrawal failed");
            }
            onSuccess();
        }
        catch (error) {
            toast.error(error.message);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm", children: _jsxs("div", { className: "bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden", children: [_jsxs("div", { className: "flex justify-between items-center bg-slate-50/50 px-6 py-4 border-b border-slate-100", children: [_jsx("h3", { className: "font-semibold text-slate-900", children: "Request Withdrawal" }), _jsxs(Button, { variant: "ghost", size: "icon", onClick: onClose, className: "text-slate-400 hover:text-slate-600 h-8 w-8 rounded-full", children: [_jsx("span", { className: "sr-only", children: "Close" }), _jsx("span", { "aria-hidden": "true", className: "text-xl", children: "\u00D7" })] })] }), _jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Payout Account" }), accountsLoading ? (_jsx("div", { className: "text-sm text-slate-500", children: "Loading accounts..." })) : accounts.length === 0 ? (_jsx("div", { className: "text-sm text-amber-600 bg-amber-50 border border-amber-100 rounded-lg p-3", children: "No payout accounts found. Add one in Settings \u2192 Payments." })) : (_jsxs("select", { title: "Payout Account", required: true, value: accountId, onChange: (e) => setAccountId(e.target.value), className: "w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none", children: [_jsx("option", { value: "", children: "Select bank account" }), accounts.map((acc) => (_jsxs("option", { value: acc.id, children: [acc.bankName, " \u2022\u2022\u2022\u2022 ", acc.accountNumber.slice(-4), " (", acc.accountName, ")"] }, acc.id)))] }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Amount (NGN)" }), _jsxs("div", { className: "relative", children: [_jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium", children: "\u20A6" }), _jsx("input", { type: "number", required: true, min: "1000", step: "0.01", value: amount, onChange: (e) => setAmount(e.target.value), className: "w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all", placeholder: "0.00" })] }), _jsx("p", { className: "text-xs text-slate-500 mt-1", children: "Minimum withdrawal: \u20A61,000.00" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Transaction PIN" }), _jsx("input", { type: "password", required: true, value: pin, onChange: (e) => setPin(e.target.value), className: "w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all", placeholder: "Enter your PIN" })] }), _jsxs("div", { className: "pt-4 flex gap-3", children: [_jsx(Button, { type: "button", onClick: onClose, variant: "outline", className: "flex-1 text-slate-700 bg-white border-slate-300 hover:bg-slate-50 font-medium text-sm", children: "Cancel" }), _jsxs(Button, { type: "submit", disabled: loading, className: "flex-1 text-white bg-indigo-600 hover:bg-indigo-700 font-medium text-sm", children: [loading && _jsx(Loader2, { className: "h-4 w-4 animate-spin mr-2" }), loading ? "Processing..." : "Confirm Withdrawal"] })] })] }), showStepUp && pendingWithdrawal && (_jsx(StepUpDialog, { isOpen: showStepUp, onClose: () => {
                        setShowStepUp(false);
                        setPendingWithdrawal(null);
                    }, onVerify: async (password) => {
                        try {
                            const res = await fetch("/api/wallet/withdraw", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    ...pendingWithdrawal,
                                    password // Step-up verification
                                }),
                            });
                            const data = await res.json();
                            if (!res.ok) {
                                throw new Error(data.error || "Withdrawal failed");
                            }
                            setShowStepUp(false);
                            setPendingWithdrawal(null);
                            onSuccess();
                        }
                        catch (error) {
                            throw error; // Let StepUpDialog handle the error
                        }
                    } }))] }) }));
}
function StepUpDialog({ isOpen, onClose, onVerify, }) {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    if (!isOpen)
        return null;
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onVerify(password);
            toast.success("Withdrawal verified successfully");
        }
        catch (error) {
            toast.error(error.message || "Verification failed");
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm", children: _jsxs("div", { className: "bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden", children: [_jsx("div", { className: "px-6 py-4 border-b border-slate-100 bg-amber-50", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center", children: _jsx(AlertCircle, { className: "h-5 w-5 text-amber-600" }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-slate-900", children: "Security Verification Required" }), _jsx("p", { className: "text-xs text-slate-600", children: "Confirm your identity to proceed" })] })] }) }), _jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-4", children: [_jsx("div", { className: "bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-800", children: "For your security, please re-enter your account password to authorize this withdrawal." }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Account Password" }), _jsx("input", { type: "password", required: true, autoFocus: true, value: password, onChange: (e) => setPassword(e.target.value), className: "w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all", placeholder: "Enter your password" })] }), _jsxs("div", { className: "pt-2 flex gap-3", children: [_jsx(Button, { type: "button", onClick: onClose, disabled: loading, variant: "outline", className: "flex-1 text-slate-700 bg-white border-slate-300 hover:bg-slate-50 font-medium text-sm", children: "Cancel" }), _jsxs(Button, { type: "submit", disabled: loading, className: "flex-1 text-white bg-indigo-600 hover:bg-indigo-700 font-medium text-sm", children: [loading && _jsx(Loader2, { className: "h-4 w-4 animate-spin mr-2" }), loading ? "Verifying..." : "Verify & Proceed"] })] })] })] }) }));
}
