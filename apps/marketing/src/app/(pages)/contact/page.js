"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button, Icon } from "@vayva/ui";
import { motion } from "framer-motion";
import { Twitter, Linkedin, Instagram } from "lucide-react";
export default function ContactPage() {
    const [status, setStatus] = useState("idle");
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("submitting");
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (!res.ok)
                throw new Error("Failed to send message");
            setStatus("success");
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                subject: "",
                message: "",
            });
        }
        catch (error) {
            console.error(error);
            setStatus("error");
        }
    };
    return (_jsx("div", { className: "py-20 px-4", children: _jsxs("div", { className: "max-w-7xl mx-auto grid lg:grid-cols-2 gap-20", children: [_jsxs(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.6 }, children: [_jsx("h1", { className: "text-4xl md:text-5xl font-bold text-[#1d1d1f] mb-6", children: "Let's talk." }), _jsx("p", { className: "text-xl text-[#1d1d1f]/60 mb-12", children: "We're here to help you grow. Reach out to our team for support, sales, or partnerships." }), _jsxs("div", { className: "space-y-8", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-[#1d1d1f] mb-2", children: "Support" }), _jsx("p", { className: "text-[#1d1d1f]/60 mb-2", children: "Our support team is available 24/7 on WhatsApp and Email." }), _jsx("a", { href: "mailto:support@vayva.ng", className: "text-[#16a34a] font-bold hover:underline", children: "support@vayva.ng" })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-[#1d1d1f] mb-2", children: "Sales" }), _jsx("p", { className: "text-[#1d1d1f]/60 mb-2", children: "Ready to scale? Talk to our sales team about enterprise plans." }), _jsx("a", { href: "mailto:sales@vayva.ng", className: "text-[#16a34a] font-bold hover:underline", children: "sales@vayva.ng" })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-[#1d1d1f] mb-2", children: "Office" }), _jsxs("p", { className: "text-[#1d1d1f]/60", children: ["4 Balarabe Musa Crescent,", _jsx("br", {}), "Victoria Island, Lagos,", _jsx("br", {}), "Nigeria."] })] }), _jsxs("div", { className: "flex gap-4 pt-4", children: [_jsx("a", { href: "https://twitter.com/vayva_ng", target: "_blank", rel: "noreferrer", className: "w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[#1d1d1f]/60 hover:text-[#46EC13] hover:bg-[#1d1d1f] transition-all", children: _jsx(Twitter, { size: 20 }) }), _jsx("a", { href: "https://linkedin.com/company/vayva", target: "_blank", rel: "noreferrer", className: "w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[#1d1d1f]/60 hover:text-[#46EC13] hover:bg-[#1d1d1f] transition-all", children: _jsx(Linkedin, { size: 20 }) }), _jsx("a", { href: "https://instagram.com/vayva.ng", target: "_blank", rel: "noreferrer", className: "w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[#1d1d1f]/60 hover:text-[#46EC13] hover:bg-[#1d1d1f] transition-all", children: _jsx(Instagram, { size: 20 }) })] })] })] }), _jsx(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.6, delay: 0.2 }, className: "bg-white border border-gray-100 p-8 md:p-10 rounded-[2rem] shadow-xl", children: status === "success" ? (_jsxs("div", { className: "h-full flex flex-col items-center justify-center text-center py-20", children: [_jsx("div", { className: "w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6", children: _jsx(Icon, { name: "Check", size: 32, className: "text-[#22C55E]" }) }), _jsx("h3", { className: "text-2xl font-bold text-[#1d1d1f] mb-4", children: "Ticket Opened!" }), _jsx("p", { className: "text-gray-500 max-w-sm mx-auto mb-8", children: "Thank you for reaching out. A support ticket has been created and we've sent a confirmation to your email address." }), _jsx(Button, { onClick: () => setStatus("idle"), className: "bg-gray-100 text-gray-900 hover:bg-gray-200", children: "Send another message" })] })) : (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-bold text-[#1d1d1f]", children: "First Name" }), _jsx("input", { type: "text", name: "firstName", value: formData.firstName, onChange: handleChange, required: true, className: "w-full h-12 rounded-xl bg-gray-50 border border-gray-100 px-4 text-[#1d1d1f] focus:outline-none focus:border-[#46EC13] transition-colors", placeholder: "John" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-bold text-[#1d1d1f]", children: "Last Name" }), _jsx("input", { type: "text", name: "lastName", value: formData.lastName, onChange: handleChange, required: true, className: "w-full h-12 rounded-xl bg-gray-50 border border-gray-100 px-4 text-[#1d1d1f] focus:outline-none focus:border-[#46EC13] transition-colors", placeholder: "Doe" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-bold text-[#1d1d1f]", children: "Email Address" }), _jsx("input", { type: "email", name: "email", value: formData.email, onChange: handleChange, required: true, className: "w-full h-12 rounded-xl bg-gray-50 border border-gray-100 px-4 text-[#1d1d1f] focus:outline-none focus:border-[#46EC13] transition-colors", placeholder: "john@company.com" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-bold text-[#1d1d1f]", children: "Subject" }), _jsx("input", { type: "text", name: "subject", value: formData.subject, onChange: handleChange, required: true, className: "w-full h-12 rounded-xl bg-gray-50 border border-gray-100 px-4 text-[#1d1d1f] focus:outline-none focus:border-[#46EC13] transition-colors", placeholder: "How can we help?" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-bold text-[#1d1d1f]", children: "Message" }), _jsx("textarea", { name: "message", value: formData.message, onChange: handleChange, required: true, className: "w-full h-32 rounded-xl bg-gray-50 border border-gray-100 p-4 text-[#1d1d1f] focus:outline-none focus:border-[#46EC13] transition-colors resize-none", placeholder: "Tell us more about your inquiry..." })] }), _jsx(Button, { type: "submit", disabled: status === "submitting", className: "w-full h-12 bg-[#1d1d1f] hover:bg-[#1d1d1f]/90 text-white font-bold rounded-xl text-lg shadow-xl shadow-[#46EC13]/10 disabled:opacity-70 disabled:cursor-not-allowed", children: status === "submitting" ? "Sending..." : "Send Message" }), status === "error" && (_jsx("p", { className: "text-red-500 text-center text-sm font-bold", children: "Something went wrong. Please try again or email us directly." }))] })) })] }) }));
}
