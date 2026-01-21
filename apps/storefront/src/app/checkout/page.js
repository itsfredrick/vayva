"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button } from "@vayva/ui";
import { useStore } from "@/context/StoreContext";
import { StorefrontService } from "@/services/storefront.service";
import NextLink from "next/link";
const Link = NextLink;
import { ChevronRight as ChevronRightIcon, AlertCircle as AlertCircleIcon, } from "lucide-react";
const ChevronRight = ChevronRightIcon;
const AlertCircle = AlertCircleIcon;
import { useRouter } from "next/navigation";
export default function CheckoutPage() {
    const { store, cart, clearCart } = useStore();
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    // Form State
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [phone, setPhone] = useState("");
    const [deliveryMethod, setDeliveryMethod] = useState("DELIVERY");
    const [agreed, setAgreed] = useState(false);
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = deliveryMethod === "DELIVERY" ? 1500 : 0; // Flat rate for demo
    const total = subtotal + shipping;
    if (!store)
        return null;
    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (!agreed) {
            setError("You must agree to the Refund Policy & Privacy Policy to continue.");
            return;
        }
        setSubmitting(true);
        setError(null);
        try {
            // 1. Create Order
            const orderData = {
                storeId: store.id,
                items: cart.map((item) => ({
                    productId: item.productId,
                    variantId: item.variantId || "default",
                    quantity: item.quantity,
                    price: item.price,
                    title: item.productName,
                })),
                customer: {
                    email,
                    name: `${firstName} ${lastName}`,
                    phone,
                    address: `${address}, ${city}, ${state}`,
                    deliveryMethod,
                },
                shippingTotal: shipping,
                total: total,
            };
            const order = await StorefrontService.createOrder(orderData);
            // 2. Initialize Payment
            const payment = await StorefrontService.initializePayment({
                orderId: order.orderId, // Assert existence as createOrder succeeded
                email: email,
                callbackUrl: `${window.location.origin}/order/confirmation?store=${store.slug}&orderId=${order.orderId}`,
            });
            // 3. Clear Cart (or wait for confirmation?)
            // Usually we clear cart after successful payment redirect back,
            // but for simplicity in V1 we clear it now or on success page.
            // Let's clear on success page.
            // 4. Redirect to Paystack
            if (payment.data?.authorization_url) {
                window.location.href = payment.data.authorization_url;
            }
            else {
                throw new Error("Payment initialization failed: No URL returned");
            }
        }
        catch (err) {
            console.error("Checkout error:", err);
            setError(err.message || "An error occurred during checkout. Please try again.");
            setSubmitting(false);
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans", children: [_jsx("div", { className: "flex-1 bg-white p-8 md:p-12 lg:p-20 order-2 md:order-1", children: _jsxs("div", { className: "max-w-xl mx-auto", children: [_jsxs("div", { className: "mb-8", children: [_jsx(Link, { href: `/?store=${store.slug}`, className: "text-xl font-bold tracking-tight", children: store.name }), _jsxs("div", { className: "flex items-center gap-2 text-xs text-gray-500 mt-4", children: [_jsx(Link, { href: `/cart?store=${store.slug}`, children: "Cart" }), _jsx(ChevronRight, { size: 12 }), _jsx("span", { className: "text-black font-bold", children: "Information" }), _jsx(ChevronRight, { size: 12 }), _jsx("span", { children: "Payment" })] })] }), error && (_jsxs("div", { className: "mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3 text-red-600 text-sm", children: [_jsx(AlertCircle, { size: 18 }), error] })), _jsxs("form", { onSubmit: handlePlaceOrder, className: "space-y-8", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-lg font-bold mb-4", children: "Contact" }), _jsx("input", { id: "checkout-email", type: "email", placeholder: "Email", "aria-label": "Email address", value: email, onChange: (e) => setEmail(e.target.value), className: "w-full p-3 border border-gray-200 rounded-lg mb-2 focus:ring-1 focus:ring-black outline-none", required: true })] }), _jsxs("div", { children: [_jsx("h2", { className: "text-lg font-bold mb-4", children: "Delivery method" }), _jsxs("div", { className: "border border-gray-200 rounded-lg overflow-hidden", children: [_jsxs("div", { className: `p-4 flex justify-between items-center cursor-pointer border-b border-gray-100 ${deliveryMethod === "DELIVERY" ? "bg-gray-50" : ""}`, onClick: () => setDeliveryMethod("DELIVERY"), children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("input", { id: "delivery-method-ship", type: "radio", checked: deliveryMethod === "DELIVERY", onChange: () => setDeliveryMethod("DELIVERY"), className: "accent-black" }), _jsx("label", { htmlFor: "delivery-method-ship", className: "text-sm cursor-pointer", children: "Ship to my address" })] }), _jsx("span", { className: "text-sm font-bold", children: "\u20A61,500" })] }), _jsxs("div", { className: `p-4 flex justify-between items-center cursor-pointer ${deliveryMethod === "PICKUP" ? "bg-gray-50" : ""}`, onClick: () => setDeliveryMethod("PICKUP"), children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("input", { id: "delivery-method-pickup", type: "radio", checked: deliveryMethod === "PICKUP", onChange: () => setDeliveryMethod("PICKUP"), className: "accent-black" }), _jsx("label", { htmlFor: "delivery-method-pickup", className: "text-sm cursor-pointer", children: "Local pickup" })] }), _jsx("span", { className: "text-sm font-bold", children: "Free" })] })] })] }), deliveryMethod === "DELIVERY" && (_jsxs("div", { children: [_jsx("h2", { className: "text-lg font-bold mb-4", children: "Shipping address" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx("input", { id: "checkout-first-name", type: "text", placeholder: "First name", "aria-label": "First name", value: firstName, onChange: (e) => setFirstName(e.target.value), className: "w-full p-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-black outline-none", required: true }), _jsx("input", { id: "checkout-last-name", type: "text", placeholder: "Last name", "aria-label": "Last name", value: lastName, onChange: (e) => setLastName(e.target.value), className: "w-full p-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-black outline-none", required: true })] }), _jsx("input", { id: "checkout-address", type: "text", placeholder: "Address", "aria-label": "Shipping address", value: address, onChange: (e) => setAddress(e.target.value), className: "w-full p-3 border border-gray-200 rounded-lg mt-4 focus:ring-1 focus:ring-black outline-none", required: true }), _jsxs("div", { className: "grid grid-cols-2 gap-4 mt-4", children: [_jsx("input", { id: "checkout-city", type: "text", placeholder: "City", "aria-label": "City", value: city, onChange: (e) => setCity(e.target.value), className: "w-full p-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-black outline-none", required: true }), _jsx("input", { id: "checkout-state", type: "text", placeholder: "State", "aria-label": "State", value: state, onChange: (e) => setState(e.target.value), className: "w-full p-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-black outline-none", required: true })] }), _jsx("input", { id: "checkout-phone", type: "tel", placeholder: "Phone (e.g. 08031234567)", "aria-label": "Phone number", value: phone, onChange: (e) => setPhone(e.target.value), className: "w-full p-3 border border-gray-200 rounded-lg mt-4 focus:ring-1 focus:ring-black outline-none", required: true })] })), _jsxs("div", { className: "pt-6 border-t border-gray-100", children: [_jsxs("div", { className: "flex items-start gap-2 mb-4", children: [_jsx("input", { type: "checkbox", id: "agreed", checked: agreed, onChange: (e) => setAgreed(e.target.checked), className: "mt-1 w-4 h-4 rounded border-gray-300 text-black focus:ring-black accent-black" }), _jsxs("label", { htmlFor: "agreed", className: "text-sm text-gray-500 cursor-pointer select-none", children: ["I agree to the ", _jsx(Link, { href: `/policies/refund-policy?store=${store.slug}`, target: "_blank", className: "underline text-gray-800", children: "Refund Policy" }), " and ", _jsx(Link, { href: `/policies/privacy-policy?store=${store.slug}`, target: "_blank", className: "underline text-gray-800", children: "Privacy Policy" }), "."] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx(Link, { href: `/cart?store=${store.slug}`, className: "text-sm text-gray-500 hover:text-black", children: "Return to cart" }), _jsx(Button, { type: "submit", disabled: submitting || cart.length === 0 || !agreed, className: "bg-black text-white px-10 py-5 rounded-lg font-bold text-sm hover:bg-gray-900 transition-all disabled:opacity-50 shadow-lg shadow-black/10", children: submitting
                                                        ? "Preparing your order..."
                                                        : "Pay Now with Paystack" })] })] })] })] }) }), _jsx("div", { className: "w-full md:w-[450px] bg-gray-50 border-l border-gray-200 p-8 md:p-12 order-1 md:order-2", children: _jsxs("div", { className: "max-w-md mx-auto sticky top-12", children: [_jsx("div", { className: "space-y-4 mb-8", children: cart.map((item, idx) => (_jsxs("div", { className: "flex gap-4", children: [_jsxs("div", { className: "w-16 h-16 bg-white border border-gray-200 rounded-lg relative overflow-hidden", children: [item.image && (_jsx("img", { src: item.image, alt: item.productName, className: "w-full h-full object-cover" })), _jsx("span", { className: "absolute -top-2 -right-2 w-5 h-5 bg-gray-500 text-white text-xs flex items-center justify-center rounded-full font-bold", children: item.quantity })] }), _jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "font-bold text-sm truncate max-w-[150px]", children: item.productName }), _jsxs("p", { className: "text-xs text-gray-400", children: ["Qty: ", item.quantity] })] }), _jsxs("span", { className: "font-bold text-sm", children: ["\u20A6", item.price.toLocaleString()] })] }, idx))) }), _jsxs("div", { className: "space-y-2 py-6 border-t border-gray-200 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-500", children: "Subtotal" }), _jsxs("span", { className: "font-medium", children: ["\u20A6", subtotal.toLocaleString()] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-500", children: "Shipping" }), _jsxs("span", { className: "font-medium", children: ["\u20A6", shipping.toLocaleString()] })] })] }), _jsxs("div", { className: "flex justify-between pt-6 border-t border-gray-200", children: [_jsx("span", { className: "text-lg font-bold", children: "Total" }), _jsxs("div", { className: "text-right", children: [_jsx("span", { className: "text-xs text-gray-400 mr-2 uppercase tracking-widest", children: "NGN" }), _jsxs("span", { className: "text-2xl font-bold", children: ["\u20A6", total.toLocaleString()] })] })] })] }) })] }));
}
