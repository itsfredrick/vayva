"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Icon } from "@vayva/ui";
import { OTPInput } from "@/components/ui/OTPInput";
import { AuthService } from "@/services/auth";
import { SplitAuthLayout } from "@/components/auth/SplitAuthLayout";

import { useAuth } from "@/context/AuthContext";

const VerifyContent = () => {
  const router = useRouter();
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleVerify = async (otpValue: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await AuthService.verify({ email, code: otpValue });

      // login expects (token, user, merchant)
      login(data.token, data.user, data.merchant);

      // Redirect logic is in login function/AuthContext,
      // but we can ensure a fallback here if needed.
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || "Invalid verification code");
      setOtp(""); // Clear OTP on error
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    try {
      await AuthService.resendCode({ email });
      setResendTimer(30);
      setCanResend(false);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to resend code");
    }
  };

  return (
    <SplitAuthLayout
      stepIndicator="Step 2/2"
      title="Verify your account"
      subtitle={`We sent a 6-digit code to ${email || "your email"}`}
      showSignInLink
    >
      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center">
          <Icon name={"Mail" as any} className="w-8 h-8 text-black" />
        </div>
      </div>

      {/* OTP Input */}
      <div className="mb-6" data-testid="auth-verify-otp-container">
        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl text-center">
            {error}
          </div>
        )}

        <OTPInput
          value={otp}
          onChange={setOtp}
          onComplete={handleVerify}
          disabled={loading}
          error={!!error}
        />
      </div>

      {/* Resend Code */}
      <div className="text-center mb-6">
        {canResend ? (
          <button
            onClick={handleResend}
            className="text-sm text-[#0D1D1E] hover:text-black font-medium transition-colors"
          >
            Resend code
          </button>
        ) : (
          <p className="text-sm text-gray-400">Resend code in {resendTimer}s</p>
        )}
      </div>

      {/* Verify Button */}
      <Button
        variant="primary"
        size="lg"
        className="w-full !bg-black !text-white hover:!bg-black/90 !rounded-xl !h-12"
        onClick={() => handleVerify(otp)}
        disabled={loading || otp.length !== 6}
        data-testid="auth-verify-submit"
      >
        {loading ? (
          <>
            <Icon name={"Loader2" as any} className="w-5 h-5 animate-spin" />
            Verifying...
          </>
        ) : (
          "Verify account"
        )}
      </Button>

      {/* Help Text */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-400">
          Didn't receive the code? Check your spam folder or{" "}
          <button
            onClick={handleResend}
            disabled={!canResend}
            className="text-[#0D1D1E] hover:text-black disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            request a new one
          </button>
        </p>
      </div>
    </SplitAuthLayout>
  );
};

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
