import { NextResponse } from "next/server";
import { withVayvaAPI } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
// NOTE: Disabled - aiSubscription model does not exist in current schema
// This route needs to be refactored to use the correct subscription model
export const POST = withVayvaAPI(PERMISSIONS.FINANCE_VIEW, async (req, { storeId }) => {
    return NextResponse.json({ error: "Subscription management not implemented" }, { status: 501 });
});
