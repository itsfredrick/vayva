import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@vayva/db";

export async function GET(request: Request) {
  try {
    // Require authentication
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - Please login" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const type = searchParams.get("type"); // PAYMENT, PAYOUT, REFUND, etc.

    // Get real transactions from ledger
    const where: any = {
      storeId: user.storeId,
    };

    if (type) {
      where.referenceType = type; // Filter by reference type (order, payout, etc.)
    }

    const transactions = await prisma.ledgerEntry.findMany({
      where,
      orderBy: { occurredAt: "desc" },
      take: limit,
      skip: offset,
    });

    // Transform to match expected format
    const formattedTransactions = transactions.map((txn: any) => {
      const amount = Number(txn.amount);
      const isDebit = txn.direction === "DEBIT";

      return {
        id: txn.id,
        merchantId: txn.storeId,
        type: txn.referenceType.toUpperCase(),
        amount: isDebit ? -amount : amount, // Negative for debits
        currency: txn.currency,
        status: "COMPLETED", // Ledger entries are always completed
        source: txn.account,
        referenceId: txn.referenceId || "",
        description: txn.description || "",
        createdAt: txn.occurredAt.toISOString(),
      };
    });

    return NextResponse.json(formattedTransactions);
  } catch (error) {
    console.error("Fetch Wallet History Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch wallet history" },
      { status: 500 },
    );
  }
}
