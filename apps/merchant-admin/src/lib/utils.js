import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
export const fetcher = (url) => fetch(url).then((res) => res.json());
export function formatCurrency(amount, currency = "NGN") {
    const value = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: currency,
    }).format(value);
}
