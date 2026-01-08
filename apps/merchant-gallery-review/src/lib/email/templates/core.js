"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Templates = void 0;
exports.authOtpVerification = authOtpVerification;
exports.onboardingWelcome = onboardingWelcome;
exports.authPasswordReset = authPasswordReset;
exports.billingReceipt = billingReceipt;
exports.teamInvite = teamInvite;
var components_1 = require("../components");
// --- TCP-01: OTP Verification ---
function authOtpVerification(data) {
    return (0, components_1.wrapEmail)("\n        ".concat((0, components_1.Hero)('lock'), "\n        ").concat((0, components_1.Text)(data.first_name ? "Hi ".concat(data.first_name, ",") : 'Hello,', 'h1'), "\n        ").concat((0, components_1.Text)('Use the verification code below to complete your secure sign in. This code is valid for 10 minutes.'), "\n        \n        <div style=\"background:#f4f4f5; border-radius:8px; padding:24px; text-align:center; margin:32px 0; letter-spacing: 8px; font-size: 32px; font-weight: 700; font-family: monospace;\">\n            ").concat(data.otp, "\n        </div>\n\n        ").concat((0, components_1.Text)('If you didn\'t request this code, you can safely ignore this email.', 'small'), "\n        "), 'Verify your account');
}
// --- TCP-10: Welcome Email ---
function onboardingWelcome(data) {
    return (0, components_1.wrapEmail)("\n        ".concat((0, components_1.Hero)('welcome'), "\n        ").concat((0, components_1.Text)('Welcome to Vayva! 🎉', 'h1'), "\n        ").concat((0, components_1.Text)("Hi <strong>".concat(data.first_name, "</strong>, we're thrilled to have you. Your store <strong>").concat(data.store_name, "</strong> is created and ready for business.")), "\n        \n        <div style=\"margin: 24px 0; background: #DCFCE7; padding: 24px; border-radius: 8px; border: 1px solid #22C55E;\">\n           ").concat((0, components_1.Text)('Get Started in 3 Steps', 'h3'), "\n           <ul style=\"margin:0; padding-left:20px; color:#374151; font-size:15px; line-height:1.6;\">\n              <li style=\"margin-bottom:8px;\">Complete your business profile</li>\n              <li style=\"margin-bottom:8px;\">Add your first product</li>\n              <li>Connect your bank account</li>\n           </ul>\n        </div>\n\n        ").concat((0, components_1.Button)(data.dashboard_url, 'Go to Dashboard'), "\n        ").concat((0, components_1.Text)('Need help? Reply to this email or visit our Help Center.', 'small', 'center'), "\n        "), 'Welcome to Vayva');
}
// --- TCP-04: Password Reset ---
function authPasswordReset(data) {
    return (0, components_1.wrapEmail)("\n        ".concat((0, components_1.Hero)('lock'), "\n        ").concat((0, components_1.Text)('Reset your password', 'h1'), "\n        ").concat((0, components_1.Text)('We received a request to reset your Vayva account password. No changes have been made yet.'), "\n        ").concat((0, components_1.Text)('Click the button below to set a new password. This link will expire in 15 minutes.'), "\n        \n        ").concat((0, components_1.Button)(data.reset_link, 'Reset Password'), "\n        \n        ").concat((0, components_1.Text)('If you didn’t request this, you can safely ignore this email. Your password will remain unchanged.', 'small'), "\n        "), 'Reset Password');
}
// --- TCP-21: Payment Receipt ---
function billingReceipt(data) {
    return (0, components_1.wrapEmail)("\n        ".concat((0, components_1.Hero)('receipt'), "\n        ").concat((0, components_1.Text)('Payment Receipt', 'h1', 'center'), "\n        ").concat((0, components_1.Text)("For ".concat(data.store_name), 'body', 'center'), "\n\n        <div style=\"text-align: center; margin-bottom: 32px;\">\n            <div style=\"font-size:12px; text-transform:uppercase; color:#6B7280; font-weight:600; letter-spacing:0.5px; margin-bottom:4px;\">Amount Paid</div>\n            <div style=\"font-size:36px; font-weight:700; color:#111827;\">").concat(data.currency, " ").concat(data.amount, "</div>\n            <div style=\"margin-top:8px;\">").concat((0, components_1.Badge)('Paid', 'success'), "</div>\n        </div>\n\n        <div style=\"background:#F9FAFB; border-radius:8px; padding:20px; border: 1px solid #E5E7EB;\">\n            ").concat((0, components_1.KeyValue)('Invoice Number', data.invoice_number), "\n            ").concat((0, components_1.KeyValue)('Date Paid', data.date), "\n            ").concat((0, components_1.KeyValue)('Payment Method', 'Card •••• 4242'), " \n        </div>\n\n        ").concat(data.billing_url ? (0, components_1.Button)(data.billing_url, 'View Billing History') : '', "\n        "), "Receipt ".concat(data.invoice_number));
}
// --- TCP-14: Team Invitation ---
function teamInvite(data) {
    return (0, components_1.wrapEmail)("\n        ".concat((0, components_1.Hero)('invite'), "\n        ").concat((0, components_1.Text)('You\'ve been invited!', 'h1'), "\n        ").concat((0, components_1.Text)("<strong>".concat(data.inviter_name, "</strong> has invited you to join the team at <strong>").concat(data.store_name, "</strong> on Vayva.")), "\n        \n        <div style=\"background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:24px; margin:24px 0;\">\n            <div style=\"margin-bottom:8px; font-size:12px; font-weight:700; color:#6B7280; text-transform:uppercase; letter-spacing:1px;\">Role</div>\n            <div style=\"font-size:18px; font-weight:600; color:#111827; margin-bottom:4px;\">").concat(data.role, "</div>\n            ").concat(data.role_description ? "<div style=\"font-size:14px; color:#4B5563;\">".concat(data.role_description, "</div>") : '', "\n        </div>\n\n        ").concat((0, components_1.Button)(data.invite_url, 'Join Team'), "\n        ").concat((0, components_1.Text)('This invitation will expire in 7 days.', 'small', 'center'), "\n        "), 'Team Invitation');
}
// Export a registry map for dynamic loading
exports.Templates = {
    auth_otp_verification: authOtpVerification,
    auth_welcome: onboardingWelcome,
    auth_password_reset: authPasswordReset,
    billing_receipt: billingReceipt,
    team_invite: teamInvite,
};
