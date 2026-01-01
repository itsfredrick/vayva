export class EnvHealth {
  static check() {
    const required = [
      "DATABASE_URL",
      "NEXTAUTH_SECRET",
      "PAYSTACK_SECRET_KEY",
      "EMAIL_PROVIDER_API_KEY",
    ];

    const missing = required.filter((key) => !process.env[key]);
    const warnings = [];

    if (process.env.NODE_ENV === "production") {
      if (process.env.PAYSTACK_SECRET_KEY?.includes("test")) {
        warnings.push("PAYSTACK_SECRET_KEY appears to be a test key");
      }
    }

    return {
      ok: missing.length === 0,
      missing,
      warnings,
    };
  }
}
