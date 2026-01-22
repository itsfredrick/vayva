"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@vayva/db";
import { revalidatePath } from "next/cache";

export type StoreSeoInput = {
    seoTitle: string | null;
    seoDescription: string | null;
    // seoKeywords: string[]; // Field not in schema yet
    socialImage: string | null;
};

export async function updateStoreSeo(data: StoreSeoInput) {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user || !user.storeId) {
        throw new Error("Unauthorized");
    }

    try {
        await prisma.store.update({
            where: { id: user.storeId },
            data: {
                seoTitle: data.seoTitle,
                seoDescription: data.seoDescription,
                // seoKeywords: data.seoKeywords, // Field not in schema yet
                socialImage: data.socialImage,
            },
        });

        revalidatePath("/dashboard/settings/seo");
        return { success: true };
    } catch (error) {
        console.error("Failed to update SEO settings:", error);
        return { success: false, error: "Failed to update settings" };
    }
}
