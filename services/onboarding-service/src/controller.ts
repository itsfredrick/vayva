import { prisma } from "@vayva/db";

export const OnboardingController = {
  // --- Wizard State ---
  getWizardState: async (storeId: string) => {
    let flow = await prisma.onboardingFlow.findUnique({
      where: { storeId },
    });

    if (!flow) {
      flow = await prisma.onboardingFlow.create({
        data: {
          storeId,
          status: "IN_PROGRESS",
          completedSteps: [],
          skippedSteps: [],
        },
      });
    }

    return flow;
  },

  updateWizardStep: async (
    storeId: string,
    stepKey: string,
    action: "complete" | "skip",
  ) => {
    const flow = await OnboardingController.getWizardState(storeId);

    const updates: any = { currentStepKey: stepKey };

    if (action === "complete") {
      updates.completedSteps = [...flow.completedSteps, stepKey];
    } else {
      updates.skippedSteps = [...flow.skippedSteps, stepKey];
    }

    const updatedFlow = await prisma.onboardingFlow.update({
      where: { storeId },
      data: updates,
    });

    // Check if fully complete and dispatch notification
    const checklist = await OnboardingController.getChecklist(storeId);
    if (checklist.every(i => i.status === "DONE")) {
      fetch(`${process.env.NOTIFICATIONS_SERVICE_URL || "http://notifications-service:3000"}/v1/internal/event`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "ONBOARDING_COMPLETED",
          storeId,
          payload: { flowId: updatedFlow.id }
        })
      }).catch(console.error);
    }

    return updatedFlow;
  },

  // --- Checklist Engine ---
  computeChecklist: async (storeId: string) => {
    // Compute checklist status from system state
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      include: {
        products: true,
        // storefrontSettings: true // Removed
      },
    });

    const settings = await prisma.storefrontSettings.findUnique({
      where: { storeId },
    });

    const [paymentAccount, deliveryOption, whatsappChannel, tosTemplate] = await Promise.all([
      prisma.paymentAccount.findFirst({
        where: { storeId, status: "CONNECTED" },
      }),
      prisma.deliveryOption.findFirst({
        where: { storeId, enabled: true },
      }),
      prisma.whatsappChannel.findFirst({
        where: { storeId, status: "CONNECTED" },
      }),
      prisma.legalTemplate.findFirst({
        where: { storeId, key: "TERMS", isActive: true },
      }),
    ]);

    const items = [
      {
        key: "storefront.products_added",
        title: "Add Products",
        description: "Add at least one product to your catalog",
        category: "STOREFRONT",
        status: (store?.products?.length && store.products.length > 0) ? "DONE" : "PENDING",
      },
      {
        key: "storefront.logo_set",
        title: "Upload Logo",
        description: "Set your store logo for branding",
        category: "STOREFRONT",
        status: settings?.logoS3Key ? "DONE" : "PENDING",
      },
      {
        key: "payments.connected",
        title: "Connect Payment Provider",
        description: "Link your Paystack or Stripe account",
        category: "PAYMENTS",
        status: paymentAccount ? "DONE" : "PENDING",
      },
      {
        key: "delivery.configured",
        title: "Setup Delivery",
        description: "Configure delivery options",
        category: "DELIVERY",
        status: deliveryOption ? "DONE" : "PENDING",
      },
      {
        key: "whatsapp.connected",
        title: "Connect WhatsApp",
        description: "Link your WhatsApp Business account",
        category: "WHATSAPP",
        status: whatsappChannel ? "DONE" : "PENDING",
      },
      {
        key: "policies.terms_published",
        title: "Publish Terms of Service",
        description: "Review and publish your terms",
        category: "POLICIES",
        status: tosTemplate ? "DONE" : "PENDING",
      },
    ];

    // Upsert checklist items
    for (const item of items) {
      await prisma.goLiveChecklistItem.upsert({
        where: { storeId_key: { storeId, key: item.key } },
        create: { storeId, ...item } as any,
        update: { status: item.status } as any,
      });
    }

    return items;
  },

  getChecklist: async (storeId: string) => {
    await OnboardingController.computeChecklist(storeId);
    return await prisma.goLiveChecklistItem.findMany({
      where: { storeId },
      orderBy: { category: "asc" },
    });
  },

  // --- Storefront Settings ---
  getStorefrontSettings: async (storeId: string) => {
    return await prisma.storefrontSettings.findUnique({
      where: { storeId },
    });
  },

  updateStorefrontSettings: async (storeId: string, data: any) => {
    return await prisma.storefrontSettings.upsert({
      where: { storeId },
      create: { storeId, ...data },
      update: data,
    });
  },
};
