import { prisma } from "@vayva/db";

export const TeamService = {
  inviteMember: async (storeId: string, email: string) => {
    // 1. Check if user already member
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      const membership = await prisma.membership.findUnique({
        where: { userId_storeId: { userId: existingUser.id, storeId } },
      });
      if (membership) throw new Error("User is already a member");
    }

    // 2. Create Invite
    const token =
      Math.random().toString(36).substring(2) + Date.now().toString(36);
    const invite = await prisma.staffInvite.create({
      data: {
        storeId,
        email,
        role: "STAFF", // Using string literal
        token,
        createdBy: "SYSTEM", // Placeholder
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    console.log(`[Email] Invite sent to ${email} with token ${invite.token}`);
    return invite;
  },

  listMembers: async (storeId: string) => {
    const members = await prisma.membership.findMany({
      where: { storeId },
      include: {
        User: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        Role: true,
      },
    });

    const invites = await prisma.staffInvite.findMany({
      where: { storeId, acceptedAt: null },
    });

    return { members, invites };
  },

  removeMember: async (storeId: string, userId: string) => {
    return await prisma.membership.delete({
      where: { userId_storeId: { userId, storeId } },
    });
  },
};
