import { prisma } from "@/lib/prisma";
import { Prisma } from "@vayva/db";

export type WhatsAppAgentSettingsUpdate = Prisma.WhatsAppAgentSettingsUpdateInput;
export type WhatsappTemplateCreate = Prisma.WhatsappTemplateCreateInput;

export const WhatsAppAgentService = {
    // --- Agent Logic Settings ---
    getSettings: async (storeId: string) => {
        // Upsert to ensure it exists
        return await prisma.whatsAppAgentSettings.upsert({
            where: { storeId },
            update: {},
            create: { storeId },
        });
    },

    updateSettings: async (storeId: string, data: WhatsAppAgentSettingsUpdate) => {
        return await prisma.whatsAppAgentSettings.update({
            where: { storeId },
            data,
        });
    },

    // --- Connection (Channel) ---
    getChannel: async (storeId: string) => {
        return await prisma.whatsappChannel.findUnique({
            where: { storeId },
        });
    },

    updateChannel: async (storeId: string, data: Prisma.WhatsappChannelUpdateInput) => {
        return await prisma.whatsappChannel.upsert({
            where: { storeId },
            update: data,
            create: {
                storeId,
                ...data,
            } as Prisma.WhatsappChannelCreateInput,
        });
    },

    // --- Templates ---
    listTemplates: async (storeId: string) => {
        return await prisma.whatsappTemplate.findMany({
            where: { storeId },
            orderBy: { createdAt: "desc" },
        });
    },

    createTemplate: async (storeId: string, data: Omit<WhatsappTemplateCreate, "storeId"> & { storeId: string }) => {
        // Note: Schema defines storeId as String, not relation in strict sense for this model in some versions,
        // but we pass it directly.
        return await prisma.whatsappTemplate.create({
            data: {
                storeId,
                name: data.name,
                language: data.language,
                category: data.category,
                status: data.status,
                components: data.components ?? [],
            },
        });
    },

    deleteTemplate: async (storeId: string, templateId: string) => {
        // Ensure ownership
        const template = await prisma.whatsappTemplate.findUnique({ where: { id: templateId } });
        if (!template || template.storeId !== storeId) {
            throw new Error("Template not found or access denied");
        }
        return await prisma.whatsappTemplate.delete({
            where: { id: templateId },
        });
    }
};
