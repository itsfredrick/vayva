import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@vayva/db";

export async function GET() {
  try {
    // Require authentication
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - Please login" },
        { status: 401 },
      );
    }

    // Get real wallet balance from database
    const wallet = await prisma.wallet.findUnique({
      where: { storeId: user.storeId },
      select: {
        availableKobo: true,
        pendingKobo: true,
        vaAccountNumber: true,
        vaBankName: true,
        vaStatus: true,
        updatedAt: true,
      },
    });

    // If no wallet exists, create one
    if (!wallet) {
      const newWallet = await prisma.wallet.create({
        data: {
          storeId: user.storeId,
          availableKobo: 0,
          pendingKobo: 0,
        },
      });

      return NextResponse.json({
        storeId: user.storeId,
        available: 0,
        pending: 0,
        total: 0,
        blocked: 0,
        currency: "NGN",
        virtualAccount: null,
        lastUpdated: newWallet.updatedAt.toISOString(),
      });
    }

    // Convert from kobo to naira (divide by 100)
    const availableNaira = Number(wallet.availableKobo) / 100;
    const pendingNaira = Number(wallet.pendingKobo) / 100;
    const totalNaira = availableNaira + pendingNaira;

    // Virtual account info (for deposits)
    const virtualAccount = wallet.vaAccountNumber
      ? {
          accountNumber: wallet.vaAccountNumber,
          bankName: wallet.vaBankName || "",
          status: wallet.vaStatus,
        }
      : null;

    return NextResponse.json({
      storeId: user.storeId,
      available: availableNaira,
      pending: pendingNaira,
      total: totalNaira,
      blocked: 0,
      currency: "NGN",
      virtualAccount,
      lastUpdated: wallet.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("Fetch Balance Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch balance" },
      { status: 500 },
    );
  }
}
