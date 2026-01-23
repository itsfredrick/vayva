export function formatCurrency(amount: unknown, currency = "NGN") {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency,
    }).format(amount);
}
export function formatDate(date: unknown) {
    return new Intl.DateTimeFormat("en-NG", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(date));
}
