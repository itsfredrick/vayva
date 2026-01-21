import { jsx as _jsx } from "react/jsx-runtime";
import { OpsShell } from "@/components/OpsShell";
import { OpsAuthService } from "@/lib/ops-auth";
import { redirect } from "next/navigation";
export default async function OpsAppLayout({ children, }) {
    // Strict Server-Side Auth Check
    const session = await OpsAuthService.getSession();
    if (!session) {
        // Redirect to login with return URL
        redirect("/ops/login");
    }
    return _jsx(OpsShell, { children: children });
}
