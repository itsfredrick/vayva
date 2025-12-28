/**
 * TEMPLATE KEYWORD MAPS (ANTI-CANNIBALIZATION)
 * Each template must have a distinct primary keyword.
 */

export interface KeywordStrategy {
    primary: string;
    secondary: string[];
    longTail: string[];
    modifiers: string[];
    competitorCapture: string[];
    negatives: string[];
}

export const TEMPLATE_KEYWORD_MAPS: Record<string, KeywordStrategy> = {
    'scheduling': {
        primary: 'appointment booking software',
        secondary: ['scheduling website', 'online booking system', 'service business booking', 'client booking app'],
        longTail: [
            'appointment booking website Nigeria',
            'service business scheduling with payments',
            'barber salon booking site with deposits',
            'spa appointment booking with reminders',
            'WhatsApp booking confirmation for services'
        ],
        modifiers: ['Nigeria', 'Lagos', 'NGN', 'Paystack', 'deposits', 'reminders', 'WhatsApp'],
        competitorCapture: ['Shopify booking alternative', 'Wix booking alternative', 'Squarespace scheduling alternative'],
        negatives: ['food ordering', 'ticketing', 'digital downloads']
    },
    'food-service': {
        primary: 'online food ordering system',
        secondary: ['restaurant ordering website', 'food delivery ordering', 'menu ordering', 'QR menu ordering'],
        longTail: [
            'restaurant online ordering Nigeria',
            'food ordering site with Paystack',
            'takeaway ordering website Lagos',
            'WhatsApp order confirmation + delivery dispatch',
            'QR code menu ordering for restaurants'
        ],
        modifiers: ['Nigeria', 'Lagos', 'NGN', 'Paystack', 'delivery', 'menu', 'WhatsApp'],
        competitorCapture: ['Shopify restaurant ordering alternative', 'Wix restaurant alternative'],
        negatives: ['appointment booking', 'event tickets', 'digital products']
    },
    'digital-products': {
        primary: 'sell digital products online',
        secondary: ['digital downloads store', 'automated file delivery', 'license key delivery', 'secure downloads'],
        longTail: [
            'sell ebooks in Nigeria with Paystack',
            'automated course files delivery after payment',
            'sell templates online with instant download',
            'protect downloads with expiring links'
        ],
        modifiers: ['Nigeria', 'NGN', 'Paystack', 'instant delivery', 'watermarking', 'expiring links'],
        competitorCapture: ['Shopify digital downloads alternative', 'Gumroad alternative Nigeria'],
        negatives: ['event tickets', 'restaurant ordering']
    },
    'event-ticketing': {
        primary: 'event ticketing platform',
        secondary: ['sell event tickets online', 'guest list management', 'QR ticket scanning', 'RSVP system'],
        longTail: [
            'event ticketing Nigeria with Paystack',
            'sell concert tickets online Lagos',
            'QR code ticket scanning app',
            'guest check-in and attendee management'
        ],
        modifiers: ['Nigeria', 'Lagos', 'Paystack', 'QR', 'check-in', 'RSVP'],
        competitorCapture: ['Shopify tickets alternative', 'Eventbrite alternative Nigeria'],
        negatives: ['course platform', 'wholesale portal']
    },
    'online-courses': {
        primary: 'online course platform',
        secondary: ['sell courses online', 'learning management system', 'course checkout', 'student portal'],
        longTail: [
            'sell online courses Nigeria Paystack',
            'course website with certificates',
            'drip content LMS Nigeria',
            'student dashboard and progress tracking'
        ],
        modifiers: ['Nigeria', 'NGN', 'Paystack', 'certificates', 'drip', 'community'],
        competitorCapture: ['Shopify courses alternative', 'Teachable alternative Nigeria', 'Thinkific alternative'],
        negatives: ['marketplace multi-vendor', 'fundraising']
    },
    'wholesale': {
        primary: 'wholesale ecommerce platform',
        secondary: ['B2B ordering portal', 'bulk pricing ecommerce', 'wholesale login pricing', 'MOQ ordering'],
        longTail: [
            'wholesale ordering portal Nigeria',
            'B2B ecommerce with tiered pricing NGN',
            'request quote + invoice ordering workflow',
            'distributor portal with approvals'
        ],
        modifiers: ['Nigeria', 'NGN', 'invoices', 'MOQ', 'tiers', 'approvals'],
        competitorCapture: ['Shopify B2B alternative', 'BigCommerce B2B alternative'],
        negatives: ['event ticketing', 'digital downloads']
    },
    'marketplace': {
        primary: 'multi-vendor marketplace platform',
        secondary: ['marketplace builder', 'vendor storefronts', 'commission marketplace', 'seller payouts'],
        longTail: [
            'create marketplace Nigeria with vendor payouts',
            'marketplace with Paystack split payments',
            'vendor onboarding + KYC workflow',
            'commission rules per category'
        ],
        modifiers: ['Nigeria', 'Paystack', 'payouts', 'commission', 'vendors'],
        competitorCapture: ['Shopify marketplace alternative', 'Sharetribe alternative Nigeria'],
        negatives: ['single-store templates', 'wholesale portal']
    },
    'fundraising': {
        primary: 'fundraising platform',
        secondary: ['donation website', 'fundraising campaigns', 'recurring donations', 'donor management'],
        longTail: [
            'donation platform Nigeria Paystack',
            'fundraising page for NGOs Nigeria',
            'recurring donations NGN',
            'donor receipts and campaigns dashboard'
        ],
        modifiers: ['Nigeria', 'NGN', 'Paystack', 'receipts', 'recurring', 'donor CRM'],
        competitorCapture: ['Shopify donations alternative', 'GoFundMe alternative Nigeria'],
        negatives: ['course', 'wholesale', 'marketplace']
    },
    'real-estate': {
        primary: 'real estate listing website',
        secondary: ['property listings platform', 'agent website', 'rental listings', 'property search filters'],
        longTail: [
            'real estate listing site Nigeria',
            'property rentals Lagos listings platform',
            'real estate agent website with lead forms',
            'property search filters + map'
        ],
        modifiers: ['Nigeria', 'Lagos', 'rent', 'buy', 'agent', 'lead forms'],
        competitorCapture: ['Shopify real estate alternative', 'Wix real estate alternative'],
        negatives: ['ticketing', 'food ordering']
    }
};
