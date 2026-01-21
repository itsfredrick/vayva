"use client";

import { useForm } from "react-hook-form";
import { Button, Input, Label, Select, Textarea } from "@vayva/ui";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function ServiceProductForm({ productId }: { productId?: string }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit } = useForm();

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        const payload = {
            title: data.serviceName,
            description: data.description,
            price: data.price,
            productType: "service",
            trackInventory: false, // Services don't track physical stock usually
            metadata: {
                durationMinutes: parseInt(data.duration),
                bufferMinutes: parseInt(data.buffer),
                staff: [data.staffId], // simple array for now
                locationType: data.locationType, // Virtual / In-person
            }
        };
        // ... fetch logic (omitted for brevity, assume similar to Retail)
        toast.success("Service created");
        router.push("/dashboard/products");
        setIsSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2 text-purple-600">Service Details</h3>
                <div className="grid gap-4">
                    <div>
                        <Label>Service Name</Label>
                        <Input {...register("serviceName", { required: true })} placeholder="e.g. 1-on-1 Consultation" />
                    </div>
                    <div>
                        <Label>Duration (Minutes)</Label>
                        <Input type="number" {...register("duration", { required: true })} placeholder="60" />
                    </div>
                    <div>
                        <Label>Buffer Time (Minutes)</Label>
                        <Input type="number" {...register("buffer")} placeholder="15" />
                        <p className="text-xs text-gray-500">Time needed between appointments.</p>
                    </div>
                    <div>
                        <Label>Price (₦)</Label>
                        <Input type="number" {...register("price", { required: true })} />
                    </div>
                    <div>
                        <Label>Staff Member</Label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" {...register("staffId")}>
                            <option value="me">Assign to Me</option>
                            <option value="staff_1">John Doe</option>
                            <option value="staff_2">Jane Smith</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="flex justify-end">
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700">Save Service</Button>
            </div>
        </form>
    );
}
