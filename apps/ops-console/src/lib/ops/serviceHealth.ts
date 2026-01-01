import { prisma } from "@vayva/db";

export class ServiceHealth {
  static async check() {
    const results: Record<string, boolean> = {};

    // 1. Database
    try {
      await prisma.$queryRaw`SELECT 1`;
      results.database = true;
    } catch (e) {
      results.database = false;
    }

    // 2. Email (Mock)
    results.emailProvider = !!process.env.EMAIL_PROVIDER_API_KEY;

    // 3. Paystack (Mock)
    results.paystack = !!process.env.PAYSTACK_SECRET_KEY;

    // 4. Redis/Queue (If applicable - omitted for V1)

    const allOk = Object.values(results).every((v) => v);

    return {
      ok: allOk,
      services: results,
    };
  }
}
