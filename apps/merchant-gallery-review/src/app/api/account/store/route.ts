import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@vayva/db";

export async function GET() {
  try {
    const session = await requireAuth();
    const storeId = session.user.storeId;

    const store = await prisma.store.findUnique({
      where: { id: storeId },
      select: {
        id: true,
        name: true,
        slug: true,
        category: true,
        logoUrl: true,
        contacts: true,
        settings: true,
      },
    });

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    // Fetch StoreProfile for additional details
    const profile = await prisma.storeProfile.findUnique({
      where: { storeId },
      select: {
        city: true,
        state: true,
        whatsappNumberE164: true,
      },
    });

    // Parse contacts and settings from JSON
    const contacts = (store.contacts as any) || {};
    const settings = (store.settings as any) || {};

    return NextResponse.json({
      id: store.id,
      name: store.name,
      slug: store.slug,
      businessType: store.category,
      description: settings.description || "",
      supportEmail: contacts.email || "",
      supportPhone: contacts.phone || "",
      logoUrl: store.logoUrl,
      whatsappNumber: profile?.whatsappNumberE164 || "",
      address: {
        street: settings.address?.street || "",
        city: profile?.city || settings.address?.city || "",
        state: profile?.state || settings.address?.state || "",
        country: settings.address?.country || "Nigeria",
        landmark: settings.address?.landmark || "",
      },
    });
  } catch (error: any) {
    console.error("Store profile fetch error:", error);

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to fetch store profile" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await requireAuth();
    const storeId = session.user.storeId;

    const body = await request.json();
    const {
      name,
      businessType,
      description,
      supportEmail,
      supportPhone,
      address,
      logoUrl,
      whatsappNumber,
    } = body;

    // Validate required fields
    if (!name || !supportEmail) {
      return NextResponse.json(
        { error: "Name and support email are required" },
        { status: 400 },
      );
    }

    // Get current store data
    const currentStore = await prisma.store.findUnique({
      where: { id: storeId },
      select: {
        contacts: true,
        settings: true,
        name: true,
        category: true,
        logoUrl: true,
      },
    });

    const currentContacts = (currentStore?.contacts as any) || {};
    const currentSettings = (currentStore?.settings as any) || {};

    // Update Store and StoreProfile in a transaction
    const [updatedStore] = await prisma.$transaction([
      prisma.store.update({
        where: { id: storeId },
        data: {
          name,
          category: businessType,
          logoUrl: logoUrl !== undefined ? logoUrl : currentStore?.logoUrl,
          contacts: {
            ...currentContacts,
            email: supportEmail,
            phone: supportPhone,
          },
          settings: {
            ...currentSettings,
            description,
            address: {
              ...(currentSettings.address || {}),
              ...address,
            },
          },
        },
      }),
      prisma.storeProfile.upsert({
        where: { storeId },
        create: {
          storeId,
          slug:
            currentStore?.name?.toLowerCase().replace(/\s+/g, "-") ||
            `store-${storeId.substring(0, 8)}`,
          displayName: name,
          city: address?.city,
          state: address?.state,
          whatsappNumberE164: whatsappNumber,
        },
        update: {
          displayName: name,
          city: address?.city,
          state: address?.state,
          whatsappNumberE164: whatsappNumber,
          logoUrl: logoUrl !== undefined ? logoUrl : currentStore?.logoUrl,
        },
      }),
    ]);

    // Audit Logging
    const { logAuditEvent, AuditEventType } = await import("@/lib/audit");
    await logAuditEvent(
      storeId,
      session.user.id,
      AuditEventType.SETTINGS_CHANGED,
      {
        keysChanged: ["name", "category", "location", "branding"].filter(
          (k) => {
            if (k === "name") return name !== currentStore?.name;
            if (k === "category")
              return businessType !== currentStore?.category;
            return true; // Simplified for address/logo
          },
        ),
      },
    );

    return NextResponse.json({
      success: true,
      message: "Store profile updated successfully",
      store: {
        id: updatedStore.id,
        name: updatedStore.name,
      },
    });
  } catch (error: any) {
    console.error("Store profile update error:", error);

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to update store profile" },
      { status: 500 },
    );
  }
}
