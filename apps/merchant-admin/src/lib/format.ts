export function formatCurrency(amount: any, currency = "NGN") {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency,
    }).format(amount);
}
export function formatDate(date: any) {
    return new Intl.DateTimeFormat("en-NG", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(date));
}
