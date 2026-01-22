import { Worker, Queue } from "bullmq";
import * as dotenv from "dotenv";
import { prisma, Direction, MessageStatus, MessageType, OrderStatus } from "@vayva/db";

import { metaProvider, kwikProvider } from "./lib/providers";
import { AIProvider } from "./lib/ai";
import { WorkerRescueService } from "./lib/worker-rescue";

dotenv.config();

import { getRedis } from "@vayva/redis";

const connection = getRedis();

import { QUEUES } from "@vayva/shared";
import { ChinaSyncService } from "@vayva/shared/china-sync-service";

// Queue instances for producers
const whatsappOutboundQueue = new Queue(QUEUES.WHATSAPP_OUTBOUND, { connection });
const agentActionsQueue = new Queue(QUEUES.AGENT_ACTIONS, { connection });
const deliveryQueue = new Queue(QUEUES.DELIVERY_SCHEDULER, { connection });

async function start() {
  console.log("Starting workers...");

  /**
   * 1. WHATSAPP INBOUND
   * Handles raw webhooks from Meta, deduplicates, and persists message.
   */
  new Worker(
    QUEUES.WHATSAPP_INBOUND,
    async (job) => {
      const { storeId, payload } = job.data as { storeId: string; payload: unknown };
      const messageData = payload.messages?.[0];
      const contactData = payload.contacts?.[0];

      if (!messageData || !contactData) return;

      const messageId = messageData.id;
      const dedupeKey = `wa_msg:${messageId}`;

      // Deduplication
      const isProcessed = await connection.get(dedupeKey);
      if (isProcessed) {
        console.log(`[Skipping] Message ${messageId} already processed.`);
        return;
      }
      await connection.set(dedupeKey, "1", "EX", 60 * 60 * 24); // 24h expiry

      console.log(`Processing ${QUEUES.WHATSAPP_INBOUND}: ${messageId}`);

      try {
        // 1. Resolve Contact
        const waId = contactData.wa_id;
        let contact = await prisma.contact.findUnique({
          where: {
            storeId_channel_externalId: {
              storeId,
              channel: "WHATSAPP",
              externalId: waId,
            },
          },
        });

        if (!contact) {
          contact = await prisma.contact.create({
            data: {
              storeId,
              channel: "WHATSAPP",
              externalId: waId,
              displayName: contactData.profile?.name,
              phoneE164: waId,
            },
          });
        }

        // 2. Resolve Conversation
        let conversation = await prisma.conversation.findUnique({
          where: {
            storeId_contactId: {
              storeId,
              contactId: contact.id,
            },
          },
        });

        if (!conversation) {
          conversation = await prisma.conversation.create({
            data: {
              storeId,
              contactId: contact.id,
              status: "OPEN",
            },
          });
        }

        // 3. Persist Message
        const message = await prisma.message.create({
          data: {
            storeId,
            conversationId: conversation.id,
            direction: Direction.INBOUND,
            type: (messageData.type?.toUpperCase() as unknown) || MessageType.TEXT,
            providerMessageId: messageId,
            textBody: messageData.text?.body || "",
            status: MessageStatus.DELIVERED,
            receivedAt: new Date(),
          },
        });

        // 4. Update Conversation Stats
        await prisma.conversation.update({
          where: { id: conversation.id },
          data: {
            lastMessageAt: new Date(),
            unreadCount: { increment: 1 },
          },
        });

        // 5. Trigger Agent Action
        if (message.type === MessageType.TEXT) {
          await agentActionsQueue.add("process", {
            messageId: message.id,
            storeId
          });
          console.log(`[Trigger] Agent Action for msg ${message.id}`);
        }

      } catch (error) {
        console.error("Error processing inbound message:", error);
        await WorkerRescueService.reportJobFailure(QUEUES.WHATSAPP_INBOUND, job.id!, error);
        throw error; // Trigger retry
      }
    },
    { connection },
  );

  /**
   * 2. WHATSAPP OUTBOUND
   * Sends messages via Meta API.
   */
  new Worker(
    QUEUES.WHATSAPP_OUTBOUND,
    async (job) => {
      const { to, body, storeId, messageId } = job.data;
      console.log(`[WHATSAPP_OUTBOUND] Sending to ${to}`);

      try {
        const result = await metaProvider.sendMessage({
          recipient: to,
          type: "text",
          body: body,
        });

        if (messageId) {
          await prisma.message.update({
            where: { id: messageId },
            data: {
              status: MessageStatus.SENT,
              providerMessageId: result.providerMessageId,
              sentAt: new Date(),
            },
          });
        }
      } catch (error) {
        console.error("Failed to send message:", error);
        if (messageId) {
          await prisma.message.update({
            where: { id: messageId },
            data: { status: MessageStatus.FAILED },
          });
        }
        throw error;
      }
    },
    { connection },
  );

  /**
   * 3. AGENT ACTIONS
   * Real AI-powered conversation handler.
   */
  new Worker(
    QUEUES.AGENT_ACTIONS,
    async (job) => {
      const { messageId, storeId } = job.data;
      console.log(`[AGENT] Analyzing message ${messageId}`);

      const message = await prisma.message.findUnique({
        where: { id: messageId },
        include: {
          conversation: {
            include: {
              contact: true
            }
          }
        },
      });

      if (!message || !message.textBody) return;

      // 1. Fetch Store Context
      const store = await prisma.store.findUnique({
        where: { id: storeId },
        include: {
          products: {
            where: { status: "ACTIVE" },
            take: 10
          }
        }
      });

      if (!store) return;

      // 2. Get AI Response
      const replyText = await AIProvider.chat(
        [{ role: "user", content: message.textBody }],
        {
          storeName: store.name,
          customerName: message.conversation.contact.displayName || undefined,
          products: store.products.map(p => ({
            name: p.title,
            price: Number(p.price)
          }))
        }
      );

      if (replyText) {
        console.log(`[AGENT] AI generated response. Replying...`);
        await whatsappOutboundQueue.add("send", {
          to: message.conversation.contact.phoneE164,
          body: replyText,
          storeId,
          messageId: message.id,
        });
      }
    },
    { connection },
  );

  /**
   * 4. DELIVERY SCHEDULER
   * Schedules delivery when Order is confirmed.
   */
  new Worker(
    QUEUES.DELIVERY_SCHEDULER,
    async (job) => {
      const { orderId } = job.data;
      console.log(`[DELIVERY] Scheduling for Order ${orderId}`);

      const idempotencyKey = `delivery_sched:${orderId}`;
      const exists = await connection.get(idempotencyKey);
      if (exists) {
        console.log(`[DELIVERY] Skipping ${orderId}, already scheduled.`);
        return;
      }

      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          customer: {
            include: {
              addresses: {
                where: { isDefault: true },
                take: 1,
              },
            },
          },
          store: {
            include: { deliverySettings: true }
          },
          items: true,
          shipment: true,
        },
      });

      if (!order || !order.storeId) {
        console.error(`[DELIVERY] Order ${orderId} or associated store not found`);
        return;
      }

      // Resolve Address
      let address;
      if (order.shipment) {
        address = {
          name: order.shipment.recipientName,
          phone: order.shipment.recipientPhone,
          address: order.shipment.addressLine1,
          city: order.shipment.addressCity,
        };
      } else if (order.customer?.addresses?.[0]) {
        const addr = order.customer.addresses[0];
        address = {
          name: addr.recipientName || `${order.customer.firstName} ${order.customer.lastName}`,
          phone: addr.recipientPhone || order.customer.phone,
          address: addr.addressLine1,
          city: addr.city,
        };
      }

      if (
        !address ||
        !address.name ||
        !address.phone ||
        !address.address
      ) {
        console.error(`[DELIVERY] Order ${orderId} missing valid shipping address`);
        return;
      }

      // Ensure Shipment Exists (Idempotent creation)
      let shipment = order.shipment;
      if (!shipment) {
        shipment = await prisma.shipment.create({
          data: {
            storeId: order.storeId,
            orderId: order.id,
            status: "REQUESTED",
            recipientName: address.name,
            recipientPhone: address.phone,
            addressLine1: address.address,
            addressCity: address.city,
          },
        });
      }

      // Schedule with Kwik
      try {
        const result = await kwikProvider.createJob({
          pickup: {
            name: (order as unknown).store?.deliverySettings?.pickupName || (order as unknown).store?.name || "Vayva Store",
            phone: (order as unknown).store?.deliverySettings?.pickupPhone || "08000000000",
            address: (order as unknown).store?.deliverySettings?.pickupAddressLine1 || "Lagos, Nigeria",
          },
          dropoff: {
            name: address.name,
            phone: address.phone,
            address: address.address,
          },
          items: order.items.map((i: unknown) => ({
            description: i.title,
            quantity: i.quantity,
          })),
        });

        // Create Dispatch Job Linked to Shipment
        await prisma.dispatchJob.create({
          data: {
            storeId: order.storeId,
            shipmentId: shipment.id,
            carrier: "KWIK",
            providerJobId: result.providerJobId,
            status: result.status,
            vehicleType: "bike",
          },
        });

        // Update Shipment tracking info
        await prisma.shipment.update({
          where: { id: shipment.id },
          data: {
            trackingUrl: result.trackingUrl,
            externalId: result.providerJobId,
            status: "ACCEPTED"
          }
        });

        // Mark as scheduled to prevent replay
        await connection.set(idempotencyKey, "1", "EX", 60 * 60 * 24 * 7); // 7 days
        console.log(`[DELIVERY] Scheduled Kwik Job: ${result.providerJobId}`);
      } catch (err) {
        console.error("[DELIVERY] Failed to schedule:", err);
        throw err;
      }
    },
    { connection },
  );

  /**
   * 5. PAYMENTS WEBHOOKS
   * Processes successful payments and triggers fulfillment.
   */
  new Worker(
    QUEUES.PAYMENTS_WEBHOOKS,
    async (job) => {
      const { providerEventId, eventType, data, metadata } = job.data;
      console.log(`[PAYMENT] Processing ${eventType} for event ${providerEventId}`);

      try {
        // 1. Idempotency Check (Claim-Check)
        const existingEvent = await prisma.paymentWebhookEvent.findUnique({
          where: {
            provider_providerEventId: {
              provider: "PAYSTACK",
              providerEventId,
            },
          },
        });

        if (existingEvent?.status === "PROCESSED") {
          console.log(`[PAYMENT] Skipping already processed event ${providerEventId}`);
          return;
        }

        if (eventType === "charge.success") {
          const storeId = metadata?.storeId;
          const purchaseType = metadata?.type;

          if (!storeId) {
            console.warn(`[PAYMENT] No storeId in metadata for event ${providerEventId}`);
            return;
          }

          if (purchaseType === "subscription") {
            await (prisma as unknown).subscription.update({
              where: { storeId },
              data: {
                status: "ACTIVE",
                // lastPaymentStatus: "success", // Not in schema
                // lastPaymentAt: new Date(), // Not in schema
                updatedAt: new Date(),
              },
            });
            console.log(`[PAYMENT] Subscription activated for Store ${storeId}`);
          } else if (purchaseType === "template_purchase") {
            const templateId = metadata?.templateId;
            const store = await prisma.store.findUnique({ where: { id: storeId } });
            if (store) {
              const settings = (store.settings as unknown) || {};
              const purchased = settings.purchasedTemplates || [];
              if (!purchased.includes(templateId)) {
                purchased.push(templateId);
                await prisma.store.update({
                  where: { id: storeId },
                  data: { settings: { ...settings, purchasedTemplates: purchased } },
                });
              }
            }
            console.log(`[PAYMENT] Template ${templateId} purchased for Store ${storeId}`);
          } else if (purchaseType === "storefront_order") {
            const orderId = metadata?.orderId;
            if (orderId) {
              const amountNet = data.amount / 100;
              const amountKobo = BigInt(data.amount);

              await prisma.$transaction([
                // 1. Update Order
                prisma.order.update({
                  where: { id: orderId },
                  data: {
                    status: OrderStatus.PAID,
                    paymentStatus: "SUCCESS" as unknown,
                  },
                }),

                // 2. Create Transaction record
                prisma.paymentTransaction.create({
                  data: {
                    storeId,
                    orderId,
                    reference: data.reference,
                    provider: "PAYSTACK",
                    amount: amountNet,
                    currency: data.currency || "NGN",
                    status: "SUCCESS" as unknown,
                    type: "CHARGE",
                  },
                }),

                // 3. Credit Merchant Wallet
                prisma.wallet.upsert({
                  where: { storeId },
                  update: {
                    availableKobo: { increment: amountKobo },
                  },
                  create: {
                    storeId,
                    availableKobo: amountKobo,
                    kycStatus: "VERIFIED",
                  },
                }),

                // 4. Create Ledger Entry for History
                prisma.ledgerEntry.create({
                  data: {
                    storeId,
                    referenceType: "ORDER",
                    referenceId: orderId,
                    direction: "CREDIT",
                    account: "WALLET",
                    amount: amountNet,
                    currency: data.currency || "NGN",
                    description: `Payment for Order #${orderId}`,
                  },
                })
              ]);

              console.log(`[PAYMENT] Order ${orderId} fully processed and credited`);

              // Trigger Delivery
              await deliveryQueue.add("schedule", { orderId });
              console.log(`[DELIVERY] Enqueued for Order ${orderId}`);
            }
          }
        } else if (eventType === "charge.failed" || eventType === "invoice.payment_failed" || eventType === "subscription.disable") {
          const storeId = metadata?.storeId;
          const purchaseType = metadata?.type;

          if (purchaseType === "subscription") {
            const gracePeriodEndsAt = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
            await (prisma as unknown).subscription.update({
              where: { storeId },
              data: {
                status: "GRACE_PERIOD" as unknown,
                gracePeriodEndsAt,
                updatedAt: new Date(),
              },
            });

            console.log(`[DUNNING] Store ${storeId} entered GRACE_PERIOD until ${gracePeriodEndsAt.toISOString()}`);

            // Trigger WhatsApp Alert to Merchant
            // We need to fetch the store owner's phone or use the default notification logic
            const store = await prisma.store.findUnique({
              where: { id: storeId },
              include: {
                memberships: {
                  where: { role_enum: "OWNER" },
                  include: { user: true }
                }
              }
            });

            const ownerPhone = (store as unknown)?.memberships?.[0]?.user?.phone;
            if (ownerPhone) {
              await whatsappOutboundQueue.add("send", {
                to: ownerPhone,
                body: `🚨 Your Vayva subscription payment failed. We've kept your store LIVE for now, but you have a 5-day grace period to update your card. \n\nClick here to fix it: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
                storeId,
              });
            }
          }
        }

        // Mark Webhook Event as PROCESSED
        await prisma.paymentWebhookEvent.update({
          where: {
            provider_providerEventId: {
              provider: "PAYSTACK",
              providerEventId,
            },
          },
          data: { status: "PROCESSED", processedAt: new Date() },
        });

      } catch (error) {
        console.error(`[PAYMENT] Error processing event ${providerEventId}:`, error);

        // Log failure back to the event record
        await prisma.paymentWebhookEvent.update({
          where: {
            provider_providerEventId: {
              provider: "PAYSTACK",
              providerEventId,
            },
          },
          data: { status: "FAILED" },
        });

        throw error; // BullMQ retry
      }
    },
    { connection },
  );

  /**
   * 6. RECONCILIATION
   * Nightly job to verify Wallet Balance vs Ledger Sum.
   */
  new Worker(
    "reconciliation",
    async (job) => {
      const { storeId } = job.data;
      console.log(`[RECON] Running reconciliation for Store ${storeId}`);

      const [wallet, ledgerSummary] = await Promise.all([
        prisma.wallet.findUnique({ where: { storeId } }),
        prisma.ledgerEntry.aggregate({
          where: { storeId, account: "WALLET" },
          _sum: { amount: true },
        }),
      ]);

      if (!wallet) return;

      const ledgerSumKobo = BigInt(Math.round(Number(ledgerSummary._sum.amount || 0) * 100));
      const difference = wallet.availableKobo - ledgerSumKobo;

      if (difference !== 0n) {
        console.error(`[RECON] BUG: Store ${storeId} has discrepancy! Wallet: ${wallet.availableKobo}, Ledger: ${ledgerSumKobo}, Diff: ${difference}`);

        // Log to Ops Table (if exists) or just specific Audit Log
        await prisma.auditLog.create({
          data: {
            storeId,
            actorType: "SYSTEM",
            actorId: "RECON-WORKER",
            actorLabel: "Reconciliation Worker",
            action: "FINANCIAL_DISCREPANCY_FOUND",
            correlationId: `recon-${storeId}-${Date.now()}`,
            afterState: {
              walletBalance: wallet.availableKobo.toString(),
              ledgerSum: ledgerSumKobo.toString(),
              difference: difference.toString()
            }
          }
        });
      } else {
        console.log(`[RECON] Store ${storeId} is consistent.`);
      }
    },
    { connection },
  );

  /**
   * 7. CHINA CATALOG SYNC
   * Background job to sync all supplier catalogs.
   */
  new Worker(
    QUEUES.CHINA_CATALOG_SYNC,
    async (job) => {
      console.log(`[SYNC] Starting Global China Catalog Sync...`);
      try {
        const { ChinaSyncService } = await import("@vayva/shared/china-sync-service");
        const result = await ChinaSyncService.syncAllSuppliers();
        console.log(`[SYNC] Completed. Results:`, result);
      } catch (error) {
        console.error(`[SYNC] Failed:`, error);
        throw error;
      }
    },
    { connection }
  );

  /**
   * 8. MANIFEST SYNC
   * Background job to fetch and update third-party extension manifests.
   * COMMENTED OUT: AppRegistry model missing from current schema
   */
  /*
  new Worker(
    QUEUES.MANIFEST_SYNC,
    async (job) => {
      // ...
    },
    { connection }
  );
  */

  console.log("Workers started with full capability.");
}

start().catch(console.error);
