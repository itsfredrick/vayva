import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    const user = session?.user;
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
        return _jsx("div", { children: "Store not found." });
    }
    return (_jsxs("div", { className: "p-6 max-w-4xl mx-auto space-y-6", children: [_jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Social & SEO Settings" }), _jsx("p", { className: "text-gray-500", children: "Control how your store appears on Google, Facebook, Twitter, and WhatsApp." })] }), _jsx(SeoSettingsForm, { initialData: store })] }));
}
