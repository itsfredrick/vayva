export interface HelpArticle {
  id: string;
  slug: string;
  title: string;
  category:
    | "Getting Started"
    | "Payments"
    | "Orders"
    | "Logistics"
    | "Account"
    | "Pricing";
  summary: string;
  content: string;
  lastUpdated: string;
}

export const HELP_ARTICLES: HelpArticle[] = [
  {
    id: "setup-whatsapp",
    slug: "setup-whatsapp-sync",
    title: "How to setup WhatsApp Sync",
    category: "Getting Started",
    summary:
      "Connect your WhatsApp account to Vayva to start capturing orders automatically.",
    lastUpdated: "Dec 24, 2025",
    content: `
            Vayva connects to your WhatsApp through a secure cloud bridge. You don't need to install anything on your phone.
            
            ### Steps to connect:
            1. Go to your Dashboard and click on **Connect WhatsApp**.
            2. Use your phone to scan the QR code that appears (similar to WhatsApp Web).
            3. Once connected, Vayva will start monitoring your messages for order patterns.
            
            ### What we track:
            Vayva only looks for messages related to product inquiries, pricing, and order confirmation. Your private messages remain private.
        `,
  },
  {
    id: "payment-methods",
    slug: "payment-methods-nigeria",
    title: "Supported Payment Methods in Nigeria",
    category: "Payments",
    summary:
      "Learn how to accept bank transfers, USSD, and card payments through Vayva.",
    lastUpdated: "Dec 24, 2025",
    content: `
            Vayva handles the complexity of verifying diverse payment methods common in Nigeria.
            
            ### Bank Transfers
            You can provide your Zenith or other bank details. Vayva can track these by asking customers to upload a screenshot of the receipt or by checking for transaction patterns.
            
            ### USSD & Cards
            Vayva integrates with Paystack to allow your customers to pay via USSD or Card. You get settled directly into your connected bank account.
            
            ### Manual Recording
            If a customer pays you in cash, you can manually record the payment in the dashboard to keep your records clean.
        `,
  },
  {
    id: "managing-orders",
    slug: "managing-orders-workflow",
    title: "Managing your Order Workflow",
    category: "Orders",
    summary:
      "From pending to delivered: how to move orders through your business pipeline.",
    lastUpdated: "Dec 22, 2025",
    content: `
            Every business has a slightly different flow. Vayva supports custom order statuses.
            
            ### Default Workflow:
            1. **Pending**: New order captured from chat.
            2. **Paid**: Payment has been verified.
            3. **Processing**: Order is being packed or prepared.
            4. **In Transit**: Handed over to logistics carrier.
            5. **Delivered**: Customer confirmed receipt.
            
            You can add custom steps like **"On Hold"** or **"Awaiting Stock"** in your Settings.
        `,
  },
  {
    id: "logistics-integration",
    slug: "logistics-carriers-nigeria",
    title: "Integrating with Nigerian Logistics",
    category: "Logistics",
    summary:
      "How to coordinate with GIGL, Red Star, and local dispatch riders.",
    lastUpdated: "Dec 20, 2025",
    content: `
            Logistics is often the hardest part of selling in Nigeria. Vayva makes it easier by centralizing the data.
            
            ### Third-Party Carriers
            When an order is ready, you can generate a shipping label or export the delivery details directly for carriers like GIGL or Terminal Africa.
            
            ### Local Dispatch
            If you use your own riders, they can access a 'Rider View' (optional) to see their daily queue and update delivery status on the fly.
        `,
  },
  {
    id: "pricing-plans",
    slug: "understanding-vayva-plans",
    title: "Understanding Vayva Pricing Plans",
    category: "Pricing",
    summary: "Which plan is right for your business volume?",
    lastUpdated: "Dec 25, 2025",
    content: `
            Vayva offers three main tiers:
            
            - **Starter (Free)**: For solo sellers getting started. Includes basic WhatsApp capture and manual records.
            - **Growth (₦5,000/mo)**: Most popular for established shops. Includes inventory, staff roles, and advanced exports.
            - **Scale (₦15,000/mo)**: For high-volume businesses or multi-branch operations. Includes full audit logs and priority support.
        `,
  },
  {
    id: "adding-team",
    slug: "multi-user-access",
    title: "Adding Team Members & Permissions",
    category: "Account",
    summary: "Coordinate with your staff by giving them controlled access.",
    lastUpdated: "Dec 18, 2025",
    content: `
            Don't share your main login. Use the Team feature.
            
            ### Roles:
            - **Owner**: Full access, including billing.
            - **Manager**: Full access to orders and products, cannot change billing.
            - **Staff**: Can view and create orders, cannot see revenue reports.
            - **Dispatch**: Only sees shipping and delivery queues.
        `,
  },
];

export function getArticleBySlug(slug: string) {
  return HELP_ARTICLES.find((a) => a.slug === slug);
}
