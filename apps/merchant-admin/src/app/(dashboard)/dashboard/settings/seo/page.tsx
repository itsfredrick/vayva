import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@vayva/db";
import { SeoSettingsForm } from "@/components/settings/SeoSettingsForm";

export const metadata = {
    title: "SEO Settings | Vayva",
};

export default async function SeoSettingsPage() {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;

    if (!user || !user.storeId) {
        redirect("/signin");
    }

    const store = await prisma.store.findUnique({
        where: { id: user.storeId },
        select: {
            seoTitle: true,
            seoDescription: true,
            // seoKeywords: true, // Not supported in schema
            socialImage: true,
        },
    });

    if (!store) {
        return <div>Store not found.</div>;
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-gray-900">Social & SEO Settings</h1>
                <p className="text-gray-500">
                    Control how your store appears on Google, Facebook, Twitter, and WhatsApp.
                </p>
            </div>

            <SeoSettingsForm initialData={store} />
        </div>
    );
}
