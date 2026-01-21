import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { Resend } from "resend";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Contact API: Received submission", body);

    // Send email notification if Resend is configured
    let emailSent = false;
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const helloEmail = process.env.EMAIL_HELLO || "hello@vayva.ng";

        // 1. Send to Vayva Team
        await resend.emails.send({
          from: "Vayva Contact Form <no-reply@vayva.ng>",
          to: [helloEmail],
          replyTo: body.email,
          subject: `[Contact Form] ${body.subject}`,
          html: `
            <h1>New Contact Submission</h1>
            <p><strong>Name:</strong> ${body.firstName} ${body.lastName}</p>
            <p><strong>Email:</strong> ${body.email}</p>
            <p><strong>Subject:</strong> ${body.subject}</p>
            <p><strong>Message:</strong></p>
            <p>${body.message.replace(/\n/g, '<br>')}</p>
            <hr>
            <p style="font-size: 12px; color: #666;">Source: ${body.source || "marketing_site"}</p>
          `
        });

        // 2. Send Confirmation to User
        await resend.emails.send({
          from: "Vayva Support <no-reply@vayva.ng>",
          to: [body.email],
          subject: `We received your inquiry: ${body.subject}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #16a34a;">Hello ${body.firstName},</h1>
              <p>Thank you for reaching out to Vayva! We've received your message regarding "<strong>${body.subject}</strong>".</p>
              <p>Our team will review your inquiry and get back to you as soon as possible (usually within 24 hours).</p>
              <div style="background: #f9fafb; padding: 20px; border-radius: 12px; margin: 20px 0;">
                <p style="margin: 0; font-size: 14px; color: #6b7280;">Your message:</p>
                <p style="margin: 10px 0 0 0; font-style: italic;">"${body.message}"</p>
              </div>
              <p>Best regards,<br>The Vayva Team</p>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              <p style="font-size: 12px; color: #9ca3af; text-align: center;">
                &copy; ${new Date().getFullYear()} Vayva. All rights reserved.
              </p>
            </div>
          `
        });
        emailSent = true;
        console.info(`[Contact Form] Email sent to ${helloEmail} from ${body.email}`);
      } catch (emailError) {
        console.error("[Contact Form] Email send failed:", emailError);
        // Continue to persist even if email fails
      }
    } else {
      console.warn("[Contact Form] RESEND_API_KEY not configured, skipping email");
    }

    // Persist to RescueIncident for Ops visibility
    await prisma.rescueIncident.create({
      data: {
        surface: "MARKETING_CONTACT",
        severity: "LOW",
        errorType: "CONTACT_FORM_SUBMISSION",
        errorMessage: `[Subject: ${body.subject}] from ${body.email}`,
        fingerprint: `contact-${Date.now()}-${Math.random()}`,
        status: "OPEN",
        diagnostics: {
          name: `${body.firstName} ${body.lastName}`,
          email: body.email,
          message: body.message,
          subject: body.subject,
          source: body.source || "marketing_site",
          emailSent
        }
      }
    });

    console.info(`[Contact Form] Persisted submission from ${body.email}`);

    return NextResponse.json({ success: true, message: "Message received" });
  } catch (error) {
    console.error("Contact API Error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
