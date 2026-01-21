"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { Button, Modal } from "@vayva/ui";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { RealEstateForm } from "./RealEstateForm";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
export function PropertyListActions({ property }) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();
    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/properties/${property.id}`, {
                method: "DELETE"
            });
            if (!res.ok)
                throw new Error("Failed to delete property");
            toast.success("Property deleted");
            router.refresh();
            setIsDeleteOpen(false);
        }
        catch (error) {
            toast.error(error.message);
        }
        finally {
            setIsDeleting(false);
        }
    };
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => setIsEditOpen(true), title: "Edit", children: _jsx(Pencil, { className: "h-4 w-4 text-gray-500" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => setIsDeleteOpen(true), title: "Delete", children: _jsx(Trash2, { className: "h-4 w-4 text-red-500" }) })] }), _jsx(Modal, { isOpen: isEditOpen, onClose: () => setIsEditOpen(false), title: "Edit Property", className: "max-w-2xl", children: _jsx(RealEstateForm, { onSuccess: () => setIsEditOpen(false), initialData: property }) }), _jsx(Modal, { isOpen: isDeleteOpen, onClose: () => setIsDeleteOpen(false), title: "Delete Property", className: "max-w-md", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("p", { className: "text-sm text-gray-500", children: ["Are you sure you want to delete ", _jsx("strong", { children: property.product?.name || property.title }), "? This action cannot be undone."] }), _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx(Button, { variant: "outline", onClick: () => setIsDeleteOpen(false), children: "Cancel" }), _jsxs(Button, { variant: "destructive", onClick: handleDelete, disabled: isDeleting, children: [isDeleting ? _jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }) : null, "Delete"] })] })] }) })] }));
}
