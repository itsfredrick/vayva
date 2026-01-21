import { jsx as _jsx } from "react/jsx-runtime";
import PaystackTestClient from "./PaystackTestClient";
export const metadata = {
    title: "Paystack Test | Vayva",
    robots: {
        index: false,
        follow: false,
    },
};
export default function PaystackTestPage() {
    return (_jsx("div", { children: _jsx(PaystackTestClient, {}) }));
}
