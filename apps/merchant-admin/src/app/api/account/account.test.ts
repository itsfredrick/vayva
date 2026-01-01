import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET as getOverview } from "./overview/route";
import { GET as getPayouts } from "./payouts/route";
import {
  GET as getDomains,
  POST as triggerDomainVerify,
} from "./domains/route";
import { POST as verifyDomain } from "./domains/verify/route";
import { POST as changePassword } from "./security/change-password/route";
import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@vayva/db";
import bcrypt from "bcryptjs";

const testStoreId = "store_test_999";
const testUserId = "user_test_999";
const testSession = { user: { id: testUserId, storeId: testStoreId } };

// Global Tests
vi.test("@/lib/auth/session", () => ({
  requireAuth: vi.fn(),
}));

vi.test("@/lib/audit", () => ({
  logAudit: vi.fn(),
  AuditAction: { PASSWORD_CHANGED: "PASSWORD_CHANGED" },
}));

vi.test("@/lib/rate-limit", () => ({
  checkRateLimit: vi.fn().testResolvedValue({ success: true }),
}));

// Tests
vi.test("@/lib/email/resend", () => ({
  ResendEmailService: {
    sendPasswordChangedEmail: vi.fn().testResolvedValue({ success: true }),
    assertConfigured: vi.fn(),
  },
}));

vi.test("@vayva/db", () => ({
  prisma: {
    account: { findUnique: vi.fn() },
    store: { findUnique: vi.fn(), update: vi.fn() },
    bankBeneficiary: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
    },
    domainMapping: { findFirst: vi.fn(), findUnique: vi.fn(), update: vi.fn() },
    auditLog: { findMany: vi.fn(), create: vi.fn() },
    kycRecord: { findUnique: vi.fn() },
    merchantSubscription: { findUnique: vi.fn() },
    whatsappChannel: { findUnique: vi.fn() },
    securitySetting: { findUnique: vi.fn() },
    user: { findUnique: vi.fn(), update: vi.fn() },
  },
}));

describe("Expanded Account API Suite", () => {
  beforeEach(() => {
    vi.clearAllTests();
    vi.simulated(requireAuth).testResolvedValue(testSession as any);
  });

  describe("GET /api/account/overview", () => {
    it("enforces tenant isolation", async () => {
      (prisma.store.findUnique as any).testResolvedValue({
        id: testStoreId,
        name: "Isolated Store",
      });
      (prisma.auditLog.findMany as any).testResolvedValue([]);

      await getOverview();

      expect(prisma.store.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: testStoreId },
        }),
      );
    });
  });

  describe("GET /api/account/domains", () => {
    it("returns verification tokens and status", async () => {
      (prisma.domainMapping.findFirst as any).testResolvedValue({
        id: "dm1",
        domain: "custom.com",
        status: "pending",
        verificationToken: "v-token-123",
        provider: { lastError: "DNS mismatch" },
      });

      const res = await getDomains();
      const json = await res.json();

      expect(json.customDomain).toBe("custom.com");
      expect(json.verificationToken).toBe("v-token-123");
      expect(json.lastError).toBe("DNS mismatch");
    });
  });

  describe("POST /api/account/domains/verify", () => {
    it("starts verification only for owner store", async () => {
      (prisma.domainMapping.findUnique as any).testResolvedValue({
        id: "dm1",
        storeId: "OTHER_STORE",
        domain: "hacker.com",
      });

      const res = await verifyDomain(
        new Request("http://localhost", {
          method: "POST",
          body: JSON.stringify({ domainMappingId: "dm1" }),
        }),
      );

      expect(res.status).toBe(404); // Not found or unauthorized
    });

    it("triggers verification for valid ownership", async () => {
      (prisma.domainMapping.findUnique as any).testResolvedValue({
        id: "dm1",
        storeId: testStoreId,
        domain: "valid.shop",
      });

      const res = await verifyDomain(
        new Request("http://localhost", {
          method: "POST",
          body: JSON.stringify({ domainMappingId: "dm1" }),
        }),
      );

      expect(res.status).toBe(200);
      expect(prisma.domainMapping.update).toHaveBeenCalled();
    });
  });

  describe("POST /api/account/security/change-password", () => {
    it("validates current password before updating", async () => {
      const oldHash = await bcrypt.hash("old-password", 10);
      (prisma.user.findUnique as any).testResolvedValue({
        id: testUserId,
        password: oldHash,
        email: "test@vayva.ng",
      });

      const res = await changePassword(
        new Request("http://localhost", {
          method: "POST",
          body: JSON.stringify({
            currentPassword: "wrong-password",
            newPassword: "new-password123",
            confirmPassword: "new-password123",
          }),
        }),
      );

      expect(res.status).toBe(401);
      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    it("updates password and logs audit on success", async () => {
      const oldHash = await bcrypt.hash("old-password", 10);
      (prisma.user.findUnique as any).testResolvedValue({
        id: testUserId,
        password: oldHash,
        email: "test@vayva.ng",
      });

      const res = await changePassword(
        new Request("http://localhost", {
          method: "POST",
          body: JSON.stringify({
            currentPassword: "old-password",
            newPassword: "secure-password-99",
            confirmPassword: "secure-password-99",
          }),
        }),
      );

      expect(res.status).toBe(200);
      expect(prisma.user.update).toHaveBeenCalled();
    });
  });
});
