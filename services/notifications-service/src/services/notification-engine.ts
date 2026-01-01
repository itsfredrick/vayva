import { prisma } from "@vayva/db";

interface SendNotificationParams {
  storeId: string;
  channel?: string; // Optional, will infer from preferences if missing
  to: string; // Phone or Email
  templateKey: string;
  variables: Record<string, any>;
  customerId?: string;
  orderId?: string;
}

export const NotificationService = {
  send: async (params: SendNotificationParams) => {
    const { storeId, to, templateKey, variables, customerId, orderId } = params;
    let channel = params.channel;

    // 1. Determine Channel Logic (Hierarchy: WA > SMS > Email)
    // For V1, simplicity: if 'to' looks like email -> EMAIL, else -> WA/SMS
    if (!channel) {
      if (to.includes("@")) channel = "EMAIL";
      else channel = "WHATSAPP"; // Default to WA for phone
    }

    // 2. Find Template
    const template = await prisma.notificationTemplate.findUnique({
      where: {
        storeId_channel_key: {
          storeId,
          channel,
          key: templateKey,
        },
      },
    });

    // 3. Render Message
    let body = "";
    let subject = "";

    if (template && template.enabled) {
      body = template.body;
      subject = template.subject || "";

      // Simple Variable Replacement
      Object.keys(variables).forEach((key) => {
        const regex = new RegExp(`{{${key}}}`, "g");
        body = body.replace(regex, String(variables[key]));
        subject = subject.replace(regex, String(variables[key]));
      });
    } else {
      // Fallback or skip?
      // If critical, maybe log error.
      // For now, let's create an outbox entry even if template missing, marked as FAILED/SKIPPED or use default hardcoded?
      // Better to skip.
      console.log(
        `Template not found or disabled: ${templateKey} for ${channel}`,
      );
      return { status: "SKIPPED", reason: "Template missing" };
    }

    // 4. Create Outbox Entry
    const outbox = await prisma.notificationOutbox.create({
      data: {
        storeId,
        channel,
        templateKey,
        to,
        payload: { subject, body, variables },
        recipientId: customerId,
        orderId,
        status: "QUEUED",
      },
    });

    // 5. Trigger Sender (Async Worker Simulation)
    // In production this would be a separate worker picking up QUEUED items.
    // Here we can attempt immediate send logic or leave it queued.
    // For V1 "Monolith-ish", we might just call the provider here.
    // await sendToProvider(outbox);

    return outbox;
  },
};
