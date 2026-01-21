import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { WalletTransactionType, WalletTransactionStatus, } from "@vayva/shared";
import { Icon, cn, Button } from "@vayva/ui";
export const TransactionList = ({ transactions, isLoading, }) => {
    if (isLoading) {
        return (_jsx("div", { className: "space-y-4", children: [1, 2, 3].map((i) => (_jsx("div", { className: "h-20 bg-gray-50 rounded-xl animate-pulse" }, i))) }));
    }
    if (transactions.length === 0) {
        return (_jsxs("div", { className: "text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200", children: [_jsx("div", { className: "w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-gray-400", children: _jsx(Icon, { name: "Receipt", size: 20 }) }), _jsx("h3", { className: "font-bold text-gray-900", children: "No transactions yet" }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Your wallet will reflect payments once customers place orders." })] }));
    }
    const getIcon = (type) => {
        switch (type) {
            case WalletTransactionType.PAYMENT:
                return "ArrowDownLeft";
            case WalletTransactionType.PAYOUT:
                return "ArrowUpRight";
            case WalletTransactionType.REFUND:
                return "RotateCcw";
            case WalletTransactionType.DISPUTE_HOLD:
                return "Lock";
            default:
                return "Circle";
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case WalletTransactionStatus.COMPLETED:
                return "bg-green-50 text-green-700";
            case WalletTransactionStatus.PENDING:
                return "bg-yellow-50 text-yellow-700";
            case WalletTransactionStatus.FAILED:
                return "bg-red-50 text-red-700";
            case WalletTransactionStatus.ON_HOLD:
                return "bg-orange-50 text-orange-700";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };
    const formatCurrency = (amount, currency) => {
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency,
        }).format(amount);
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "flex gap-2 overflow-x-auto pb-2", children: ["All", "Payments", "Payouts", "Refunds"].map((tab, i) => (_jsx(Button, { variant: "ghost", className: cn("px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap h-auto border", i === 0
                        ? "bg-black text-white hover:bg-black/90 border-black"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"), children: tab }, tab))) }), _jsx("div", { className: "space-y-3", children: transactions.map((txn) => {
                    const isPositive = txn.amount > 0;
                    return (_jsxs("div", { className: "bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow group", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", txn.type === WalletTransactionType.PAYOUT
                                            ? "bg-gray-100 text-gray-600"
                                            : txn.type === WalletTransactionType.DISPUTE_HOLD
                                                ? "bg-red-50 text-red-600"
                                                : "bg-blue-50 text-blue-600"), children: _jsx(Icon, { name: getIcon(txn.type), size: 18 }) }), _jsxs("div", { children: [_jsx("p", { className: "font-bold text-gray-900 text-sm", children: txn.description }), _jsxs("p", { className: "text-xs text-gray-500 mt-0.5", children: [new Date(txn.createdAt).toLocaleDateString(), " \u2022", " ", new Date(txn.createdAt).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })] })] })] }), _jsxs("div", { className: "text-right", children: [_jsxs("p", { className: cn("font-mono font-bold text-sm", isPositive ? "text-green-600" : "text-gray-900"), children: [isPositive ? "+" : "", formatCurrency(txn.amount, txn.currency)] }), _jsx("span", { className: cn("inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mt-1", getStatusColor(txn.status)), children: txn.status.replace("_", " ") })] })] }, txn.id));
                }) })] }));
};
