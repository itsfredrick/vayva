export type TenantType = "platform" | "storefront" | "admin" | "unknown";
export type RoutingAction = "render" | "redirect" | "rewrite" | "not_found";

export interface RoutingResult {
  resolvedTenant: string | null;
  tenantType: TenantType;
  action: RoutingAction;
  destination: string | null;
  reason: string;
}

export interface ResolverInput {
  hostname: string;
  path: string;
  query: Record<string, string | string[] | undefined>;
  tenantMap: Record<string, string>; // Subdomain -> TenantID
  env: string;
}

/**
 * ANTIGRAVITY TENANT RESOLVER
 * Authoritative logic for Vayva domain routing.
 */
export function resolveRequest(input: ResolverInput): RoutingResult {
  const { hostname, path, tenantMap } = input;
  const host = hostname.toLowerCase();

  // 1. Platform Root (Marketing)
  // We handle vayva.ng, www.vayva.ng, and apex domains for localhost/preview
  if (
    host === "vayva.ng" ||
    host === "www.vayva.ng" ||
    host === "localhost" ||
    host.startsWith("localhost:")
  ) {
    return {
      resolvedTenant: null,
      tenantType: "platform",
      action: "render",
      destination: null,
      reason: "Primary platform domain detected.",
    };
  }

  // 2. Admin Portal
  if (host === "admin.vayva.ng") {
    return {
      resolvedTenant: null,
      tenantType: "admin",
      action: "redirect",
      destination: `https://vayva.ng/dashboard`,
      reason: "Admin subdomain deprecated. Redirecting to /dashboard.",
    };
  }

  // 3. Tenant Storefronts (*.vayva.ng)
  if (host.endsWith(".vayva.ng")) {
    const subdomain = host.replace(".vayva.ng", "");

    // Handle deeply nested subdomains as invalid (e.g. foo.bar.vayva.ng)
    if (subdomain.includes(".")) {
      return {
        resolvedTenant: null,
        tenantType: "unknown",
        action: "not_found",
        destination: "/404",
        reason: "Invalid subdomain hierarchy.",
      };
    }

    const tenantId = tenantMap[subdomain];
    if (tenantId) {
      return {
        resolvedTenant: tenantId,
        tenantType: "storefront",
        action: "rewrite",
        destination: `/store/${subdomain}${path}`,
        reason: `Resolved tenant: ${subdomain} (${tenantId})`,
      };
    }

    return {
      resolvedTenant: null,
      tenantType: "unknown",
      action: "not_found",
      destination: "/store-not-found",
      reason: `Unregistered tenant subdomain: ${subdomain}`,
    };
  }

  // 4. Vercel Preview Domains (*.vercel.app)
  if (host.endsWith(".vercel.app")) {
    // For simplicity in previews, we render platform unless we add custom header logic later
    return {
      resolvedTenant: null,
      tenantType: "platform",
      action: "render",
      destination: null,
      reason: "Vercel preview domain - defaulting to platform.",
    };
  }

  // Default Fallback
  return {
    resolvedTenant: null,
    tenantType: "unknown",
    action: "not_found",
    destination: "/404",
    reason: "Unrecognized hostname.",
  };
}
