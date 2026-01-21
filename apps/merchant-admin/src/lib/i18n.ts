
import { format as dateFnsFormat, formatInTimeZone } from "date-fns-tz";
import { zhCN, enUS, fr, enGB } from "date-fns/locale";

// Defaults
const DEFAULT_LOCALE = "en-NG";
const DEFAULT_CURRENCY = "NGN";
const DEFAULT_TIMEZONE = "Africa/Lagos";

/**
 * Format a number as currency
 * @param amount Number to format
 * @param currency ISO 4217 Currency Code
 * @param locale Locale string
 */
export function formatCurrency(
    amount: number,
    currency: string = DEFAULT_CURRENCY,
    locale: string = DEFAULT_LOCALE
): string {
    try {
        return new Intl.NumberFormat(locale, {
            style: "currency",
            currency: currency,
        }).format(amount);
    } catch (error) {
        // Fallback if currency/locale is invalid
        return new Intl.NumberFormat(DEFAULT_LOCALE, {
            style: "currency",
            currency: DEFAULT_CURRENCY,
        }).format(amount);
    }
}

/**
 * Format a date with timezone awareness
 * @param date Date object or string
 * @param formatStr Format string (date-fns)
 * @param timezone IANA Timezone string
 */
export function formatDateTime(
    date: Date | string | number,
    formatStr: string = "PPP p",
    timezone: string = DEFAULT_TIMEZONE
): string {
    try {
        const d = new Date(date);
        return formatInTimeZone(d, timezone, formatStr);
    } catch (error) {
        return date.toString();
    }
}

/**
 * Get readable timezone name
 */
export function getTimezoneName(timezone: string): string {
    return timezone.replace(/_/g, " ");
}
