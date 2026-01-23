import { NextResponse } from "next/server";
export async function GET() {
    const stats = {
        totalRevenue: 154000,
        countNew: 5,
        countInProgress: 3,
        countCompleted: 12,
        countPendingPayment: 2,
    };
    return NextResponse.json(stats);
}
