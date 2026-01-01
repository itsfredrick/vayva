"use client";

import React, { useState } from "react";
import { Button, Icon, cn, Input } from "@vayva/ui";
import { StorefrontConfig, StorefrontProduct } from "@/types/storefront";
import { getThemeStyles } from "@/utils/theme-utils";
import { WhatsAppPreviewModal } from "./WhatsAppPreviewModal";

// --- Components ---

const PaymentBadge = ({ rule }: { rule?: string }) => {
  if (!rule) return null;

  const config = {
    pay_to_confirm: {
      label: "Pay to Confirm",
      color: "bg-blue-100 text-blue-700",
    },
    pay_after: { label: "Pay Later", color: "bg-green-100 text-green-700" },
    deposit: {
      label: "Deposit Required",
      color: "bg-purple-100 text-purple-700",
    },
  };

  const c = config[rule as keyof typeof config];
  if (!c) return null;

  return (
    <span
      className={cn(
        "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide",
        c.color,
      )}
    >
      {c.label}
    </span>
  );
};

const ServiceDetailModal = ({
  service,
  onClose,
  onBook,
}: {
  service: StorefrontProduct | null;
  onClose: () => void;
  onBook: (s: StorefrontProduct) => void;
}) => {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl relative z-10 animate-in slide-in-from-bottom-10 duration-300 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 pb-0 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-1">{service.name}</h2>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Icon name="Clock" size={14} /> {service.duration}
              </span>
              <PaymentBadge rule={service.paymentRule} />
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          <div className="bg-gray-50 p-4 rounded-xl mb-6">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              ₦{service.price.toLocaleString()}
            </div>
            <p className="text-sm opacity-60">Base price per session</p>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-sm mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {service.description}
              </p>
            </div>

            {service.included && (
              <div>
                <h3 className="font-bold text-sm mb-2">What's Included</h3>
                <ul className="space-y-2">
                  {service.included.map((inc, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-600">
                      <Icon
                        name="Check"
                        size={16}
                        className="text-green-500 mt-0.5"
                      />
                      {inc}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-xl flex gap-3 text-blue-900 text-sm">
              <Icon name="Info" size={20} className="shrink-0" />
              <p>
                Cancellation Policy: Please cancel at least 24 hours in advance
                to avoid a fee.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t safe-area-bottom">
          <Button
            className="w-full h-12 rounded-xl text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => onBook(service)}
          >
            Book Appointment
          </Button>
        </div>
      </div>
    </div>
  );
};

const BookingRequestModal = ({
  service,
  onClose,
  onConfirm,
}: {
  service: StorefrontProduct | null;
  onClose: () => void;
  onConfirm: (date: string, time: string) => void;
}) => {
  if (!service) return null;
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleConfirm = () => {
    if (!date || !time) return; // Simple validation
    onConfirm(date, time);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl relative z-10 p-6 animate-in zoom-in-95 duration-200">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Icon name="Calendar" size={24} />
          </div>
          <h3 className="font-bold text-xl">Request Slot</h3>
          <p className="text-sm text-gray-500">for {service.name}</p>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
              Preferred Date
            </label>
            <Input
              type="date"
              className="w-full"
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
              Preferred Time
            </label>
            <select
              className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm bg-white"
              onChange={(e) => setTime(e.target.value)}
            >
              <option value="">Select Time...</option>
              <option value="Morning (9AM - 12PM)">Morning (9AM - 12PM)</option>
              <option value="Afternoon (12PM - 4PM)">
                Afternoon (12PM - 4PM)
              </option>
              <option value="Evening (4PM - 8PM)">Evening (4PM - 8PM)</option>
            </select>
          </div>
        </div>

        <Button
          className="w-full h-12 rounded-xl font-bold bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
          onClick={handleConfirm}
          disabled={!date || !time}
        >
          <Icon name="MessageCircle" size={18} /> Send Request
        </Button>
        <button
          onClick={onClose}
          className="w-full py-3 text-sm text-gray-500 mt-2 font-medium"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export function ServiceTemplate({ config }: { config: StorefrontConfig }) {
  const theme = getThemeStyles(config.theme);
  const { content } = config;
  const services = (content.services || []) as StorefrontProduct[];

  const [selectedService, setSelectedService] =
    useState<StorefrontProduct | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [waModal, setWaModal] = useState({ open: false, message: "" });

  const handleInitialBook = (s: StorefrontProduct) => {
    setSelectedService(s);
  };

  const handleProceedToBooking = (s: StorefrontProduct) => {
    // Close detail, open booking input
    // Actually detail modal stays open? No, easier to switch context.
    setIsBooking(true);
  };

  const handleFinalizeBooking = (date: string, time: string) => {
    if (!selectedService) return;

    const msg = `Hello, I'd like to book *${selectedService.name}*.\n\n📅 Date: ${date}\n⏰ Time: ${time}\n\nPlease confirm availability.`;
    setWaModal({ open: true, message: msg });
    setIsBooking(false);
    setSelectedService(null);
  };

  return (
    <div
      className={cn(
        "min-h-[800px] flex flex-col transition-colors duration-300 relative bg-gray-50",
        theme.text,
        theme.font,
      )}
    >
      {/* Preview Banner */}
      <div className="bg-blue-600 text-white text-[10px] uppercase font-bold text-center py-2 tracking-widest sticky top-0 z-50">
        Preview mode — bookings are simulated.
      </div>

      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-[30px] z-40 border-b">
        <div className="font-bold text-xl tracking-tight">
          STUDIO<span className="text-blue-600">.</span>
        </div>
        <Button
          size="sm"
          className="rounded-full bg-black text-white px-5 font-bold hover:bg-gray-800"
          onClick={() => {
            const first = services[0];
            if (first) setSelectedService(first);
          }}
        >
          Book Now
        </Button>
      </header>

      {/* Hero */}
      <section className="px-6 py-12 text-center bg-white border-b">
        <div className="max-w-xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-4 leading-tight text-gray-900">
            {content.headline}
          </h1>
          <p className="text-lg text-gray-500 mb-8">{content.subtext}</p>
          <div className="flex justify-center gap-8 text-sm font-medium text-gray-400">
            <span className="flex items-center gap-1">
              <Icon name="Check" size={14} className="text-blue-500" /> WhatsApp
              Booking
            </span>
            <span className="flex items-center gap-1">
              <Icon name="Check" size={14} className="text-blue-500" /> Secure
              Payments
            </span>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="p-6 max-w-2xl mx-auto w-full pb-24">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-lg">Services Menu</h2>
          <span className="text-xs bg-gray-200 px-2 py-1 rounded-md font-bold text-gray-600">
            {services.length} Items
          </span>
        </div>

        <div className="grid gap-4">
          {services.map((s) => (
            <div
              key={s.id}
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
              onClick={() => setSelectedService(s)}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors">
                    {s.name}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Icon name="Clock" size={12} /> {s.duration}
                    </span>
                    {s.paymentRule && (
                      <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    )}
                    <span className="capitalize">
                      {s.paymentRule?.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">
                    ₦{s.price.toLocaleString()}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2 mt-2">
                {s.description}
              </p>
              <div className="mt-4 pt-4 border-t border-dashed flex justify-between items-center">
                <span className="text-xs font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  View Details
                </span>
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-50 text-gray-400 group-hover:text-blue-600 transition-colors">
                  <Icon name="ArrowRight" size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <ServiceDetailModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onBook={handleProceedToBooking}
      />

      {isBooking && selectedService && (
        <BookingRequestModal
          service={selectedService}
          onClose={() => setIsBooking(false)}
          onConfirm={handleFinalizeBooking}
        />
      )}

      <WhatsAppPreviewModal
        isOpen={waModal.open}
        onClose={() => setWaModal({ ...waModal, open: false })}
        message={waModal.message}
      />

      {/* Simple Footer */}
      <footer className="py-8 text-center text-xs text-gray-400 border-t bg-white">
        <p>&copy; 2024 Studio Services. Powered by Vayva.</p>
      </footer>
    </div>
  );
}
