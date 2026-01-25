import { FastifyPluginAsync } from "fastify";
import { prisma, Prisma } from "@vayva/db";
import { z } from "zod";

const onboardingRoute: FastifyPluginAsync = async fastify => {
  // Save Store Details
  fastify.post(
    "/store",
    {
      onRequest: [fastify.authenticate],
    },
    async (request, reply) => {
      // Simplification for v1 wizard:
      const WizardSchema = z.object({
        name: z.string(),
        slug: z.string(),
        settings: z.record(z.unknown()).optional(),
      });

      const body = WizardSchema.parse(request.body);
      const user = request.user;

      // 0. Check for slug collision
      const existingStore = await prisma.store.findUnique({
        where: { slug: body.slug },
      });

      if (existingStore) {
        return reply
          .status(409)
          .send({ error: "Store URL (slug) is already taken." });
      }

      // 1. Create Tenant (One-to-one with User for V1 solo founders)
      const tenant = await prisma.tenant.create({
        data: {
          name: body.name,
          slug: body.slug,
          tenantMemberships: {
            create: {
              userId: user.sub,
              role: "OWNER",
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
          settings: (body.settings || {}) as unknown as Prisma.InputJsonValue,
        },
      });

      // 3. Assign Default Template
      try {
        const defaultTemplate = await prisma.template.findUnique({
          where: { slug: "vayva-default" },
        });

        if (defaultTemplate) {
          await prisma.merchantTheme.create({
            data: {
              storeId: store.id,
              templateId: defaultTemplate.id,
              status: "PUBLISHED",
              config: {},
              publishedAt: new Date(),
            },
          });
        }
      } catch (err) {
        request.log.error(`Failed to assign default template: ${err}`);
      }

      return {
        message: "Store created successfully",
        storeId: store.id,
        tenantId: tenant.id,
      };
    },
  );
};

export default onboardingRoute;
