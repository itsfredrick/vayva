import { prisma } from "@vayva/db";

export class ServiceHealth {
  static async check() {
    const results: Record<string, boolean> = {};

    // 1. Database
    try {
      await prisma.$queryRaw`SELECT 1`;
      results.database = true;
    } catch (e: any) {
      results.database = false;
    }

    // 2. Email (Test)
    results.emailProvider = !!process.env.EMAIL_PROVIDER_API_KEY;

    // 3. Paystack (Test)
    results.paystack = !!process.env.PAYSTACK_SECRET_KEY;

    // 4. Redis/Queue (If applicable - omitted for V1)

    const allOk = Object.values(results).every((v) => v);

    return {
      ok: allOk,
      services: results,
    };
  }
}
