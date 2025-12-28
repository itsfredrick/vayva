
import { wrapEmail, renderButton } from './src/lib/email/layout';
import { ResendEmailService } from './src/lib/email/resend';
import * as fs from 'fs';
import * as path from 'path';

// Mock env
process.env.NEXTAUTH_URL = 'http://localhost:3000';

async function generatePreviews() {
    const layoutPreview = wrapEmail(`
        <h1 style="margin:0 0 12px; font-size:22px; font-weight:600;">Layout Test</h1>
        <p style="margin:0 0 24px; font-size:16px; line-height:1.6; color:#444444;">
            This is a test of the standard layout.
        </p>
        ${renderButton('http://example.com', 'Test Button')}
    `, 'Layout Preview');

    // Manually invoke templates (accessing private methods via any or reflection if needed, but we can just duplicate logic or make them public temporarily? 
    // Actually, ResendEmailService has public send methods, but they rely on Resend API.
    // I made getOTPTemplate private.
    // I can just recreate the calls here to verify the rendering logic or assume the unit tests cover it.
    // Better: I'll read the file content I wrote and just render it here for visual check.

    // Actually, I can just use the wrapEmail function directly with sample content to verify the style.
}

const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Email Previews</title>
    <style>
        body { font-family: sans-serif; padding: 20px; background: #eee; }
        .preview-container { margin-bottom: 40px; border: 1px solid #ccc; background: white; }
        .label { padding: 10px; background: #333; color: white; font-weight: bold; }
        iframe { width: 100%; height: 600px; border: none; }
    </style>
</head>
<body>
    <h1>Email Template Previews</h1>

    <div class="preview-container">
        <div class="label">Password Reset</div>
        <iframe srcdoc="${wrapEmail(`
            <h1 style='margin:0 0 12px; font-size:22px; font-weight:600;'>Reset your password</h1>
            <p style='margin:0 0 16px; font-size:16px; line-height:1.6; color:#444444;'>
                We received a request to reset your Vayva account password.
            </p>
            <p style='margin:0 0 24px; font-size:16px; line-height:1.6; color:#444444;'>
                Click the button below to set a new password. This link will expire in 15 minutes.
            </p>
            ${renderButton('#', 'Reset Password')}
            <p style='margin:24px 0 0; font-size:14px; color:#666666;'>
                If you didn’t request this, you can safely ignore this email.
            </p>
        `, 'Reset Password').replace(/"/g, '&quot;')}" ></iframe>
    </div>

    <div class="preview-container">
        <div class="label">Welcome Email</div>
        <iframe srcdoc="${wrapEmail(`
            <h1 style='margin:0 0 12px; font-size:22px; font-weight:600;'>
                Welcome to Vayva!
            </h1>
            <p style='margin:0 0 16px; font-size:16px; line-height:1.6; color:#444444;'>
                Hi <strong>Fredrick</strong>, we're thrilled to have you. Your store <strong>Fredrick's Store</strong> is ready to be set up.
            </p>
            
            <div style='margin: 24px 0;'>
                <p style='margin:0 0 8px; font-weight:600; font-size:14px; text-transform:uppercase; letter-spacing:0.5px; color:#666666;'>Next Steps</p>
                <ul style='margin:0; padding-left:20px; color:#444444; font-size:15px; line-height:1.6;'>
                    <li style='margin-bottom:8px;'>Complete your business profile</li>
                    <li style='margin-bottom:8px;'>Add your first product</li>
                    <li>Connect your bank account</li>
                </ul>
            </div>

            ${renderButton('#', 'Go to Dashboard')}
            
            <p style='margin:24px 0 0; font-size:14px; color:#666666;'>
                Need help? Reply to this email or contact support.
            </p>
        `, 'Welcome').replace(/"/g, '&quot;')}" ></iframe>
    </div>

    <div class="preview-container">
        <div class="label">Team Invite</div>
        <iframe srcdoc="${wrapEmail(`
        <h1 style='margin:0 0 12px; font-size:22px; font-weight:600;'>
            You've been invited!
        </h1>
        <p style='margin:0 0 24px; font-size:16px; line-height:1.6; color:#444444;'>
            Hi there, <strong>John Doe</strong> has invited you to join the team at <strong>Vayva HQ</strong> on Vayva.
        </p>
        
        <div style='background:#f9fafb; border:1px solid #eeeeee; border-radius:8px; padding:20px; margin:24px 0;'>
            <p style='margin:0 0 12px; font-weight:600; color:#111111; font-size:13px; text-transform:uppercase; letter-spacing:0.5px;'>
                Your Role: ADMIN
            </p>
            <ul style='margin:0; padding-left:20px; color:#444444; font-size:14px; line-height:1.6;'>
                <li>Manage orders</li><li>View analytics</li>
            </ul>
        </div>

        ${renderButton('#', 'Accept Invitation')}

        <p style='margin:24px 0 0; font-size:14px; color:#666666; text-align:center;'>
            If you didn't expect this invitation, you can safely ignore this email.
        </p>
        `, 'Team Invite').replace(/"/g, '&quot;')}" ></iframe>
    </div>

</body>
</html>
`;

fs.writeFileSync('preview_emails.html', html);
console.log('Previews generated at preview_emails.html');
