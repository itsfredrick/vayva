import { prisma } from '@vayva/db';
import { EmailAdapter, EmailPayload } from './types';
import { ConsoleAdapter } from './adapters/consoleAdapter';
import { FlagService } from '../flags/flagService';

export class EmailService {
    private static adapter: EmailAdapter = new ConsoleAdapter(); // Default to Console

    static initialize() {
        if (process.env.EMAIL_PROVIDER === 'resend') {
            // this.adapter = new ResendAdapter(); // TODO: Import when ready
        }
    }

    static async send(payload: EmailPayload) {
        // 1. KILL SWITCH CHECK
        const enabled = await FlagService.isEnabled('email.outbound.enabled');
        if (!enabled) {
            console.warn(`[Email] Blocked by Kill Switch`);
            return { success: false, error: 'Feature Disabled' };
        }

        // 2. Check Suppression
        const suppression = await prisma.email_suppression.findUnique({
            where: { email: payload.to }
        });

        if (suppression) {
            console.warn(`[EmailService] Suppression hit for ${payload.to}`);
            await this.logEmail(payload, 'suppressed', 'console', undefined, 'Recipient suppressed');
            return { success: false, error: 'Recipient suppressed' };
        }

        // 3. Send
        try {
            const result = await this.adapter.send(payload);

            await this.logEmail(
                payload,
                result.error ? 'failed' : 'sent',
                'console', // dynamic based on adapter
                result.providerId,
                result.error
            );

            return { success: !result.error, error: result.error };
        } catch (e: any) {
            console.error('[EmailService] Send Failed', e);
            await this.logEmail(payload, 'failed', 'console', undefined, e.message);
            return { success: false, error: e.message };
        }
    }

    private static async logEmail(
        payload: EmailPayload,
        status: string,
        provider: string,
        providerMsgId?: string,
        error?: string
    ) {
        await prisma.email_message.create({
            data: {
                toEmail: payload.to,
                templateKey: payload.templateKey,
                merchantId: payload.merchantId,
                userId: payload.userId,
                status,
                provider,
                providerMsgId,
                subject: payload.subject,
                meta: payload.meta || {},
                correlationId: payload.correlationId,
                error
            }
        });
    }
}
