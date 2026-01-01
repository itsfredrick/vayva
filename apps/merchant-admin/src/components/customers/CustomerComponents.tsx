"use client";

import React, { useState } from "react";
import {
  CustomerNote,
  CustomerOrderSummary,
  CustomersService,
} from "@/services/customers";
import { Button, Icon } from "@vayva/ui";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

// --- Orders Table ---
export const CustomerOrdersTable = ({
  orders,
}: {
  orders: CustomerOrderSummary[];
}) => {
  const router = useRouter();
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-medium">
          <tr>
            <th className="px-6 py-4">Order</th>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {orders.length === 0 ? (
            <tr>
              <td colSpan={4} className="p-6 text-center text-gray-400">
                No orders found.
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr
                key={order.id}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => router.push(`/admin/orders/${order.id}`)}
              >
                <td className="px-6 py-4 font-bold text-[#0B0B0B]">
                  {order.orderNumber}
                  <span className="text-xs font-normal text-gray-400 ml-2">
                    ({order.itemsCount} items)
                  </span>
                </td>
                <td className="px-6 py-4 text-[#525252]">
                  {new Date(order.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-bold text-[#0B0B0B]">
                  ₦ {order.total.toLocaleString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

// --- Notes List & Modal ---
interface NotesSectionProps {
  notes: CustomerNote[];
  onAddNote: (content: string) => Promise<void>;
}

export const NotesSection = ({ notes, onAddNote }: NotesSectionProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!newNote.trim()) return;
    setLoading(true);
    await onAddNote(newNote);
    setLoading(false);
    setNewNote("");
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsModalOpen(true)} size="sm">
          <Icon name="Plus" size={14} className="mr-2" /> Add Note
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {notes.length === 0 ? (
          <div className="p-8 text-center text-gray-400 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
            No notes yet. Add one to keep track of this customer.
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="bg-yellow-50/50 border border-yellow-100 p-4 rounded-xl flex flex-col gap-2"
            >
              <p className="text-sm text-[#0B0B0B] whitespace-pre-wrap">
                {note.content}
              </p>
              <div className="flex justify-between items-center text-xs text-gray-400 mt-2">
                <span>{new Date(note.date).toLocaleString()}</span>
                <span className="font-medium text-yellow-700">
                  {note.author}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={(e) =>
              e.target === e.currentTarget && setIsModalOpen(false)
            }
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              key="modal"
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-[#0B0B0B]">Add Note</h3>
                <button onClick={() => setIsModalOpen(false)}>
                  <Icon name="X" size={18} />
                </button>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <textarea
                  className="w-full h-32 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black/5 outline-none resize-none"
                  placeholder="Enter note details..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={loading || !newNote.trim()}
                  >
                    {loading ? "Saving..." : "Save Note"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
