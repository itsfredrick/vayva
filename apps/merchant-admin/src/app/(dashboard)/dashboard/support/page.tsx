"use client";

import React, { useState, useEffect } from "react";
import { Icon, Button } from "@vayva/ui";
import { ConversationList } from "@/components/whatsapp/conversation-list";
import { ChatWindowContainer } from "@/components/whatsapp/ChatWindowContainer";
import { WaAgentService } from "@/services/wa-agent";

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<"tickets" | "whatsapp" | "settings">("tickets");

  // Data States
  const [tickets, setTickets] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  // Loading States
  const [loading, setLoading] = useState(true);
  const [waLoading, setWaLoading] = useState(false);

  // Modals
  const [isCreateOpen, setCreateOpen] = useState(false);

  // Fetch Tickets
  useEffect(() => {
    if (activeTab === "tickets") {
      setLoading(true);
      fetch("/api/merchant/support/tickets")
        .then((res) => res.json())
        .then((data) => {
          setTickets(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [activeTab, isCreateOpen]);

  // Fetch WhatsApp
  useEffect(() => {
    if (activeTab === "whatsapp") {
      setWaLoading(true);
      WaAgentService.getConversations()
        .then((data) => {
          setConversations(data);
          setWaLoading(false);
        })
        .catch(() => setWaLoading(false));
    }
  }, [activeTab]);

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col">
      {/* Header & Tabs */}
      <div className="px-6 py-4 flex justify-between items-center border-b border-gray-100 bg-white">
        <div>
          <h1 className="text-2xl font-bold">Support & Feedback</h1>
          <p className="text-gray-500 text-sm">Manage tickets and customer conversations.</p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-lg">
          {(["tickets", "whatsapp", "settings"] as const).map((tab) => (
            <Button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-bold capitalize rounded-md transition-all ${activeTab === tab
                ? "bg-white text-black shadow-sm"
                : "text-gray-500 hover:text-gray-900"
                }`}
            >
              {tab === "whatsapp" ? "WhatsApp Inbox" : tab}
            </Button>
          ))}
        </div>

        {activeTab === "tickets" && (
          <Button
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-medium"
          >
            <Icon name="Plus" size={16} />
            New Ticket
          </Button>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden bg-gray-50">

        {/* TICKETS VIEW */}
        {activeTab === "tickets" && (
          <div className="p-6 h-full overflow-y-auto">
            <div className="max-w-4xl mx-auto bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              {loading ? (
                <div className="p-8 text-center text-gray-400">Loading tickets...</div>
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
                            className={`w-2 h-2 rounded-full ${t.status === "open" ? "bg-green-500" : "bg-gray-300"
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
          </div>
        )}

        {activeTab === "whatsapp" && (
          <div className="flex h-full border-t border-gray-200 bg-white">
            <div className="w-80 border-r border-gray-200 h-full flex flex-col">
              <ConversationList
                conversations={conversations}
                selectedId={selectedConversationId}
                onSelect={setSelectedConversationId}
                isLoading={waLoading}
              />
            </div>
            <div className="flex-1 h-full bg-gray-50">
              {selectedConversationId ? (
                <ChatWindowContainer conversationId={selectedConversationId} conversations={conversations} />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <Icon name="MessageCircle" size={48} className="mb-4 opacity-20" />
                  <p>Select a conversation to start chatting</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SETTINGS VIEW */}
        {activeTab === "settings" && <SettingsView />}

      </div>

      {isCreateOpen && (
        <CreateTicketModal onClose={() => setCreateOpen(false)} />
      )}
    </div>
  );
}

function SettingsView() {
  const [settings, setSettings] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newClaim, setNewClaim] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [s, p] = await Promise.all([
          WaAgentService.getSettings(),
          WaAgentService.getProfile(),
        ]);
        setSettings(s);
        setProfile(p);
      } catch (e) {
        console.error("Failed to load settings", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSave() {
    if (!settings || !profile) return;
    setSaving(true);
    try {
      await Promise.all([
        WaAgentService.updateSettings(settings),
        WaAgentService.updateProfile(profile),
      ]);
      // Optional: Toast success
    } catch (e) {
      console.error("Failed to save", e);
    } finally {
      setSaving(false);
    }
  }

  function toggleSetting(key: string) {
    if (!settings) return;
    setSettings({ ...settings, [key]: !settings[key] });
  }

  function addClaim() {
    if (!newClaim.trim() || !profile) return;
    setProfile({
      ...profile,
      prohibitedClaims: [...(profile.prohibitedClaims || []), newClaim.trim()],
    });
    setNewClaim("");
  }

  function removeClaim(idx: number) {
    if (!profile) return;
    const next = [...(profile.prohibitedClaims || [])];
    next.splice(idx, 1);
    setProfile({ ...profile, prohibitedClaims: next });
  }

  if (loading) return <div className="p-8 text-center text-gray-400">Loading settings...</div>;
  if (!settings || !profile) return <div className="p-8 text-center text-red-500">Failed to load settings. WhatsApp may not be enabled.</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto overflow-y-auto h-full pb-20">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-xl">Support & Safety Settings</h3>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 text-sm font-bold"
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="space-y-6">
        {/* General Toggles */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h4 className="font-bold text-sm uppercase text-gray-500 mb-4">General Configuration</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-sm">Enable WhatsApp Integration</p>
                <p className="text-xs text-gray-500">Allow customers to contact you via WhatsApp</p>
              </div>
              <Button
                aria-label="Toggle WhatsApp integration"
                onClick={() => toggleSetting("enabled")}
                className={`w-10 h-6 rounded-full transition-colors relative ${settings.enabled ? "bg-green-500" : "bg-gray-200"}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${settings.enabled ? "left-5" : "left-1"}`} />
              </Button>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-sm">Human Handoff</p>
                <p className="text-xs text-gray-500">Allow AI to escalate complex queries to humans</p>
              </div>
              <Button
                aria-label="Toggle Human Handoff"
                onClick={() => toggleSetting("humanHandoffEnabled")}
                className={`w-10 h-6 rounded-full transition-colors relative ${settings.humanHandoffEnabled ? "bg-green-500" : "bg-gray-200"}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${settings.humanHandoffEnabled ? "left-5" : "left-1"}`} />
              </Button>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-sm">Auto-Reply Outside Hours</p>
                <p className="text-xs text-gray-500">Send an automated message when closed</p>
              </div>
              <Button
                aria-label="Toggle Auto-Reply"
                onClick={() => toggleSetting("autoReplyOutsideHours")}
                className={`w-10 h-6 rounded-full transition-colors relative ${settings.autoReplyOutsideHours ? "bg-green-500" : "bg-gray-200"}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${settings.autoReplyOutsideHours ? "left-5" : "left-1"}`} />
              </Button>
            </div>
          </div>
        </div>

        {/* Safety Filters */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h4 className="font-bold text-sm uppercase text-gray-500 mb-4">AI Safety Filters</h4>
          <p className="text-sm text-gray-600 mb-4">
            Configure specific claims or topics the AI should refuse to discuss.
          </p>

          <div className="flex gap-2 mb-4">
            <input
              value={newClaim}
              onChange={(e) => setNewClaim(e.target.value)}
              placeholder="e.g. 'We offer medical advice'"
              className="flex-1 border p-2 rounded text-sm"
              onKeyDown={(e) => e.key === "Enter" && addClaim()}
            />
            <Button onClick={addClaim} className="px-3 py-2 bg-gray-100 font-bold text-xs rounded hover:bg-gray-200">ADD</Button>
          </div>

          <div className="space-y-2">
            {profile.prohibitedClaims?.map((claim: string, idx: number) => (
              <div key={idx} className="flex justify-between items-center bg-red-50 p-2 rounded border border-red-100">
                <span className="text-sm text-red-700">{claim}</span>
                <Button
                  title="Remove claim"
                  aria-label="Remove claim"
                  onClick={() => removeClaim(idx)}
                  className="text-red-400 hover:text-red-700"
                >
                  <Icon name="X" size={14} />
                </Button>
              </div>
            ))}
            {(!profile.prohibitedClaims || profile.prohibitedClaims.length === 0) && (
              <p className="text-xs text-gray-400 italic">No prohibited claims configured.</p>
            )}
          </div>
        </div>
      </div>
    </div >
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
            <label htmlFor="ticket-type" className="block text-xs font-bold uppercase text-gray-500 mb-1">
              Type
            </label>
            <select
              id="ticket-type"
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
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </Button>
            <Button
              disabled={submitting}
              type="submit"
              className="flex-1 py-2 text-sm font-bold text-white bg-black rounded-lg hover:bg-gray-800"
            >
              {submitting ? "Sending..." : "Submit Ticket"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
