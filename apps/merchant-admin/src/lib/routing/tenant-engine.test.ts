import { describe, it, expect } from "vitest";
import { resolveRequest, ResolverInput } from "./tenant-engine";

describe("AntiGravity Tenant Resolver", () => {
  const testTenantMap = {
    bloom: "tenant_bloom_id",
    gizmo: "tenant_gizmo_id",
  };

  const baseInput: ResolverInput = {
    hostname: "vayva.ng",
    path: "/",
    query: {},
    tenantMap: testTenantMap,
    env: "production",
  };

  it("should resolve the platform root correctly", () => {
    const result = resolveRequest({ ...baseInput, hostname: "vayva.ng" });
    expect(result.tenantType).toBe("platform");
    expect(result.action).toBe("render");
  });

  it("should resolve www subdomain as platform", () => {
    const result = resolveRequest({ ...baseInput, hostname: "www.vayva.ng" });
    expect(result.tenantType).toBe("platform");
    expect(result.action).toBe("render");
  });

  it("should resolve admin subdomain", () => {
    const result = resolveRequest({
      ...baseInput,
      hostname: "admin.vayva.ng",
      path: "/dashboard",
    });
    expect(result.tenantType).toBe("admin");
    expect(result.action).toBe("rewrite");
    expect(result.destination).toBe("/admin/dashboard");
  });

  it("should resolve valid tenant storefronts", () => {
    const result = resolveRequest({
      ...baseInput,
      hostname: "bloom.vayva.ng",
      path: "/shop",
    });
    expect(result.tenantType).toBe("storefront");
    expect(result.resolvedTenant).toBe("tenant_bloom_id");
    expect(result.action).toBe("rewrite");
    expect(result.destination).toBe("/store/bloom/shop");
  });

  it("should handle unknown tenant subdomains", () => {
    const result = resolveRequest({
      ...baseInput,
      hostname: "unknown.vayva.ng",
    });
    expect(result.tenantType).toBe("unknown");
    expect(result.action).toBe("not_found");
    expect(result.destination).toBe("/store-not-found");
  });

  it("should reject invalid nested subdomains", () => {
    const result = resolveRequest({
      ...baseInput,
      hostname: "too.many.levels.vayva.ng",
    });
    expect(result.tenantType).toBe("unknown");
    expect(result.action).toBe("not_found");
  });

  it("should default to platform on Vercel preview domains", () => {
    const result = resolveRequest({
      ...baseInput,
      hostname: "vayva-git-main.vercel.app",
    });
    expect(result.tenantType).toBe("platform");
    expect(result.action).toBe("render");
  });

  it("should handle localhost for development", () => {
    const result = resolveRequest({ ...baseInput, hostname: "localhost:3000" });
    expect(result.tenantType).toBe("platform");
    expect(result.action).toBe("render");
  });
});
