"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Button } from "@vayva/ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, MapPin, Trash2, Edit } from "lucide-react";
import { PickupLocationForm } from "./pickup-location-form";
import { toast } from "sonner";
export default function PickupPage() {
    const [locations, setLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [editingLocation, setEditingLocation] = useState(null);
    const fetchLocations = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/settings/pickup");
            const data = await res.json();
            setLocations(data);
        }
        catch (e) {
            console.error(e);
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchLocations();
    }, []);
    const handleSubmit = async (data) => {
        try {
            const url = editingLocation
                ? `/api/settings/pickup/${editingLocation.id}`
                : "/api/settings/pickup";
            const method = editingLocation ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok)
                throw new Error("Failed");
            toast.success(editingLocation ? "Updated" : "Created");
            setIsOpen(false);
            setEditingLocation(null);
            fetchLocations();
        }
        catch (e) {
            toast.error("Error saving location");
        }
    };
    const handleDelete = async (id) => {
        if (!confirm("Are you sure?"))
            return;
        try {
            await fetch(`/api/settings/pickup/${id}`, { method: "DELETE" });
            toast.success("Deleted");
            fetchLocations();
        }
        catch (e) {
            toast.error("Failed to delete");
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-medium", children: "Pickup Locations" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Manage addresses where customers can pick up orders." })] }), _jsxs(Dialog, { open: isOpen, onOpenChange: (open) => {
                            setIsOpen(open);
                            if (!open)
                                setEditingLocation(null);
                        }, children: [_jsx(DialogTrigger, { asChild: true, children: _jsxs(Button, { children: [_jsx(Plus, { className: "mr-2 h-4 w-4" }), " Add Location"] }) }), _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: editingLocation ? "Edit Location" : "Add Pickup Location" }), _jsx(DialogDescription, { children: "Enter details for this pickup point." })] }), _jsx(PickupLocationForm, { initialData: editingLocation, onSubmit: handleSubmit, isSubmitting: false })] })] })] }), _jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [locations.map((loc) => (_jsxs(Card, { children: [_jsxs(CardHeader, { className: "pb-2", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsxs(CardTitle, { className: "text-base font-semibold flex items-center gap-2", children: [_jsx(MapPin, { className: "h-4 w-4 text-primary" }), loc.name] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: "ghost", size: "icon", onClick: () => {
                                                            setEditingLocation(loc);
                                                            setIsOpen(true);
                                                        }, children: _jsx(Edit, { className: "h-4 w-4 text-muted-foreground" }) }), _jsx(Button, { variant: "ghost", size: "icon", onClick: () => handleDelete(loc.id), children: _jsx(Trash2, { className: "h-4 w-4 text-destructive" }) })] })] }), _jsx(CardDescription, { children: loc.address })] }), _jsxs(CardContent, { children: [_jsxs("div", { className: "text-sm text-muted-foreground", children: [loc.city, ", ", loc.state] }), loc.isDefault && _jsx("div", { className: "mt-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded w-fit", children: "Default" })] })] }, loc.id))), locations.length === 0 && !isLoading && (_jsx("div", { className: "col-span-2 text-center py-12 text-muted-foreground border rounded-lg border-dashed", children: "No pickup locations yet." }))] })] }));
}
