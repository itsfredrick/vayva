import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Button, Icon, Modal, cn } from "@vayva/ui";
export const WithdrawalModal = ({ isOpen, onClose, availableBalance, onSuccess, }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [eligibility, setEligibility] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState("");
    const [amount, setAmount] = useState(0);
    const [quote, setQuote] = useState(null);
    // Load Eligibility on Open
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setLoading(true);
            Promise.all([
                fetch("/api/wallet/withdraw/eligibility").then((r) => r.json()),
                fetch("/api/wallet/payout-accounts").then((r) => r.json()),
            ]).then(([eligRes, accRes]) => {
                setEligibility(eligRes);
                setAccounts(accRes);
                if (accRes.length > 0)
                    setSelectedAccount(accRes[0].id);
                setLoading(false);
            });
        }
    }, [isOpen]);
    const handleGetQuote = async () => {
        if (!amount || amount <= 0)
            return;
        setLoading(true);
        const res = await fetch("/api/wallet/withdraw/quote", {
            method: "POST",
            body: JSON.stringify({ amount, payout_account_id: selectedAccount }),
        });
        const q = await res.json();
        setQuote(q);
        setLoading(false);
        setStep(3);
    };
    const handleConfirm = async () => {
        setLoading(true);
        try {
            await fetch("/api/wallet/withdraw", {
                method: "POST",
                body: JSON.stringify({ amount, payout_account_id: selectedAccount }),
            });
            onSuccess();
            onClose();
        }
        catch (e) {
            console.error(e);
            alert("Withdrawal failed. Please try again.");
        }
        finally {
            setLoading(false);
        }
    };
    const StepIndicator = () => (_jsxs("div", { className: "flex items-center gap-2 mb-6 text-xs font-bold text-gray-400", children: [_jsx("span", { className: cn(step >= 1 ? "text-black" : ""), children: "1. Check" }), _jsx("span", { className: "h-px w-4 bg-gray-200" }), _jsx("span", { className: cn(step >= 2 ? "text-black" : ""), children: "2. Value" }), _jsx("span", { className: "h-px w-4 bg-gray-200" }), _jsx("span", { className: cn(step >= 3 ? "text-black" : ""), children: "3. Review" })] }));
    return (_jsx(Modal, { isOpen: isOpen, onClose: onClose, title: "Withdraw Funds", className: "max-w-lg", children: _jsxs("div", { className: "space-y-6", children: [_jsx(StepIndicator, {}), step === 1 && (_jsxs("div", { className: "space-y-4", children: [loading && (_jsx("div", { className: "text-gray-500 text-sm", children: "Checking eligibility..." })), eligibility && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-600", children: "KYC Status" }), eligibility.kycStatus === "verified" ? (_jsx("span", { className: "text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md", children: "Verified" })) : (_jsxs("span", { className: "text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md flex items-center gap-1", children: [_jsx(Icon, { name: "AlertTriangle", size: 12 }), " Action Required"] }))] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-600", children: "Payout Account" }), eligibility.hasPayoutAccount ? (_jsx("span", { className: "text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md", children: "Added" })) : (_jsx("span", { className: "text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md", children: "Missing" }))] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-600", children: "Available Balance" }), _jsxs("span", { className: "font-mono text-sm font-bold", children: ["\u20A6", availableBalance.toLocaleString()] })] })] }), eligibility.isEligible ? (_jsx(Button, { onClick: () => setStep(2), className: "w-full", children: "Continue" })) : (_jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-sm text-red-600 font-medium mb-3", children: eligibility.blockedReasons[0] ||
                                                "Please resolve the issues above." }), _jsx(Button, { variant: "outline", className: "w-full", onClick: onClose, children: "Close" })] }))] }))] })), step === 2 && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-xs font-bold text-gray-500 uppercase", children: "Payout Account" }), accounts.map((acc) => (_jsxs("div", { onClick: () => setSelectedAccount(acc.id), className: cn("p-4 border rounded-xl cursor-pointer transition-all flex items-center justify-between", selectedAccount === acc.id
                                        ? "border-black bg-gray-50 shadow-sm"
                                        : "border-gray-200"), children: [_jsxs("div", { children: [_jsx("div", { className: "font-bold text-sm text-gray-900", children: acc.bankName }), _jsxs("div", { className: "text-xs text-gray-500", children: [acc.accountName, " \u2022 ", acc.accountNumber] })] }), selectedAccount === acc.id && (_jsx(Icon, { name: "Check", size: 16, className: "text-black" }))] }, acc.id))), _jsx(Button, { variant: "link", className: "text-xs font-bold text-black underline pl-1 pt-1 h-auto p-0 hover:no-underline", children: "+ Add another account" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-xs font-bold text-gray-500 uppercase", children: "Amount to Withdraw" }), _jsxs("div", { className: "relative", children: [_jsx("span", { className: "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold", children: "\u20A6" }), _jsx("input", { type: "number", value: amount || "", onChange: (e) => setAmount(Number(e.target.value)), className: "w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl font-mono text-lg font-bold focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-shadow", placeholder: "0.00" })] }), _jsxs("div", { className: "flex justify-between items-center text-xs text-gray-500 px-1", children: [_jsxs("span", { children: ["Balance: \u20A6", availableBalance.toLocaleString()] }), _jsx(Button, { variant: "link", onClick: () => setAmount(availableBalance), className: "font-bold text-blue-600 hover:underline h-auto p-0", children: "Max" })] })] }), _jsxs("div", { className: "flex gap-3 pt-4", children: [_jsx(Button, { variant: "outline", onClick: () => setStep(1), className: "flex-1", children: "Back" }), _jsx(Button, { onClick: handleGetQuote, className: "flex-1", disabled: !amount || amount > availableBalance || loading, children: loading ? "Calculating..." : "Review" })] })] })), step === 3 && quote && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-gray-50 border border-gray-100 rounded-xl p-5 space-y-3", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-gray-500", children: "Amount" }), _jsxs("span", { className: "font-bold font-mono", children: ["\u20A6", quote.amount.toLocaleString()] })] }), _jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-gray-500", children: "Service Fee" }), _jsxs("span", { className: "font-bold font-mono text-gray-600", children: ["- \u20A6", quote.fee.toLocaleString()] })] }), _jsx("div", { className: "h-px bg-gray-200 my-2" }), _jsxs("div", { className: "flex justify-between text-base", children: [_jsx("span", { className: "font-bold text-gray-900", children: "Total to You" }), _jsxs("span", { className: "font-bold font-mono text-green-600", children: ["\u20A6", quote.netAmount.toLocaleString()] })] })] }), _jsxs("div", { className: "flex items-start gap-2 bg-blue-50 text-blue-800 p-4 rounded-xl text-xs", children: [_jsx(Icon, { name: "Info", size: 16, className: "shrink-0 mt-0.5" }), _jsxs("p", { children: ["Funds will arrive in your", " ", _jsx("strong", { children: accounts.find((a) => a.id === selectedAccount)?.bankName }), " ", "account ", quote.estimatedArrival, "."] })] }), _jsxs("div", { className: "flex gap-3 pt-2", children: [_jsx(Button, { variant: "outline", onClick: () => setStep(2), className: "flex-1", children: "Back" }), _jsx(Button, { onClick: handleConfirm, className: "flex-1", disabled: loading, children: loading ? "Processing..." : "Confirm Withdrawal" })] })] }))] }) }));
};
