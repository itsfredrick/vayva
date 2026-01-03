import React from "react";
import Link from "next/link";
import { Button } from "@vayva/ui";
import { MessageCircle, Users, Heart, Share2, Tag } from "lucide-react";
import { APP_URL } from "@/lib/constants";

export const metadata = {
  title: "Community | Vayva",
  description: "Join the Vayva merchant community. Share tips, ask questions, and grow together.",
};

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-20 pb-16 px-4 bg-gradient-to-b from-green-50 to-white text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-green-100 text-green-700 text-xs font-bold uppercase mb-6 shadow-sm">
            <Users size={14} />
            Vayva Merchant Community
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-[#0F172A] mb-8 tracking-tight">
            Grow faster, <span className="text-[#22C55E]">together.</span>
          </h1>
          <p className="text-xl text-[#64748B] mb-10 max-w-2xl mx-auto leading-relaxed">
            Connect with thousands of Nigerian business owners. Share strategies, get feedback on your store, and learn what's working right now.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="https://chat.whatsapp.com/">
              <Button className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-8 py-4 text-lg font-bold rounded-xl shadow-lg shadow-green-100 transition-all hover:scale-105 inline-flex items-center gap-2">
                <MessageCircle size={20} />
                Join WhatsApp Group
              </Button>
            </Link>
            <Link href="https://twitter.com/vayva_ng">
              <Button variant="outline" className="border-2 border-gray-200 px-8 py-4 text-lg font-bold rounded-xl space-x-2">
                <span>Follow on Twitter</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Community Channels */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* WhatsApp */}
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-[#25D366] rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-green-200">
                <MessageCircle size={28} fill="white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">WhatsApp Hub</h3>
              <p className="text-gray-600 mb-6">
                Our active community group. Daily discussions on sales hacks, logistics providers, and Vayva tips.
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-6">
                <Users size={16} /> 2,400+ Members
              </div>
              <Link href={`${APP_URL}/signup`}>
                <span className="text-[#25D366] font-bold text-sm tracking-wide hover:underline cursor-pointer">
                  REQUEST ACCESS →
                </span>
              </Link>
            </div>

            {/* Twitter */}
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-gray-200">
                <span className="text-2xl font-bold">X</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Twitter / X</h3>
              <p className="text-gray-600 mb-6">
                Follow for rapid updates, feature announcements, and shout-outs to our top merchants of the week.
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-6">
                <Heart size={16} /> Daily Spotlights
              </div>
              <Link href="https://twitter.com/vayva_ng">
                <span className="text-black font-bold text-sm tracking-wide hover:underline cursor-pointer">
                  FOLLOW US →
                </span>
              </Link>
            </div>

            {/* Telegram (Resources) */}
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-200">
                <Share2 size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Resource Channel</h3>
              <p className="text-gray-600 mb-6">
                Download free templates, marketing scripts, and seasonal sales calendars for your business.
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-6">
                <Tag size={16} /> Free Assets
              </div>
              <Link href={`${APP_URL}/signup`}>
                <span className="text-blue-500 font-bold text-sm tracking-wide hover:underline cursor-pointer">
                  BROWSE CHANNEL →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="py-24 px-4 border-t border-gray-100">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Upcoming Community Events</h2>
          <div className="w-full space-y-4">
            {[
              { title: "WhatsApp Sales Masterclass", date: "Jan 15, 7:00 PM", type: "Webinar", status: "Open" },
              { title: "Lagos Merchant Meetup", date: "Feb 2, 2:00 PM", type: "In-Person", status: "Waitlist" },
              { title: "Product Photography Workshop", date: "Feb 10, 5:00 PM", type: "Live Demo", status: "Open" }
            ].map((event, i) => (
              <div key={i} className="flex flex-col md:flex-row items-center justify-between bg-white border border-gray-200 p-6 rounded-2xl hover:border-green-200 transition-colors">
                <div className="text-left mb-4 md:mb-0">
                  <h4 className="font-bold text-lg text-gray-900">{event.title}</h4>
                  <p className="text-sm text-gray-500">{event.date} • {event.type}</p>
                </div>
                <Button variant={event.status === 'Open' ? 'primary' : 'secondary'} className={`rounded-xl px-6 ${event.status === 'Open' ? 'bg-[#22C55E] hover:bg-[#16A34A] text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                  {event.status === 'Open' ? 'Register Free' : 'Join Waitlist'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
