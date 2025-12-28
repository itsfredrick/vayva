
import { prisma } from '@vayva/db';
import { SecurityUtils } from '@/lib/security/tokens';
import { EmailService } from '../email/emailService';
import { wrapEmail, renderButton } from '../email/layout';

export class AuthFlowService {

    static async requestEmailVerification(userId: string, email: string) {
        // 1. Generate Token
        const token = SecurityUtils.generateToken();
        const tokenHash = SecurityUtils.hashToken(token);
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        // 2. Store Hash
        await prisma.user_email_verification.upsert({
            where: { userId },
            update: { tokenHash, expiresAt, verifiedAt: null },
            create: { userId, tokenHash, expiresAt }
        });

        // 3. Send Email
        const content = `
            <h1 style="margin:0 0 12px; font-size:22px; font-weight:600;">Verify your email</h1>
            <p style="margin:0 0 24px; font-size:16px; line-height:1.6; color:#444444;">
                Click the button below to verify your email address.
            </p>
            ${renderButton(`${process.env.NEXTAUTH_URL}/verify-email?token=${token}`, 'Verify Email')}
        `;

        await EmailService.send({
            to: email,
            subject: 'Verify your email',
            html: wrapEmail(content, 'Verify Email'),
            text: `Verify: /verify-email?token=${token}`,
            templateKey: 'verify_email',
            userId,
            correlationId: `auth_verify_${tokenHash.substring(0, 8)}`
        });

        return true;
    }

    static async confirmEmailVerification(token: string) {
        const tokenHash = SecurityUtils.hashToken(token);

        const record = await prisma.user_email_verification.findUnique({
            where: { tokenHash }
        });

        if (!record) throw new Error('Invalid token');
        if (record.verifiedAt) throw new Error('Already verified');
        if (record.expiresAt < new Date()) throw new Error('Token expired');

        await prisma.user_email_verification.update({
            where: { id: record.id },
            data: { verifiedAt: new Date() }
        });

        return true;
    }

    static async requestPasswordReset(email: string) {
        // Mock User lookup
        const userId = 'mock_user_id'; // Mock

        const token = SecurityUtils.generateToken();
        const tokenHash = SecurityUtils.hashToken(token);
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

        await prisma.password_reset_token.create({
            data: { userId, tokenHash, expiresAt }
        });

        const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

        const content = `
            <h1 style="margin:0 0 12px; font-size:22px; font-weight:600;">Reset your password</h1>

            <p style="margin:0 0 16px; font-size:16px; line-height:1.6; color:#444444;">
                We received a request to reset your Vayva account password.
            </p>

            <p style="margin:0 0 24px; font-size:16px; line-height:1.6; color:#444444;">
                Click the button below to set a new password. This link will expire in 15 minutes.
            </p>

            ${renderButton(resetLink, 'Reset Password')}

            <p style="margin:24px 0 0; font-size:14px; color:#666666;">
                If you didn’t request this, you can safely ignore this email.
            </p>
        `;

        await EmailService.send({
            to: email,
            subject: 'Reset your password',
            html: wrapEmail(content, 'Reset Password'),
            text: `Reset Password: ${resetLink}`,
            templateKey: 'password_reset',
            userId,
            correlationId: `pwd_reset_${tokenHash.substring(0, 8)}`
        });

        console.log(`[EMAIL] Reset Password for ${email}`);
    }

    static async confirmPasswordReset(token: string, newPassword: string) {
        const tokenHash = SecurityUtils.hashToken(token);

        const record = await prisma.password_reset_token.findUnique({
            where: { tokenHash }
        });

        if (!record) throw new Error('Invalid token');
        if (record.usedAt) throw new Error('Token already used');
        if (record.expiresAt < new Date()) throw new Error('Token expired');

        await prisma.$transaction(async (tx) => {
            // 1. Mark Token Used
            await tx.password_reset_token.update({
                where: { id: record.id },
                data: { usedAt: new Date() }
            });

            // 2. Revoke Sessions (Mock logic for V1)
            // await tx.userSession.updateMany(...)
        });
    }
}
