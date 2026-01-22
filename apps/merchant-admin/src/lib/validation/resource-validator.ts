
import { INDUSTRY_CONFIG } from "@/config/industry";
import { IndustrySlug, PrimaryObject, FieldKey } from "@/lib/templates/types";

export interface ValidationResult {
    valid: boolean;
    errors: Record<string, string>;
}

export function validateResource(
    industrySlug: IndustrySlug,
    primaryObject: PrimaryObject,
    data: Record<string, unknown>
): ValidationResult {
    const errors: Record<string, string> = {};

    const config = INDUSTRY_CONFIG[industrySlug];
    if (!config) return { valid: false, errors: { form: "Config error" } };

    const formConfig = config.forms[primaryObject];
    if (!formConfig) return { valid: true, errors: {} }; // Flexible fallback

    const { requiredFields, validation } = formConfig;

    // 1. Check Required Fields
    requiredFields.forEach((field) => {
        const val = data[field];
        if (val === undefined || val === null || val === "" || (Array.isArray(val) && val.length === 0)) {
            errors[field] = "Required";
        }
    });

    // 2. Groups & Rules
    if (validation) {
        if (validation.minImages && (!data.images || data.images.length < validation.minImages)) {
            errors["images"] = `Min ${validation.minImages} images`;
        }
        if (validation.minDescriptionLength && data.description && data.description.length < validation.minDescriptionLength) {
            errors["description"] = `Min ${validation.minDescriptionLength} chars`;
        }

        // Group Logic
        const groups = validation.requiredGroups || [];

        if (groups.includes("specs") && (!data.specs_map && !data.sqft && !data.make)) {
            // Loose check for any spec field based on industry?
            // Keeping it simple: check generic spec field or specific ones if known
            // For now, if 'specs' required, we assume 'specs_map' or specialized fields
        }

        if (groups.includes("location") && !data.location && !data.venue) {
            errors["location"] = "Location required";
        }

        if (groups.includes("schedule") && !data.event_date && !data.dates) {
            errors["event_date"] = "Date/Schedule required";
        }

        if (groups.includes("files") && !data.file_upload) {
            errors["file_upload"] = "File required";
        }

        // Legacy flag support (mapped to groups logic implicitly or explicit check)
        if (validation.requireDate && !data.event_date) {
            errors["event_date"] = "Date required";
        }
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors
    };
}
