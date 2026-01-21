import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { KYCStatus } from "@vayva/shared";
import { Button, Icon, cn } from "@vayva/ui";
export const KYCCard = ({ kyc }) => {
    const isComplete = kyc.status === KYCStatus.APPROVED;
    const isReview = kyc.status === KYCStatus.IN_REVIEW;
    const isAction = kyc.status === KYCStatus.REQUIRES_ACTION || kyc.status === KYCStatus.FAILED;
    return (_jsxs("div", { className: "bg-white rounded-2xl border border-gray-200 p-6 flex flex-col h-full relative overflow-hidden group hover:border-gray-300 transition-colors", children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: cn("w-10 h-10 rounded-full flex items-center justify-center", isComplete
                                    ? "bg-green-50 text-green-600"
                                    : isReview
                                        ? "bg-blue-50 text-blue-600"
                                        : "bg-amber-50 text-amber-600"), children: _jsx(Icon, { name: "ShieldCheck", size: 20 }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-bold text-gray-900", children: "Identity & Compliance" }), _jsx("p", { className: "text-xs text-gray-500", children: "Required for withdrawals" })] })] }), isComplete && (_jsx("div", { className: "p-1 bg-green-100 rounded-full", children: _jsx(Icon, { name: "Check", size: 14, className: "text-green-700" }) }))] }), _jsx("div", { className: "flex-1", children: isComplete ? (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between text-sm py-2 border-b border-gray-50", children: [_jsx("span", { className: "text-gray-500", children: "Status" }), _jsxs("span", { className: "font-bold text-green-700 flex items-center gap-1", children: ["Verified ", _jsx(Icon, { name: "Check", size: 14 })] })] }), _jsxs("div", { className: "flex items-center justify-between text-sm py-2 border-b border-gray-50", children: [_jsx("span", { className: "text-gray-500", children: "Verified On" }), _jsx("span", { className: "font-mono text-gray-900", children: kyc.verifiedAt
                                        ? new Date(kyc.verifiedAt).toLocaleDateString()
                                        : "N/A" })] })] })) : (_jsxs("div", { className: "bg-gray-50 rounded-xl p-4 text-sm mb-4", children: [_jsx("p", { className: "font-bold text-gray-900 mb-1", children: isReview ? "Verification in Progress" : "Verification Required" }), _jsx("p", { className: "text-gray-600 leading-relaxed", children: isReview
                                ? "We are reviewing your documents. This usually takes 24 hours."
                                : "Submit your BVN or NIN to unlock withdrawals and higher limits." })] })) }), _jsx("div", { className: "mt-6", children: isComplete ? (_jsx(Button, { variant: "outline", className: "w-full text-gray-500", disabled: true, children: "Verification Complete" })) : isReview ? (_jsx(Button, { variant: "outline", className: "w-full", disabled: true, children: "In Review..." })) : (_jsxs(Button, { className: "w-full gap-2", children: ["Start Verification ", _jsx(Icon, { name: "ArrowRight", size: 16 })] })) })] }));
};
