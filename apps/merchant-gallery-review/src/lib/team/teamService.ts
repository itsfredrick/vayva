import { prisma } from "@vayva/db";
import { SecurityUtils } from "../security/tokens";
import { ROLES } from "./permissions";
import { EmailService } from "../email/emailService";
import { wrapEmail, renderButton } from "../email/layout";

export class TeamService {
  static SEAT_LIMITS: Record<string, number> = {
    STARTER: 1, // Only Owner
    GROWTH: 2, // Owner + 1
    PRO: 6, // Owner + 5
    ENTERPRISE: 100,
  };

  static async getSeatUsage(merchantId: string) {
    return prisma.membership.count({
      where: { storeId: merchantId, status: "active" },
    });
  }

  static async inviteMember(
    merchantId: string,
    createdByUserId: string,
    data: { email: string; role: string },
  ) {
    // 1. Check Limits (Real Plan)
    const store = await prisma.store.findUnique({
      where: { id: merchantId },
      select: { plan: true },
    });

    if (!store) throw new Error("Store not found");

    const currentSeats = await this.getSeatUsage(merchantId);
    const limit = this.SEAT_LIMITS[store.plan] || 1;

    if (currentSeats >= limit) {
      throw new Error(
        `Seat limit reached for your ${store.plan} plan (${limit} seats). Upgrade required.`,
      );
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
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    // 3. Send Email
    const inviteUrl = `${process.env.NEXTAUTH_URL}/invite/accept?token=${token}`;
    const content = `
            <h1 style="margin:0 0 12px; font-size:22px; font-weight:600;">You've been invited!</h1>
            <p style="margin:0 0 24px; font-size:16px; line-height:1.6; color:#444444;">
                You have been invited to join the Vayva team. Click the button below to accept the invitation.
            </p>
            ${renderButton(inviteUrl, "Join Team")}
            <p style="margin:24px 0 0; font-size:14px; color:#666666;">
                This link will expire in 7 days.
            </p>
        `;

    await EmailService.send({
      to: data.email,
      subject: "You have been invited to Vayva",
      html: wrapEmail(content, "Team Invitation"),
      text: `Accept: ${inviteUrl}`,
      templateKey: "team_invite",
      merchantId,
      correlationId: `invite_${token.substring(0, 8)}`,
    });
  }

  static async acceptInvite(token: string, userId: string) {
    // StaffInvite schema uses 'token' uniquely.
    const invite = await prisma.staffInvite.findUnique({ where: { token } });
    if (!invite) throw new Error("Invalid Invite");
    if (invite.expiresAt < new Date()) throw new Error("Expired Invite");
    if (invite.acceptedAt) throw new Error("Already Accepted");

    await prisma.$transaction(async (tx: any) => {
      // Mark Accepted
      await tx.staffInvite.update({
        where: { id: invite.id },
        data: { acceptedAt: new Date() },
      });

      // Create Membership
      await tx.membership.create({
        data: {
          userId,
          storeId: invite.storeId,
          role: invite.role,
          status: "active",
        },
      });
    });
  }
}
