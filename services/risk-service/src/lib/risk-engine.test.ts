import { RiskEngine } from "./risk-engine";
import { prisma } from "@vayva/db";

const mockPrisma = {
  riskSignal: { create: jest.fn() },
  riskProfile: { upsert: jest.fn(), update: jest.fn() },
  customerRiskProfile: { upsert: jest.fn() },
  enforcementAction: { findFirst: jest.fn(), create: jest.fn() },
};

jest.mock("@vayva/db", () => ({
  prisma: {
    riskSignal: { create: jest.fn() },
    riskProfile: { upsert: jest.fn(), update: jest.fn() },
    customerRiskProfile: { upsert: jest.fn() },
    enforcementAction: { findFirst: jest.fn(), create: jest.fn() },
  },
  RiskScope: { MERCHANT: "MERCHANT", CUSTOMER: "CUSTOMER" },
  RiskSeverity: { HIGH: "HIGH", MEDIUM: "MEDIUM", LOW: "LOW" },
  EnforcementActionType: { REQUIRE_MANUAL_APPROVAL: "REQUIRE_MANUAL_APPROVAL" },
  EnforcementScope: { MERCHANT: "MERCHANT" },
  RiskStatus: { CRITICAL: "CRITICAL" },
}));

describe("RiskEngine", () => {
  let engine: RiskEngine;

  beforeEach(() => {
    engine = new RiskEngine();
    jest.clearAllMocks();
  });

  it("should calculate score for HIGH severity", async () => {
    (prisma.riskSignal.create as jest.Mock).mockResolvedValue({
      id: "1",
      scoreDelta: 50,
    });
    (prisma.riskProfile.upsert as jest.Mock).mockResolvedValue({
      merchantRiskScore: 50,
      status: "NORMAL",
    });

    await engine.ingestSignal({
      merchantId: "m1",
      scope: "MERCHANT",
      key: "test",
      severity: "HIGH",
    });

    expect(prisma.riskSignal.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ scoreDelta: 50 }),
      }),
    );
  });

  it("should trigger enforcement if score > 100", async () => {
    (prisma.riskSignal.create as jest.Mock).mockResolvedValue({
      id: "1",
      scoreDelta: 50,
    });
    // Return a profile that will exceed threshold
    (prisma.riskProfile.upsert as jest.Mock).mockResolvedValue({
      merchantRiskScore: 101,
      status: "NORMAL",
    });
    (prisma.enforcementAction.create as jest.Mock).mockResolvedValue({
      id: "e1",
    });

    await engine.ingestSignal({
      merchantId: "m1",
      scope: "MERCHANT",
      key: "test",
      severity: "HIGH",
    });

    expect(prisma.riskProfile.update).toHaveBeenCalledWith({
      where: { merchantId: "m1" },
      data: { status: "CRITICAL" },
    });
    expect(prisma.enforcementAction.create).toHaveBeenCalled();
  });
});
