import { NextRequest, NextResponse } from 'next/server';
import { verifyPaystackSignature } from '@/lib/webhooks/verify'; // Using verify logic from previous tasks
import { prisma } from '@vayva/db';

export async function POST(req: NextRequest) {
    const rawBody = await req.text();
    const signature = req.headers.get('x-paystack-signature') || '';

    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
        console.error('PAYSTACK_SECRET_KEY is not configured');
        return new NextResponse('Webhook Misconfigured', { status: 500 });
    }

    if (!verifyPaystackSignature(JSON.parse(rawBody), signature, secret)) {
        return new NextResponse('Invalid Signature', { status: 401 });
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event;
    const data = event.data;
    const providerEventId = String(data.id || event.id);

    try {
        // 1. Idempotency Check
        const existingEvent = await prisma.paymentWebhookEvent.findUnique({
            where: {
                provider_providerEventId: {
                    provider: 'PAYSTACK',
                    providerEventId
                }
            }
        });

        if (existingEvent && existingEvent.status === 'PROCESSED') {
            return new NextResponse('Already Processed', { status: 200 });
        }

        // 2. Track / Update Event Status
        const webhookEvent = await prisma.paymentWebhookEvent.upsert({
            where: {
                provider_providerEventId: {
                    provider: 'PAYSTACK',
                    providerEventId
                }
            },
            create: {
                provider: 'PAYSTACK',
                providerEventId,
                eventType,
                payload: event as any,
                status: 'RECEIVED'
            },
            update: {
                status: 'PROCESSING'
            }
        });

        if (eventType === 'charge.success') {
            const storeId = data.metadata?.storeId;
            const purchaseType = data.metadata?.type;

            if (storeId) {
                if (purchaseType === 'subscription') {
                    await prisma.merchantSubscription.update({
                        where: { storeId },
                        data: {
                            status: 'ACTIVE',
                            lastPaymentStatus: 'success',
                            lastPaymentAt: new Date(),
                        }
                    });
                } else if (purchaseType === 'template_purchase') {
                    const templateId = data.metadata?.templateId;
                    await prisma.store.update({
                        where: { id: storeId },
                        data: {
                            settings: {
                                upsert: {
                                    update: { purchasedTemplates: { push: templateId } },
                                    set: { purchasedTemplates: [templateId] }
                                }
                            }
                        }
                    });
                } else if (purchaseType === 'storefront_order') {
                    const orderId = data.metadata?.orderId;
                    if (orderId) {
                        await prisma.order.update({
                            where: { id: orderId },
                            data: {
                                status: 'PAID',
                                paymentStatus: 'SUCCESS',
                            }
                        });

                        await prisma.paymentTransaction.create({
                            data: {
                                storeId,
                                orderId,
                                reference: data.reference,
                                provider: 'PAYSTACK',
                                amount: data.amount / 100,
                                currency: 'NGN',
                                status: 'SUCCESS',
                                type: 'CHARGE'
                            }
                        });
                    }
                }

                if (purchaseType !== 'storefront_order') {
                    const invoice = await prisma.invoice.create({
                        data: {
                            storeId,
                            invoiceNumber: `INV-${Date.now()}`,
                            amountNgn: Math.floor(data.amount / 100),
                            status: 'PAID',
                            paidAt: new Date(),
                            providerInvoiceRef: data.reference
                        }
                    });

                    // Send Receipt Email
                    const store = await prisma.store.findUnique({
                        where: { id: storeId },
                        include: {
                            memberships: {
                                where: { role: 'OWNER' },
                                include: { User: true },
                                take: 1
                            }
                        }
                    });

                    if (store && store.memberships[0]?.User?.email) {
                        const { ResendEmailService } = await import('@/lib/email/resend');
                        await ResendEmailService.sendPaymentReceiptEmail(
                            store.memberships[0].User.email,
                            invoice.amountNgn,
                            invoice.invoiceNumber,
                            store.name
                        );
                    }
                }

                // ---------------------------------------------------------
                // ⚡ AUTO-DISPATCH TRIGGER
                // ---------------------------------------------------------
                // If payment is for an Order, trigger delivery dispatch
                if (data.metadata?.orderId) {
                    try {
                        const { DeliveryService } = await import('@/lib/delivery/DeliveryService');
                        await DeliveryService.autoDispatch(
                            data.metadata.orderId,
                            'storefront',
                            `storefront:${data.metadata.orderId}:dispatch`
                        );
                    } catch (err) {
                        console.error('[AutoDispatch] Failed to trigger from Paystack:', err);
                        // Do not fail the webhook, just log
                    }
                }
            }
        } else if (eventType === 'charge.failed') {
            const storeId = data.metadata?.storeId;
            if (storeId) {
                await prisma.merchantSubscription.update({
                    where: { storeId },
                    data: {
                        status: 'PAST_DUE',
                        lastPaymentStatus: 'failed'
                    }
                });
            }
        } else if (eventType.startsWith('dispute.')) {
            const { DisputeService } = await import('@/lib/disputes/disputeService');
            // Assuming DisputeService exists and is wired correctly
            try {
                await DisputeService.handleWebhookEvent(event);
            } catch (error) {
                console.error('Dispute handling failed:', error);
            }
        }

        // 3. Mark as PROCESSED
        await prisma.paymentWebhookEvent.update({
            where: { id: webhookEvent.id },
            data: { status: 'PROCESSED', processedAt: new Date() }
        });

        return new NextResponse('OK', { status: 200 });

    } catch (e: any) {
        console.error('Webhook processing error:', e);

        // Log error to webhook event if possible
        const providerEventId = String(data.id || event.id);
        try {
            await prisma.paymentWebhookEvent.update({
                where: {
                    provider_providerEventId: {
                        provider: 'PAYSTACK',
                        providerEventId
                    }
                },
                data: { status: 'FAILED', error: e.message }
            });
        } catch (innerError) {
            // Ignore if we can't even log failure
        }

        return new NextResponse('Error', { status: 500 });
    }
}
