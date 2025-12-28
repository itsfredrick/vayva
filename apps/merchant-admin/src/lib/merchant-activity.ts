
// Merchant-safe audit event types (subset of all events)
export const MERCHANT_VISIBLE_EVENTS = [
    'ORDER_STATUS_CHANGED',
    'ORDER_BULK_STATUS_CHANGED',
    'ORDER_EXPORTED',
    'WITHDRAWAL_REQUESTED',
    'WITHDRAWAL_STATUS_CHANGED',
    'TEAM_INVITE_SENT',
    'TEAM_ROLE_CHANGED',
    'TEAM_MEMBER_REMOVED',
    'SETTINGS_CHANGED',
    'SECURITY_RATE_LIMIT_BLOCKED',
    'SECURITY_SESSION_INVALIDATED',
    'EXPORT_CREATED',
    'EXPORT_DOWNLOADED',
    'COMPLIANCE_REPORT_CREATED',
    'COMPLIANCE_REPORT_DOWNLOADED'
] as const;

export function formatActivityForMerchant(event: any): {
    time: string;
    actor: string;
    action: string;
    summary: string;
} {
    const time = new Date(event.createdAt).toLocaleString();
    const actor = event.actorRole || 'System';

    let action = '';
    let summary = '';

    switch (event.action) {
        case 'ORDER_STATUS_CHANGED':
            action = 'Order Updated';
            summary = `Order ${event.metadata?.orderRef || 'N/A'} changed from ${event.metadata?.fromStatus} to ${event.metadata?.toStatus}`;
            break;

        case 'ORDER_BULK_STATUS_CHANGED':
            action = 'Bulk Order Update';
            summary = `${event.metadata?.count || 0} orders updated to ${event.metadata?.toStatus}`;
            break;

        case 'ORDER_EXPORTED':
            action = 'Orders Exported';
            summary = `${event.metadata?.count || 0} orders exported`;
            break;

        case 'WITHDRAWAL_REQUESTED':
            action = 'Withdrawal Requested';
            summary = `₦${(event.metadata?.amountGross / 100).toLocaleString()} requested (Ref: ${event.metadata?.reference})`;
            break;

        case 'WITHDRAWAL_STATUS_CHANGED':
            action = 'Withdrawal Updated';
            summary = `Withdrawal ${event.metadata?.referenceCode} marked as ${event.metadata?.toStatus}`;
            break;

        case 'TEAM_INVITE_SENT':
            action = 'Team Invite Sent';
            summary = `Invitation sent to ${event.metadata?.role} role`;
            break;

        case 'TEAM_ROLE_CHANGED':
            action = 'Role Changed';
            summary = `Team member role updated to ${event.metadata?.newRole}`;
            break;

        case 'TEAM_MEMBER_REMOVED':
            action = 'Team Member Removed';
            summary = 'Team member access revoked';
            break;

        case 'SETTINGS_CHANGED':
            action = 'Settings Updated';
            summary = `Updated: ${event.metadata?.keys?.join(', ') || 'settings'}`;
            break;

        case 'SECURITY_RATE_LIMIT_BLOCKED':
            action = 'Rate Limit Applied';
            summary = 'Request temporarily limited for security';
            break;

        case 'SECURITY_SESSION_INVALIDATED':
            action = 'Session Refreshed';
            summary = 'Security session updated';
            break;

        case 'EXPORT_CREATED':
            action = 'Export Created';
            summary = `${event.metadata?.type} export prepared`;
            break;

        case 'EXPORT_DOWNLOADED':
            action = 'Export Downloaded';
            summary = `${event.metadata?.type} export downloaded`;
            break;

        case 'COMPLIANCE_REPORT_CREATED':
            action = 'Compliance Report Created';
            summary = `${event.metadata?.reportType} report generated`;
            break;

        case 'COMPLIANCE_REPORT_DOWNLOADED':
            action = 'Compliance Report Downloaded';
            summary = `${event.metadata?.reportType} report downloaded`;
            break;

        default:
            action = event.action.replace(/_/g, ' ');
            summary = 'Activity recorded';
    }

    return { time, actor, action, summary };
}
