import React, { useState, useEffect } from "react";
import { Button, Drawer, Icon, IconName, cn, Modal } from "@vayva/ui";
import { Customer, CustomerInsight, CustomerActivity } from "@vayva/shared";
import { WhatsAppAction } from "./WhatsAppAction";
import { CustomerForm } from "./CustomerForm";

interface CustomerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: string | null;
}

interface CustomerStats {
  aov: number;
  [key: string]: any;
}

export const CustomerDrawer = ({
  isOpen,
  onClose,
  customerId,
}: CustomerDrawerProps) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [insights, setInsights] = useState<CustomerInsight[]>([]);
  const [history, setHistory] = useState<CustomerActivity[]>([]);
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"timeline" | "notes">("timeline");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isOpen && customerId) {
      fetchData();
    } else {
      setCustomer(null);
      setInsights([]);
      setHistory([]);
    }
  }, [isOpen, customerId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Parallel fetch for speed
      const [profileRes, historyRes] = await Promise.all([
        fetch(`/api/customers/${customerId}`).then((r) => r.json()),
        fetch(`/api/customers/${customerId}/history`).then((r) => r.json()),
      ]);

      setCustomer(profileRes.profile);
      setInsights(profileRes.insights);
      setStats(profileRes.stats);
      setHistory(historyRes);
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!customer || !window.confirm("Are you sure you want to delete this customer? This action cannot be undone.")) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/customers/${customer.id}`, {
        method: "DELETE"
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to delete customer");
        return;
      }
      onClose();
    } catch (e: any) {
      console.error(e);
      alert("An error occurred while deleting the customer");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={loading ? "Loading..." : "Customer Profile"}
    >
      {loading || !customer ? (
        <div className="h-full flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-black border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="flex flex-col h-full bg-gray-50">
          {/* SECTION A: PROFILE HEADER */}
          <div className="bg-white p-6 border-b border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-xl font-bold text-gray-600 border border-gray-100">
                  {customer.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {customer.name}
                  </h2>
                  <p className="text-gray-500 text-sm font-mono flex items-center gap-2">
                    <Icon name="Phone" size={12} /> {customer.phone}
                  </p>
                  <div className="flex gap-2 mt-2">
                    {insights.some((i: CustomerInsight) => i.type === "risk") && (
                      <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        High Risk
                      </span>
                    )}
                    <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Seen {new Date(customer.lastSeenAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditModalOpen(true)}
                  className="h-9 w-9 p-0 rounded-full"
                  title="Edit Profile"
                >
                  <Icon name="Edit3" size={14} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="h-9 w-9 p-0 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50 border-gray-200"
                  title="Delete Customer"
                >
                  {isDeleting ? (
                    <div className="animate-spin w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full" />
                  ) : (
                    <Icon name="Trash2" size={14} />
                  )}
                </Button>
                <WhatsAppAction
                  phone={customer.phone}
                  name={customer.name}
                  label="Message"
                  size="sm"
                />
              </div>
            </div>

            {/* SECTION B: SUMMARY STATS */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                  Lifetime Value
                </p>
                <p className="text-lg font-bold font-mono">
                  ₦{customer.totalSpend.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                  Orders
                </p>
                <p className="text-lg font-bold">{customer.totalOrders}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                  AOV
                </p>
                <p className="text-lg font-bold font-mono">
                  ₦{(stats?.aov || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* SECTION: INSIGHTS SCROLL */}
          {insights.length > 0 && (
            <div className="bg-white p-4 border-b border-gray-200">
              <h3 className="text-xs font-bold text-gray-900 uppercase mb-3 flex items-center gap-1">
                <Icon name="Sparkles" size={12} className="text-amber-500" />{" "}
                Smart Insights
              </h3>
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {insights.map((insight: any) => (
                  <div
                    key={insight.id}
                    className="min-w-[200px] p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon
                        name={insight.icon as IconName}
                        size={14}
                        className="text-indigo-600"
                      />
                      <span className="text-xs font-bold text-indigo-900">
                        {insight.title}
                      </span>
                    </div>
                    <p className="text-[10px] text-indigo-700 leading-tight">
                      {insight.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex-1 overflow-auto p-6">
            {/* SECTION C & D: TIMELINE */}
            <div className="flex gap-4 border-b border-gray-200 mb-6">
              <Button
                variant="ghost"
                onClick={() => setActiveTab("timeline")}
                className={cn(
                  "pb-2 text-sm font-bold transition-colors rounded-none hover:bg-transparent h-auto p-0 hover:no-underline",
                  activeTab === "timeline"
                    ? "border-b-2 border-black text-black"
                    : "text-gray-400 hover:text-gray-600",
                )}
              >
                History
              </Button>
              <Button
                variant="ghost"
                onClick={() => setActiveTab("notes")}
                className={cn(
                  "pb-2 text-sm font-bold transition-colors rounded-none hover:bg-transparent h-auto p-0 hover:no-underline",
                  activeTab === "notes"
                    ? "border-b-2 border-black text-black"
                    : "text-gray-400 hover:text-gray-600",
                )}
              >
                Notes
              </Button>
            </div>

            {activeTab === "timeline" && (
              <div className="space-y-6 relative pl-4 border-l-2 border-gray-100 ml-2">
                {history.map((item: CustomerActivity, idx: number) => (
                  <div key={item.id} className="relative pl-6">
                    <div
                      className={cn(
                        "absolute -left-[25px] top-0 w-8 h-8 rounded-full border-4 border-gray-50 flex items-center justify-center bg-white shadow-sm",
                        item.type === "order"
                          ? "text-blue-600"
                          : item.type === "message"
                            ? "text-green-600"
                            : "text-gray-400",
                      )}
                    >
                      <Icon
                        name={
                          (item.type === "order"
                            ? "ShoppingBag"
                            : item.type === "message"
                              ? "MessageCircle"
                              : "FileText") as IconName
                        }
                        size={14}
                      />
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative group hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold uppercase text-gray-500">
                          {item.type}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(item.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="font-medium text-gray-900 text-sm">
                        {item.description}
                      </div>
                      {item.amount && (
                        <div className="mt-2 font-mono font-bold text-gray-900">
                          ₦{item.amount.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "notes" && (
              <div className="text-center py-10 text-gray-400">
                <Icon
                  name="FileText"
                  size={32}
                  className="mx-auto mb-2 opacity-20"
                />
                <p className="text-sm">No internal notes yet.</p>
                <Button size="sm" variant="outline" className="mt-4">
                  Add Note
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Customer Profile"
      >
        <CustomerForm
          initialData={customer}
          onSuccess={() => {
            setIsEditModalOpen(false);
            fetchData(); // Refresh profile
          }}
        />
      </Modal>
    </Drawer>
  );
};
