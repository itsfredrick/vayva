"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button, Icon, Input } from "@vayva/ui";
import { PasswordStrengthIndicator } from "@/components/ui/PasswordStrengthIndicator";
import { AuthService } from "@/services/auth";
import { SplitAuthLayout } from "@/components/auth/SplitAuthLayout";
const ResetPasswordContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token") || "";
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await AuthService.resetPassword({ token, password });
            router.push("/signin?reset=success");
        }
        catch (err) {
            console.error(err);
            setError(err.response?.data?.error || "Failed to reset password");
        }
        finally {
            setLoading(false);
        }
    };
    if (!token) {
        return (_jsx(SplitAuthLayout, { title: "Invalid reset link", subtitle: "This password reset link is invalid or has expired", showSignInLink: true, children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6", children: _jsx(Icon, { name: "AlertCircle", className: "w-8 h-8 text-red-600" }) }), _jsx(Link, { href: "/forgot-password", children: _jsx(Button, { variant: "primary", className: "w-full !bg-black !text-white !rounded-xl !h-12", children: "Request new link" }) })] }) }));
    }
    return (_jsxs(SplitAuthLayout, { title: "Set new password", subtitle: "Choose a strong password for your account", showSignInLink: true, children: [_jsx("div", { className: "flex justify-center mb-6", children: _jsx("div", { className: "w-16 h-16 bg-black/5 rounded-full flex items-center justify-center", children: _jsx(Icon, { name: "Lock", className: "w-8 h-8 text-black" }) }) }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [error && (_jsx("div", { className: "p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl", children: error })), _jsxs("div", { children: [_jsxs("div", { className: "relative", children: [_jsx(Input, { label: "New Password", type: showPassword ? "text" : "password", placeholder: "Create a strong password", value: password, onChange: (e) => setPassword(e.target.value), required: true }), _jsx(Button, { type: "button", variant: "ghost", size: "icon", onClick: () => setShowPassword(!showPassword), className: "absolute right-3 top-[38px] text-gray-400 hover:text-black h-8 w-8", children: _jsx(Icon, { name: (showPassword ? "EyeOff" : "Eye"), className: "w-5 h-5" }) })] }), _jsx(PasswordStrengthIndicator, { password: password })] }), _jsxs("div", { className: "relative", children: [_jsx(Input, { label: "Confirm Password", type: showConfirmPassword ? "text" : "password", placeholder: "Re-enter your password", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), required: true }), _jsx(Button, { type: "button", variant: "ghost", size: "icon", onClick: () => setShowConfirmPassword(!showConfirmPassword), className: "absolute right-3 top-[38px] text-gray-400 hover:text-black h-8 w-8", children: _jsx(Icon, { name: (showConfirmPassword ? "EyeOff" : "Eye"), className: "w-5 h-5" }) }), confirmPassword.length > 0 && password !== confirmPassword && (_jsx("p", { className: "text-xs text-red-600 mt-1", children: "Passwords do not match" }))] }), _jsx(Button, { type: "submit", variant: "primary", size: "lg", className: "w-full !bg-black !text-white hover:!bg-black/90 !rounded-xl !h-12", disabled: loading || password !== confirmPassword || !password, children: loading ? (_jsxs(_Fragment, { children: [_jsx(Icon, { name: "Loader2", className: "w-5 h-5 animate-spin" }), "Resetting password..."] })) : ("Reset password") })] }), _jsx("div", { className: "mt-6 text-center", children: _jsxs(Link, { href: "/signin", className: "text-sm text-[#0D1D1E] hover:text-black font-medium transition-colors inline-flex items-center gap-1", children: [_jsx(Icon, { name: "ArrowLeft", className: "w-4 h-4" }), "Back to sign in"] }) })] }));
};
export default function ResetPasswordPage() {
    return (_jsx(Suspense, { fallback: _jsx("div", { children: "Loading..." }), children: _jsx(ResetPasswordContent, {}) }));
}
