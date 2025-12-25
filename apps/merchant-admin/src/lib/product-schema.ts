
import { z } from 'zod';
import { ProductServiceType, ProductServiceStatus } from '@vayva/shared';

export const productSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters"),
    description: z.string().optional(),
    type: z.nativeEnum(ProductServiceType),
    price: z.coerce.number().min(0, "Price cannot be negative"),
    category: z.string().optional(),
    images: z.array(z.string()).optional(),
    status: z.nativeEnum(ProductServiceStatus),

    // Retail specific
    searchTags: z.array(z.string()).optional(),

    // Inventory (UI Object)
    inventory: z.object({
        enabled: z.boolean(),
        quantity: z.coerce.number().min(0),
        lowStockThreshold: z.coerce.number().optional()
    }).optional(),

    // Service specific
    availability: z.object({
        days: z.array(z.string()),
        timeRange: z.string()
    }).optional(),

    // Food specific
    isTodaysSpecial: z.boolean().optional(),

    // Additional fields for DB
    handle: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
