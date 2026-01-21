"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { INDUSTRY_CONFIG } from "@/config/industry";
import { FIELD_REGISTRY, FieldType } from "@/config/fields";
import { validateResource } from "@/lib/validation/resource-validator";
import { IndustrySlug, PrimaryObject, FieldKey } from "@/lib/templates/types";
import { Button, Card, Input, Label, Textarea, Icon, Select } from "@vayva/ui"; // Assuming Select exists or using standard
import { toast } from "sonner";
import { useStore } from "@/context/StoreContext";
import { VariantManager } from "@/components/products/VariantManager";
import { InventoryHistory } from "@/components/products/InventoryHistory";
import { FileUpload } from "@/components/ui/FileUpload";

interface ValidatedFormProps {
    primaryObject: PrimaryObject;
    mode: "create" | "edit";
    initialData?: any;
    resourceId?: string;
    onSuccessPath?: string;
}

export const DynamicResourceForm = ({
    primaryObject,
    mode,
    initialData,
    resourceId,
    onSuccessPath
}: ValidatedFormProps) => {
    const router = useRouter();
    const { merchant } = useAuth();
    const { store } = useStore();
    const industrySlug = ((store as any)?.industrySlug || (merchant as any)?.industrySlug || "retail") as IndustrySlug;

    const config = INDUSTRY_CONFIG[industrySlug];
    // Fallback to retail if config missing to prevent crash
    const effectiveConfig = config || INDUSTRY_CONFIG['retail'];
    const formConfig = effectiveConfig.forms[primaryObject];

    const [formData, setFormData] = useState<any>(initialData || {});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    if (!formConfig) {
        return (
            <Card className="p-8 text-center">
                <h3 className="text-red-600 font-bold mb-2">Configuration Error</h3>
                <p>No form configuration found for <strong>{primaryObject}</strong> in <strong>{effectiveConfig.displayName}</strong>.</p>
                <Button variant="outline" className="mt-4" onClick={() => router.back()}>Go Back</Button>
            </Card>
        );
    }

    const { requiredFields, optionalFields, variantLabel } = formConfig;

    const handleChange = (field: string, val: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: val }));
        // Clear error on type
        if (errors[field]) {
            setErrors((prev: any) => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        // 1. Validation
        const validation = validateResource(industrySlug, primaryObject, formData);
        if (!validation.valid) {
            setErrors(validation.errors);
            toast.error("Please fix the errors before saving");
            setLoading(false);
            return;
        }

        try {
            // 2. Submit to Universal API
            const isCreate = mode === "create";
            const endpoint = isCreate ? "/api/resources/create" : `/api/resources/${primaryObject}/${resourceId}`;
            const payload = isCreate ? { primaryObject, data: formData } : formData;
            const res = await fetch(endpoint, {
                method: isCreate ? "POST" : "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.error || "Failed to save");
            }

            toast.success(`${primaryObject} saved successfully`);

            // 3. Route Back
            if (onSuccessPath) {
                router.push(onSuccessPath);
            } else {
                const routeMap: Record<string, string> = {
                    product: "products",
                    service: "services",
                    event: "events",
                    course: "courses",
                    post: "posts",
                    project: "projects",
                    campaign: "campaigns",
                    listing: "listings",
                    menu_item: "menu-items",
                    digital_asset: "digital-assets"
                };
                const sub = routeMap[primaryObject] || "products";
                router.push(`/dashboard/${sub}`);
            }

        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    // --- FIELD RENDERER ---
    const renderInput = (key: string, required: boolean) => {
        const def = (FIELD_REGISTRY as any)[key] || { label: key, type: "text" };
        const err = errors[key];

        const commonProps = {
            placeholder: def.placeholder,
            value: formData[key] || "",
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleChange(key, e.target.value),
            className: err ? "border-red-500" : ""
        };

        switch (def.type) {
            case "textarea":
                return <Textarea {...commonProps} rows={4} />;
            case "number":
                return <Input {...commonProps} type="number" step="0.01" />;
            case "date":
                return <Input {...commonProps} type="datetime-local" />; // simplified
            case "select":
                return (
                    <select
                        title={def.label || "Select option"}
                        className={`w-full p-2 border rounded-md ${err ? 'border-red-500' : 'border-gray-200'}`}
                        value={formData[key] || ""}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange(key, e.target.value)}
                    >
                        <option value="">Select {def.label}</option>
                        {def.options?.map((opt: any) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                );
            case "image":
            case "file":
                const accept = def.type === "image" ? "image/*" : "*/*";
                return (
                    <FileUpload
                        value={formData[key] || ""}
                        onChange={(url) => handleChange(key, url)}
                        label={def.label || "Upload File"}
                        accept={accept}
                    />
                );
            case "tags":
                return <Input {...commonProps} placeholder="Comma, separated, tags" />;
            default:
                return <Input {...commonProps} />;
        }
    }

    const renderFieldBlock = (key: string, required: boolean) => {
        const def = (FIELD_REGISTRY as any)[key] || { label: key, type: "text" };
        const isWide = def.type === 'textarea' || def.type === 'image' || def.type === 'file';

        return (
            <div className={isWide ? "col-span-2" : "col-span-1"}>
                <Label className="mb-1 block">
                    {def.label} {required && <span className="text-red-500">*</span>}
                </Label>
                {renderInput(key, required)}
                {def.helpText && <p className="text-xs text-gray-500 mt-1">{def.helpText}</p>}
                {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold capitalize">
                    {mode} {effectiveConfig.displayName} {primaryObject.replace(/_/g, " ")}
                </h1>
            </div>

            <Card className="p-6">
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                    {/* Hardcoded Title if not in required fields - usually Title is fundamental */}
                    {!requiredFields.includes('title') && !requiredFields.includes('name') && (
                        <div className="col-span-2">
                            <Label>Name / Title *</Label>
                            <Input
                                value={formData.title || ""}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('title', e.target.value)}
                                placeholder="Item Name"
                            />
                        </div>
                    )}

                    {requiredFields.map(field => (
                        <React.Fragment key={field}>{renderFieldBlock(field, true)}</React.Fragment>
                    ))}

                    {optionalFields.length > 0 && (
                        <>
                            <div className="col-span-2 pt-4 pb-2 border-b border-gray-100">
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Optional Details</h3>
                            </div>
                            {optionalFields.map(field => (
                                <React.Fragment key={field}>{renderFieldBlock(field, false)}</React.Fragment>
                            ))}
                        </>
                    )}

                    {/* Variants Section */}
                    {variantLabel && mode === "edit" && resourceId && (
                        <div className="col-span-2 mt-8 pt-8 border-t border-gray-100">
                            <VariantManager productId={resourceId} variantLabel={variantLabel} />

                            {/* Inventory History (Create gap) */}
                            <div className="mt-8">
                                <InventoryHistory productId={resourceId} />
                            </div>
                        </div>
                    )}

                    {variantLabel && mode === "create" && (
                        <div className="col-span-2 mt-4 bg-gray-50 p-4 rounded-xl border border-dashed border-gray-200 text-center">
                            <p className="text-sm text-gray-500">
                                You can add <strong>{variantLabel}</strong> after saving this item.
                            </p>
                        </div>
                    )}

                    <div className="col-span-2 pt-6 flex gap-3 justify-end border-t border-gray-100 mt-4">
                        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" isLoading={loading}>
                            {mode === 'create' ? 'Create' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
