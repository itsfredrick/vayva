import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@vayva/ui";
import { ArrowLeft, Calendar, User, Tag, Share2 } from "lucide-react";
import { notFound } from "next/navigation";
import { NewsletterForm } from "@/components/blog/NewsletterForm";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  authorImage: string;
  authorBio: string;
  date: string;
  image: string;
  slug: string;
  content: string;
  readTime: string;
}

const POSTS: BlogPost[] = [
  {
    id: 1,
    title: "How to Automate WhatsApp Sales Without Losing the Personal Touch",
    excerpt: "Automation doesn't have to feel robotic. Learn how successful Nigerian brands use Vayva's AI to handle inquiries 24/7 while keeping customers happy and engaged with personalized responses.",
    category: "Guides",
    author: "Tola Adesina",
    authorImage: "https://randomuser.me/api/portraits/women/44.jpg",
    authorBio: "Growth Lead at Vayva. Passionate about helping Nigerian businesses scale.",
    date: "Dec 28, 2025",
    image: "/images/step-1-whatsapp.png",
    slug: "automate-whatsapp-sales",
    readTime: "5 min read",
    content: `
## The Challenge of WhatsApp Sales

Every Nigerian business owner knows the struggle. Your phone buzzes constantly with "How much?" messages, and you're torn between responding quickly and actually running your business.

The traditional approach has been to either:
- Respond to every message manually (exhausting)
- Ignore messages until you have time (losing sales)
- Hire someone to manage your DMs (expensive)

But there's a better way.

## Enter AI-Powered Automation

Vayva's AI doesn't just send generic auto-replies. It actually understands what your customers are asking for and responds intelligently.

### How It Works

1. **Intent Recognition**: When a customer asks "How much is the red dress?", Vayva understands they want pricing for a specific product.

2. **Smart Responses**: Instead of a generic "Thanks for your message", Vayva pulls the actual price and sends it with product details.

3. **Handoff When Needed**: For complex questions, Vayva seamlessly hands off to you with full context.

## Real Results from Nigerian Businesses

**Adaeze Fashion** saw a 340% increase in response rate after implementing Vayva. "I used to miss so many sales because I couldn't reply fast enough," says owner Ada Okonkwo. "Now every customer gets an instant response."

**QuickBites Lagos** reduced their response time from 2 hours to under 30 seconds. "Our customers love that they can order anytime, even at 3am," shares founder Emeka.

## Getting Started

Setting up automation on Vayva takes less than 10 minutes:

1. Connect your WhatsApp Business number
2. Import your product catalog
3. Customize your AI's tone and responses
4. Go live!

The best part? You can monitor all conversations and jump in whenever you want. You're always in control.

## The Bottom Line

Automation isn't about replacing the human touch—it's about amplifying it. By letting AI handle the repetitive queries, you free up time to focus on the conversations that really matter.

Ready to transform your WhatsApp sales? [Get started with Vayva today](/signup).
    `,
  },
  {
    id: 2,
    title: "5 Nigerian Brands That Scaled to ₦10M/Month on WhatsApp",
    excerpt: "From fashion to food, see how these local businesses transformed their chaotic WhatsApp DMs into streamlined sales channels. Case studies included.",
    category: "Success Stories",
    author: "Chidi Nwafor",
    authorImage: "https://randomuser.me/api/portraits/men/32.jpg",
    authorBio: "Content Writer at Vayva. Telling stories of Nigerian business success.",
    date: "Dec 20, 2025",
    image: "/images/calm-solution.jpg",
    slug: "nigerian-brands-scale",
    readTime: "8 min read",
    content: `
## Introduction

WhatsApp isn't just a messaging app in Nigeria—it's a marketplace. And some businesses have figured out how to turn those chat bubbles into serious revenue.

We spoke with 5 Nigerian brands that crossed the ₦10M monthly revenue mark using WhatsApp as their primary sales channel. Here's what they learned.

## 1. Adaeze Fashion - Lagos

**Monthly Revenue**: ₦15M+
**Products**: Women's fashion, accessories

Adaeze started selling clothes from her bedroom in 2021. Today, she has a team of 8 and ships nationwide.

**Key Strategy**: "I treat every DM like a VIP customer. Even with automation, every message feels personal."

**Vayva Impact**: 340% increase in response rate, 50% reduction in order errors.

## 2. QuickBites Lagos - Food Delivery

**Monthly Revenue**: ₦12M+
**Products**: Local dishes, small chops

What started as a side hustle during lockdown became a full-time business.

**Key Strategy**: "Speed is everything in food. If you don't reply in 5 minutes, they've ordered from someone else."

**Vayva Impact**: Response time dropped from 2 hours to 30 seconds.

## 3. TechGadgets NG - Electronics

**Monthly Revenue**: ₦18M+
**Products**: Phones, accessories, repairs

Trust is crucial when selling electronics online. TechGadgets built it through consistent communication.

**Key Strategy**: "We send order updates at every stage. Customers never have to ask 'where's my order?'"

**Vayva Impact**: Customer complaints dropped by 70%.

## 4. Glow Beauty - Skincare

**Monthly Revenue**: ₦11M+
**Products**: Skincare, beauty products

Skincare requires education. Glow Beauty turned their WhatsApp into a consultation service.

**Key Strategy**: "We don't just sell products. We help customers understand their skin and recommend solutions."

**Vayva Impact**: Average order value increased by 45% through smart upselling.

## 5. Fresh Farms Direct - Groceries

**Monthly Revenue**: ₦14M+
**Products**: Fresh produce, groceries

Selling perishables on WhatsApp seemed impossible. Fresh Farms made it work.

**Key Strategy**: "We batch orders by area and deliver same-day. Freshness is our promise."

**Vayva Impact**: Inventory management reduced waste by 60%.

## Common Patterns

All 5 businesses shared these traits:
- **Fast responses** (under 5 minutes)
- **Clear product catalogs** with prices
- **Consistent follow-up** on orders
- **Professional payment handling**

## Your Turn

These businesses didn't have special advantages. They just committed to treating WhatsApp as a real sales channel, not an afterthought.

Ready to join them? [Start your Vayva journey today](/signup).
    `,
  },
  {
    id: 3,
    title: "Understanding the New CBN KYC Requirements for Online Sellers",
    excerpt: "Confused by the latest banking regulations? We break down exactly what online vendors need to know to keep their business accounts compliant in 2026.",
    category: "Regulation",
    author: "Sarah Okonjo",
    authorImage: "https://randomuser.me/api/portraits/women/68.jpg",
    authorBio: "Legal & Compliance at Vayva. Making regulations understandable.",
    date: "Dec 15, 2025",
    image: "/images/chaos-problem.jpg",
    slug: "cbn-kyc-requirements",
    readTime: "6 min read",
    content: `
## What Changed?

The Central Bank of Nigeria (CBN) has updated its Know Your Customer (KYC) requirements for businesses operating online. These changes affect anyone receiving payments through digital channels.

## Who Needs to Comply?

If you:
- Accept payments online
- Use mobile money or bank transfers
- Process more than ₦500,000 monthly

You need to ensure your business is KYC compliant.

## The Three Tiers

### Tier 1 - Basic
- NIN verification
- Phone number verification
- Daily limit: ₦50,000
- Monthly limit: ₦300,000

### Tier 2 - Standard
- All Tier 1 requirements
- BVN verification
- Address verification
- Daily limit: ₦200,000
- Monthly limit: ₦1,000,000

### Tier 3 - Enhanced
- All Tier 2 requirements
- CAC registration
- Tax identification
- Utility bill
- No limits

## What Vayva Does for You

When you sign up for Vayva, we guide you through the KYC process step by step:

1. **Document Collection**: We tell you exactly what documents you need
2. **Verification**: Our system verifies your information automatically
3. **Compliance Monitoring**: We alert you if anything needs updating

## Common Questions

**Q: What if I'm just starting out?**
A: Start with Tier 1 and upgrade as your business grows.

**Q: How long does verification take?**
A: Most verifications complete within 24-48 hours.

**Q: What happens if I'm not compliant?**
A: Your payment processing may be limited or suspended.

## Action Steps

1. Check your current KYC tier
2. Gather required documents for the next tier
3. Submit through your Vayva dashboard
4. Wait for verification (usually 24-48 hours)

## Need Help?

Our compliance team is available to answer questions. [Contact support](/contact) or check our [Help Center](/help/kyc-safety).

Stay compliant, stay in business.
    `,
  },
  {
    id: 4,
    title: "The Ultimate Guide to Inventory Management for IG vendors",
    excerpt: "Stop overselling and disappointing customers. Discover simple strategies to track stock levels across Instagram, WhatsApp, and your physical store.",
    category: "Operations",
    author: "David Ibrahim",
    authorImage: "https://randomuser.me/api/portraits/men/86.jpg",
    authorBio: "Operations Expert at Vayva. Helping businesses run smoothly.",
    date: "Dec 10, 2025",
    image: "/images/mobile-showcase.png",
    slug: "inventory-management-guide",
    readTime: "7 min read",
    content: `
## The Overselling Problem

Every IG vendor has been there. You post a product, it goes viral, and suddenly you have 50 orders for something you only have 10 of.

Now you're stuck with angry customers, refund requests, and a damaged reputation.

## Why Traditional Methods Fail

**Spreadsheets**: Get outdated the moment you make a sale
**Memory**: Works until you're busy (which is always)
**Notes app**: Good luck finding that one entry

## The Vayva Solution

Vayva's inventory system syncs across all your channels in real-time:

### Automatic Stock Updates
When someone buys on WhatsApp, your Instagram shows updated stock. When someone buys in-store, your online channels reflect it instantly.

### Low Stock Alerts
Get notified when items are running low so you can reorder before you run out.

### Variant Tracking
Track sizes, colors, and other variants separately. Know exactly how many Medium Blue shirts you have left.

## Setting Up Your Inventory

### Step 1: Import Your Products
Upload your catalog via CSV or add products manually. Include:
- Product name
- SKU (if you have one)
- Price
- Initial stock quantity
- Variants (size, color, etc.)

### Step 2: Connect Your Channels
Link your WhatsApp, Instagram, and any other sales channels. Vayva will sync inventory across all of them.

### Step 3: Set Alerts
Configure when you want to be notified:
- Low stock threshold (e.g., 5 units)
- Out of stock
- Restock reminders

## Best Practices

### 1. Regular Audits
Even with automation, do a physical count monthly. Things get lost, damaged, or miscounted.

### 2. Buffer Stock
Keep a small buffer (10-20%) for unexpected demand. Better to have extra than to oversell.

### 3. Seasonal Planning
Track which products sell when. Stock up before peak seasons.

### 4. Supplier Relationships
Know your reorder lead times. If it takes 2 weeks to restock, order when you have 2 weeks of inventory left.

## The Results

Vendors using Vayva's inventory management report:
- 90% reduction in overselling
- 40% less time spent on stock tracking
- 25% improvement in customer satisfaction

## Get Started

Stop the spreadsheet madness. [Sign up for Vayva](/signup) and get your inventory under control today.
    `,
  },
];

