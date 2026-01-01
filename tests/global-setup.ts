/**
 * Global setup for E2E tests
 * Runs once before all tests
 */

async function globalSetup() {
  console.log("🔧 Global E2E Test Setup");
  console.log("✅ Test environment ready");

  // Note: Database connection and test users will be created per-test
  // to avoid conflicts between parallel test runs
}

export default globalSetup;
