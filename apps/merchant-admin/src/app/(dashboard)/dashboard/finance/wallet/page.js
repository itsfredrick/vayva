import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { prisma } from "@vayva/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Adjust import if needed
import { Card, CardContent, CardHeader, CardTitle, CardDescription, } from "@/components/ui/card";
import { Button, EmptyState } from "@vayva/ui";
import { Wallet, Building2, Copy, } from "lucide-react";
import WalletGuard from "@/components/wallet/WalletGuard";
import { WithdrawFundsTrigger } from "@/components/wallet/WithdrawFundsTrigger";
async function getWallet(storeId) {
    const wallet = await prisma.wallet.findUnique({
        where: { storeId },
    });
    return wallet;
}
export default async function WalletPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
        return _jsx("div", { children: "Please login" });
    // Assuming session has storeId or we fetch it.
    // For demo, let's fetch the membership to get storeId like in other pages
    const membership = await prisma.membership.findFirst({
        where: { userId: session.user.id },
        select: { storeId: true },
    });
    if (!membership)
        return _jsx("div", { children: "No store found" });
    const wallet = await getWallet(membership.storeId);
    // Format currency
    const formatter = new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
    });
    const balance = wallet ? Number(wallet.availableKobo) / 100 : 0;
    const pending = wallet ? Number(wallet.pendingKobo) / 100 : 0;
    return (_jsx(WalletGuard, { children: _jsxs("div", { className: "flex-1 space-y-4 p-8 pt-6", children: [_jsxs("div", { className: "flex items-center justify-between space-y-2", children: [_jsx("h2", { className: "text-3xl font-bold tracking-tight", children: "Wallet & Payouts" }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Button, { variant: "outline", children: "History" }), _jsx(WithdrawFundsTrigger, {})] })] }), _jsxs("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: [_jsxs(Card, { className: "bg-black text-white", children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium text-gray-200", children: "Available Balance" }), _jsx(Wallet, { className: "h-4 w-4 text-gray-400" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: formatter.format(balance) }), _jsxs("p", { className: "text-xs text-gray-400", children: ["+ ", formatter.format(pending), " pending"] })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Virtual Account" }), _jsx(Building2, { className: "h-4 w-4 text-muted-foreground" })] }), _jsx(CardContent, { children: wallet && wallet.vaStatus === "CREATED" ? (_jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "text-xl font-bold flex items-center gap-2", children: [wallet.vaAccountNumber, _jsx(Copy, { className: "h-3 w-3 cursor-pointer text-muted-foreground" })] }), _jsxs("p", { className: "text-sm text-muted-foreground", children: [wallet.vaBankName, " \u2022 ", wallet.vaAccountName] }), _jsx("p", { className: "text-xs text-blue-600 mt-2 bg-blue-50 p-1 rounded inline-block", children: "Send money here to fund wallet" })] })) : (_jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("span", { className: "text-sm text-muted-foreground", children: "No active account. Complete KYC." }), _jsx(Button, { size: "sm", variant: "secondary", children: "Setup Account" })] })) })] })] }), _jsx("div", { className: "grid gap-4 md:grid-cols-1", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Recent Transactions" }), _jsx(CardDescription, { children: "Your recent inflows and payouts." })] }), _jsx(CardContent, { children: _jsx(EmptyState, { title: "No recent transactions", icon: "AlertCircle", description: "Your recent inflows and payouts will appear here." }) })] }) })] }) }));
}
