
"use client";

import useSWR, { mutate } from "swr";
import { fetcher } from "@/lib/utils";
import { format } from "date-fns";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button, EmptyState } from "@vayva/ui";
import { Trash, Tag, Percent, DollarSign, Edit2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function DiscountList() {
    const router = useRouter();
    const { data: discounts, error } = useSWR("/api/marketing/discounts", fetcher);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this discount?")) return;
        try {
            await fetch(`/api/marketing/discounts/${id}`, { method: "DELETE" });
            toast.success("Discount deleted");
            mutate("/api/marketing/discounts");
        } catch (err) {
            toast.error("Failed to delete");
        }
    };

    if (error) return <div className="text-red-500">Failed to load discounts</div>;
    if (!discounts) return <div className="p-8 text-center text-gray-500">Loading...</div>;

    if (discounts.length === 0) {
        return (
            <EmptyState
                title="No Discounts Yet"
                description="Create your first discount to drive sales."
                action={
                    <Link href="/dashboard/marketing/discounts/new">
                        <Button>Create Discount</Button>
                    </Link>
                }
            />
        );
    }

    return (
        <div className="border rounded-md bg-white overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Schedule</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {discounts.map((d: unknown) => {
                        const status = (!d.endsAt || new Date(d.endsAt) > new Date()) ? "Active" : "Expired";
                        return (
                            <TableRow key={d.id}>
                                <TableCell>
                                    <div className="font-medium">{d.name}</div>
                                    {d.code && (
                                        <div className="flex items-center gap-1 text-xs text-blue-600 mt-1">
                                            <Tag size={12} />
                                            <span className="font-mono bg-blue-50 px-1 rounded">{d.code}</span>
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary">
                                        {d.requiresCoupon ? "Coupon" : "Automatic"}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1">
                                        {d.type === "PERCENTAGE" ? <Percent size={14} /> : <DollarSign size={14} />}
                                        <span>
                                            {d.type === "PERCENTAGE"
                                                ? `${d.valuePercent}%`
                                                : `₦${d.valueAmount}`
                                            }
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={status === "Active" ? "default" : "secondary"}>
                                        {status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-sm text-gray-500">
                                    {format(new Date(d.startsAt), "MMM d")}
                                    {d.endsAt ? ` - ${format(new Date(d.endsAt), "MMM d, yyyy")}` : " (No expiry)"}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-indigo-600" onClick={() => router.push(`/dashboard/marketing/discounts/${d.id}`)}>
                                            <Edit2 size={16} />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500" onClick={() => handleDelete(d.id)}>
                                            <Trash size={16} />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
