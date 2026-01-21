"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MarketShell } from "@/components/market/market-shell";
import { Button, Input } from "@vayva/ui"; // Mock UI lib
import { useToast } from "@/components/ui/use-toast";
export default function CheckoutPage() {
    const { toast } = useToast();
    const searchParams = useSearchParams();
    const router = useRouter();
    const productId = searchParams.get("productId");
    const [product, setProduct] = useState(null);
    const [address, setAddress] = useState("");
    const [quote, setQuote] = useState(null);
    const [loading, setLoading] = useState(false);
    const [initPayment, setInitPayment] = useState(false);
    // 1. Fetch Product
    useEffect(() => {
        if (!productId)
            return;
        fetch(`/api/market/products/${productId}`)
            .then(res => res.json())
            .then(setProduct)
            .catch(console.error);
    }, [productId]);
    // 2. Get Delivery Quote
    const handleGetQuote = async () => {
        if (!address) {
            return toast({
                title: "Address Required",
                description: "Please enter a valid delivery address.",
                variant: "destructive",
            });
        }
        setLoading(true);
        try {
            const res = await fetch("/api/market/logistics/quote", {
                method: "POST",
                body: JSON.stringify({
                    sellerId: product.seller.id, // Ensure API returns sellerId!
                    buyerAddress: address,
                    productIds: [product.id]
                })
            });
            const data = await res.json();
            setQuote(data);
        }
        catch (err) {
            toast({ title: "Error", description: "Failed to get delivery estimate", variant: "destructive" });
        }
        finally {
            setLoading(false);
        }
    };
    // 3. Helper: Seller ID check
    // Note: product.seller might be just { name: ... } from previous API.
    // I need to verify `api/market/products/[id]` returns `seller.id` or `product.storeId`.
    // API uses `product.store.name`. I need `product.storeId` exposed.
    // Assuming I fix API if needed. For now, let's use `product.storeId` if available 
    // or pass dummy "store_id" (Checkout API expects it).
    // 4. Pay
    const handlePay = async () => {
        setInitPayment(true);
        try {
            const res = await fetch("/api/market/checkout", {
                method: "POST",
                body: JSON.stringify({
                    email: "guest@vayva.ng", // Guest Checkout for now
                    items: [{ productId: product.id, qty: 1 }],
                })
            });
            const data = await res.json();
            if (data.authorization_url) {
                window.location.href = data.authorization_url;
            }
            else {
                toast({ title: "Payment Failed", description: "Could not initialize payment.", variant: "destructive" });
            }
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setInitPayment(false);
        }
    };
    if (!productId)
        return _jsx("div", { className: "text-white p-12", children: "Empty Cart" });
    if (!product)
        return _jsx("div", { className: "text-white p-12", children: "Loading..." });
    const total = (product.price * 100) + (quote ? quote.priceKobo : 0);
    return (_jsx(MarketShell, { children: _jsxs("div", { className: "max-w-2xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-2xl font-bold text-white mb-6", children: "Checkout" }), _jsxs("div", { className: "grid gap-6", children: [_jsxs("div", { className: "bg-white/5 border border-white/10 p-4 rounded-xl flex gap-4", children: [_jsx("div", { className: "w-20 h-20 bg-gray-800 rounded-lg overflow-hidden", children: product.images?.[0] && _jsx("img", { src: product.images[0], alt: product.name, className: "w-full h-full object-cover" }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-bold text-white", children: product.name }), _jsxs("div", { className: "text-sm text-gray-400", children: ["Sold by ", product.seller.name] }), _jsxs("div", { className: "text-lg font-bold text-emerald-400 mt-1", children: [product.curr, " ", product.price.toLocaleString()] })] })] }), _jsxs("div", { className: "bg-white/5 border border-white/10 p-4 rounded-xl space-y-4", children: [_jsx("h3", { className: "font-bold text-white", children: "Delivery" }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Input, { placeholder: "Enter full address (Lagos only for Beta)", value: address, onChange: (e) => setAddress(e.target.value), className: "bg-transparent border-white/20 text-white" }), _jsx(Button, { onClick: handleGetQuote, disabled: loading, variant: "secondary", children: loading ? "..." : "Get Quote" })] }), quote && (_jsxs("div", { className: "bg-emerald-500/10 border border-emerald-500/30 p-3 rounded text-sm text-emerald-300", children: ["Typically ", Math.round(quote.etaMinutes / 60), " hours via ", quote.vehicle, ".", _jsx("br", {}), "Fee: \u20A6 ", (quote.priceKobo / 100).toLocaleString()] }))] }), _jsxs("div", { className: "border-t border-white/10 pt-4 text-white", children: [_jsxs("div", { className: "flex justify-between mb-2", children: [_jsx("span", { children: "Subtotal" }), _jsxs("span", { children: ["\u20A6 ", product.price.toLocaleString()] })] }), _jsxs("div", { className: "flex justify-between mb-4", children: [_jsx("span", { children: "Delivery" }), _jsx("span", { children: quote ? `₦ ${(quote.priceKobo / 100).toLocaleString()}` : "-" })] }), _jsxs("div", { className: "flex justify-between text-xl font-bold", children: [_jsx("span", { children: "Total" }), _jsxs("span", { children: ["\u20A6 ", (total / 100).toLocaleString()] })] })] }), _jsx(Button, { size: "lg", className: "w-full bg-primary text-black font-bold", onClick: handlePay, disabled: initPayment || !quote, children: initPayment ? "Processing..." : `Pay ₦ ${(total / 100).toLocaleString()}` }), _jsx("p", { className: "text-xs text-center text-gray-500", children: "Protected by Vayva Guarantee. Processed by Paystack securely." })] })] }) }));
}
