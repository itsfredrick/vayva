
const fs = require('fs');

// --- Layout Logic (Inlined from layout.ts) ---
const BRAND_COLOR = '#111111';
const HEADLINE_COLOR = '#111111';
const BG_COLOR = '#f7f7f7';
const LOGO_URL = 'https://vayva.ng/logo-black.png'; // Hardcoded for preview

function wrapEmail(contentHtml, title = 'Vayva Notification') {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0; padding:0; background-color:${BG_COLOR}; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
      <td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.06); overflow: hidden;">
      <!-- Header -->
      <tr>
        <td style="padding:32px 40px 24px; text-align: left;">
          <img src="${LOGO_URL}" alt="Vayva" width="120" style="display:block;" />
        </td>
      </tr>
      <tr><td style="padding:0 40px;"><div style="height:1px; background:#eeeeee;"></div></td></tr>
      <!-- Content -->
      <tr>
        <td style="padding:32px 40px; color:${HEADLINE_COLOR}; text-align: left;">
          ${contentHtml}
        </td>
      </tr>
      <!-- Footer -->
      <tr>
        <td style="padding:24px 40px; background:#fafafa; font-size:12px; color:#777777; text-align: center;">
          <p style="margin:0;">© ${new Date().getFullYear()} Vayva • Lagos, Nigeria</p>
          <div style="margin-top: 8px;">
            <a href="#" style="color: #777777; text-decoration: underline; margin: 0 4px;">Privacy</a>
            •
            <a href="#" style="color: #777777; text-decoration: underline; margin: 0 4px;">Terms</a>
          </div>
        </td>
      </tr>
    </table>
  </td>
</tr>
  </table>
</body>
</html>
    `;
}

function renderButton(url, label) {
  return `
    <a href="${url}" style="display:inline-block; background:${BRAND_COLOR}; color:#ffffff; text-decoration:none; padding:14px 26px; border-radius:8px; font-size:15px; font-weight:500; margin-top: 8px; margin-bottom: 8px;">
        ${label} →
    </a>
    `;
}

// --- Preview Generation ---

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
