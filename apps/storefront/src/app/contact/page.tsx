import React from "react";
import { Button, Input, Icon } from "@vayva/ui";

async function getContactDetails() {
  try {
    const apiBase =
      process.env.NEXT_PUBLIC_API_URL || "";

    const res = await fetch(`${apiBase}/public/stores/policies`, {
      next: { revalidate: 0 },
    });
    if (res.ok) return await res.json();
  } catch (e) {
    return null;
  }
  return null;
}

export default async function ContactPage() {
  const data = await getContactDetails();
  const contact = data?.policyContact;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1280px] mx-auto px-6 py-24 md:py-32 lg:flex lg:gap-20">
        {/* Left Side: Contact Info */}
        <div className="lg:w-1/3 mb-16 lg:mb-0">
          <div className="inline-block px-3 py-1 bg-gray-50 rounded-full text-[10px] font-bold text-gray-400 mb-6 uppercase tracking-[0.2em]">
            GET IN TOUCH
          </div>
          <h1
            className="text-5xl md:text-6xl font-bold text-[#0B0B0B] mb-8 tracking-tighter"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Contact Us
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed font-medium mb-12">
            Have a question about your order or our products? We're here to help
            you.
          </p>

          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                <Icon name="Mail" size={20} className="text-gray-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Email Us
                </p>
                <a
                  href={`mailto:${contact?.email || "support@vayva.shop"}`}
                  className="text-black font-bold hover:underline break-all"
                >
                  {contact?.email || "support@vayva.shop"}
                </a>
              </div>
            </div>

            {contact?.phone && (
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                  <Icon name="Phone" size={20} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Call Us
                  </p>
                  <p className="text-black font-bold">{contact.phone}</p>
                </div>
              </div>
            )}

            {contact?.businessHours && (
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                  <Icon name="Clock" size={20} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Operating Hours
                  </p>
                  <p className="text-black font-bold">
                    {contact.businessHours}
                  </p>
                </div>
              </div>
            )}

            {contact?.address && (
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                  <Icon name="MapPin" size={20} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Location
                  </p>
                  <p className="text-black font-bold">{contact.address}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div className="flex-1 max-w-[700px]">
          <div className="p-8 md:p-12 bg-gray-50 rounded-[40px] border border-gray-100">
            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full h-14 bg-white rounded-2xl border border-gray-100 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-shadow"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="w-full h-14 bg-white rounded-2xl border border-gray-100 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-shadow"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                  Order Number (Optional)
                </label>
                <input
                  type="text"
                  placeholder="#12345"
                  className="w-full h-14 bg-white rounded-2xl border border-gray-100 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-shadow"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                  Message
                </label>
                <textarea
                  className="w-full min-h-[180px] bg-white rounded-3xl border border-gray-100 p-6 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-shadow resize-none"
                  placeholder="How can we help you today?"
                ></textarea>
              </div>

              <Button className="w-full !h-16 !rounded-2xl !bg-black !text-white text-lg font-bold shadow-lg shadow-black/10 hover:shadow-black/20 hover:-translate-y-1 transition-all">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
