import React, { useState } from "react";
import { PublicStore, PublicProduct } from "@/types/storefront";
import { EventHeader } from "./components/EventHeader";
import { EventHero } from "./components/EventHero";
import { TicketSelector } from "./components/TicketSelector";
import { CheckoutOverlay } from "./components/CheckoutOverlay";
import { TicketSuccess } from "./components/TicketSuccess";
import { useStore } from "@/context/StoreContext";

interface TicketlyLayoutProps {
  store: PublicStore;
  products: PublicProduct[];
}

export const TicketlyLayout = ({ store, products }: TicketlyLayoutProps) => {
  // For demo, we just pick the first event to show as "Main Event"
  // In real app, this would be an event detail page or a list
  const mainEvent = products[0];

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutData, setCheckoutData] = useState<{
    total: number;
    count: number;
  } | null>(null);
  const [successAttendee, setSuccessAttendee] = useState<{
    name: string;
    email: string;
  } | null>(null);

  const handleBuyClick = () => {
    // Scroll to tickets
    document.getElementById("tickets")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleTicketSelect = (_id: string, count: number, total: number) => {
    setCheckoutData({ total, count });
    setIsCheckingOut(true);
  };

  const handlePaymentComplete = (attendee: any) => {
    setIsCheckingOut(false);
    setSuccessAttendee(attendee);
  };

  if (!mainEvent) return <div>No events found.</div>;

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <EventHeader storeName={store.name} />

      <main>
        <EventHero event={mainEvent} onBuy={handleBuyClick} />
        <TicketSelector event={mainEvent} onSelect={handleTicketSelect} />

        {/* More Events Test */}
        <section className="bg-gray-50 py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">More from {store.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.slice(1).map((evt) => (
                <div
                  key={evt.id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="h-48 bg-gray-200">
                    <img
                      src={evt.images?.[0]}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="text-purple-600 text-xs font-bold uppercase tracking-wider mb-2">
                      {new Date(
                        evt.eventDetails?.date || "",
                      ).toLocaleDateString()}
                    </div>
                    <h3 className="font-bold text-lg mb-2">{evt.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      {evt.eventDetails?.venue}
                    </p>
                    <button className="text-sm font-bold border border-gray-200 px-4 py-2 rounded-lg hover:border-purple-600 hover:text-purple-600 transition-colors">
                      See Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center opacity-50 text-sm">
          <p>
            &copy; {new Date().getFullYear()} {store.name}. Powered by Ticketly.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span>Terms</span>
            <span>Privacy</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {isCheckingOut && checkoutData && (
        <CheckoutOverlay
          total={checkoutData.total}
          count={checkoutData.count}
          onClose={() => setIsCheckingOut(false)}
          onComplete={handlePaymentComplete}
        />
      )}

      {successAttendee && (
        <TicketSuccess
          event={mainEvent}
          attendee={successAttendee}
          onClose={() => setSuccessAttendee(null)}
        />
      )}
    </div>
  );
};
