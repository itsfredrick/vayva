"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Button } from "@vayva/ui";
import Link from "next/link";
import { format } from "date-fns";
const legalDocuments = [
    { title: "Legal Hub", href: "/legal" },
    { title: "Terms of Service", href: "/legal/terms" },
    { title: "Privacy Policy", href: "/legal/privacy" },
    { title: "Acceptable Use Policy", href: "/legal/acceptable-use" },
    { title: "Prohibited Items", href: "/legal/prohibited-items" },
    { title: "Refund Policy", href: "/legal/refund-policy" },
    { title: "KYC & Compliance", href: "/legal/kyc-safety" },
    { title: "Manage Cookies", href: "/legal/cookies", active: true },
];
export default function ManageCookiesPage() {
    const [essentialEnabled] = useState(true); // Always enabled
    const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
    const [marketingEnabled, setMarketingEnabled] = useState(false);
    const [status, setStatus] = useState("idle");
    const [errorMsg, setErrorMsg] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [updatedAt, setUpdatedAt] = useState(null);
    // Load initial state from API (which reads cookie)
    useEffect(() => {
        async function loadConsent() {
            try {
                const res = await fetch("/api/consent/cookies");
                if (res.ok) {
                    const data = await res.json();
                    setAnalyticsEnabled(!!data.analytics);
                    setMarketingEnabled(!!data.marketing);
                    if (data.updatedAt)
                        setUpdatedAt(data.updatedAt);
                }
            }
            catch (_error) {
                // Silent fail on load, default strict
            }
            finally {
                setIsLoading(false);
            }
        }
        loadConsent();
    }, []);
    const handleSave = async () => {
        setStatus("saving");
        setErrorMsg("");
        try {
            const res = await fetch("/api/consent/cookies", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    analytics: analyticsEnabled,
                    marketing: marketingEnabled,
                    essential: true,
                }),
            });
            if (res.ok) {
                const data = await res.json();
                setStatus("success");
                if (data.updatedAt)
                    setUpdatedAt(data.updatedAt);
                setTimeout(() => setStatus("idle"), 3000);
            }
            else {
                const err = await res.json().catch(() => ({}));
                setStatus("error");
                setErrorMsg(err.message || "Failed to save preferences");
            }
        }
        catch (error) {
            setStatus("error");
            setErrorMsg("Network error occurred");
        }
    };
    if (isLoading) {
        return (_jsx("div", { className: "min-h-screen bg-white flex items-center justify-center", children: "Loading preferences..." }));
    }
    return (_jsx("div", { className: "min-h-screen bg-white", children: _jsx("div", { className: "max-w-7xl mx-auto px-6 py-16", children: _jsxs("div", { className: "flex gap-12", children: [_jsx("aside", { className: "w-64 flex-shrink-0 hidden md:block", children: _jsxs("nav", { className: "sticky top-24", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900 mb-4", children: "Legal Documents" }), _jsx("ul", { className: "space-y-2", children: legalDocuments.map((doc) => (_jsx("li", { children: _jsx(Link, { href: doc.href, className: `block px-3 py-2 text-sm rounded ${doc.active
                                                ? "bg-gray-100 text-gray-900 font-medium"
                                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`, children: doc.title }) }, doc.href))) })] }) }), _jsxs("main", { className: "flex-1 max-w-3xl", children: [_jsx("h1", { className: "text-4xl font-bold text-gray-900 mb-4", children: "Manage Cookies" }), _jsxs("div", { className: "mb-8 text-sm text-gray-600", children: [_jsxs("p", { children: [_jsx("strong", { children: "Last Updated:" }), " ", updatedAt
                                                ? format(new Date(updatedAt), "MMMM d, yyyy")
                                                : "Never"] }), _jsxs("p", { children: [_jsx("strong", { children: "Jurisdiction:" }), " Federal Republic of Nigeria"] }), _jsxs("p", { children: [_jsx("strong", { children: "Governing Entity:" }), " Vayva Tech (operating in Nigeria)"] })] }), _jsxs("div", { className: "prose prose-gray mb-12", children: [_jsx("h2", { children: "What Are Cookies?" }), _jsx("p", { children: "Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences, improve functionality, and analyze usage patterns." }), _jsx("h2", { children: "How Vayva Uses Cookies" }), _jsx("p", { children: "We use cookies to provide and improve the Vayva platform. Cookies help us understand how you use the Service, remember your settings, and keep your account secure." })] }), _jsxs("div", { className: "space-y-6 mb-12", children: [_jsx("div", { className: "border border-gray-200 rounded-lg p-6", children: _jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "Essential Cookies" }), _jsx("p", { className: "text-sm text-gray-700 mb-4", children: "These cookies are necessary for the Service to function. They enable core features like account authentication, security, and session management. These cookies cannot be disabled." })] }), _jsx("div", { className: "ml-4", children: _jsxs("div", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", title: "Essential Cookies", placeholder: "Essential Cookies", checked: essentialEnabled, disabled: true, className: "w-5 h-5 text-gray-400 border-gray-300 rounded cursor-not-allowed" }), _jsx("span", { className: "ml-2 text-sm text-gray-500", children: "Always Active" })] }) })] }) }), _jsx("div", { className: "border border-gray-200 rounded-lg p-6", children: _jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "Analytics Cookies" }), _jsx("p", { className: "text-sm text-gray-700 mb-4", children: "These cookies help us understand how you use the Service. They collect information about pages visited, features used, and errors encountered. This data is used to improve the Service." })] }), _jsx("div", { className: "ml-4", children: _jsxs("div", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", title: "Analytics Cookies", placeholder: "Analytics Cookies", checked: analyticsEnabled, onChange: (e) => setAnalyticsEnabled(e.target.checked), className: "w-5 h-5 text-[#22C55E] border-gray-300 rounded focus:ring-[#22C55E]" }), _jsx("span", { className: "ml-2 text-sm text-gray-700", children: analyticsEnabled ? "Enabled" : "Disabled" })] }) })] }) }), _jsx("div", { className: "border border-gray-200 rounded-lg p-6", children: _jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "Marketing Cookies" }), _jsx("p", { className: "text-sm text-gray-700 mb-4", children: "These cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user." })] }), _jsx("div", { className: "ml-4", children: _jsxs("div", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", title: "Marketing Cookies", placeholder: "Marketing Cookies", checked: marketingEnabled, onChange: (e) => setMarketingEnabled(e.target.checked), className: "w-5 h-5 text-[#22C55E] border-gray-300 rounded focus:ring-[#22C55E]" }), _jsx("span", { className: "ml-2 text-sm text-gray-700", children: marketingEnabled ? "Enabled" : "Disabled" })] }) })] }) })] }), _jsxs("div", { className: "flex items-center gap-4 mb-12", children: [_jsx(Button, { onClick: handleSave, disabled: status === "saving", className: `px-6 py-3 font-semibold rounded transition-colors ${status === "saving"
                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            : "bg-[#22C55E] hover:bg-[#16A34A] text-white"}`, children: status === "saving" ? "Saving..." : "Save Preferences" }), status === "success" && (_jsxs("span", { className: "text-sm text-[#22C55E] flex items-center", children: [_jsx("svg", { className: "w-4 h-4 mr-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }), "Saved successfully"] })), status === "error" && (_jsxs("span", { className: "text-sm text-red-600 flex items-center", children: [_jsx("svg", { className: "w-4 h-4 mr-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }), errorMsg] }))] }), _jsxs("div", { className: "prose prose-gray", children: [_jsx("h2", { children: "Managing Cookies in Your Browser" }), _jsx("p", { children: "You can also control cookies through your browser settings. Most browsers allow you to:" }), _jsxs("ul", { children: [_jsx("li", { children: "View and delete existing cookies" }), _jsx("li", { children: "Block all cookies" }), _jsx("li", { children: "Block third-party cookies" }), _jsx("li", { children: "Clear cookies when you close your browser" })] }), _jsxs("p", { children: [_jsx("strong", { children: "Note:" }), " Blocking essential cookies will prevent you from using the Vayva platform."] }), _jsx("h2", { children: "Third-Party Cookies" }), _jsx("p", { children: "Vayva does not use third-party advertising cookies. We may use third-party analytics services (e.g., Google Analytics) to understand Service usage. These services are bound by their own privacy policies." }), _jsx("h2", { children: "Cookie Retention" }), _jsx("p", { children: "Cookies are retained for the following periods:" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("strong", { children: "Session Cookies:" }), " Deleted when you close your browser"] }), _jsxs("li", { children: [_jsx("strong", { children: "Authentication Cookies:" }), " 30 days or until you log out"] }), _jsxs("li", { children: [_jsx("strong", { children: "Analytics Cookies:" }), " 12 months"] })] }), _jsx("h2", { children: "Changes to Cookie Usage" }), _jsx("p", { children: "We may update our use of cookies from time to time. We will notify you of material changes through the Service or by email." }), _jsx("h2", { children: "Contact Information" }), _jsx("p", { children: "For questions about cookies or this page, please contact:" }), _jsxs("p", { children: [_jsx("strong", { children: "Vayva Tech" }), _jsx("br", {}), "Email: privacy@vayva.ng", _jsx("br", {}), "Support: support@vayva.ng"] })] }), _jsx("div", { className: "mt-12 pt-8 border-t border-gray-200", children: _jsxs("p", { className: "text-sm text-gray-600", children: ["This Cookie Management page is part of Vayva's", " ", _jsx(Link, { href: "/legal/privacy", className: "text-[#22C55E] hover:underline", children: "Privacy Policy" }), " ", "and is governed by Nigerian law."] }) })] })] }) }) }));
}
