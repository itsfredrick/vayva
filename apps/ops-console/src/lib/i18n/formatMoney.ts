export function formatMoney(
  amount: number,
  currency = "NGN",
  locale = "en-NG",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0, // No kobo/cents unless crucial, standard Vayva style
  }).format(amount);
}
