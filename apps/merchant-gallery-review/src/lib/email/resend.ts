import { Resend } from "resend";
import { wrapEmail, renderButton, BRAND_COLOR } from "./layout";
import { FEATURES } from "../env-validation";
import { BRAND, getCanonicalUrl } from "@vayva/shared";


const RESEND_KEY =
  process.env.NODE_ENV === "test"
    ? process.env.RESEND_API_KEY || "re_test_test_key_123"
    : process.env.RESEND_API_KEY;

const resend = new Resend(RESEND_KEY);

export class ResendEmailService {
  private static fromEmail =
    process.env.RESEND_FROM_EMAIL || `No-reply@${BRAND.domain}`;
  private static billingEmail = process.env.EMAIL_BILLING || `Billing@${BRAND.domain}`;
  private static helloEmail = process.env.EMAIL_HELLO || `Hello@${BRAND.domain}`;
  private static supportEmail = process.env.EMAIL_SUPPORT || `Support@${BRAND.domain}`;


  /**
   * Check if email service is configured
   */
  private static assertConfigured() {
    if (!FEATURES.EMAIL_ENABLED) {
      throw new Error("Email service is not configured");
    }
  }

  // --- 1. OTP Verification ---
  static async sendOTPEmail(to: string, code: string, firstName?: string) {
    this.assertConfigured();

    try {
      const { data, error } = await resend.emails.send({
        from: this.fromEmail,
        to,
        subject: "Verify your email - Vayva",
        html: wrapEmail(this.getOTPTemplate(code, firstName), "Verify Email"),
      });

      if (error) {
        console.error("[Resend] OTP Error:", error);
        throw new Error(`Failed to send OTP email: ${error.message}`);
      }

      return { success: true, messageId: data?.id };
    } catch (error: any) {
      console.error("[Resend] OTP Error:", error);
      throw error;
    }
  }

  // --- 2. Welcome Email ---
  static async sendWelcomeEmail(
    to: string,
    firstName: string,
    storeName: string,
  ) {
    this.assertConfigured();

    try {
      const { data, error } = await resend.emails.send({
        from: this.helloEmail,
        to,
        subject: `Welcome to Vayva, ${firstName}!`,
        html: wrapEmail(
          this.getWelcomeTemplate(firstName, storeName),
          "Welcome to Vayva",
        ),
      });

      if (error) {
        console.error("[Resend] Welcome Error:", error);
        throw new Error(`Failed to send welcome email: ${error.message}`);
      }

      return { success: true, messageId: data?.id };
    } catch (error: any) {
      console.error("[Resend] Welcome Error:", error);
      throw error;
    }
  }

  // --- 3. Password Changed ---
  static async sendPasswordChangedEmail(to: string) {
    this.assertConfigured();

    try {
      const { data, error } = await resend.emails.send({
        from: this.fromEmail,
        to,
        subject: "Security Alert: Password Changed",
        html: wrapEmail(this.getPasswordChangedTemplate(), "Security Alert"),
      });

      if (error) {
        console.error("[Resend] Password Change Error:", error);
        throw new Error(
          `Failed to send password change email: ${error.message}`,
        );
      }

      return { success: true, messageId: data?.id };
    } catch (error: any) {
      console.error("[Resend] Password Change Error:", error);
      throw error;
    }
  }

  // --- 4. Payment Receipt ---
  static async sendPaymentReceiptEmail(
    to: string,
    amountNgn: number,
    invoiceNumber: string,
    storeName: string,
  ) {
    this.assertConfigured();

    try {
      const { data, error } = await resend.emails.send({
        from: this.billingEmail,
        to,
        subject: `Receipt for ${storeName} - ${invoiceNumber}`,
        html: wrapEmail(
          this.getReceiptTemplate(amountNgn, invoiceNumber, storeName),
          "Payment Receipt",
        ),
      });

      if (error) {
        console.error("[Resend] Receipt Error:", error);
        throw new Error(`Failed to send receipt email: ${error.message}`);
      }

      return { success: true, messageId: data?.id };
    } catch (error: any) {
      console.error("[Resend] Receipt Error:", error);
      throw error;
    }
  }

  // --- 5. Subscription Expiry Reminder ---
  static async sendSubscriptionExpiryReminder(
    to: string,
    storeName: string,
    planName: string,
    expiryDate: string,
  ) {
    this.assertConfigured();

    try {
      const { billingSubscriptionExpiryReminder } =
        await import("./templates/core");
      const billingUrl = getCanonicalUrl("/dashboard/settings/billing");


      const { data, error } = await resend.emails.send({
        from: this.billingEmail,
        to,
        subject: `Action Required: Your subscription for ${storeName} expires in 3 days`,
        html: billingSubscriptionExpiryReminder({
          store_name: storeName,
          plan_name: planName,
          expiry_date: expiryDate,
          billing_url: billingUrl,
        }),
      });

      if (error) {
        console.error("[Resend] Subscription Expiry Error:", error);
        throw new Error(
          `Failed to send subscription expiry email: ${error.message}`,
        );
      }

      return { success: true, messageId: data?.id };
    } catch (error: any) {
      console.error("[Resend] Subscription Expiry Error:", error);
      throw error;
    }
  }

