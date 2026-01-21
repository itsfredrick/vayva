"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button, Input } from "@vayva/ui";
import { toast } from "sonner";
import { updateStoreSeo } from "@/app/(dashboard)/dashboard/settings/seo/actions";
const seoSchema = z.object({
    seoTitle: z.string().max(60, "Title should be under 60 characters").optional().nullable(),
    seoDescription: z.string().max(160, "Description should be under 160 characters").optional().nullable(),
    // seoKeywords: z.string().optional(), // Comma separated string for input
    socialImage: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
});
const Label = ({ children }) => (_jsx("label", { className: "block text-sm font-bold text-gray-700 mb-1.5", children: children }));
const Textarea = React.forwardRef((props, ref) => (_jsx("textarea", { ref: ref, className: "w-full min-h-[100px] px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-all placeholder:text-gray-400 resize-y", ...props })));
Textarea.displayName = "Textarea";
export function SeoSettingsForm({ initialData }) {
    const { register, handleSubmit, formState: { errors, isSubmitting }, } = useForm({
        resolver: zodResolver(seoSchema),
        defaultValues: {
            seoTitle: initialData.seoTitle || "",
            seoDescription: initialData.seoDescription || "",
            // seoKeywords: initialData.seoKeywords?.join(", ") || "",
            socialImage: initialData.socialImage || "",
        },
    });
    const onSubmit = async (data) => {
        try {
            const formattedData = {
                seoTitle: data.seoTitle || null,
                seoDescription: data.seoDescription || null,
                // seoKeywords: data.seoKeywords ? data.seoKeywords.split(",").map((k) => k.trim()).filter(Boolean) : [],
                socialImage: data.socialImage || null,
            };
            const result = await updateStoreSeo(formattedData);
            if (result.success) {
                toast.success("SEO settings updated successfully");
            }
            else {
                toast.error("Failed to update settings");
            }
        }
        catch (error) {
            toast.error("An unexpected error occurred");
        }
    };
    return (_jsxs("div", { className: "bg-white rounded-xl border border-gray-100 shadow-sm p-6 max-w-2xl", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h2", { className: "text-lg font-bold text-gray-900", children: "Search Engine Optimization (SEO)" }), _jsx("p", { className: "text-sm text-gray-500", children: "Control how your store appears in Google search results and on social media." })] }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-6", children: [_jsxs("div", { children: [_jsx(Label, { children: "Meta Title" }), _jsx("div", { className: "text-xs text-gray-400 mb-2", children: "The headline clickable title for search results (Max 60 chars)." }), _jsx(Input, { ...register("seoTitle"), placeholder: "e.g. My Premium Store | Best Fashion in Lagos", error: !!errors.seoTitle }), errors.seoTitle && _jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.seoTitle.message })] }), _jsxs("div", { children: [_jsx(Label, { children: "Meta Description" }), _jsx("div", { className: "text-xs text-gray-400 mb-2", children: "A brief summary of your page. This often appears under the title in search results (Max 160 chars)." }), _jsx(Textarea, { ...register("seoDescription"), placeholder: "Shop the latest fashion trends at unbeatable prices..." }), errors.seoDescription && _jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.seoDescription.message })] }), _jsxs("div", { children: [_jsx(Label, { children: "Keywords" }), _jsx("div", { className: "text-xs text-gray-400 mb-2", children: "Comma-separated keywords relevant to your store." })] }), _jsxs("div", { children: [_jsx(Label, { children: "Social Image URL" }), _jsx("div", { className: "text-xs text-gray-400 mb-2", children: "The image shown when your link is shared on WhatsApp, Twitter, or Facebook." }), _jsx(Input, { ...register("socialImage"), placeholder: "https://...", error: !!errors.socialImage }), errors.socialImage && _jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.socialImage.message })] }), _jsx("div", { className: "pt-4 flex justify-end", children: _jsx(Button, { type: "submit", isLoading: isSubmitting, children: "Save Changes" }) })] })] }));
}
