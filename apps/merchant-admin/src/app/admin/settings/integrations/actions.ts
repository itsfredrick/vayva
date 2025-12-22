'use server';

import crypto from 'crypto';
import { revalidatePath } from 'next/cache';
import { ApiKeyService } from '../../../../lib/security/apiKeys';
import { WebhookService } from '../../../../lib/integrations/webhookService';
import { getMerchantId } from '../../../../lib/auth/tenant';
import { z } from 'zod';

// API Keys
const createKeySchema = z.object({
    name: z.string().min(1, 'Name is required'),
    scopes: z.array(z.string()).default(['read', 'write']),
});

export async function createApiKey(formData: FormData) {
    try {
        const merchantId = await getMerchantId();
        if (!merchantId) throw new Error('Unauthorized');

        const rawData = {
            name: formData.get('name'),
            scopes: JSON.parse(formData.get('scopes') as string || '["read", "write"]'),
        };

        const data = createKeySchema.parse(rawData);
        const result = await ApiKeyService.createKey(merchantId, data.name, data.scopes, 'admin'); // Created by admin user

        revalidatePath('/admin/settings/integrations');
        return { success: true, key: result }; // Initial return includes RAW key
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function revokeApiKey(keyId: string) {
    try {
        const merchantId = await getMerchantId();
        if (!merchantId) throw new Error('Unauthorized');

        await ApiKeyService.revokeKey(keyId, merchantId);
        revalidatePath('/admin/settings/integrations');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}


// Webhooks
const createWebhookSchema = z.object({
    url: z.string().url(),
    events: z.array(z.string()).min(1),
    secret: z.string().optional() // Auto generated if missing settings
});

export async function createWebhook(formData: FormData) {
    try {
        const merchantId = await getMerchantId();
        if (!merchantId) throw new Error('Unauthorized');

        const rawData = {
            url: formData.get('url'),
            events: JSON.parse(formData.get('events') as string || '[]'),
        };

        const data = createWebhookSchema.parse(rawData);

        // We need a repository interaction here or service.
        // Assuming WebhookService or direct DB. Service is cleaner if exposed.
        // Checking WebhookService... it handles signing/delivery.
        // We probably need to use Prisma directly for management if Service doesn't expose generic CRUD, 
        // OR add CRUD to Service. Let's use direct Prisma for V1 of this Action to be speedier, 
        // as WebhookService in Int 57 was likely focused on delivery logic.

        // Wait, better to check if WebhookService has createSubscription.
        // If not, I'll add it to the service or do it inline here.
        // Inline for now to avoid switching contexts too much if I can import prisma.

        const { prisma } = await import('@vayva/db');
        const secret = crypto.randomUUID().replace(/-/g, '');
        const secretHash = crypto.createHash('sha256').update(secret).digest('hex');

        await prisma.webhookSubscription.create({
            data: {
                merchantId,
                name: (data.url.split('//')[1] || data.url).split('/')[0], // Default name from hostname
                url: data.url,
                events: data.events,
                signingSecretHash: secretHash,
                status: 'active'
            }
        });

        revalidatePath('/admin/settings/integrations');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function deleteWebhook(id: string) {
    try {
        const merchantId = await getMerchantId();
        const { prisma } = await import('@vayva/db');
        await prisma.webhookSubscription.deleteMany({
            where: { id, merchantId } // Ensure ownership
        });
        revalidatePath('/admin/settings/integrations');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}
