import { NextResponse } from "next/server";
import { WithdrawalEligibility } from "@vayva/shared";

export async function GET() {
  // Simulate complex check
  await new Promise((resolve) => setTimeout(resolve, 600));

  // Test Logic: vary based on random or fixed state for now
  // In a real app, check Auth User's Merchant -> KYC Status

  const eligibility: WithdrawalEligibility = {
    kycStatus: "verified", // Change to 'review' to test blocking
    hasPayoutAccount: true,
    availableBalance: 450000,
    minWithdrawal: 1000,
    blockedReasons: [],
    isEligible: true,
  };

  // Example blocking logic (uncomment to test)
  // eligibility.kycStatus = 'pending';
  // eligibility.isEligible = false;
  // eligibility.blockedReasons.push('KYC Verification Pending');

  return NextResponse.json(eligibility);
}
