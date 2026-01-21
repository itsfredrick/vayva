"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Logo } from "@/components/Logo";
import { AuthLeftPanel } from "./AuthLeftPanel";
import { AuthRightPanel } from "./AuthRightPanel";
export const SplitAuthLayout = ({ children, stepIndicator, title, subtitle, showSignInLink, showSignUpLink, }) => {
    return (_jsxs("div", { className: "min-h-screen flex flex-col lg:flex-row", children: [_jsx(AuthLeftPanel, { showSignInLink: showSignInLink, showSignUpLink: showSignUpLink }), _jsx("div", { className: "lg:hidden bg-[#F8F9FA] p-6 border-b border-gray-200", children: _jsx(Logo, { size: "md", showText: true }) }), _jsx(AuthRightPanel, { stepIndicator: stepIndicator, title: title, subtitle: subtitle, children: children })] }));
};
