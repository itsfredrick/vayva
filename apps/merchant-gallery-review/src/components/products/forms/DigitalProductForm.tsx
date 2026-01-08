"use client";

import { useForm } from "react-hook-form";
import { Button, Input, Textarea, Label } from "@vayva/ui";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function DigitalProductForm({ productId }: { productId?: string }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit } = useForm();

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        const payload = {
            title: data.assetName,
            description: data.description,
            price: data.price,
            productType: "digital",
            trackInventory: false, // Unlimited copies logic usually
            metadata: {
                fileUrl: data.fileUrl, // S3 link would be here
                fileFormat: data.fileFormat,
                licenseType: data.licenseType, // Personal vs Commercial
                fileSize: "10MB" // Mock
            }
        };

        toast.success("Digital asset published");
        router.push("/dashboard/products");
        setIsSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2 text-blue-500">Digital Asset</h3>
                <div className="grid gap-4">
                    <div>
                        <Label>Asset Name</Label>
                        <Input {...register("assetName", { required: true })} placeholder="e.g. 3D Model Pack" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>File Format</Label>
                            <Input {...register("fileFormat")} placeholder=".OB, .FBX, .PDF" />
                        </div>
                        <div>
                            <Label>Price (₦)</Label>
                            <Input type="number" {...register("price", { required: true })} />
                        </div>
                    </div>
                    <div>
                        <Label>License Type</Label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" {...register("licenseType")}>
                            <option value="personal">Personal Use Only</option>
                            <option value="commercial">Commercial License</option>
                        </select>
                    </div>
                    <div className="border-2 border-dashed border-blue-200 rounded p-8 bg-blue-50 text-center">
                        <p className="text-blue-600 font-bold">Upload Source File</p>
                        <p className="text-xs text-gray-500">Secure bucket upload</p>
                    </div>
                </div>
            </div>
            <div className="flex justify-end">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Publish Asset</Button>
            </div>
        </form>
    );
}
