import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { requireStoreAccess } from "@/lib/auth/session";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const session = await requireStoreAccess();

    const body = await request.json();
    const { pin } = body;

    if (!pin || pin.length !== 4) {
      return NextResponse.json(
        { error: "Invalid PIN format" },
        { status: 400 },
      );
    }

    const wallet = await prisma.wallet.findUnique({
      where: { storeId: session.user.storeId },
    });

    if (!wallet || !wallet.pinHash) {
      return NextResponse.json({ error: "PIN not set up" }, { status: 400 });
    }

    // 1. Check Lockout
    if (
      wallet.isLocked &&
      wallet.lockedUntil &&
      wallet.lockedUntil > new Date()
    ) {
      const retryAfter = Math.ceil(
        (wallet.lockedUntil.getTime() - Date.now()) / 1000,
      );
      return NextResponse.json(
        {
          error: "Too many attempts. Account locked.",
          requiredAction: "WAIT",
          details: { retryAfterSeconds: retryAfter },
        },
        { status: 403 },
      );
    }

    const isValid = await bcrypt.compare(pin, wallet.pinHash);

    if (!isValid) {
      // 2. Increment fail count and handle lockout
      const newAttempts = wallet.failedPinAttempts + 1;
      const isNowLocked = newAttempts >= 5;
      const lockedUntil = isNowLocked
        ? new Date(Date.now() + 15 * 60 * 1000)
        : null;

      await prisma.wallet.update({
        where: { storeId: session.user.storeId },
        data: {
          failedPinAttempts: newAttempts,
          isLocked: isNowLocked,
          lockedUntil: lockedUntil,
        },
      });

      return NextResponse.json(
        {
          error: isNowLocked
            ? "Too many attempts. Locked for 15m."
            : "Incorrect PIN",
          attemptsRemaining: Math.max(0, 5 - newAttempts),
        },
        { status: 403 },
      );
    }

    // 3. Reset failures on success
    await prisma.wallet.update({
      where: { storeId: session.user.storeId },
      data: {
        failedPinAttempts: 0,
        isLocked: false,
        lockedUntil: null,
      },
    });

    // 4. Establish secure PIN session
    const { createPinSession } = await import("@/lib/auth/gating");
    await createPinSession(session.user.storeId, wallet.pinVersion);

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
