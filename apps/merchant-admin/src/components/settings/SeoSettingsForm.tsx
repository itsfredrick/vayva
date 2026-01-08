"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button, Input } from "@vayva/ui";
import { toast } from "sonner";
import { updateStoreSeo } from "@/app/(dashboard)/dashboard/settings/seo/actions";

const seoSchema = z.object({
    seoTitle: z.string().max(60, "Title should be under 60 characters").optional().nullable(),
    seoDescription: z.string().max(160, "Description should be under 160 characters").optional().nullable(),
    seoKeywords: z.string().optional(), // Comma separated string for input
    socialImage: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
});

type SeoFormValues = z.infer<typeof seoSchema>;

interface SeoSettingsFormProps {
    initialData: {
        seoTitle?: string | null;
        seoDescription?: string | null;
        seoKeywords?: string[];
        socialImage?: string | null;
    };
}

const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="block text-sm font-bold text-gray-700 mb-1.5">{children}</label>
);

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
    (props, ref) => (
        <textarea
            ref={ref}
            className="w-full min-h-[100px] px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-all placeholder:text-gray-400 resize-y"
            {...props}
        />
    )
);
Textarea.displayName = "Textarea";

export function SeoSettingsForm({ initialData }: SeoSettingsFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SeoFormValues>({
        resolver: zodResolver(seoSchema),
        defaultValues: {
            seoTitle: initialData.seoTitle || "",
            seoDescription: initialData.seoDescription || "",
            seoKeywords: initialData.seoKeywords?.join(", ") || "",
            socialImage: initialData.socialImage || "",
        },
    });

    const onSubmit = async (data: SeoFormValues) => {
        try {
            const formattedData = {
                seoTitle: data.seoTitle || null,
                seoDescription: data.seoDescription || null,
                seoKeywords: data.seoKeywords ? data.seoKeywords.split(",").map((k) => k.trim()).filter(Boolean) : [],
                socialImage: data.socialImage || null,
            };

            const result = await updateStoreSeo(formattedData);

            if (result.success) {
                toast.success("SEO settings updated successfully");
            } else {
                toast.error("Failed to update settings");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 max-w-2xl">
            <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900">Search Engine Optimization (SEO)</h2>
                <p className="text-sm text-gray-500">
                    Control how your store appears in Google search results and on social media.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <Label>Meta Title</Label>
                    <div className="text-xs text-gray-400 mb-2">
                        The headline clickable title for search results (Max 60 chars).
                    </div>
                    <Input {...register("seoTitle")} placeholder="e.g. My Premium Store | Best Fashion in Lagos" error={!!errors.seoTitle} />
                    {errors.seoTitle && <p className="text-red-500 text-xs mt-1">{errors.seoTitle.message}</p>}
                </div>

                <div>
                    <Label>Meta Description</Label>
                    <div className="text-xs text-gray-400 mb-2">
                        A brief summary of your page. This often appears under the title in search results (Max 160 chars).
                    </div>
                    <Textarea {...register("seoDescription")} placeholder="Shop the latest fashion trends at unbeatable prices..." />
                    {errors.seoDescription && <p className="text-red-500 text-xs mt-1">{errors.seoDescription.message}</p>}
                </div>

                <div>
                    <Label>Keywords</Label>
                    <div className="text-xs text-gray-400 mb-2">
                        Comma-separated keywords relevant to your store.
                    </div>
                    <Input {...register("seoKeywords")} placeholder="fashion, lagos, boutique, affordable, delivery" />
                </div>

                <div>
                    <Label>Social Image URL</Label>
                    <div className="text-xs text-gray-400 mb-2">
                        The image shown when your link is shared on WhatsApp, Twitter, or Facebook.
                    </div>
                    <Input {...register("socialImage")} placeholder="https://..." error={!!errors.socialImage} />
                    {errors.socialImage && <p className="text-red-500 text-xs mt-1">{errors.socialImage.message}</p>}
                </div>

                <div className="pt-4 flex justify-end">
                    <Button type="submit" isLoading={isSubmitting}>
                        Save Changes
                    </Button>
                </div>
            </form>
        </div>
    );
}
