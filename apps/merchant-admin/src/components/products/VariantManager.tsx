
"use client";

import { useState } from "react";
import useSWR from "swr";
import { Button, Input } from "@vayva/ui";
import { Label } from "@/components/ui/label";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import { fetcher } from "@/lib/utils";

interface VariantManagerProps {
    productId: string;
    variantLabel?: string;
}

export function VariantManager({ productId, variantLabel = "Variants" }: VariantManagerProps) {
    const { data: variants, mutate, error } = useSWR(`/api/products/${productId}/variants`, fetcher);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingVariant, setEditingVariant] = useState<any>(null); // If null, create mode

    const [formData, setFormData] = useState({
        name: "", // Option value e.g. "Small" (will be title)
        price: "",
        sku: "",
        stock: "0"
    });

    const handleOpen = (variant?: any) => {
        if (variant) {
            setEditingVariant(variant);
            setFormData({
                name: variant.title,
                price: variant.price || "",
                sku: variant.sku || "",
                stock: variant.inventory?.toString() || "0"
            });
        } else {
            setEditingVariant(null);
            setFormData({ name: "", price: "", sku: "", stock: "0" });
        }
        setIsDialogOpen(true);
    };

    const handleSave = async () => {
        try {
            const payload: any = {
                title: formData.name,
                options: [{ name: variantLabel, value: formData.name }], // Simple 1-dim variant for now
                price: formData.price,
                sku: formData.sku,
                stock: formData.stock
            };

            const url = editingVariant
                ? `/api/products/${productId}/variants/${editingVariant.id}`
                : `/api/products/${productId}/variants`;

            const method = editingVariant ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Failed to save variant");

            toast.success(editingVariant ? "Variant updated" : "Variant added");
            setIsDialogOpen(false);
            mutate();
        } catch (err: any) {
            toast.error("Error saving variant");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await fetch(`/api/products/${productId}/variants/${id}`, { method: "DELETE" });
            toast.success("Variant deleted");
            mutate();
        } catch (err: any) {
            toast.error("Failed to delete");
        }
    };

    if (error) return <div className="text-red-500">Failed to load variants</div>;

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{variantLabel}</h3>
                <Button size="sm" onClick={() => handleOpen()}>Add {variantLabel}</Button>
            </div>

            <div className="border rounded-md overflow-hidden bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="p-3">Name</TableHead>
                            <TableHead className="p-3">Price</TableHead>
                            <TableHead className="p-3">SKU</TableHead>
                            <TableHead className="p-3">Stock</TableHead>
                            <TableHead className="p-3 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {variants?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="p-6 text-center text-gray-400">
                                    No variants yet. Add one to get started.
                                </TableCell>
                            </TableRow>
                        )}
                        {variants?.map((v: any) => (
                            <TableRow key={v.id} className="hover:bg-gray-50">
                                <TableCell className="p-3 font-medium">{v.title}</TableCell>
                                <TableCell className="p-3">{v.price}</TableCell>
                                <TableCell className="p-3 text-gray-500">{v.sku || "-"}</TableCell>
                                <TableCell className="p-3">{v.inventory}</TableCell>
                                <TableCell className="p-3 text-right flex justify-end gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => handleOpen(v)}>Edit</Button>
                                    <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDelete(v.id)}>
                                        <Trash size={16} />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingVariant ? "Edit" : "Add"} {variantLabel}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div>
                            <Label>Name / Value (e.g. Small, Red)</Label>
                            <Input
                                value={(formData.name as any)}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. XL"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Price</Label>
                                <Input
                                    type="number"
                                    value={(formData.price as any)}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label>SKU</Label>
                                <Input
                                    value={(formData.sku as any)}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, sku: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <Label>Stock On Hand</Label>
                            <Input
                                type="number"
                                value={(formData.stock as any)}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, stock: e.target.value })}
                                placeholder="0"
                            />
                            {editingVariant && <p className="text-xs text-gray-500 mt-1">Adjusting this will create an inventory log.</p>}
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave}>Save</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
