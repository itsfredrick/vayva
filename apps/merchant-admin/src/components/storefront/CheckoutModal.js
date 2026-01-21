import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Button } from "@vayva/ui";
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
export function CheckoutModal({ isOpen, onClose, cart, total, storeSlug, onSuccess, requireAddress = true, submitFn, }) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (submitFn) {
                await submitFn({
                    customer: formData,
                    items: cart,
                    total
                });
                toast.success("Processed successfully!");
                onSuccess(formData);
                onClose();
            }
            else {
                const res = await fetch(`/api/storefront/${storeSlug}/checkout`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        customer: formData,
                        items: cart,
                        total,
                    }),
                });
                const data = await res.json();
                if (!res.ok)
                    throw new Error(data.error || "Checkout failed");
                if (data.authorization_url) {
                    toast.loading("Redirecting to secure payment...", { duration: 4000 });
                    setTimeout(() => {
                        window.location.href = data.authorization_url;
                    }, 1000);
                }
                else {
                    toast.success("Order placed successfully!");
                    onSuccess(formData);
                    onClose();
                }
            }
        }
        catch (error) {
            console.error(error);
            toast.error(error.message || "Failed to process order");
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsx(Dialog, { open: isOpen, onOpenChange: onClose, children: _jsxs(DialogContent, { className: "sm:max-w-lg", children: [_jsx(DialogHeader, { children: _jsxs(DialogTitle, { children: ["Checkout (\u20A6", total.toLocaleString(), ")"] }) }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 py-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Contact Info" }), _jsx("input", { required: true, type: "text", placeholder: "Full Name", className: "w-full p-2 border rounded-md", value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }) }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsx("input", { required: true, type: "email", placeholder: "Email", className: "w-full p-2 border rounded-md", value: formData.email, onChange: (e) => setFormData({ ...formData, email: e.target.value }) }), _jsx("input", { required: true, type: "tel", placeholder: "Phone", className: "w-full p-2 border rounded-md", value: formData.phone, onChange: (e) => setFormData({ ...formData, phone: e.target.value }) })] })] }), requireAddress && (_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Delivery Address" }), _jsx("input", { required: true, type: "text", placeholder: "Address Line", className: "w-full p-2 border rounded-md", value: formData.address, onChange: (e) => setFormData({ ...formData, address: e.target.value }) }), _jsx("input", { required: true, type: "text", placeholder: "City", className: "w-full p-2 border rounded-md", value: formData.city, onChange: (e) => setFormData({ ...formData, city: e.target.value }) })] })), _jsxs("div", { className: "pt-4 border-t border-gray-100", children: [_jsxs("div", { className: "flex justify-between mb-4 text-sm", children: [_jsx("span", { className: "text-gray-500", children: "Subtotal" }), _jsxs("span", { children: ["\u20A6", total.toLocaleString()] })] }), _jsxs(Button, { type: "submit", disabled: isLoading, className: "w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2", children: [isLoading ? _jsx(Loader2, { className: "animate-spin w-4 h-4" }) : null, "Pay \u20A6", total.toLocaleString()] })] })] })] }) }));
}
