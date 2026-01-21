export function formatCurrency(amount: number, currency: string = "NGN") {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency,
    }).format(amount);
}

export function formatDate(date: string | Date) {
    return new Intl.DateTimeFormat("en-NG", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(date));
}
