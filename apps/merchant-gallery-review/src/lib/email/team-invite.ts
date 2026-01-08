import { Resend } from "resend";
import { wrapEmail, renderButton, BRAND_COLOR } from "./layout";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendTeamInviteParams {
  email: string;
  storeName: string;
  role: string;
  inviterName: string;
}

export async function sendTeamInvite({
  email,
  storeName,
  role,
  inviterName,
}: SendTeamInviteParams) {
  const inviteUrl = `${process.env.NEXTAUTH_URL}/accept-invite?email=${encodeURIComponent(email)}`;

  // Role Descriptions
  let roleDesc = "";
  switch (role) {
    case "OWNER":
      roleDesc =
        "<li>Full access to all features including billing and team management</li>";
      break;
    case "ADMIN":
      roleDesc =
        "<li>Manage orders, products, and customers</li><li>View analytics and reports</li>";
      break;
    case "SUPPORT":
      roleDesc =
        "<li>View orders and chat with customers</li><li>Process refunds</li>";
      break;
    default:
      roleDesc = "<li>Access to store management features</li>";
  }

  const contentHtml = `
        <h1 style="margin:0 0 12px; font-size:22px; font-weight:600;">
            You've been invited!
        </h1>
        <p style="margin:0 0 24px; font-size:16px; line-height:1.6; color:#444444;">
            Hi there, <strong>${inviterName}</strong> has invited you to join the team at <strong>${storeName}</strong> on Vayva.
        </p>
        
        <div style="background:#f9fafb; border:1px solid #eeeeee; border-radius:8px; padding:20px; margin:24px 0;">
            <p style="margin:0 0 12px; font-weight:600; color:#111111; font-size:13px; text-transform:uppercase; letter-spacing:0.5px;">
                Your Role: ${role}
            </p>
            <ul style="margin:0; padding-left:20px; color:#444444; font-size:14px; line-height:1.6;">
                ${roleDesc}
            </ul>
        </div>

        ${renderButton(inviteUrl, "Accept Invitation")}

        <p style="margin:24px 0 0; font-size:14px; color:#666666; text-align:center;">
            If you didn't expect this invitation, you can safely ignore this email.
        </p>
    `;

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Vayva <noreply@vayva.ng>",
      to: [email],
      subject: `You've been invited to join ${storeName} on Vayva`,
      html: wrapEmail(contentHtml, "Team Invitation"),
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Email send error:", error);
    throw error;
  }
}
