"use client";

import React from "react";
import {
  BadgeCheck,
  Building2,
  Briefcase,
  CreditCard,
  LayoutDashboard,
  Package,
  Sparkles,
  Shirt,
  Smartphone,
  Truck,
  Users,
  UtensilsCrossed,
  Wrench,
} from "lucide-react";

type IndustryKey = "retail" | "food" | "fashion" | "realestate" | "beauty" | "electronics" | "services";

const INDUSTRIES: Array<{
  key: IndustryKey;
  buttonLabel: string;
  label: string;
  tagline: string;
  Icon: React.ComponentType<{ className?: string }>;
  before: string;
  after: string;
  bullets: string[];
  outcomes: string[];
}> = [
  {
    key: "retail",
    buttonLabel: "Retail",
    label: "General Retail",
    tagline: "Products, orders, inventory, and delivery — all tracked.",
    Icon: Wrench,
    before:
      "Before Vayva, you’re replying customers while in traffic or in a meeting — then you get home and realize you missed a payment or forgot an address.",
    after:
      "With Vayva, every chat becomes an order. Payments, stock, delivery and customer history sit in one dashboard — so you can sell and still live your life.",
    bullets: [
      "Create your storefront website (your own link) and share it in WhatsApp/IG bio.",
      "Turn chats into tracked orders with status: pending → paid → shipped → delivered.",
      "Request payment (link or transfer), confirm quickly, and keep records automatically.",
      "Delivery your way: set a pickup point and manage dispatch in Vayva — automated options depend on your plan/integration.",
    ],
    outcomes: ["Clean records", "Less stress", "More time back"],
  },
  {
    key: "food",
    buttonLabel: "Food",
    label: "Food & Restaurants",
    tagline: "Menu orders, payment requests, kitchen + dispatch tracking.",
    Icon: UtensilsCrossed,
    before:
      "Before Vayva, orders are screenshots, addresses are voice notes, and your kitchen is calling you because they can’t find the right details.",
    after:
      "With Vayva, WhatsApp orders are structured. Your team sees what to prepare, who has paid, and where the rider is — without calling you every 5 minutes.",
    bullets: [
      "Capture menu orders with notes (no onions, extra spice, etc.) and keep it organized.",
      "Request payment and mark paid — so you don’t cook for jokes.",
      "Kitchen view keeps active orders clear during rush hour.",
      "Dispatch tracking so you can answer “dispatch don reach?” with confidence (manual or automated depending on your setup).",
    ],
    outcomes: ["Fewer mistakes", "Less calling", "Faster turnaround"],
  },
  {
    key: "fashion",
    buttonLabel: "Fashion",
    label: "Fashion & Apparel",
    tagline: "Sizes/variants, stock control, repeat customers.",
    Icon: Shirt,
    before:
      "Before Vayva, you’re asking the same questions all day: size, colour, delivery address — and then you lose the chat when you get busy at work.",
    after:
      "With Vayva, the details are captured once. Stock stays accurate, payment is tracked, and delivery is handled — even if you’re at your 9–5.",
    bullets: [
      "Capture size/colour/variant details so you don’t re-ask the same questions.",
      "Track inventory so you stop taking payment for what’s not available.",
      "Send payment links and keep receipts/records clean for every sale.",
      "Know what’s selling, what to restock, and what’s pending delivery from your dashboard.",
    ],
    outcomes: ["Less back-and-forth", "Better stock", "More repeat buyers"],
  },
  {
    key: "beauty",
    buttonLabel: "Beauty",
    label: "Beauty & Cosmetics",
    tagline: "Shades/variants, product info, repeat purchase tracking.",
    Icon: Sparkles,
    before:
      "Before Vayva, customers ask for ingredients, shade names, and expiry — and you end up sending long voice notes and still losing the sale.",
    after:
      "With Vayva, your products have clear details on your storefront, and WhatsApp chats become trackable orders with payment + delivery handled.",
    bullets: [
      "List products with ingredients/usage so customers trust what they’re buying.",
      "Track shades/variants and stock so you don’t oversell.",
      "Payment + delivery tracking in one flow — less back-and-forth, more completed orders (automation depends on plan/integration).",
      "See repeat customers and what they usually buy.",
    ],
    outcomes: ["More trust", "Fewer cancelled orders", "Repeat customers"],
  },
  {
    key: "electronics",
    buttonLabel: "Electronics",
    label: "Electronics",
    tagline: "Specs, warranty info, stock, faster checkout.",
    Icon: Smartphone,
    before:
      "Before Vayva, you’re answering specs and price questions nonstop, while serious buyers wait — and you still can’t tell which orders are paid.",
    after:
      "With Vayva, product specs live on your storefront and every WhatsApp conversation can become a paid order with delivery tracking.",
    bullets: [
      "Publish products with specs + warranty info so buyers don’t need to ask twice.",
      "Confirm availability and lock stock when payment is received.",
      "Keep receipts, order history, and customer details automatically.",
      "Delivery tracking and after-sales follow-up from one dashboard (automation depends on plan/integration).",
    ],
    outcomes: ["Faster response", "Cleaner payments", "Fewer disputes"],
  },
  {
    key: "services",
    buttonLabel: "Services",
    label: "Professional Services",
    tagline: "Bookings, invoices, status updates.",
    Icon: Briefcase,
    before:
      "Before Vayva, you’re chasing clients for deposits, mixing bookings with personal chats, and forgetting who you promised what.",
    after:
      "With Vayva, bookings and payments are organized. Clients get clarity, you get peace, and you can focus on your work — not your WhatsApp.",
    bullets: [
      "Turn chats into bookings with clear status: requested → confirmed → completed.",
      "Send quotes/invoices and collect payment without chasing.",
      "Keep customer notes and history so you deliver consistently.",
      "Track your daily/weekly performance from the dashboard.",
    ],
    outcomes: ["Cleaner bookings", "Paid faster", "Better customer history"],
  },
  {
    key: "realestate",
    buttonLabel: "Real Estate",
    label: "Real Estate",
    tagline: "Listings, viewings, and follow-ups — tracked like a pipeline.",
    Icon: Building2,
    before:
      "Before Vayva, you’re juggling ten prospects in WhatsApp, missing follow-ups, and losing track of who wants what.",
    after:
      "With Vayva, your listings are organized, viewings are scheduled, and follow-ups are tracked — so you don’t lose hot leads because you got busy.",
    bullets: [
      "Create property listings with details that answer questions upfront.",
      "Schedule viewings and track outcomes in a simple pipeline.",
      "Keep notes and follow-ups per prospect — no more digging through chats.",
      "See performance and activity with clean records.",
    ],
    outcomes: ["Cleaner pipeline", "Better follow-up", "More closed deals"],
  },
];

