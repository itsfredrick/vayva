"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AuthService } from "@/services/auth";
import { SplitAuthLayout } from "@/components/auth/SplitAuthLayout";
import { Button, Input, Label } from "@vayva/ui";
export default function SigninPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showGoogleModal, setShowGoogleModal] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const data = await AuthService.login({ email, password, rememberMe });
            login(data.token, data.user);
        }
        catch (err) {
            console.error(err);
            setError(err.response?.data?.error || "Incorrect email or password");
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs(SplitAuthLayout, { title: "Welcome back", subtitle: "Sign in to manage your business operations", showSignUpLink: true, children: [_jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [error && (_jsx("div", { className: "p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg", children: error })), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "email", children: "Email address" }), _jsx(Input, { id: "email", type: "email", placeholder: "you@business.com", value: email, onChange: (e) => setEmail(e.target.value), required: true, "data-testid": "auth-signin-email" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "password", children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx(Input, { id: "password", type: showPassword ? "text" : "password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", value: password, onChange: (e) => setPassword(e.target.value), required: true, "data-testid": "auth-signin-password" }), _jsx(Button, { type: "button", variant: "ghost", size: "icon", onClick: () => setShowPassword(!showPassword), className: "absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 h-8 w-8", "aria-label": showPassword ? "Hide password" : "Show password", children: showPassword ? (_jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" }) })) : (_jsxs("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [_jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" }), _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" })] })) })] }), _jsxs("div", { className: "flex items-center justify-between mt-3", children: [_jsxs("label", { htmlFor: "remember-me", className: "flex items-center gap-2 cursor-pointer group", children: [_jsx("input", { id: "remember-me", type: "checkbox", checked: rememberMe, onChange: (e) => setRememberMe(e.target.checked), className: "w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary transition-all cursor-pointer" }), _jsx("span", { className: "text-sm text-gray-600 group-hover:text-gray-900 transition-colors", children: "Remember me" })] }), _jsx(Link, { href: "/forgot-password", className: "text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors", children: "Forgot password?" })] })] }), _jsx(Button, { type: "submit", isLoading: loading, className: "w-full h-12", "data-testid": "auth-signin-submit", children: "Sign in" })] }), _jsxs("div", { className: "mt-6 text-center text-sm text-gray-600", children: ["New here?", " ", _jsx(Link, { href: "/signup", className: "text-gray-900 hover:text-black font-semibold transition-colors", children: "Create an account" }), _jsx("div", { className: "mt-2", children: _jsx("a", { href: "https://vayva.ng/help", target: "_blank", rel: "noopener noreferrer", className: "text-xs text-gray-400 hover:text-gray-600 transition-colors", children: "Having trouble?" }) })] }), showGoogleModal && (_jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-white rounded-lg p-6 max-w-sm w-full shadow-xl", children: [_jsxs("div", { className: "text-center mb-4", children: [_jsx("div", { className: "w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3", children: _jsx("svg", { className: "w-6 h-6 text-gray-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }) }), _jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "Google Sign-In Not Configured" }), _jsx("p", { className: "text-sm text-gray-600", children: "Please sign in with your email and password." })] }), _jsx(Button, { className: "w-full h-10", onClick: () => setShowGoogleModal(false), children: "Got it" })] }) }))] }));
}
