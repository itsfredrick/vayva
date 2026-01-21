"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth";
import { SplitAuthLayout } from "@/components/auth/SplitAuthLayout";
import { Button, Input, Label } from "@vayva/ui";
export default function SignupPage() {
    const router = useRouter();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showGoogleModal, setShowGoogleModal] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!agreedToTerms) {
            setError("Please agree to the Terms, Privacy Policy, and EULA.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await AuthService.register({ email, password, firstName, lastName });
            router.push(`/verify?email=${encodeURIComponent(email)}`);
        }
        catch (err) {
            console.error(err);
            setError(err.message || "Failed to create account");
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs(SplitAuthLayout, { title: "Create your Vayva account", subtitle: "Set up your business system in minutes", showSignInLink: true, children: [_jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [error && (_jsx("div", { className: "p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg", children: error })), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "firstName", children: "First name" }), _jsx(Input, { id: "firstName", placeholder: "John", value: firstName, onChange: (e) => setFirstName(e.target.value), required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "lastName", children: "Last name" }), _jsx(Input, { id: "lastName", placeholder: "Doe", value: lastName, onChange: (e) => setLastName(e.target.value), required: true })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "email", children: "Business email" }), _jsx(Input, { id: "email", type: "email", placeholder: "you@business.com", value: email, onChange: (e) => setEmail(e.target.value), required: true, "data-testid": "auth-signup-email" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "password", children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx(Input, { id: "password", type: showPassword ? "text" : "password", placeholder: "Create a strong password", value: password, onChange: (e) => setPassword(e.target.value), required: true, "data-testid": "auth-signup-password" }), _jsx(Button, { type: "button", variant: "ghost", size: "icon", onClick: () => setShowPassword(!showPassword), className: "absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 h-8 w-8", children: _jsxs("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [_jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" }), _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" })] }) })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "confirmPassword", children: "Confirm password" }), _jsx(Input, { id: "confirmPassword", type: showConfirmPassword ? "text" : "password", placeholder: "Re-enter your password", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), required: true })] }), _jsxs("label", { htmlFor: "terms-agreement", className: "flex items-start gap-3 cursor-pointer", children: [_jsx("input", { id: "terms-agreement", type: "checkbox", checked: agreedToTerms, onChange: (e) => setAgreedToTerms(e.target.checked), className: "w-4 h-4 mt-0.5 rounded border-gray-300 text-primary focus:ring-primary" }), _jsxs("span", { className: "text-sm text-gray-600", children: ["By creating an account, you agree to our", " ", _jsx(Link, { href: "/legal/terms", target: "_blank", className: "text-gray-900 font-medium underline", children: "Terms" }), ",", " ", _jsx(Link, { href: "/legal/privacy", target: "_blank", className: "text-gray-900 font-medium underline", children: "Privacy" }), ", and", " ", _jsx(Link, { href: "/legal/eula", target: "_blank", className: "text-gray-900 font-medium underline", children: "EULA" }), "."] })] }), _jsx(Button, { type: "submit", isLoading: loading, disabled: !agreedToTerms, className: "w-full h-12", "data-testid": "auth-signup-submit", children: "Create account" })] }), _jsxs("div", { className: "mt-6 text-center text-sm text-gray-600", children: ["Already have an account?", " ", _jsx(Link, { href: "/signin", className: "text-gray-900 font-semibold transition-colors", children: "Sign in" })] }), showGoogleModal && (_jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-white rounded-lg p-6 max-w-sm w-full shadow-xl text-center", children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Google Sign-Up Not Configured" }), _jsx("p", { className: "text-sm text-gray-600 mb-4", children: "Please sign up with your email." }), _jsx(Button, { className: "w-full", onClick: () => setShowGoogleModal(false), children: "Got it" })] }) }))] }));
}
