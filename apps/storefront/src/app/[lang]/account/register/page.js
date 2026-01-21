"use client";
import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { StoreShell } from "@/components/StoreShell";
import { Button } from "@vayva/ui";
import { Lock, ArrowRight, Loader2, Mail, PenTool } from "lucide-react";
import Link from "next/link";
export default function RegisterPage() {
    const { store } = useStore();
    const router = useRouter();
    const params = useParams();
    const lang = params.lang || "en";
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    storeId: store?.id,
                    email: form.email,
                    password: form.password,
                    firstName: form.firstName,
                    lastName: form.lastName,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Registration failed");
            }
            // API sets httpOnly cookie.
            localStorage.setItem("vayva_user", JSON.stringify(data.customer || {
                email: form.email,
                name: `${form.firstName} ${form.lastName}`,
            }));
            router.push(`/${lang}/account`);
        }
        catch (e) {
            setError(e.message);
        }
        finally {
            setIsLoading(false);
        }
    };
    if (!store)
        return null;
    return (_jsx(StoreShell, { children: _jsxs("div", { className: "min-h-[calc(100vh-200px)] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-noise bg-gray-50", children: [_jsxs("div", { className: "sm:mx-auto sm:w-full sm:max-w-md", children: [_jsxs("h2", { className: "mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight", children: ["Join ", store.name] }), _jsxs("p", { className: "mt-2 text-center text-sm text-gray-600", children: ["Already have an account?", " ", _jsx(Link, { href: `/${lang}/account/login`, className: "font-medium text-black hover:text-gray-800 underline transition-colors", children: "Log in" })] })] }), _jsx("div", { className: "mt-8 sm:mx-auto sm:w-full sm:max-w-md", children: _jsxs("div", { className: "glass-panel py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 relative overflow-hidden", children: [_jsx("div", { className: "absolute -top-10 -left-10 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl pointer-events-none" }), _jsxs("form", { className: "space-y-6 relative z-10", onSubmit: handleRegister, children: [error && (_jsxs("div", { className: "bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2 animate-shake", children: [_jsx("span", { children: "\u26A0\uFE0F" }), " ", error] })), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "reg-first-name", className: "block text-sm font-medium text-gray-700", children: "First Name" }), _jsxs("div", { className: "mt-1 relative rounded-md shadow-sm", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(PenTool, { className: "h-5 w-5 text-gray-400" }) }), _jsx("input", { id: "reg-first-name", type: "text", required: true, value: form.firstName, onChange: (e) => setForm({ ...form, firstName: e.target.value }), className: "pl-10 block w-full border-gray-300 rounded-xl focus:ring-black focus:border-black sm:text-sm py-3", placeholder: "Jane" })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "reg-last-name", className: "block text-sm font-medium text-gray-700", children: "Last Name" }), _jsx("div", { className: "mt-1 relative rounded-md shadow-sm", children: _jsx("input", { id: "reg-last-name", type: "text", required: true, value: form.lastName, onChange: (e) => setForm({ ...form, lastName: e.target.value }), className: "block w-full border-gray-300 rounded-xl focus:ring-black focus:border-black sm:text-sm py-3 px-4", placeholder: "Doe" }) })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "reg-email", className: "block text-sm font-medium text-gray-700", children: "Email address" }), _jsxs("div", { className: "mt-1 relative rounded-md shadow-sm", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Mail, { className: "h-5 w-5 text-gray-400" }) }), _jsx("input", { id: "reg-email", type: "email", required: true, value: form.email, onChange: (e) => setForm({ ...form, email: e.target.value }), className: "pl-10 block w-full border-gray-300 rounded-xl focus:ring-black focus:border-black sm:text-sm py-3", placeholder: "you@example.com" })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "reg-password", className: "block text-sm font-medium text-gray-700", children: "Password" }), _jsxs("div", { className: "mt-1 relative rounded-md shadow-sm", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Lock, { className: "h-5 w-5 text-gray-400" }) }), _jsx("input", { id: "reg-password", type: "password", required: true, value: form.password, onChange: (e) => setForm({ ...form, password: e.target.value }), className: "pl-10 block w-full border-gray-300 rounded-xl focus:ring-black focus:border-black sm:text-sm py-3", placeholder: "Min 6 characters" })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "reg-confirm-password", className: "block text-sm font-medium text-gray-700", children: "Confirm Password" }), _jsxs("div", { className: "mt-1 relative rounded-md shadow-sm", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Lock, { className: "h-5 w-5 text-gray-400" }) }), _jsx("input", { id: "reg-confirm-password", type: "password", required: true, value: form.confirmPassword, onChange: (e) => setForm({ ...form, confirmPassword: e.target.value }), className: "pl-10 block w-full border-gray-300 rounded-xl focus:ring-black focus:border-black sm:text-sm py-3", placeholder: "Repeat password" })] })] }), _jsx("div", { children: _jsx(Button, { type: "submit", disabled: isLoading, className: "w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed h-auto", "aria-label": isLoading ? "Creating account" : "Create account", children: isLoading ? (_jsx(Loader2, { className: "animate-spin h-5 w-5" })) : (_jsxs(_Fragment, { children: ["Create Account ", _jsx(ArrowRight, { className: "ml-2 h-4 w-4" })] })) }) })] })] }) })] }) }));
}
