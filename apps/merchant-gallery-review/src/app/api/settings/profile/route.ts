import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@vayva/db";

export async function GET() {
  try {
    const session = await requireAuth();
    const storeId = session.user.storeId;

    const store = await prisma.store.findUnique({
      where: { id: storeId },
      include: {
        merchantOnboarding: true,
        kycRecord: true,
      },
    });

    // Try to find or create store profile
    let profile = await prisma.storeProfile.findUnique({
      where: { storeId },
    });

    if (!profile && store) {
      profile = await prisma.storeProfile.create({
        data: {
          storeId,
          slug: store.slug,
          displayName: store.name,
        },
      });
    }

    return NextResponse.json({
      store: {
        name: store?.name,
        category: store?.category,
        contacts: store?.contacts || {},
      },
      profile: {
        displayName: profile?.displayName,
        bio: profile?.bio,
        state: profile?.state,
        city: profile?.city,
        whatsappNumberE164: profile?.whatsappNumberE164,
        websiteUrl: profile?.websiteUrl,
      },
    });
  } catch (error: any) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await requireAuth();
    const storeId = session.user.storeId;
    const body = await req.json();

    const { store: storeData, profile: profileData } = body;

    // Update Store
    await prisma.store.update({
      where: { id: storeId },
      data: {
        name: storeData.name,
        category: storeData.category,
        contacts: storeData.contacts,
      },
    });

    // Update StoreProfile
    await prisma.storeProfile.update({
      where: { storeId },
      data: {
        displayName: profileData.displayName,
        bio: profileData.bio,
        state: profileData.state,
        city: profileData.city,
        whatsappNumberE164: profileData.whatsappNumberE164,
        websiteUrl: profileData.websiteUrl,
      },
    });

    // Log audit event
    await prisma.auditLog.create({
      data: {
        storeId,
        actorType: "USER",
        actorId: session.user.id,
        actorLabel: session.user.email || "Merchant",
        action: "PROFILE_UPDATED",
        entityType: "Store",
        entityId: storeId,
        correlationId: `profile-${Date.now()}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
}