  /**
   * Internal Template Generators (Content Body Only)
   */

  private static getOTPTemplate(code: string, firstName?: string): string {
    return `
            <h1 style="margin:0 0 12px; font-size:22px; font-weight:600;">
                ${firstName ? `Hi ${firstName}` : "Hello"}
            </h1>
            <p style="margin:0 0 24px; font-size:16px; line-height:1.6; color:#444444;">
                Use the verification code below to complete your sign up. This code will expire in 10 minutes.
            </p>
            <div style="background:#f4f4f5; border-radius:8px; padding:24px; text-align:center; margin:32px 0; letter-spacing: 8px; font-size: 32px; font-weight: 700; font-family: monospace;">
                ${code}
            </div>
            <p style="margin:24px 0 0; font-size:14px; color:#666666;">
                If you didn't request this code, you can safely ignore this email.
            </p>
        `;
  }

  private static getWelcomeTemplate(
    firstName: string,
    storeName: string,
  ): string {
    const dashboardUrl = getCanonicalUrl("/onboarding");


    return `
            <h1 style="margin:0 0 12px; font-size:22px; font-weight:600;">
                Welcome to Vayva!
            </h1>
            <p style="margin:0 0 16px; font-size:16px; line-height:1.6; color:#444444;">
                Hi <strong>${firstName}</strong>, we're thrilled to have you. Your store <strong>${storeName}</strong> is ready to be set up.
            </p>
            
            <div style="margin: 24px 0;">
                <p style="margin:0 0 8px; font-weight:600; font-size:14px; text-transform:uppercase; letter-spacing:0.5px; color:#666666;">Next Steps</p>
                <ul style="margin:0; padding-left:20px; color:#444444; font-size:15px; line-height:1.6;">
                    <li style="margin-bottom:8px;">Complete your business profile</li>
                    <li style="margin-bottom:8px;">Add your first product</li>
                    <li>Connect your bank account</li>
                </ul>
            </div>

            ${renderButton(dashboardUrl, "Go to Dashboard")}
            
            <p style="margin:24px 0 0; font-size:14px; color:#666666;">
                Need help? Reply to this email or contact support.
            </p>
        `;
  }

  private static getPasswordChangedTemplate(): string {
    return `
            <h1 style="margin:0 0 12px; font-size:22px; font-weight:600;">
                Password Changed
            </h1>
            <p style="margin:0 0 16px; font-size:16px; line-height:1.6; color:#444444;">
                This is a confirmation that the password for your Vayva account has been changed successfully.
            </p>
            <div style="background:#fff1f2; border-radius:8px; padding:16px; margin:24px 0; color:#be123c; font-size:14px; line-height:1.5;">
                <strong>Note:</strong> If you did not make this change, please contact support immediately to secure your account.
            </div>
        `;
  }

  private static getReceiptTemplate(
    amount: number,
    invoiceRef: string,
    storeName: string,
  ): string {
    const formattedAmount = new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);

    return `
            <h1 style="margin:0 0 4px; font-size:22px; font-weight:600;">Receipt</h1>
            <p style="margin:0 0 24px; font-size:14px; color:#666666;">For ${storeName}</p>

            <div style="margin-bottom:32px;">
                <div style="font-size:12px; text-transform:uppercase; color:#666666; font-weight:600; letter-spacing:0.5px; margin-bottom:4px;">Amount Paid</div>
                <div style="font-size:36px; font-weight:700; color:#111111;">${formattedAmount}</div>
            </div>

            <div style="background:#f9fafb; border-radius:8px; padding:20px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
                    <tr>
                        <td style="padding:4px 0; color:#666666;">Invoice</td>
                        <td style="padding:4px 0; text-align:right; color:#111111; font-weight:500; font-family:monospace;">${invoiceRef}</td>
                    </tr>
                    <tr>
                        <td style="padding:4px 0; color:#666666;">Date</td>
                        <td style="padding:4px 0; text-align:right; color:#111111; font-weight:500;">${new Date().toLocaleDateString()}</td>
                    </tr>
                    <tr>
                        <td style="padding:4px 0; color:#666666;">Status</td>
                        <td style="padding:4px 0; text-align:right; color:#111111; font-weight:600;">Paid</td>
                    </tr>
                </table>
            </div>

&nbsp;</p>
            <p style="margin:24px 0 0; font-size:14px; color:#666666;">
                View your invoice history in <a href="${getCanonicalUrl("/dashboard/settings/billing")}" style="color:#111111; text-decoration:underline;">Billing Settings</a>.
            </p>
        `;
  }
}
