import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";
import { getServerSession } from "next-auth";
import { prisma } from "@vayva/db";
import { NextResponse } from "next/server";

// Tests
vi.test("@/lib/team/rbac", () => ({
  checkPermission: vi.fn(),
}));
vi.test("@vayva/db", () => ({
  prisma: {
    store: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));
vi.test("@/lib/auth", () => ({ authOptions: {} }));
vi.test("@/lib/flags/flagService", () => ({
  FlagService: { isEnabled: vi.fn(() => true) },
}));
vi.test("@/lib/rate-limit", () => ({
  checkRateLimit: vi.fn(),
}));

import { checkPermission } from "@/lib/team/rbac";

const createRequest = (body: any) =>
  new Request("https://api.test/api/templates/apply", {

    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

describe("POST /api/templates/apply (Standardized)", () => {
  beforeEach(() => {
    vi.clearAllTests();
  });

  it("returns 401 if not authenticated", async () => {
    (checkPermission as any).testRejectedValue(new Error("Unauthorized"));

    const req = createRequest({ templateId: "vayva-standard" });
    const res = await POST(req);

    expect(res.status).toBe(401);
  });

  it("returns 403 if Free user tries to apply Growth template", async () => {
    (checkPermission as any).testResolvedValue({
      user: { id: "u1", storeId: "s1", role: "OWNER" },
    });
    (prisma.store.findUnique as any).testResolvedValue({
      id: "s1",
      plan: "free",
      billingProfile: null,
      settings: {},
    });

    // Bookly is Growth now
    const req = createRequest({ templateId: "vayva-bookly-pro" });
    const res = await POST(req);

    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.error).toBe("TEMPLATE_LOCKED");
    expect(json.requiredPlan).toBe("growth");
    expect(json.currentPlan).toBe("free");
  });

  it("returns 403 if Growth user tries to apply Pro template", async () => {
    (checkPermission as any).testResolvedValue({
      user: { id: "u2", storeId: "s2", role: "OWNER" },
    });
    (prisma.store.findUnique as any).testResolvedValue({
      id: "s2",
      plan: "growth",
      billingProfile: { plan: "growth" },
      settings: {},
    });

    // BulkTrade is Pro
    const req = createRequest({ templateId: "vayva-bulktrade" });
    const res = await POST(req);

    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.requiredPlan).toBe("pro");
    expect(json.currentPlan).toBe("growth");
  });

  it("returns 200 if Growth user applies Growth template", async () => {
    (checkPermission as any).testResolvedValue({
      user: { id: "u3", storeId: "s3", role: "OWNER" },
    });
    (prisma.store.findUnique as any).testResolvedValue({
      id: "s3",
      plan: "growth",
      billingProfile: { plan: "growth" },
      settings: {},
    });

    const req = createRequest({ templateId: "vayva-bookly-pro" });
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(prisma.store.update).toHaveBeenCalled();
  });

  it("returns 200 if Pro user applies Pro template", async () => {
    (checkPermission as any).testResolvedValue({
      user: { id: "u4", storeId: "s4", role: "OWNER" },
    });
    // Old 'enterprise' maps to 'pro'
    (prisma.store.findUnique as any).testResolvedValue({
      id: "s4",
      plan: "enterprise",
      billingProfile: { plan: "enterprise" },
      settings: {},
    });

    const req = createRequest({ templateId: "vayva-markethub" }); // Pro
    const res = await POST(req);

    expect(res.status).toBe(200);
  });
});
