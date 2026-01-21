/**
 * COMPETITOR COMPARISON DATA
 * Source of Truth for "Shopify Attack Strategy" pages.
 * Enforces "Factual and Defensible" rule.
 */
export const COMPETITORS = {
    shopify: {
        name: "Shopify",
        slug: "shopify",
        title: "Shopify Nigeria: Pricing, Payments & Alternatives",
        description: "Thinking of using Shopify in Nigeria? Learn about NGN pricing, Paystack integration, and why Vayva is the specialized alternative for local commerce.",
        heroHeading: "Shopify vs Vayva: Which is right for your Nigerian business?",
        verdict: "Shopify is a global leader, but Vayva is built for the specific operational realities of Nigeria—from NGN stability to native WhatsApp order flows.",
        featureComparison: [
            {
                feature: "Monthly Subscription",
                vayva: "₦0 (Free Forever)",
                competitor: "$29+ USD/mo",
            },
            {
                feature: "Transaction Fees",
                vayva: "3% Flat",
                competitor: "2.0% (unless using Shopify Payments)",
            },
            {
                feature: "Currency Stability",
                vayva: "Fixed NGN pricing",
                competitor: "Fluctuates with USD rate",
            },
            {
                feature: "WhatsApp Commerce",
                vayva: "Native",
                competitor: "Requires paid plugins",
            },
        ],
        faqs: [
            {
                question: "Is Vayva cheaper than Shopify?",
                answer: 'For most Nigerian merchants, yes. By charging in NGN and having a low 3% platform fee, Vayva helps you avoid the hidden costs of currency conversion.',
            },
            {
                question: "Does Vayva support Paystack?",
                answer: 'Yes, Paystack is a core, native integration on Vayva. No extra setup or "Shopify-only" restrictions.',
            },
            {
                question: "Can I use my own domain?",
                answer: "Yes. Just like Shopify, you can connect your own .com or .ng domain to your Vayva store.",
            },
            {
                question: "Is there a mobile app?",
                answer: "Yes, Vayva is designed primarily for mobile, allowing you to manage orders and chat with customers entirely from your phone browser.",
            },
            {
                question: "How do I handle shipping?",
                answer: "Vayva integrates with local logistics providers like Kwik, which Shopify does not support natively.",
            },
            {
                question: "Can I sell digital products?",
                answer: "Absolutely. Vayva handles automated delivery for ebooks, courses, and software keys.",
            },
        ],
    },
    "shopify-vs-vayva": {
        name: "Shopify",
        slug: "shopify-vs-vayva",
        title: "Shopify vs Vayva: The Head-to-Head Comparison",
        description: "Detailed comparison of features, ease of use, and local support between Shopify and Vayva for merchants in Nigeria.",
        heroHeading: "Shopify vs Vayva: The Honest Breakdown",
        verdict: "Choose Shopify if you need complex global wholesale; choose Vayva if you want a fast, mobile-friendly store that just works in Nigeria.",
        featureComparison: [
            {
                feature: "Onboarding Speed",
                vayva: "3 minutes",
                competitor: "30-60 minutes",
            },
            {
                feature: "Payment Gateways",
                vayva: "Paystack, Flutterwave (Native)",
                competitor: "Manual setup required",
            },
            {
                feature: "Support",
                vayva: "Local WhatsApp Support",
                competitor: "Email / Global Chat",
            },
        ],
        faqs: [
            {
                question: "Is Vayva as secure as Shopify?",
                answer: "Yes. We use industry-standard encryption and our payment integrations are handled by PCI-DSS compliant partners like Paystack.",
            },
            {
                question: "Do I need a laptop to use Vayva?",
                answer: "No. Unlike Shopify which is desktop-centric, Vayva is built to be managed 100% via mobile.",
            },
            {
                question: "Can I have multiple staff members?",
                answer: "Yes, Vayva supports team collaboration on our Pro plans.",
            },
            {
                question: "Can I sell on social media?",
                answer: "Yes. Vayva generates links perfect for Instagram, TikTok, and WhatsApp.",
            },
            {
                question: "What happens to my data?",
                answer: "You own your data. You can export your customer and product lists at any time.",
            },
            {
                question: "Is there a free trial?",
                answer: "Better—we have a Free Forever plan for small businesses.",
            },
        ],
    },
    "shopify-alternative-nigeria": {
        name: "Shopify Alternative",
        slug: "shopify-alternative-nigeria",
        title: "The Best Shopify Alternative in Nigeria (2025)",
        description: "Looking for a Shopify alternative in Nigeria? Vayva is the #1 choice for merchants who want NGN pricing and seamless WhatsApp commerce.",
        heroHeading: "The Shopify alternative built for Nigeria.",
        verdict: 'Vayva solves the "USD Problem" for Nigerian ecommerce. Pay in Naira, sell on WhatsApp, grow without the $29/mo barrier.',
        featureComparison: [
            {
                feature: "Primary Currency",
                vayva: "NGN (Naira)",
                competitor: "USD (Dollars)",
            },
            {
                feature: "WhatsApp Ordering",
                vayva: "Inclusive",
                competitor: "Additional Monthly Cost",
            },
            {
                feature: "Local Logistics",
                vayva: "Integrated",
                competitor: "Manual / Third-party",
            },
        ],
        faqs: [
            {
                question: "Why is Vayva the best alternative?",
                answer: "Because we built it specifically for the African merchant who relies on WhatsApp and needs to avoid USD price spikes.",
            },
            {
                question: "Is it easy to switch?",
                answer: "We are building tools to help you migrate. For now, you can add products easily via our mobile dashboard.",
            },
            {
                question: "Does Vayva have themes?",
                answer: "We have conversion-optimized templates specifically for popular Nigerian industries like Fashion, Food, and Services.",
            },
            {
                question: "Can I accept bank transfers?",
                answer: 'Yes, Vayva automates bank transfer verification, unlike the manual "payment proof" mess on other platforms.',
            },
            {
                question: "How is the loading speed?",
                answer: "Vayva stores are optimized for 3G/4G connections common in Nigeria, often loading 2x faster than Shopify stores.",
            },
            {
                question: "Where is Vayva based?",
                answer: "Our team and infrastructure are focused on the Nigerian market.",
            },
        ],
    },
    wix: {
        name: "Wix",
        slug: "wix",
        title: "Wix vs Vayva: eCommerce Comparison for Nigeria",
        description: "Is Wix the right choice for your store in Nigeria? Compare it with Vayva's commerce-first features and local payment integrations.",
        heroHeading: "Building a Store: Wix vs Vayva",
        verdict: "Wix is a general-purpose website builder. Vayva is a high-performance commerce engine.",
        featureComparison: [
            {
                feature: "Mobile UX",
                vayva: "Native Mobile Web App",
                competitor: "Responsive Desktop Site",
            },
            {
                feature: "Order Management",
                vayva: "WhatsApp-optimized",
                competitor: "Email-centric",
            },
            {
                feature: "Speed",
                vayva: "Ultralight (Optimized for NG)",
                competitor: "Heavy (Javascript-heavy)",
            },
        ],
        faqs: [
            {
                question: "Is Wix hard to use?",
                answer: 'Wix\'s "drag and drop" can be overwhelming. Vayva uses "content-first" templates that ensure you can\'t break your design.',
            },
            {
                question: "Does Wix support Naira payments?",
                answer: "Wix requires external plugins for Paystack, which can be brittle. Vayva is native.",
            },
            {
                question: "How is the SEO?",
                answer: "Both provide good SEO, but Vayva generates automatic Schema for Nigerian products and prices natively.",
            },
            {
                question: "Is Vayva good for blogs?",
                answer: "Yes, our blog system is fast and built for SEO indexing.",
            },
            {
                question: "Can I use Wix for a restaurant?",
                answer: "Wix has a restaurant app, but Vayva's ordering flow is strictly faster for customers on mobile.",
            },
            {
                question: "What about support?",
                answer: "Vayva provides local, high-touch support.",
            },
        ],
    },
    squarespace: {
        name: "Squarespace",
        slug: "squarespace",
        title: "Squarespace vs Vayva: Commerce Comparison",
        description: "Sophisticated design meets African commerce. See how Squarespace compares to Vayva for selling online in Nigeria.",
        heroHeading: "Squarespace vs Vayva: Design vs Performance",
        verdict: "Squarespace is beautiful but lacks localized commerce features for Nigeria. Vayva combines premium design with native local workflows.",
        featureComparison: [
            {
                feature: "Payment Gateway",
                vayva: "Native Paystack",
                competitor: "No native NGN gateway",
            },
            {
                feature: "Pricing",
                vayva: "Starting at ₦0",
                competitor: "$23+ USD/mo",
            },
            {
                feature: "Template Focus",
                vayva: "Conversion & Mobile",
                competitor: "Visual Portfolio",
            },
        ],
        faqs: [
            {
                question: "Does Squarespace work in Nigeria?",
                answer: "Technically yes, but the lack of a native Naira payment gateway is a major blocker for local merchants.",
            },
            {
                question: "Is Vayva design as good as Squarespace?",
                answer: 'Our "Vayva Premium" templates are designed by top UX specialists to match global aesthetic standards while outperforming on speed.',
            },
            {
                question: "Is there a free Squarespace version?",
                answer: "No. Vayva allows you to start for free.",
            },
            {
                question: "Can I sell event tickets?",
                answer: "Yes, Vayva offers simple digital ticketing templates for events.",
            },
            {
                question: "What about analytics?",
                answer: "Vayva provides deep insights into your sales, conversion rates, and customer behavior.",
            },
            {
                question: "Is Vayva optimized for mobile?",
                answer: "Yes, 95% of Vayva customers shop on mobile, so every page is mobile-perfect.",
            },
        ],
    },
    "instagram-shopping": {
        name: "Instagram",
        slug: "instagram-shopping",
        title: "Vayva vs Instagram Shopping | Automate your Social Commerce",
        description: "Stop saying 'Price in DM'. Use Vayva to automate your Instagram sales, track inventory in real-time, and build trust with a professional storefront.",
        heroHeading: "Vayva vs Instagram: Stop saying 'Price in DM'.",
        verdict: "Instagram is for discovery, Vayva is for closing. Use them together—Instagram for traffic, Vayva for automated checkout and inventory management.",
        featureComparison: [
            {
                feature: "Checkout",
                vayva: "Automated & Instant",
                competitor: "Manual Back-and-forth",
            },
            {
                feature: "Inventory",
                vayva: "Real-time Tracking",
                competitor: "Manual Management",
            },
            {
                feature: "Trust",
                vayva: "Professional Storefront",
                competitor: "DM-based Trust Issues",
            },
            {
                feature: "Records",
                vayva: "Complete Audit Trail",
                competitor: "Scattered Chat History",
            },
        ],
        faqs: [
            {
                question: "How does Vayva help with Instagram sales?",
                answer: "Vayva gives you a professional link-in-bio store that automates checkout so you don't have to manually reply to 'How much?' questions.",
            },
            {
                question: "Can I still talk to customers?",
                answer: "Yes! Vayva handles the busywork of taking orders, leaving you free to handle high-value customer interactions.",
            },
        ],
    },
    jumia: {
        name: "Jumia",
        slug: "jumia",
        title: "Vayva vs Jumia | Build Your Own Brand in Nigeria",
        description: "Stop paying high commissions to Jumia. Build your own brand with Vayva and keep more of your money while owning your customer data.",
        heroHeading: "Vayva vs Jumia: Build your own Brand, not a listing.",
        verdict: "Jumia is a marketplace where you compete on price. Vayva is an infrastructure where you build a brand and own the customer relationship.",
        featureComparison: [
            {
                feature: "Fees",
                vayva: "3% Flat Fee",
                competitor: "Up to 20% Commission",
            },
            {
                feature: "Branding",
                vayva: "Your Own Domain/Store",
                competitor: "Jumia Marketplace Theme",
            },
            {
                feature: "Data",
                vayva: "You Own Customer Leads",
                competitor: "Jumia Owns the Customer",
            },
            {
                feature: "Payouts",
                vayva: "Secure Escrow Wallet",
                competitor: "Delayed Market Cycles",
            },
        ],
        faqs: [
            {
                question: "Is Vayva better than Jumia?",
                answer: "If you want to build a long-term brand and avoid high commissions, Vayva is the superior choice for your own storefront.",
            },
            {
                question: "How do I ship orders?",
                answer: "Vayva connects you with local logistics partners directly, rather than relying on a centralized warehouse.",
            },
        ],
    },
};
