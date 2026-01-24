import { QRCodeGenerator } from "@/components/growth/QRCodeGenerator";
import { requireAuth } from "@/lib/session";
import { prisma } from "@vayva/db";
import { notFound } from "next/navigation";

export default async function QRCodePage() {
    const user = await requireAuth();

    const store = await prisma.store.findUnique({
        where: { id: user.storeId },
        select: { name: true, slug: true }
    });

    if (!store) {
        notFound();
    }

    // Construct store URL - ensure it handles dev/prod environments correctly
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "vayva.localhost:3000";
    const storeUrl = `${protocol}://${store.slug}.${rootDomain}`;

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Offline Traffic Generator</h1>
                <p className="text-gray-500 max-w-md mx-auto">
                    Bridge the gap between your physical location and your digital store.
                </p>
            </div>

            <QRCodeGenerator
                storeUrl={storeUrl}
                storeName={store.name}
            />
        </div>
    );
}
