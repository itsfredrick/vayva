import { headers } from "next/headers";

export async function getSlugFromHeaders(): Promise<string | null> {
    const headersList = await headers();
    const host = headersList.get("host") || "";

    if (process.env.NEXT_PUBLIC_ROOT_DOMAIN && host.includes(process.env.NEXT_PUBLIC_ROOT_DOMAIN)) {
        return host.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "");
    } else if (host.endsWith(".vayva.com")) {
        return host.replace(".vayva.com", "");
    } else if (host.endsWith(".vayva.shop")) {
        return host.replace(".vayva.shop", "");
    } else if (host.endsWith(".vayva.ng")) {
        return host.replace(".vayva.ng", "");
    }
    return null;
}
