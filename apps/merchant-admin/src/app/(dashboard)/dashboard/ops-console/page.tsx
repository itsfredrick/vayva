
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { MarketplaceMetrics, OpsActionCards } from "@/components/marketplace/MarketplaceOpsHub";
import { Button, Icon } from "@vayva/ui";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function OpsConsolePage() {
    const router = useRouter();

    const recentVendors = [
        { id: "1", name: "Green Garden Co.", category: "Furniture", status: "PENDING", joinDate: "2026-01-20" },
        { id: "2", name: "TechNova Solutions", category: "Electronics", status: "ACTIVE", joinDate: "2026-01-18" },
        { id: "3", name: "Azure Fashion", category: "Apparel", status: "ACTIVE", joinDate: "2026-01-15" },
    ];

    return (
        <div className="p-8 space-y-8 bg-studio-gray/30 min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-black text-white rounded-lg">
                            <Icon name="Terminal" size={16} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Marketplace Control</span>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Ops Console</h1>
                    <p className="text-gray-500 mt-2 max-w-lg">
                        Unified management hub for your multi-vendor platform. Track partner performance, reconcile commissions, and manage store-wide integrity.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-2xl border-gray-200">
                        <Icon name="Search" size={16} className="mr-2" /> Find Vendor
                    </Button>
                    <Button className="rounded-2xl bg-black text-white px-6">
                        <Icon name="UserPlus" size={16} className="mr-2" /> Invite Partner
                    </Button>
                </div>
            </div>

            {/* Metrics Grid */}
            <MarketplaceMetrics />

            {/* Action Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <OpsActionCards onAction={(route) => router.push(route)} />

                    {/* Recent Activity Table */}
                    <Card className="border-none shadow-sm overflow-hidden">
                        <CardHeader className="bg-white border-b border-gray-50">
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="text-lg font-black">Vendor Activity</CardTitle>
                                    <CardDescription>Recent onboarding requests and status updates.</CardDescription>
                                </div>
                                <Button variant="ghost" size="sm" className="text-xs font-bold uppercase tracking-widest text-gray-400">View All</Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-gray-50/50">
                                    <TableRow>
                                        <TableHead className="text-[10px] font-black uppercase py-4">Partner Name</TableHead>
                                        <TableHead className="text-[10px] font-black uppercase">Category</TableHead>
                                        <TableHead className="text-[10px] font-black uppercase">Status</TableHead>
                                        <TableHead className="text-[10px] font-black uppercase text-right px-6">Joined</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentVendors.map((vendor) => (
                                        <TableRow key={vendor.id} className="hover:bg-gray-50/50 transition-colors">
                                            <TableCell className="font-bold text-gray-900 py-4">{vendor.name}</TableCell>
                                            <TableCell className="text-gray-500">{vendor.category}</TableCell>
                                            <TableCell>
                                                <Badge variant={vendor.status === "ACTIVE" ? "default" : "secondary"}>
                                                    {vendor.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right text-gray-400 font-mono text-xs px-6">{vendor.joinDate}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                    <Card className="bg-black text-white border-none shadow-xl shadow-black/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Icon name="Lightbulb" className="text-yellow-400" />
                                <span className="font-black">Platform Tip</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                You can set custom commission rates for each vendor in the <b>Vendor Detail</b> view. Use tiers to incentivize high-volume partners.
                            </p>
                            <Button variant="outline" className="w-full mt-6 rounded-xl border-white/20 hover:bg-white/10 text-white">
                                Learn More
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-dashed bg-gray-50/50 hover:bg-white transition-colors cursor-pointer border-gray-200">
                        <CardContent className="p-8 text-center">
                            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 border border-gray-100">
                                <Icon name="BarChart3" className="text-gray-400" />
                            </div>
                            <h4 className="font-bold text-gray-900 mb-1">Add Operational Metric</h4>
                            <p className="text-xs text-gray-400">Configure custom widgets for your console hub.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
