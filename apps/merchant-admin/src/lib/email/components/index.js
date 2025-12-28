"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapEmail = wrapEmail;
exports.Hero = Hero;
exports.Button = Button;
exports.Badge = Badge;
exports.Text = Text;
exports.KeyValue = KeyValue;
var design_system_1 = require("../design-system");
function style(s) {
    return Object.entries(s).map(function (_a) {
        var k = _a[0], v = _a[1];
        return "".concat(k.replace(/[A-Z]/g, function (m) { return "-".concat(m.toLowerCase()); }), ":").concat(v);
    }).join(';');
}
// --- Layout ---
function wrapEmail(contentHtml, title) {
    if (title === void 0) { title = 'Vayva Notification'; }
    var bodyStyle = style({
        margin: 0,
        padding: 0,
        backgroundColor: design_system_1.Colors.Neutral.Background,
        fontFamily: design_system_1.Typography.FontFamily,
        color: design_system_1.Colors.Neutral.DarkGrey,
        webkitFontSmoothing: 'antialiased',
    });
    var containerStyle = style({
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: design_system_1.Colors.Neutral.White,
        borderRadius: design_system_1.Borders.Radius.lg,
        boxShadow: design_system_1.Shadows.Card,
        overflow: 'hidden',
    });
    return "\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n  <title>".concat(title, "</title>\n</head>\n<body style=\"").concat(bodyStyle, "\">\n  <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"padding:40px 0; background-color:").concat(design_system_1.Colors.Neutral.Background, ";\">\n    <tr>\n      <td align=\"center\">\n        <!-- Main Card -->\n        <table width=\"600\" cellpadding=\"0\" cellspacing=\"0\" style=\"").concat(containerStyle, "\">\n            <!-- Header Logo -->\n            <tr>\n                <td style=\"padding:").concat(design_system_1.Spacing.xl, " ").concat(design_system_1.Spacing.xxl, " ").concat(design_system_1.Spacing.lg, "; text-align: left;\">\n                    <img src=\"https://vayva.com/logo-black.png\" alt=\"Vayva\" width=\"100\" style=\"display:block;\" />\n                </td>\n            </tr>\n            <!-- Divider -->\n            <tr><td style=\"padding:0 ").concat(design_system_1.Spacing.xxl, ";\"><div style=\"height:1px; background:").concat(design_system_1.Colors.Neutral.LightGrey, ";\"></div></td></tr>\n            <!-- Content -->\n            <tr>\n                <td style=\"padding:").concat(design_system_1.Spacing.xl, " ").concat(design_system_1.Spacing.xxl, "; text-align: left; font-size: ").concat(design_system_1.Typography.Sizes.Body, "; line-height: ").concat(design_system_1.Typography.LineHeights.Relaxed, ";\">\n                    ").concat(contentHtml, "\n                </td>\n            </tr>\n            <!-- Footer -->\n            <tr>\n                <td style=\"padding:").concat(design_system_1.Spacing.lg, " ").concat(design_system_1.Spacing.xxl, "; background:").concat(design_system_1.Colors.Neutral.Background, "; font-size:").concat(design_system_1.Typography.Sizes.Micro, "; color:").concat(design_system_1.Colors.Neutral.Grey, "; text-align: center;\">\n                    <p style=\"margin:0 0 8px;\">\u00A9 ").concat(new Date().getFullYear(), " Vayva \u2022 Lagos, Nigeria</p>\n                    <div>\n                        <a href=\"#\" style=\"color:").concat(design_system_1.Colors.Neutral.Grey, "; text-decoration: underline; margin:0 4px;\">Privacy</a>\n                        \u2022\n                        <a href=\"#\" style=\"color:").concat(design_system_1.Colors.Neutral.Grey, "; text-decoration: underline; margin:0 4px;\">Terms</a>\n                    </div>\n                </td>\n            </tr>\n        </table>\n      </td>\n    </tr>\n  </table>\n</body>\n</html>\n    ");
}
// --- Components ---
function Hero(type) {
    // Map types to illustrative SVGs (using simplified inline SVGs for now or hosted URLs)
    // For luxury feel, we use simple geometric shapes with the Vayva green gradient if no asset provided.
    // Ideally these would be hosted images like `https://cdn.vayva.com/email/hero-${type}.png`
    // Placeholder for luxury gradient block if no image
    var gradient = design_system_1.Colors.Gradients.Primary;
    return "\n    <div style=\"margin: 0 0 ".concat(design_system_1.Spacing.lg, " 0; height: 120px; background: ").concat(gradient, "; border-radius: ").concat(design_system_1.Borders.Radius.md, "; display: flex; align-items: center; justify-content: center;\">\n        <!-- Placeholder Icon/Illustration -->\n        <div style=\"color: white; font-size: 24px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; opacity: 0.9;\">\n            ").concat(type.toUpperCase(), "\n        </div>\n    </div>\n    ");
}
function Button(url, label) {
    var btnStyle = style({
        display: 'inline-block',
        backgroundColor: design_system_1.Colors.Brand.Primary, // Primary green
        color: design_system_1.Colors.Neutral.White,
        textDecoration: 'none',
        padding: '14px 32px',
        borderRadius: design_system_1.Borders.Radius.md,
        fontSize: '15px',
        fontWeight: design_system_1.Typography.Weights.Medium,
        boxShadow: design_system_1.Shadows.Button,
        textAlign: 'center',
    });
    return "\n    <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"margin: ".concat(design_system_1.Spacing.xl, " 0;\">\n        <tr>\n            <td align=\"center\">\n                <a href=\"").concat(url, "\" style=\"").concat(btnStyle, "\">").concat(label, "</a>\n            </td>\n        </tr>\n    </table>\n    ");
}
function Badge(text, color) {
    if (color === void 0) { color = 'info'; }
    var bgMap = {
        success: '#DCFCE7',
        warning: '#FEF3C7',
        error: '#FEE2E2',
        info: '#DBEAFE',
    };
    var textMap = {
        success: '#166534',
        warning: '#92400E',
        error: '#991B1B',
        info: '#1E40AF',
    };
    var badgeStyle = style({
        display: 'inline-block',
        backgroundColor: bgMap[color],
        color: textMap[color],
        fontSize: '12px',
        fontWeight: '600',
        padding: '4px 10px',
        borderRadius: '9999px',
        border: "1px solid ".concat(bgMap[color]), // slight border to ensure shape
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    });
    return "<span style=\"".concat(badgeStyle, "\">").concat(text, "</span>");
}
function Text(content, type, align) {
    if (type === void 0) { type = 'body'; }
    if (align === void 0) { align = 'left'; }
    var styles = {
        margin: '0 0 16px',
        textAlign: align,
        color: design_system_1.Colors.Neutral.DarkGrey,
    };
    if (type === 'h1') {
        styles.fontSize = design_system_1.Typography.Sizes.H1;
        styles.fontWeight = design_system_1.Typography.Weights.Bold;
        styles.color = design_system_1.Colors.Neutral.Black;
        styles.margin = '0 0 24px';
    }
    else if (type === 'h2') {
        styles.fontSize = design_system_1.Typography.Sizes.H2;
        styles.fontWeight = design_system_1.Typography.Weights.Bold;
        styles.color = design_system_1.Colors.Neutral.Black;
    }
    else if (type === 'h3') {
        styles.fontSize = design_system_1.Typography.Sizes.H3;
        styles.fontWeight = design_system_1.Typography.Weights.Bold;
        styles.color = design_system_1.Colors.Neutral.Black;
        styles.margin = '0 0 12px';
    }
    else if (type === 'small') {
        styles.fontSize = design_system_1.Typography.Sizes.Small;
        styles.color = design_system_1.Colors.Neutral.Grey;
    }
    else {
        styles.fontSize = design_system_1.Typography.Sizes.Body;
        styles.lineHeight = design_system_1.Typography.LineHeights.Relaxed;
    }
    return "<div style=\"".concat(style(styles), "\">").concat(content, "</div>");
}
function KeyValue(label, value) {
    return "\n    <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"padding: 8px 0; border-bottom: 1px solid ".concat(design_system_1.Colors.Neutral.LightGrey, ";\">\n        <tr>\n            <td style=\"color: ").concat(design_system_1.Colors.Neutral.Grey, "; font-size: 14px;\">").concat(label, "</td>\n            <td align=\"right\" style=\"color: ").concat(design_system_1.Colors.Neutral.Black, "; font-weight: 500; font-size: 14px;\">").concat(value, "</td>\n        </tr>\n    </table>\n    ");
}
