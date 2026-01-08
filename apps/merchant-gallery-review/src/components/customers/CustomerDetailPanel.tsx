import React, { useEffect, useState } from "react";
import { Customer, CustomerActivity } from "@vayva/shared";
import { Icon, cn } from "@vayva/ui";

interface CustomerDetailPanelProps {
  customer: Customer | null;
  onClose: () => void;
}

export const CustomerDetailPanel = ({
  customer,
  onClose,
}: CustomerDetailPanelProps) => {
  const [history, setHistory] = useState<CustomerActivity[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!customer) return;

    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/customers/details?id=${customer.id}`);
        const data = await res.json();
        if (data.history) setHistory(data.history);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [customer]);

  if (!customer) return null;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);

  return (
    <div className="fixed inset-y-0 right-0 w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-300 flex flex-col border-l border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex items-start justify-between bg-gray-50/50">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-700 font-bold text-xl shadow-sm">
            {customer.name.charAt(0)}
          </div>
          <div>
            <h2 className="font-bold text-xl text-gray-900">{customer.name}</h2>
            <p className="text-sm text-gray-500 font-mono">{customer.phone}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
        >
          <Icon name="X" size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-center p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase">
              Orders
            </p>
            <p className="font-bold text-gray-900">{customer.totalOrders}</p>
          </div>
          <div className="border-x border-gray-200">
            <p className="text-[10px] text-gray-400 font-bold uppercase">LTV</p>
            <p className="font-bold text-gray-900">
              {formatCurrency(customer.totalSpend)}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase">
              Active
            </p>
            <p className="font-bold text-gray-900">
              {Math.ceil(
                (Date.now() - new Date(customer.firstSeenAt).getTime()) /
                  (1000 * 60 * 60 * 24),
              )}
              d
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <button className="w-full py-3 bg-green-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-colors mb-3 shadow-lg shadow-green-100">
            <Icon name="MessageCircle" size={18} /> Message on WhatsApp
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button className="py-2.5 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50">
              Create Order
            </button>
            <button className="py-2.5 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50">
              Book Appt
            </button>
          </div>
        </div>

        {/* History */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Icon name="Clock" size={16} /> Recent Activity
          </h3>

          {loading ? (
            <div className="space-y-3">
              <div className="h-12 bg-gray-50 rounded animate-pulse" />
              <div className="h-12 bg-gray-50 rounded animate-pulse" />
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 hover:bg-gray-50 px-2 -mx-2 rounded transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center",
                        item.type === "order"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-purple-50 text-purple-600",
                      )}
                    >
                      <Icon
                        name={
                          item.type === "order" ? "ShoppingBag" : "Calendar"
                        }
                        size={14}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 capitalize">
                        {item.type} #{item.id.split("_")[1]}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono font-medium">
                      {item.amount ? formatCurrency(item.amount) : "-"}
                    </p>
                    <span className="text-[10px] uppercase font-bold text-green-600">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