export default function IndustriesInteractiveSection(props: {
  initialIndustry?: string;
}): React.JSX.Element {
  const initialKey: IndustryKey = ((): IndustryKey => {
    const value = (props.initialIndustry || "").toLowerCase();
    if (value === "retail") return "retail";
    if (value === "food") return "food";
    if (value === "fashion") return "fashion";
    if (value === "beauty") return "beauty";
    if (value === "electronics") return "electronics";
    if (value === "services") return "services";
    if (value === "realestate" || value === "real_estate") return "realestate";
    return "retail";
  })();

  const [selected, setSelected] = React.useState<IndustryKey>(initialKey);
  const active = React.useMemo(() => INDUSTRIES.find((i) => i.key === selected)!, [selected]);

  return (
    <section className="px-4 pb-10 md:pb-16 relative z-10">
      <div className="max-w-[1760px] mx-auto">
        <div className="rounded-3xl border border-gray-100 bg-white p-6 md:p-10 shadow-sm">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-[#22C55E] text-[10px] font-black uppercase tracking-widest mb-6 border border-green-100">
            Built for real businesses
          </div>

          <div className="grid gap-8 md:grid-cols-[1fr_1fr] md:items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                Built for how we actually sell in Nigeria.
              </h2>
              <p className="mt-3 text-[#64748B] leading-relaxed">
                Most businesses don’t lose sales because their product is bad. They lose sales because DMs get messy: “How much?”, “Send account”, “Is it available?”, “Dispatch don reach?”.
              </p>
              <p className="mt-3 text-[#64748B] leading-relaxed">
                Vayva keeps it clean: it captures the order, requests payment, tracks delivery, and records everything in your dashboard.
              </p>
              <p className="mt-3 text-[#64748B] leading-relaxed">
                Delivery can be manual or automated — depending on your plan and integrations.
              </p>

              <div className="mt-6">
                <div className="text-xs font-black uppercase tracking-widest text-gray-500">Choose an industry</div>
                <div className="mt-3 flex flex-wrap gap-3">
                  {INDUSTRIES.map((it) => {
                    const isActive = it.key === selected;
                    return (
                      <Button
                        variant="ghost"
                        key={it.key}
                        type="button"
                        onClick={() => setSelected(it.key)}
                        aria-pressed={isActive}
                        className={
                          isActive
                            ? "rounded-full bg-[#22C55E] px-4 py-2 text-sm font-bold text-white"
                            : "rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-[#0F172A] hover:border-gray-300"
                        }
                      >
                        {it.buttonLabel}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {[{ Icon: LayoutDashboard, label: "Orders" }, { Icon: CreditCard, label: "Payments" }, { Icon: Package, label: "Inventory" }, { Icon: Truck, label: "Delivery" }].map(
                  (it) => (
                    <div key={it.label} className="rounded-2xl border border-gray-100 bg-gray-50/40 p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white border border-gray-100 flex items-center justify-center">
                          <it.Icon className="w-4 h-4 text-[#22C55E]" />
                        </div>
                        <div className="text-sm font-extrabold text-[#0F172A]">{it.label}</div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-gray-100 bg-gray-50/40 p-5 md:p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center">
                  <active.Icon className="w-6 h-6 text-[#0F172A]" />
                </div>
                <div className="min-w-0">
                  <div className="text-lg font-extrabold text-[#0F172A] leading-tight">{active.label}</div>
                  <div className="mt-1 text-sm text-[#64748B] leading-relaxed">{active.tagline}</div>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                <div className="rounded-2xl bg-white border border-gray-100 p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center">
                      <BadgeCheck className="w-4 h-4 text-red-600" />
                    </div>
                    <div className="text-xs font-black uppercase tracking-widest text-gray-500">Before</div>
                  </div>
                  <div className="mt-2 text-sm text-[#0F172A] leading-relaxed">{active.before}</div>
                </div>
                <div className="rounded-2xl bg-white border border-gray-100 p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-[#22C55E]" />
                    </div>
                    <div className="text-xs font-black uppercase tracking-widest text-gray-500">After</div>
                  </div>
                  <div className="mt-2 text-sm text-[#0F172A] leading-relaxed">{active.after}</div>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {active.bullets.map((b) => (
                  <div key={b} className="flex items-start gap-3">
                    <span className="mt-2 w-2 h-2 rounded-full bg-[#22C55E] flex-shrink-0" />
                    <div className="text-sm text-[#0F172A] leading-relaxed">{b}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl bg-white border border-gray-100 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                    <Users className="w-5 h-5 text-[#22C55E]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase font-black text-gray-500 tracking-wider">What you get</div>
                    <div className="mt-1 text-sm font-extrabold text-[#0F172A]">
                      {active.outcomes.join(" • ")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
