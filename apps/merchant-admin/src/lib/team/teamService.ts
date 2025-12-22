
import { prisma } from '@vayva/db';
import { SecurityUtils } from '../security/tokens';
import { ROLES } from './permissions';
import { EmailService } from '../email/emailService';

export class TeamService {

    static SEAT_LIMITS: Record<string, number> = {
        'growth': 1,
        'pro': 5,
        'enterprise': 100
    };

    static async getSeatUsage(merchantId: string) {
        return prisma.membership.count({
            where: { storeId: merchantId, status: 'active' }
        });
    }

    static async inviteMember(merchantId: string, createdByUserId: string, data: { email: string, role: string }) {
        // 1. Check Limits (Mock Plan)
        const currentSeats = await this.getSeatUsage(merchantId);
        const limit = this.SEAT_LIMITS['pro']; // Mock Plan Lookup

        if (currentSeats >= limit) {
            throw new Error(`Seat limit reached (${limit}). Upgrade required.`);
        }

        // 2. Create Invite
        const token = SecurityUtils.generateToken();
        // StaffInvite schema uses 'token' directly and it's unique.
        // The original code used tokenHash, but let's check schema.
        // Line 722: token String @unique

        await prisma.staffInvite.create({
            data: {
                storeId: merchantId,
                email: data.email,
                role: data.role,
                token,
                createdBy: createdByUserId, // schema uses createdBy (String)
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
            }
        });

        // 3. Send Email
        await EmailService.send({
            to: data.email,
            subject: 'You have been invited to Vayva',
            html: `<p>Accept invite: <a href="/invite/accept?token=${token}">Accept</a></p>`,
            text: `Accept: /invite/accept?token=${token}`,
            templateKey: 'team_invite',
            merchantId,
            correlationId: `invite_${token.substring(0, 8)}`
        });
    }

    static async acceptInvite(token: string, userId: string) {
        // StaffInvite schema uses 'token' uniquely.
        const invite = await prisma.staffInvite.findUnique({ where: { token } });
        if (!invite) throw new Error('Invalid Invite');
        if (invite.expiresAt < new Date()) throw new Error('Expired Invite');
        if (invite.acceptedAt) throw new Error('Already Accepted');

        await prisma.$transaction(async (tx) => {
            // Mark Accepted
            await tx.staffInvite.update({
                where: { id: invite.id },
                data: { acceptedAt: new Date() }
            });

            // Create Membership
            await tx.membership.create({
                data: {
                    userId,
                    storeId: invite.storeId,
                    role: invite.role,
                    status: 'active'
                }
            });
        });
    }
}