export function generateStaticParams() {
  return POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) {
    return {
      title: "Post Not Found | Vayva Blog",
    };
  }
  return {
    title: `${post.title} | Vayva Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<React.JSX.Element> {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gray-50 pt-32 pb-16 px-4 border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-[#22C55E] transition-colors mb-8 font-medium"
          >
            <ArrowLeft size={18} />
            Back to Blog
          </Link>

          <div className="flex items-center gap-4 text-sm mb-6">
            <span className="bg-[#22C55E]/10 text-[#22C55E] px-3 py-1 rounded-full font-bold uppercase tracking-wide">
              {post.category}
            </span>
            <span className="text-gray-500 flex items-center gap-1">
              <Calendar size={14} /> {post.date}
            </span>
            <span className="text-gray-500">{post.readTime}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
            {post.title}
          </h1>

          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            {post.excerpt}
          </p>

          {/* Author */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
              <Image
                src={post.authorImage}
                alt={post.author}
                width={48}
                height={48}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
            <div>
              <p className="font-bold text-gray-900">{post.author}</p>
              <p className="text-sm text-gray-500">{post.authorBio}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <article className="max-w-3xl mx-auto prose prose-lg prose-gray prose-headings:text-gray-900 prose-a:text-[#22C55E] prose-a:no-underline hover:prose-a:underline">
          <div
            dangerouslySetInnerHTML={{
              __html: post.content
                .replace(/^## /gm, '<h2 class="text-2xl font-bold mt-12 mb-4">')
                .replace(/^### /gm, '<h3 class="text-xl font-bold mt-8 mb-3">')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n\n/g, '</p><p class="mb-4 text-gray-600 leading-relaxed">')
                .replace(/^- /gm, '<li class="ml-4 mb-2">')
                .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#22C55E] hover:underline">$1</a>')
            }}
          />
        </article>
      </section>

      {/* Share */}
      <section className="py-8 px-4 border-t border-gray-100">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <p className="text-gray-500 font-medium">Found this helpful? Share it!</p>
          <div className="flex gap-3">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://vayva.ng/blog/${post.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#22C55E] hover:text-white transition-all"
            >
              <Share2 size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 px-4 bg-[#0F172A] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Want more tips like this?
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Join 5,000+ merchants receiving weekly growth strategies.
          </p>
          <NewsletterForm />
        </div>
      </section>

      {/* Related Posts */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">More Articles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {POSTS.filter((p) => p.slug !== post.slug)
              .slice(0, 3)
              .map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all"
                >
                  <span className="text-xs font-bold text-[#22C55E] uppercase tracking-wide">
                    {relatedPost.category}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mt-2 group-hover:text-[#22C55E] transition-colors line-clamp-2">
                    {relatedPost.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-2">{relatedPost.date}</p>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
