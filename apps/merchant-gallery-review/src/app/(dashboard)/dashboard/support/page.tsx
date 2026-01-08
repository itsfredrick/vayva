"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@vayva/ui";

export default function SupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    fetch("/api/merchant/support/tickets")
      .then((res) => res.json())
      .then((data) => {
        setTickets(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isCreateOpen]); // refresh on modal close

  return (
    <div className="max-w-4xl mx-auto py-8 px-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Support & Feedback</h1>
          <p className="text-gray-500 text-sm">We're here to help.</p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-medium"
        >
          <Icon name="Plus" size={16} />
          New Ticket
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : tickets.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Icon name="LifeBuoy" size={24} className="text-gray-400" />
            </div>
            <h3 className="font-bold text-gray-900">No tickets yet</h3>
            <p className="text-gray-500 text-sm mt-1">
              Found a bug or have a request? Let us know.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {tickets.map((t) => (
              <div
                key={t.id}
                className="p-4 hover:bg-gray-50 flex justify-between items-center cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        t.status === "open" ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                    <h4 className="font-medium text-sm">{t.subject}</h4>
                    <span className="text-xs text-gray-400 uppercase border px-1 rounded">
                      {t.type}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs line-clamp-1">
                    {t.description}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-400 block">
                    {new Date(t.updatedAt).toLocaleDateString()}
                  </span>
                  <span className="text-xs font-semibold">{t.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isCreateOpen && (
        <CreateTicketModal onClose={() => setCreateOpen(false)} />
      )}
    </div>
  );
}

function CreateTicketModal({ onClose }: { onClose: () => void }) {
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const form = e.target as HTMLFormElement;
    const data = {
      subject: (form.elements.namedItem("subject") as HTMLInputElement).value,
      type: (form.elements.namedItem("type") as HTMLSelectElement).value,
      description: (
        form.elements.namedItem("description") as HTMLTextAreaElement
      ).value,
    };

    await fetch("/api/merchant/support/tickets", {
      method: "POST",
      body: JSON.stringify(data),
    });
    setSubmitting(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-bold mb-4">New Support Ticket</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
              Type
            </label>
            <select
              name="type"
              className="w-full p-2 border rounded-lg text-sm bg-gray-50"
            >
              <option value="bug">Report a Bug</option>
              <option value="feature">Feature Request</option>
              <option value="billing">Billing Issue</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
              Subject
            </label>
            <input
              name="subject"
              required
              className="w-full p-2 border rounded-lg text-sm"
              placeholder="Brief summary"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
              Description
            </label>
            <textarea
              name="description"
              required
              className="w-full p-2 border rounded-lg text-sm h-32"
              placeholder="Details..."
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              disabled={submitting}
              type="submit"
              className="flex-1 py-2 text-sm font-bold text-white bg-black rounded-lg hover:bg-gray-800"
            >
              {submitting ? "Sending..." : "Submit Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
