
"use client";

import React, { useState } from "react";
import { Button, Icon } from "@vayva/ui";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Filter, Mail, MoreVertical, ExternalLink } from "lucide-react";

export default function VendorsPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const vendors = [
        { id: "1", name: "Green Garden Co.", email: "contact@greengarden.com", category: "Furniture", products: 45, status: "ACTIVE", revenue: "₦2.4M", commission: "12%" },
        { id: "2", name: "TechNova Solutions", email: "sales@technova.io", category: "Electronics", products: 128, status: "ACTIVE", revenue: "₦8.9M", commission: "10%" },
        { id: "3", name: "Azure Fashion", email: "hi@azurefashion.ng", category: "Apparel", products: 310, status: "ACTIVE", revenue: "₦12.1M", commission: "15%" },
        { id: "4", name: "Urban Kicks", email: "support@urbankicks.com", category: "Footwear", products: 22, status: "PENDING", revenue: "₦0", commission: "12%" },
        { id: "5", name: "Luxe Home", email: "admin@luxehome.com", category: "Decor", products: 67, status: "SUSPENDED", revenue: "₦4.5M", commission: "12%" },
    ];

    return (
        <div className="p-8 space-y-6 bg-studio-gray/30 min-h-screen">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Vendor Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Direct control over your marketplace partners and their platform status.</p>
                </div>
                <Button className="rounded-xl bg-black text-white px-6">
                    <Icon name="Plus" size={16} className="mr-2" /> Invite New Vendor
                </Button>
            </div>

            <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-white border-b border-gray-50 p-6">
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <Input
                                placeholder="Search by vendor name or email..."
                                className="pl-10 rounded-xl bg-gray-50/50 border-gray-100"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="rounded-xl border-gray-100 text-xs font-bold uppercase tracking-widest text-gray-500">
                                <Filter size={14} className="mr-2" /> Filter
                            </Button>
                            <Button variant="outline" className="rounded-xl border-gray-100 text-xs font-bold uppercase tracking-widest text-gray-500">
                                Export CSV
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow>
                                <TableHead className="text-[10px] font-black uppercase py-4 pl-6">Vendor Details</TableHead>
                                <TableHead className="text-[10px] font-black uppercase">Market Category</TableHead>
                                <TableHead className="text-[10px] font-black uppercase">Products</TableHead>
                                <TableHead className="text-[10px] font-black uppercase">Commission</TableHead>
                                <TableHead className="text-[10px] font-black uppercase">Total Sales</TableHead>
                                <TableHead className="text-[10px] font-black uppercase">Status</TableHead>
                                <TableHead className="text-[10px] font-black uppercase text-right pr-6">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {vendors.map((vendor) => (
                                <TableRow key={vendor.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <TableCell className="py-4 pl-6">
                                        <div>
                                            <p className="font-black text-gray-900 text-base">{vendor.name}</p>
                                            <p className="text-xs text-gray-400 flex items-center gap-1">
                                                <Mail size={12} /> {vendor.email}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-gray-500 font-medium">{vendor.category}</TableCell>
                                    <TableCell className="text-gray-900 font-black">{vendor.products}</TableCell>
                                    <TableCell className="text-studio-purple font-black">{vendor.commission}</TableCell>
                                    <TableCell className="text-gray-900 font-black">{vendor.revenue}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={vendor.status === "ACTIVE" ? "default" : vendor.status === "PENDING" ? "secondary" : "destructive"}
                                            className="rounded-lg px-2 py-0.5 text-[10px] font-black"
                                        >
                                            {vendor.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-black hover:text-white">
                                                <ExternalLink size={14} />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                                                <MoreVertical size={14} />
                                            </Button>
                                        </div>
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
