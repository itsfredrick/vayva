"use client";
import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { StoreShell } from "@/components/StoreShell";
import { Button } from "@vayva/ui";
import { User, Lock, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
export default function LoginPage() {
    const { store } = useStore();
    const router = useRouter();
    const params = useParams();
    const lang = params.lang || "en";
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    storeId: store?.id,
                    email,
                    password,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Invalid credentials");
            }
            // Success: API sets httpOnly cookie. We just set local state for UI.
            localStorage.setItem("vayva_user", JSON.stringify(data.customer));
            router.push(`/${lang}/account`);
        }
        catch (e) {
            setError(e.message || "Login failed");
        }
        finally {
            setIsLoading(false);
        }
    };
    if (!store)
        return null;
    return (_jsx(StoreShell, { children: _jsxs("div", { className: "min-h-[calc(100vh-200px)] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-noise bg-gray-50", children: [_jsxs("div", { className: "sm:mx-auto sm:w-full sm:max-w-md", children: [_jsxs("h2", { className: "mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight", children: ["Log in to ", store.name] }), _jsxs("p", { className: "mt-2 text-center text-sm text-gray-600", children: ["Or", " ", _jsx(Link, { href: `/${lang}/account/register`, className: "font-medium text-black hover:text-gray-800 underline transition-colors", children: "create an account" })] })] }), _jsx("div", { className: "mt-8 sm:mx-auto sm:w-full sm:max-w-md", children: _jsxs("div", { className: "glass-panel py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 relative overflow-hidden", children: [_jsx("div", { className: "absolute -top-10 -right-10 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" }), _jsxs("form", { className: "space-y-6 relative z-10", onSubmit: handleLogin, children: [error && (_jsxs("div", { className: "bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2 animate-shake", children: [_jsx("span", { children: "\u26A0\uFE0F" }), " ", error] })), _jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700", children: "Email address" }), _jsxs("div", { className: "mt-1 relative rounded-md shadow-sm", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(User, { className: "h-5 w-5 text-gray-400" }) }), _jsx("input", { id: "email", name: "email", type: "email", autoComplete: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "pl-10 block w-full border-gray-300 rounded-xl focus:ring-black focus:border-black sm:text-sm py-3 transition-shadow", placeholder: "you@example.com" })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700", children: "Password" }), _jsxs("div", { className: "mt-1 relative rounded-md shadow-sm", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Lock, { className: "h-5 w-5 text-gray-400" }) }), _jsx("input", { id: "password", name: "password", type: "password", autoComplete: "current-password", required: true, value: password, onChange: (e) => setPassword(e.target.value), className: "pl-10 block w-full border-gray-300 rounded-xl focus:ring-black focus:border-black sm:text-sm py-3 transition-shadow", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" })] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("input", { id: "remember-me", name: "remember-me", type: "checkbox", className: "h-4 w-4 text-black focus:ring-black border-gray-300 rounded" }), _jsx("label", { htmlFor: "remember-me", className: "ml-2 block text-sm text-gray-900", children: "Remember me" })] }), _jsx("div", { className: "text-sm", children: _jsx("a", { href: "#", className: "font-medium text-black hover:text-gray-800", children: "Forgot your password?" }) })] }), _jsx("div", { children: _jsx(Button, { type: "submit", disabled: isLoading, className: "w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed h-auto", "aria-label": isLoading ? "Signing in" : "Sign in", children: isLoading ? (_jsx(Loader2, { className: "animate-spin h-5 w-5" })) : (_jsxs(_Fragment, { children: ["Sign in ", _jsx(ArrowRight, { className: "ml-2 h-4 w-4" })] })) }) })] }), _jsxs("div", { className: "mt-6", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-0 flex items-center", children: _jsx("div", { className: "w-full border-t border-gray-200" }) }), _jsx("div", { className: "relative flex justify-center text-sm", children: _jsx("span", { className: "px-2 bg-white text-gray-500", children: "Demo Credentials" }) })] }), _jsxs("div", { className: "mt-2 text-center text-xs text-gray-400", children: [_jsx("span", { className: "font-mono bg-gray-100 px-1 py-0.5 rounded", children: "demo@vayva.ng" }), " ", "/", " ", _jsx("span", { className: "font-mono bg-gray-100 px-1 py-0.5 rounded", children: "demo" })] })] })] }) })] }) }));
}
