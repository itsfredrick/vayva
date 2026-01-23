export function formatMoney(amount: unknown, currency = "NGN", locale = "en-NG") {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0, // No kobo/cents unless crucial, standard Vayva style
    }).format(amount);
}
