
import { prisma } from '@vayva/db';
import { EmailService } from '../email/emailService';

export class RecoveryService {

    static async scheduleRecovery(sessionId: string, merchantId: string) {
        // 1. Check Settings
        const settings = await prisma.checkout_recovery_settings.findUnique({
            where: { merchantId }
        });

        if (!settings || !settings.enabled) return;

        // 2. Schedule Messages
        // Stage 1
        await prisma.checkout_recovery_message.create({
            data: {
                checkoutSessionId: sessionId,
                stage: 'hour_1',
                channel: 'email', // Simplified: Force Email for V1 Integration
                status: 'scheduled',
                scheduledAt: new Date(Date.now() + settings.stage1Hours * 60 * 60 * 1000)
            }
        });

        // Stage 2 (Optional - omitted for brevity in V1)
    }

    static async processRecovery(messageId: string) {
        const msg = await prisma.checkout_recovery_message.findUnique({
            where: { id: messageId }
        }); // In real Prisma client this relation needs to be defined in schema or fetched manually if relation inference is off

        // Manual fetch if relation issue
        if (!msg) return;

        // Logic to send email
        // Mocked here to just log execution
        console.log(`[Recovery] Sending recovery for session ${msg.checkoutSessionId}`);

        await prisma.checkout_recovery_message.update({
            where: { id: messageId },
            data: { status: 'sent', sentAt: new Date() }
        });
    }

    static async cancelRecovery(sessionId: string) {
        await prisma.checkout_recovery_message.updateMany({
            where: { checkoutSessionId: sessionId, status: 'scheduled' },
            data: { status: 'cancelled' }
        });
    }
}
