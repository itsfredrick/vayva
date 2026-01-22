
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button, Icon, IconName, Input, Switch, cn } from "@vayva/ui";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, TrendingUp, DollarSign, Wallet, CreditCard, Lock, Building, AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PermissionGate } from "@/components/auth/PermissionGate";
import { PERMISSIONS } from "@/lib/core/permissions";

interface FinanceOverview {
    totalSales: number;
    platformFees: number;
    netEarnings: number;
    pendingBalance: number;
    availableBalance: number;
    currency: string;
    dailySales?: unknown[];
}

interface Payout {
    id: string;
    amount: number;
    status: string;
    destination: unknown;
    reference: string;
    createdAt: string;
}

interface BankBeneficiary {
    id: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
    isDefault: boolean;
}

interface StoreStatus {
    kycStatus: "NONE" | "PENDING" | "VERIFIED" | "FAILED";
}

export default function FinancePage() {
    const [loading, setLoading] = useState(true);
    const [overview, setOverview] = useState<FinanceOverview | null>(null);
    const [payouts, setPayouts] = useState<Payout[]>([]);
    const [beneficiaries, setBeneficiaries] = useState<BankBeneficiary[]>([]);
    const [storeStatus, setStoreStatus] = useState<StoreStatus>({ kycStatus: "NONE" });
    const [dailySales, setDailySales] = useState<any[]>([]);

    const [withdrawAmount, setWithdrawAmount] = useState<string>("");
    const [selectedBankId, setSelectedBankId] = useState<string>("");
    const [password, setPassword] = useState("");
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState<"DETAILS" | "AUTH">("DETAILS");
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
                if (data.dailySales) setDailySales(data.dailySales);
            }
            if (payoutsRes.ok) setPayouts(await payoutsRes.json());
            if (storeRes.ok) setStoreStatus(await storeRes.json());
            if (beneficiariesRes.ok) setBeneficiaries(await beneficiariesRes.json());

        } catch (error) {
            toast.error("Failed to load finance data");
        } finally {
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
        } catch (error: unknown) {
            toast.error(error.message);
        } finally {
            setIsWithdrawing(false);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-96"><Loader2 className="animate-spin" /></div>;
    }

    const currency = overview?.currency || "NGN";
    const canWithdraw = overview && overview.availableBalance > 0 && storeStatus.kycStatus === "VERIFIED";

    return (
        <PermissionGate permission={PERMISSIONS.FINANCE_VIEW} fallback={<div className="p-8 text-center bg-white border rounded-2xl shadow-sm">
            <Lock className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-bold">Access Restricted</h3>
            <p className="text-gray-500">You do not have permission to view financial records.</p>
        </div>}>
            <div className="space-y-6 max-w-6xl mx-auto pb-10">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight text-black">Finance</h2>
                        <p className="text-gray-500">Manage your earnings, payouts, and bank details.</p>
                    </div>
                    <div className="flex gap-2 items-center">
                        <div className="flex items-center space-x-2 mr-4">
                            <Switch
                                id="payout-notifs"
                                checked={notificationsEnabled}
                                onCheckedChange={setNotificationsEnabled}
                            />
                            <Label htmlFor="payout-notifs">Payout Alerts</Label>
                        </div>

                        <Dialog open={open} onOpenChange={(o) => {
                            setOpen(o);
                            if (!o) { setStep("DETAILS"); setPassword(""); }
                        }}>
                            <DialogTrigger asChild>
                                <Button disabled={!canWithdraw} className="bg-vayva-green text-white hover:bg-vayva-green/90 shadow-lg shadow-green-500/20 font-bold">
                                    <Wallet className="mr-2 h-4 w-4" /> Withdraw Funds
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Withdraw Funds</DialogTitle>
                                    <DialogDescription>
                                        Available Balance: <b>{formatCurrency(overview?.availableBalance || 0, currency)}</b>
                                    </DialogDescription>
                                </DialogHeader>

                                {storeStatus.kycStatus !== "VERIFIED" && (
                                    <Alert variant="destructive">
                                        <AlertTriangle className="h-4 w-4" />
                                        <AlertTitle>KYC Required</AlertTitle>
                                        <AlertDescription>
                                            You must verify your identity before withdrawing funds.
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {step === "DETAILS" ? (
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="bank">Destination Account</Label>
                                            <Select value={selectedBankId} onValueChange={setSelectedBankId}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select bank account" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {beneficiaries.map(b => (
                                                        <SelectItem key={b.id} value={b.id}>
                                                            {b.bankName} - {b.accountNumber}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {beneficiaries.length === 0 && (
                                                <p className="text-xs text-red-500">No bank accounts found. Please add one in Settings.</p>
                                            )}
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="amount">Amount</Label>
                                            <Input
                                                id="amount"
                                                type="number"
                                                value={withdrawAmount}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWithdrawAmount(e.target.value)}
                                                placeholder="0.00"
                                                min={1000}
                                            />
                                            <p className="text-xs text-muted-foreground">Min withdrawal: ₦1,000</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="password">Confirm Password</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                value={password}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                                placeholder="Enter your login password"
                                            />
                                            <p className="text-xs text-muted-foreground">Security check to authorize this transfer.</p>
                                        </div>
                                    </div>
                                )}

                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                                    {step === "DETAILS" ? (
                                        <Button onClick={() => setStep("AUTH")} disabled={!withdrawAmount || !selectedBankId}>
                                            Next
                                        </Button>
                                    ) : (
                                        <Button onClick={handleWithdraw} disabled={isWithdrawing || !password}>
                                            {isWithdrawing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Confirm Withdrawal
                                        </Button>
                                    )}
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {storeStatus.kycStatus !== "VERIFIED" && (
                    <Alert variant="destructive" className="mb-6">
                        <Lock className="h-4 w-4" />
                        <AlertTitle>Payouts Paused</AlertTitle>
                        <AlertDescription>
                            Your account is currently unverified. Please complete KYC verification in Settings to enable withdrawals.
                        </AlertDescription>
                        <Button variant="outline" size="sm" className="mt-2 bg-white text-destructive border-transparent hover:bg-gray-100">
                            Verify Now
                        </Button>
                    </Alert>
                )}

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-bold text-black">Total Sales</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(overview?.totalSales || 0, currency)}</div>
                            <p className="text-xs text-muted-foreground">Gross sales volume</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-bold text-black">Platform Fees</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(overview?.platformFees || 0, currency)}</div>
                            <p className="text-xs text-muted-foreground">3% platform commission</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-bold text-black">Net Earnings</CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(overview?.netEarnings || 0, currency)}</div>
                            <p className="text-xs text-muted-foreground">After fees deduction</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-studio-gray border-studio-border">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-bold text-black">Available Balance</CardTitle>
                            <Wallet className="h-4 w-4 text-vayva-green" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black text-black">{formatCurrency(overview?.availableBalance || 0, currency)}</div>
                            <p className="text-xs text-gray-500">
                                Pending: {formatCurrency(overview?.pendingBalance || 0, currency)} (7-day hold)
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Sales Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart data={dailySales}>
                                    <XAxis
                                        dataKey="name"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `₦${value}`}
                                    />
                                    <Bar dataKey="sales" fill="#22C55E" radius={[4, 4, 0, 0]} />
                                    <Tooltip />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <div className="col-span-3">
                        <Tabs defaultValue="history">
                            <TabsList className="w-full">
                                <TabsTrigger value="history" className="w-full">Payout History</TabsTrigger>
                            </TabsList>
                            <TabsContent value="history" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Recent Payouts</CardTitle>
                                        <CardDescription>History of your withdrawal requests.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Reference</TableHead>
                                                    <TableHead>Amount</TableHead>
                                                    <TableHead>Status</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {payouts.length === 0 && (
                                                    <TableRow>
                                                        <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                                                            No payouts found.
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                                {payouts.slice(0, 5).map((payout) => (
                                                    <TableRow key={payout.id}>
                                                        <TableCell className="font-mono text-xs max-w-[80px] truncate" title={payout.reference}>
                                                            {payout.reference}
                                                        </TableCell>
                                                        <TableCell>{formatCurrency(payout.amount, currency)}</TableCell>
                                                        <TableCell>
                                                            <Badge variant={payout.status === "SUCCESS" ? "default" : payout.status === "FAILED" ? "destructive" : "secondary"}>
                                                                {payout.status}
                                                            </Badge>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </PermissionGate>
    );
}
