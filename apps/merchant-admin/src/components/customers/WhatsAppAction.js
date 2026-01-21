import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, Icon } from "@vayva/ui";
export const WhatsAppAction = ({ phone, name, message = "", variant = "primary", size = "md", label = "Message", className = "", // Deconstruct className
 }) => {
    const handleClick = (e) => {
        e.stopPropagation();
        // Clean phone number (strip spaces, ensure international format)
        // Test logic for Nigerian numbers
        let cleanPhone = phone.replace(/\s+/g, "").replace("+", "");
        if (cleanPhone.startsWith("0"))
            cleanPhone = "234" + cleanPhone.substring(1);
        const text = encodeURIComponent(message || `Hi ${name || "there"}, regarding your order...`);
        const url = `https://wa.me/${cleanPhone}?text=${text}`;
        window.open(url, "_blank");
    };
    if (variant === "icon") {
        return (_jsx(Button, { variant: "ghost", onClick: handleClick, className: `w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors ${className} p-0`, title: `Message ${name || "Customer"}`, children: _jsx(Icon, { name: "MessageCircle", size: 16 }) }));
    }
    return (_jsxs(Button, { variant: variant === "primary"
            ? "primary"
            : variant === "outline"
                ? "outline"
                : "ghost", size: size === "md" ? "default" : size, onClick: handleClick, className: `gap-2 ${variant === "primary" ? "bg-[#25D366] hover:bg-[#128C7E] text-white border-none" : "text-green-700 hover:text-green-800 hover:bg-green-50"} ${className}`, children: [_jsx(Icon, { name: "MessageCircle", size: size === "sm" ? 14 : 16 }), label] }));
};
