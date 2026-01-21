"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button, Input } from "@vayva/ui";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, TrendingUp, DollarSign, Wallet, CreditCard, Lock, AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { PermissionGate } from "@/components/auth/PermissionGate";
import { PERMISSIONS } from "@/lib/core/permissions";
export default function FinancePage() {
    const [loading, setLoading] = useState(true);
    const [overview, setOverview] = useState(null);
    const [payouts, setPayouts] = useState([]);
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [storeStatus, setStoreStatus] = useState({ kycStatus: "NONE" });
    const [dailySales, setDailySales] = useState([]);
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [selectedBankId, setSelectedBankId] = useState("");
    const [password, setPassword] = useState("");
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState("DETAILS");
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        try {
            setLoading(true);
            const [overviewRes, payoutsRes, storeRes, beneficiariesRes] = await Promise.all([
                fetch("/api/finance/overview"),
                fetch("/api/finance/payouts"),
                fetch("/api/store/status"),
                fetch("/api/settings/payouts")
            ]);
            if (overviewRes.ok) {
                const data = await overviewRes.json();
                setOverview(data);
                if (data.dailySales)
                    setDailySales(data.dailySales);
            }
            if (payoutsRes.ok)
                setPayouts(await payoutsRes.json());
            if (storeRes.ok)
                setStoreStatus(await storeRes.json());
            if (beneficiariesRes.ok)
                setBeneficiaries(await beneficiariesRes.json());
        }
        catch (error) {
            toast.error("Failed to load finance data");
        }
        finally {
            setLoading(false);
        }
    };
    const handleWithdraw = async () => {
        if (!withdrawAmount || isNaN(Number(withdrawAmount))) {
            toast.error("Please enter a valid amount");
            return;
        }
        if (!selectedBankId) {
            toast.error("Please select a bank account");
            return;
        }
        if (step === "DETAILS") {
            setStep("AUTH");
            return;
        }
        if (!password) {
            toast.error("Password is required");
            return;
        }
        try {
            setIsWithdrawing(true);
            const selectedBank = beneficiaries.find(b => b.id === selectedBankId);
            const res = await fetch("/api/finance/payouts", {
                method: "POST",
                body: JSON.stringify({
                    amount: Number(withdrawAmount),
                    bankDetails: {
                        bankCode: "000",
                        accountNumber: selectedBank?.accountNumber
                    },
                    password
                })
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to request payout");
            }
            toast.success("Payout requested successfully");
            setOpen(false);
            setWithdrawAmount("");
            setPassword("");
            setStep("DETAILS");
            fetchData();
        }
        catch (error) {
            toast.error(error.message);
        }
        finally {
            setIsWithdrawing(false);
        }
    };
    if (loading) {
        return _jsx("div", { className: "flex items-center justify-center h-96", children: _jsx(Loader2, { className: "animate-spin" }) });
    }
    const currency = overview?.currency || "NGN";
    const canWithdraw = overview && overview.availableBalance > 0 && storeStatus.kycStatus === "VERIFIED";
    return (_jsx(PermissionGate, { permission: PERMISSIONS.FINANCE_VIEW, fallback: _jsxs("div", { className: "p-8 text-center bg-white border rounded-2xl shadow-sm", children: [_jsx(Lock, { className: "w-12 h-12 text-gray-200 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-bold", children: "Access Restricted" }), _jsx("p", { className: "text-gray-500", children: "You do not have permission to view financial records." })] }), children: _jsxs("div", { className: "space-y-6 max-w-6xl mx-auto pb-10", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-black tracking-tight text-black", children: "Finance" }), _jsx("p", { className: "text-gray-500", children: "Manage your earnings, payouts, and bank details." })] }), _jsxs("div", { className: "flex gap-2 items-center", children: [_jsxs("div", { className: "flex items-center space-x-2 mr-4", children: [_jsx(Switch, { id: "payout-notifs", checked: notificationsEnabled, onCheckedChange: setNotificationsEnabled }), _jsx(Label, { htmlFor: "payout-notifs", children: "Payout Alerts" })] }), _jsxs(Dialog, { open: open, onOpenChange: (o) => {
                                        setOpen(o);
                                        if (!o) {
                                            setStep("DETAILS");
                                            setPassword("");
                                        }
                                    }, children: [_jsx(DialogTrigger, { asChild: true, children: _jsxs(Button, { disabled: !canWithdraw, className: "bg-vayva-green text-white hover:bg-vayva-green/90 shadow-lg shadow-green-500/20 font-bold", children: [_jsx(Wallet, { className: "mr-2 h-4 w-4" }), " Withdraw Funds"] }) }), _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Withdraw Funds" }), _jsxs(DialogDescription, { children: ["Available Balance: ", _jsx("b", { children: formatCurrency(overview?.availableBalance || 0, currency) })] })] }), storeStatus.kycStatus !== "VERIFIED" && (_jsxs(Alert, { variant: "destructive", children: [_jsx(AlertTriangle, { className: "h-4 w-4" }), _jsx(AlertTitle, { children: "KYC Required" }), _jsx(AlertDescription, { children: "You must verify your identity before withdrawing funds." })] })), step === "DETAILS" ? (_jsxs("div", { className: "grid gap-4 py-4", children: [_jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "bank", children: "Destination Account" }), _jsxs(Select, { value: selectedBankId, onValueChange: setSelectedBankId, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select bank account" }) }), _jsx(SelectContent, { children: beneficiaries.map(b => (_jsxs(SelectItem, { value: b.id, children: [b.bankName, " - ", b.accountNumber] }, b.id))) })] }), beneficiaries.length === 0 && (_jsx("p", { className: "text-xs text-red-500", children: "No bank accounts found. Please add one in Settings." }))] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "amount", children: "Amount" }), _jsx(Input, { id: "amount", type: "number", value: withdrawAmount, onChange: (e) => setWithdrawAmount(e.target.value), placeholder: "0.00", min: 1000 }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Min withdrawal: \u20A61,000" })] })] })) : (_jsx("div", { className: "grid gap-4 py-4", children: _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "password", children: "Confirm Password" }), _jsx(Input, { id: "password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "Enter your login password" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Security check to authorize this transfer." })] }) })), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setOpen(false), children: "Cancel" }), step === "DETAILS" ? (_jsx(Button, { onClick: () => setStep("AUTH"), disabled: !withdrawAmount || !selectedBankId, children: "Next" })) : (_jsxs(Button, { onClick: handleWithdraw, disabled: isWithdrawing || !password, children: [isWithdrawing && _jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), "Confirm Withdrawal"] }))] })] })] })] })] }), storeStatus.kycStatus !== "VERIFIED" && (_jsxs(Alert, { variant: "destructive", className: "mb-6", children: [_jsx(Lock, { className: "h-4 w-4" }), _jsx(AlertTitle, { children: "Payouts Paused" }), _jsx(AlertDescription, { children: "Your account is currently unverified. Please complete KYC verification in Settings to enable withdrawals." }), _jsx(Button, { variant: "outline", size: "sm", className: "mt-2 bg-white text-destructive border-transparent hover:bg-gray-100", children: "Verify Now" })] })), _jsxs("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-bold text-black", children: "Total Sales" }), _jsx(DollarSign, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: formatCurrency(overview?.totalSales || 0, currency) }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Gross sales volume" })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-bold text-black", children: "Platform Fees" }), _jsx(TrendingUp, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: formatCurrency(overview?.platformFees || 0, currency) }), _jsx("p", { className: "text-xs text-muted-foreground", children: "3% platform commission" })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-bold text-black", children: "Net Earnings" }), _jsx(CreditCard, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: formatCurrency(overview?.netEarnings || 0, currency) }), _jsx("p", { className: "text-xs text-muted-foreground", children: "After fees deduction" })] })] }), _jsxs(Card, { className: "bg-studio-gray border-studio-border", children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-bold text-black", children: "Available Balance" }), _jsx(Wallet, { className: "h-4 w-4 text-vayva-green" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-black text-black", children: formatCurrency(overview?.availableBalance || 0, currency) }), _jsxs("p", { className: "text-xs text-gray-500", children: ["Pending: ", formatCurrency(overview?.pendingBalance || 0, currency), " (7-day hold)"] })] })] })] }), _jsxs("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-7", children: [_jsxs(Card, { className: "col-span-4", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Sales Overview" }) }), _jsx(CardContent, { className: "pl-2", children: _jsx(ResponsiveContainer, { width: "100%", height: 350, children: _jsxs(BarChart, { data: dailySales, children: [_jsx(XAxis, { dataKey: "name", stroke: "#888888", fontSize: 12, tickLine: false, axisLine: false }), _jsx(YAxis, { stroke: "#888888", fontSize: 12, tickLine: false, axisLine: false, tickFormatter: (value) => `₦${value}` }), _jsx(Bar, { dataKey: "sales", fill: "#22C55E", radius: [4, 4, 0, 0] }), _jsx(Tooltip, {})] }) }) })] }), _jsx("div", { className: "col-span-3", children: _jsxs(Tabs, { defaultValue: "history", children: [_jsx(TabsList, { className: "w-full", children: _jsx(TabsTrigger, { value: "history", className: "w-full", children: "Payout History" }) }), _jsx(TabsContent, { value: "history", className: "space-y-4", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Recent Payouts" }), _jsx(CardDescription, { children: "History of your withdrawal requests." })] }), _jsx(CardContent, { children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Reference" }), _jsx(TableHead, { children: "Amount" }), _jsx(TableHead, { children: "Status" })] }) }), _jsxs(TableBody, { children: [payouts.length === 0 && (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 3, className: "text-center h-24 text-muted-foreground", children: "No payouts found." }) })), payouts.slice(0, 5).map((payout) => (_jsxs(TableRow, { children: [_jsx(TableCell, { className: "font-mono text-xs max-w-[80px] truncate", title: payout.reference, children: payout.reference }), _jsx(TableCell, { children: formatCurrency(payout.amount, currency) }), _jsx(TableCell, { children: _jsx(Badge, { variant: payout.status === "SUCCESS" ? "default" : payout.status === "FAILED" ? "destructive" : "secondary", children: payout.status }) })] }, payout.id)))] })] }) })] }) })] }) })] })] }) }));
}
