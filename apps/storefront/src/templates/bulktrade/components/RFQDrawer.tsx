import React, { useState } from "react";
import { X, Send, Trash2, ArrowRight } from "lucide-react";
import { PublicProduct } from "@/types/storefront";

interface RFQItem {
  product: PublicProduct;
  qty: number;
}

interface RFQDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: RFQItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQty: (id: string, qty: number) => void;
  onSubmit: () => void;
}

export const RFQDrawer = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onUpdateQty,
  onSubmit,
}: RFQDrawerProps) => {
  const [submitting, setSubmitting] = useState(false);

  // Simple state for notes
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onSubmit();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-[#0F172A] text-white flex items-center justify-between">
          <div>
            <h2 className="font-bold text-lg">Request For Quote</h2>
            <p className="text-xs text-gray-400">
              {items.length} items ready for pricing review
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              <p>Your RFQ list is empty.</p>
              <button
                onClick={onClose}
                className="mt-4 text-blue-600 font-bold hover:underline"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            items.map(({ product, qty }) => {
              const moq = product.wholesaleDetails?.moq || 1;
              const isMoqMet = qty >= moq;

              return (
                <div
                  key={product.id}
                  className="flex gap-4 border-b border-gray-100 pb-6"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    <img
                      src={product.images?.[0]}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">
                      SKU: {product.id.toUpperCase()}
                    </p>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-gray-500">
                          Qty:
                        </label>
                        <input
                          type="number"
                          value={qty}
                          onChange={(e) =>
                            onUpdateQty(
                              product.id,
                              parseInt(e.target.value) || 0,
                            )
                          }
                          className={`w-20 px-2 py-1 border rounded text-sm ${!isMoqMet ? "border-red-300 bg-red-50 text-red-900" : "border-gray-300"}`}
                        />
                      </div>
                      <button
                        onClick={() => onRemoveItem(product.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    {!isMoqMet && (
                      <p className="text-[10px] text-red-600 mt-1 font-bold">
                        Below MOQ ({moq} units)
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {items.length > 0 && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Additional Notes / Delivery Terms
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full h-32 p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="E.g., Special packaging requirements, specific delivery date..."
              ></textarea>
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between mb-4 text-sm">
              <span className="text-gray-500">
                Estimated Total (Indicative)
              </span>
              <span className="font-bold text-gray-900">
                ~ ₦
                {items
                  .reduce((acc, item) => acc + item.product.price * item.qty, 0)
                  .toLocaleString()}
              </span>
            </div>
            <button
              onClick={handleSubmit}
              disabled={
                submitting ||
                items.some(
                  (i) => i.qty < (i.product.wholesaleDetails?.moq || 1),
                )
              }
              className="w-full bg-[#0F172A] hover:bg-[#1E293B] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all"
            >
              {submitting ? (
                "Submitting Request..."
              ) : (
                <>
                  Submit Quote Request <ArrowRight size={18} />
                </>
              )}
            </button>
            <p className="text-center text-[10px] text-gray-400 mt-3">
              This is not a final invoice. You will receive a formal quote
              within 24 hours.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
