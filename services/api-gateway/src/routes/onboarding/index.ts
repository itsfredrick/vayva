import { FastifyPluginAsync } from 'fastify';
import { prisma } from '@vayva/db';
import { StoreSchema } from '@vayva/schemas';
import { z } from 'zod';

const onboardingRoute: FastifyPluginAsync = async (fastify) => {
    // Save Store Details
    fastify.post('/store', {
        onRequest: [fastify.authenticate]
    }, async (request, reply) => {
        // We expect the body to match components of the Store schema or a specific Onboarding schema
        // For now, let's assume we are receiving the full Store object or partial
        // But StoreSchema requires tenantId etc. In wizard we might just get name, type, contact.

        // Simplification for v1 wizard:
        const WizardSchema = z.object({
            name: z.string(),
            slug: z.string(),
            settings: z.record(z.any()).optional(),
        });

        const body = WizardSchema.parse(request.body);
        const user = (request as any).user as { id: string, email: string };

        // 1. Create Tenant (One-to-one with User for V1 solo founders)
        // In a real app we might check if user already has a tenant or if we are inviting.
        // For V1 Signup -> Onboarding flow, we create a new Tenant.

        const tenant = await prisma.tenant.create({
            data: {
                name: body.name,
                slug: body.slug, // TODO: Ensure unique slug globally
                TenantMembership: {
                    create: {
                        userId: user.id,
                        role: 'OWNER',
                    },
                },
            },
        });

        // 2. Create Store
        const store = await prisma.store.create({
            data: {
                tenantId: tenant.id,
                name: body.name,
                slug: body.slug,
                settings: body.settings || {},
            },
        });

        // 3. Assign Default Template
        try {
            const defaultTemplate = await prisma.template.findUnique({
                where: { slug: 'vayva-default' }
            });

            if (defaultTemplate) {
                await prisma.merchantTheme.create({
                    data: {
                        storeId: store.id,
                        templateId: defaultTemplate.id,
                        status: 'PUBLISHED',
                        config: {},
                        publishedAt: new Date()
                    }
                });
            } else {
                console.warn('Default template "vayva-default" not found. Skipping theme assignment.');
            }
        } catch (err) {
            console.error('Failed to assign default template:', err);
        }

        return {
            message: 'Store created successfully',
            storeId: store.id,
            tenantId: tenant.id
        };
    });
};

export default onboardingRoute;
