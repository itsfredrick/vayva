import React from "react";

export const SubscriptionCTA = () => {
  return (
    <section className="bg-[#2E2E2E] text-white py-24 px-8 text-center">
      <h3 className="font-serif text-3xl md:text-4xl mb-6">
        Never run out of your essentials.
      </h3>
      <p className="text-stone-300 max-w-xl mx-auto mb-10 leading-relaxed font-light">
        Subscribe to your favorite products and save 15% on every order. Pause,
        skip, or cancel anytime.
      </p>
      <button className="bg-[#C9B7A2] text-white px-8 py-4 uppercase tracking-widest text-xs font-bold hover:bg-[#B8A690] transition-colors">
        Explore Subscriptions
      </button>
    </section>
  );
};
