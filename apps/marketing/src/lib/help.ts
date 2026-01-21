export interface HelpArticle {
    id: string;
    slug: string;
    title: string;
    category: string;
    summary: string;
    content: string;
    lastUpdated?: string;
}

export const HELP_ARTICLES: HelpArticle[] = [
    {
        id: "1",
        slug: "getting-started",
        category: "Onboarding",
        title: "How to get started with Vayva",
        summary: "Learn the basics of setting up your Vayva store and launching your first products.",
        content: "Vayva simplifies launching your online business. Create an account, choose a template, and add your first product in minutes."
    },
    {
        id: "2",
        slug: "delivery-options",
        category: "Logistics",
        title: "Delivery Options: Partner vs Own Rider",
        summary: "Choose between using Vayva's delivery partner (Kwik) or your own dispatch riders.",
        content: `
      Vayva offers two flexible delivery models:
      
      • Vayva Delivery Partner (Kwik): 
         Use our integrated partner for automatic dispatching and tracking. Best for Lagos-based merchants requiring instant delivery.
      
      • Own Dispatch Rider:
         If you have your own riders, you can manage them manually. Simply select 'Self Dispatch' in your merchant settings.
         
      To configure these, go to Settings > Delivery in your Merchant Dashboard.
    `
    },
    {
        id: "3",
        slug: "pricing-plans",
        category: "Billing",
        title: "Pricing and Limits",
        summary: "Understand our subscription plans and transaction fees.",
        content: "Vayva offers several plans tailored to your business size..."
    },
    {
        id: "4",
        slug: "storefront-customization",
        category: "Design",
        title: "Customizing your Storefront",
        summary: "How to use our visual builder to customize your look and feel.",
        content: "Our visual builder allows you to select templates, customize sections, and publish changes instantly."
    }
];

export function getArticleBySlug(slug: string): HelpArticle | undefined {
    return HELP_ARTICLES.find(article => article.slug === slug);
}

