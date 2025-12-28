import { CanonicalCategorySlug, CanonicalTemplateId } from '@/lib/templates-registry';

export type PlanTier = 'free' | 'growth' | 'pro';

export interface Template {
    id: CanonicalTemplateId | string; // Allow string for legacy/dev but prefer canonical
    name: string;
    slug: string;
    category: CanonicalCategorySlug | string;
    tier: PlanTier;
    description: string;
    bestFor: string;
    workflows: string[];
    setupTime: string;
    volume: 'low' | 'medium' | 'high' | 'any';
    teamSize: 'solo' | 'small' | 'multi' | 'any';
    configures: string[];
    customizable: string[];
    capabilitiesUnlocked?: string[];
    previewImage: string;
    creates: {
        pages: string[];
        sections: string[];
        objects: string[];
    };
}

export const TEMPLATES: Template[] = [
    {
        id: 'simple-retail',
        slug: 'simple-retail',
        name: 'Simple Retail Selling',
        category: 'retail',
        tier: 'free',
        description: 'Perfect for local merchants selling physical goods with cash or bank transfer.',
        bestFor: 'Solo merchants selling physical products',
        workflows: ['Orders', 'Manual Payments', 'Delivery Notes'],
        setupTime: '5 minutes',
        volume: 'low',
        teamSize: 'solo',
        configures: ['Order statuses', 'Manual payment recording', 'Basic delivery notes', 'Single-user flow'],
        customizable: ['Prices', 'Status names'],
        previewImage: '/marketing/templates/simple-retail.png',
        creates: {
            pages: ['Dashboard', 'Order List', 'Customer List'],
            sections: ['Payment Log', 'Daily Totals'],
            objects: ['Retail Product', 'Simple Order']
        }
    },
    {
        id: 'structured-retail',
        slug: 'structured-retail',
        name: 'Structured Retail',
        category: 'retail',
        tier: 'growth',
        description: 'Advanced inventory tracking and payment reconciliation for busy shops.',
        bestFor: 'Merchants with repeatable daily operations',
        workflows: ['Orders', 'Payments', 'Inventory', 'Deliveries', 'Records'],
        setupTime: '10 minutes',
        volume: 'medium',
        teamSize: 'small',
        configures: ['Full order lifecycle', 'Payment reconciliation', 'Inventory tracking', 'Delivery status flow'],
        customizable: ['Prices', 'Status names', 'Staff roles', 'Workflow rules'],
        capabilitiesUnlocked: ['Multi-staff access', 'Inventory workflows', 'Basic exports'],
        previewImage: '/marketing/templates/structured-retail.png',
        creates: {
            pages: ['Inventory Manager', 'Delivery Queue', 'Staff Permissions'],
            sections: ['Profit Margin', 'Low Stock Alerts'],
            objects: ['Inventory Item', 'Multi-stage Order']
        }
    },
    {
        id: 'food-catering',
        slug: 'food-catering',
        name: 'Food & Catering Blueprints',
        category: 'food',
        tier: 'growth',
        description: 'Order batching and delivery coordination for busy kitchens.',
        bestFor: 'Food vendors and catering services',
        workflows: ['Orders', 'Payments', 'Logistics'],
        setupTime: '12 minutes',
        volume: 'medium',
        teamSize: 'small',
        configures: ['Order batching', 'Custom delivery zones', 'Daily kitchen reports', 'Payment splitting'],
        customizable: ['Menu', 'Prep times'],
        previewImage: '/marketing/templates/food.png',
        creates: {
            pages: ['Order Queue', 'Kitchen Display'],
            sections: ['Delivery Routes'],
            objects: ['Menu Item', 'Batch Order']
        }
    },
    {
        id: 'online-boutique',
        slug: 'online-boutique',
        name: 'Online Boutique (High Volume)',
        category: 'online',
        tier: 'growth',
        description: 'Optimized for flash sales and high-traffic Instagram/WhatsApp drops.',
        bestFor: 'Fashion and lifestyle brands',
        workflows: ['Orders', 'Inventory', 'Customers'],
        setupTime: '8 minutes',
        volume: 'high',
        teamSize: 'small',
        configures: ['Flash sale handling', 'Automatic stock updates', 'Customer waitlists', 'Payment reconciliation'],
        customizable: ['Catalog', 'Sale rules'],
        previewImage: '/marketing/templates/boutique.png',
        creates: {
            pages: ['Global Inventory', 'Waitlist Manager'],
            sections: ['Performance Stats'],
            objects: ['Variation SKU', 'Waitlist Entry']
        }
    },
    {
        id: 'wholesale',
        slug: 'wholesale',
        name: 'Wholesale / Bulk Orders',
        category: 'wholesale',
        tier: 'pro',
        description: 'Handles bulk pricing, partial payments, and complex distribution workflows.',
        bestFor: 'Bulk sellers and distributors',
        workflows: ['Orders', 'Payments', 'Inventory', 'Deliveries', 'Records'],
        setupTime: '15 minutes',
        volume: 'high',
        teamSize: 'multi',
        configures: ['Complex pricing', 'Partial payments', 'Delivery stages', 'Bulk order statuses'],
        customizable: ['Minimum orders', 'Payment terms', 'Staff roles', 'Workflow rules'],
        capabilitiesUnlocked: ['Unlimited staff', 'Full audit logs', 'Long-term data retention', 'Priority support'],
        previewImage: '/marketing/templates/wholesale.png',
        creates: {
            pages: ['Wholesale Portal', 'Audit Logs', 'Branch Overview'],
            sections: ['Bulk Pricing Rules', 'Partial Payment Ledger'],
            objects: ['Wholesale SKU', 'Bulk Order']
        }
    },
    {
        id: 'multi-branch-retail',
        slug: 'multi-branch-retail',
        name: 'Multi-Branch Retail Ops',
        category: 'retail',
        tier: 'pro',
        description: 'Consolidated records across multiple store locations or branches.',
        bestFor: 'Scaling physical chains',
        workflows: ['Orders', 'Inventory', 'Staff', 'Audit'],
        setupTime: '25 minutes',
        volume: 'high',
        teamSize: 'multi',
        configures: ['Branch-level isolation', 'Consolidated reporting', 'Transfer workflows', 'Centralized audit log'],
        customizable: ['Branch structure', 'Staff roles'],
        previewImage: '/marketing/templates/multi-branch.png',
        creates: {
            pages: ['Branch Overview', 'Audit Center', 'Staff Directory'],
            sections: ['Inter-branch Transfers'],
            objects: ['Branch Entity', 'Audit Log Entry']
        }
    }
];

export function getTemplateBySlug(slug: string) {
    return TEMPLATES.find(t => t.slug === slug);
}

export function isTierAccessible(userTier: PlanTier, requiredTier: PlanTier): boolean {
    const tierHierarchy: Record<PlanTier, number> = { free: 0, growth: 1, pro: 2 };
    return tierHierarchy[userTier] >= tierHierarchy[requiredTier];
}
