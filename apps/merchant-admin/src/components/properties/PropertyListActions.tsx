"use client";

import { useState } from "react";
import { Button, Modal } from "@vayva/ui";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { RealEstateForm } from "./RealEstateForm";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface PropertyListActionsProps {
    property: any; // Ideally AccommodationProduct & { product: Product }
}

export function PropertyListActions({ property }: PropertyListActionsProps) {
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

            if (!res.ok) throw new Error("Failed to delete property");

            toast.success("Property deleted");
            router.refresh();
            setIsDeleteOpen(false);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => setIsEditOpen(true)} title="Edit">
                    <Pencil className="h-4 w-4 text-gray-500" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setIsDeleteOpen(true)} title="Delete">
                    <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
            </div>

            {/* Edit Modal */}
            <Modal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                title="Edit Property"
                className="max-w-2xl"
            >
                <RealEstateForm
                    onSuccess={() => setIsEditOpen(false)}
                    initialData={property}
                />
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                title="Delete Property"
                className="max-w-md"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-500">
                        Are you sure you want to delete <strong>{property.product?.name || property.title}</strong>?
                        This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Delete
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
