export type ActorType = "merchant_user" | "platform_admin" | "system";
export type NotificationSeverity = "info" | "success" | "warning" | "critical";

export interface ActorContext {
  actorId: string | null;
  actorType: ActorType;
  actorLabel: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  correlationId: string;
}

export interface BaseEventPayload {
  merchantId: string;
  type: string;
  entityType?: string;
  entityId?: string;
  payload?: Record<string, any>;
  dedupeKey?: string;
  ctx: ActorContext;
}

export interface NotificationConfig {
  title: string | ((payload: any) => string);
  body: string | ((payload: any) => string);
  severity: NotificationSeverity;
  actionUrl?: string | ((payload: any, entityId?: string) => string);
}

export interface AuditConfig {
  action: string;
  beforeState?: (payload: any) => any;
  afterState?: (payload: any) => any;
}

export interface EventDefinition {
  notification?: NotificationConfig;
  audit?: AuditConfig;
}
