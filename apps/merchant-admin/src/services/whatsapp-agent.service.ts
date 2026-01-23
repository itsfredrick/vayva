import { prisma } from "@/lib/prisma";
export const WhatsAppAgentService = {
    // --- Agent Logic Settings ---
    getSettings: async (storeId: unknown) => {
        // Upsert to ensure it exists
        return await prisma.whatsAppAgentSettings.upsert({
            where: { storeId },
            update: {},
            create: { storeId },
        });
    },
    updateSettings: async (storeId: unknown, data: unknown) => {
        return await prisma.whatsAppAgentSettings.update({
            where: { storeId },
            data,
        });
    },
    // --- Connection (Channel) ---
    getChannel: async (storeId: unknown) => {
        return await prisma.whatsappChannel.findUnique({
            where: { storeId },
        });
    },
    updateChannel: async (storeId: unknown, data: unknown) => {
        return await prisma.whatsappChannel.upsert({
            where: { storeId },
            update: data,
            create: {
                storeId,
                ...data,
            },
        });
    },
    // --- Templates ---
    listTemplates: async (storeId: unknown) => {
        return await prisma.whatsappTemplate.findMany({
            where: { storeId },
            orderBy: { createdAt: "desc" },
        });
    },
    createTemplate: async (storeId: unknown, data: unknown) => {
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
    deleteTemplate: async (storeId: unknown, templateId: unknown) => {
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
