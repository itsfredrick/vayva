import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from 'next/link';
import { Button } from '@vayva/ui';
export default function NotFound() {
    return (_jsxs("div", { className: "min-h-screen flex flex-col items-center justify-center bg-gray-50", children: [_jsx("h2", { className: "text-4xl font-bold text-gray-900 mb-4", children: "Page Not Found" }), _jsx("p", { className: "text-gray-600 mb-8", children: "Could not find requested resource" }), _jsx(Link, { href: "/", children: _jsx(Button, { children: "Return Home" }) })] }));
}
