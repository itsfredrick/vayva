
"use client";

import React from "react";
import { Button, Icon } from "@vayva/ui";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, ArrowDownLeft, Calendar } from "lucide-react";

export default function CommissionsPage() {
    const logs = [
        { id: "T-10045", orderId: "ORD-9902", vendor: "TechNova Solutions", saleAmount: "₦120,500", rate: "10%", commission: "₦12,050", date: "2026-01-24 14:22", status: "SETTLED" },
        { id: "T-10044", orderId: "ORD-9891", vendor: "Azure Fashion", saleAmount: "₦45,000", rate: "15%", commission: "₦6,750", date: "2026-01-24 12:05", status: "PENDING" },
        { id: "T-10043", orderId: "ORD-9888", vendor: "Green Garden Co.", saleAmount: "₦250,000", rate: "12%", commission: "₦30,000", date: "2026-01-23 18:45", status: "SETTLED" },
        { id: "T-10042", orderId: "ORD-9885", vendor: "TechNova Solutions", saleAmount: "₦15,000", rate: "10%", commission: "₦1,500", date: "2026-01-23 16:30", status: "PENDING" },
        { id: "T-10041", orderId: "ORD-9880", vendor: "Urban Kicks", saleAmount: "₦85,000", rate: "12%", commission: "₦10,200", date: "2026-01-23 09:12", status: "FAILED" },
    ];

    return (
        <div className="p-8 space-y-6 bg-studio-gray/30 min-h-screen">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Commission Ledger</h1>
                    <p className="text-gray-500 text-sm mt-1">Real-time tracking of platform revenue and vendor transaction fees.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="rounded-xl border-gray-200">
                        <Calendar size={16} className="mr-2" /> Jan 2026
                    </Button>
                    <Button className="rounded-xl bg-black text-white px-6 font-bold">
                        Export Report
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm bg-studio-purple text-white">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">Total Commission MTD</p>
                                <h3 className="text-3xl font-black">₦485,200</h3>
                            </div>
                            <div className="p-2 bg-white/10 rounded-lg">
                                <TrendingUp size={20} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-1 text-xs font-bold text-white/80">
                            <span className="text-green-300">+22%</span> vs last month
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Avg. Platform Rate</p>
                        <h3 className="text-3xl font-black text-gray-900">12.4%</h3>
                        <div className="mt-4 flex items-center gap-1 text-xs font-bold text-gray-400">
                            Managed across 18 unique vendors
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Pending Settlements</p>
                        <h3 className="text-3xl font-black text-orange-600">₦82,950</h3>
                        <div className="mt-4 flex items-center gap-1 text-xs font-bold text-gray-400">
                            5 batches awaiting review
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-white border-b border-gray-50 p-6">
                    <CardTitle className="text-lg font-black">Transaction Log</CardTitle>
                    <CardDescription>Fee breakdown for every successful multi-vendor sale.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow>
                                <TableHead className="text-[10px] font-black uppercase py-4 pl-6">Transaction ID</TableHead>
                                <TableHead className="text-[10px] font-black uppercase">Order</TableHead>
                                <TableHead className="text-[10px] font-black uppercase">Vendor Partner</TableHead>
                                <TableHead className="text-[10px] font-black uppercase">Sale Amount</TableHead>
                                <TableHead className="text-[10px] font-black uppercase">Fee Rate</TableHead>
                                <TableHead className="text-[10px] font-black uppercase">Commission</TableHead>
                                <TableHead className="text-[10px] font-black uppercase">Status</TableHead>
                                <TableHead className="text-[10px] font-black uppercase text-right pr-6">Timestamp</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.map((log) => (
                                <TableRow key={log.id} className="hover:bg-gray-50/50 transition-colors">
                                    <TableCell className="py-4 pl-6 font-mono text-xs text-blue-600 font-bold">{log.id}</TableCell>
                                    <TableCell className="font-bold text-gray-900">{log.orderId}</TableCell>
                                    <TableCell className="text-gray-500 font-medium">{log.vendor}</TableCell>
                                    <TableCell className="text-gray-900 font-black">{log.saleAmount}</TableCell>
                                    <TableCell className="text-gray-400 font-black">{log.rate}</TableCell>
                                    <TableCell className="text-green-600 font-black">{log.commission}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={log.status === "SETTLED" ? "default" : log.status === "PENDING" ? "secondary" : "destructive"}
                                            className="rounded-lg px-2 py-0.5 text-[10px] font-black"
                                        >
                                            {log.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right pr-6 text-gray-400 font-mono text-[10px]">
                                        {log.date}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
