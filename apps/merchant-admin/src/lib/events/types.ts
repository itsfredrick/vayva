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
  payload?: Record<string, unknown>;
  dedupeKey?: string;
  ctx: ActorContext;
}

export interface NotificationConfig<T = unknown> {
  title: string | ((payload: T) => string);
  body: string | ((payload: T) => string);
  severity: NotificationSeverity;
  actionUrl?: string | ((payload: T, entityId?: string) => string);
}

export interface AuditConfig<T = unknown> {
  action: string;
  beforeState?: (payload: T) => unknown;
  afterState?: (payload: T) => unknown;
}

export interface EventDefinition<T = unknown> {
  notification?: NotificationConfig<T>;
  audit?: AuditConfig<T>;
}
