import { NextResponse } from "next/server";
// Paystack standard transfer rate (simulated) -> 10 NGN if < 5000, 25 if < 50000, 50 otherwise
const calculateFee = (amount) => {
    if (amount <= 5000)
        return 10;
    if (amount <= 50000)
        return 25;
    return 50;
};
import { getSessionUser } from "@/lib/session";
export async function POST(request) {
    const user = await getSessionUser();
    if (!user?.storeId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const { amount } = body;
    const fee = calculateFee(amount);
    const quote = {
        amount,
        fee,
        netAmount: amount - fee,
        currency: "NGN",
        estimatedArrival: "within 24 hours",
    };
    return NextResponse.json(quote);
}
