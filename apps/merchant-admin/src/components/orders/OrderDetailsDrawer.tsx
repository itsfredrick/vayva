import React from "react";
import { UnifiedOrder, UnifiedOrderStatus, OrderType } from "@vayva/shared";
import { Drawer, Icon, cn, Button } from "@vayva/ui";

interface OrderDetailsDrawerProps {
  order: UnifiedOrder | null;
  onClose: () => void;
}

export const OrderDetailsDrawer = ({
  order,
  onClose,
}: OrderDetailsDrawerProps) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [actionNote, setActionNote] = React.useState("");
  const [showCancel, setShowCancel] = React.useState(false);
  const [showRefund, setShowRefund] = React.useState(false);

  if (!order) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleStatusUpdate = async (nextStatus: UnifiedOrderStatus) => {
    setIsLoading(true);
    try {
      await fetch(`/api/orders/${order.id}/status`, {
        method: "POST",
        body: JSON.stringify({ next_status: nextStatus }),
      });
      // Ideally trigger a refresh of the parent list here
      onClose();
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    setIsLoading(true);
    try {
      await fetch(`/api/orders/${order.id}/cancel`, {
        method: "POST",
        body: JSON.stringify({ reason: actionNote || "Merchant cancelled" }),
      });
      onClose();
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefund = async () => {
    setIsLoading(true);
    try {
      await fetch(`/api/orders/${order.id}/refund`, {
        method: "POST",
        body: JSON.stringify({
          amount: order.totalAmount,
          reason: actionNote || "Full refund",
        }),
      });
      onClose();
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const renderActionButtons = () => {
    if (showCancel) {
      return (
        <div className="flex flex-col gap-3 w-full animate-in slide-in-from-bottom-5">
          <p className="text-sm font-bold text-red-600 mb-1">
            Confirm Cancellation?
          </p>
          <input
            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
            placeholder="Reason for cancellation..."
            value={(actionNote as any)}
            onChange={(e: any) => setActionNote(e.target.value)}
          />
          <div className="flex gap-2">
            <Button
              onClick={() => setShowCancel(false)}
              variant="secondary"
              className="flex-1 font-bold rounded-xl"
            >
              Back
            </Button>
            <Button
              onClick={handleCancel}
              disabled={isLoading}
              variant="destructive"
              className="flex-1 font-bold rounded-xl"
            >
              {isLoading ? "Processing..." : "Confirm Cancel"}
            </Button>
          </div>
        </div>
      );
    }

    if (showRefund) {
      return (
        <div className="flex flex-col gap-3 w-full animate-in slide-in-from-bottom-5">
          <p className="text-sm font-bold text-orange-600 mb-1">
            Issue Full Refund?
          </p>
          <input
            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
            placeholder="Reason for refund..."
            value={(actionNote as any)}
            onChange={(e: any) => setActionNote(e.target.value)}
          />
          <div className="flex gap-2">
            <Button
              onClick={() => setShowRefund(false)}
              variant="secondary"
              className="flex-1 font-bold rounded-xl"
            >
              Back
            </Button>
            <Button
              onClick={handleRefund}
              disabled={isLoading}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl"
            >
              {isLoading
                ? "Processing..."
                : `Refund ${formatCurrency(order.totalAmount)}`}
            </Button>
          </div>
        </div>
      );
    }

    // Default Workflow Buttons
    return (
      <div className="flex flex-col gap-3 w-full">
        <div className="flex gap-2">
          {order.status === UnifiedOrderStatus.NEW && (
            <>
              <Button
                onClick={() =>
                  handleStatusUpdate(UnifiedOrderStatus.PROCESSING)
                }
                className="flex-1 rounded-xl font-bold"
              >
                Accept Order
              </Button>
              <Button
                onClick={() => setShowCancel(true)}
                variant="destructive" //Using destructive variant but overriding bg for softer look if needed, or stick to system destructive
                className="px-4 bg-red-50 text-red-600 hover:bg-red-100 border-none rounded-xl font-bold"
              >
                Reject
              </Button>
            </>
          )}

          {order.status === UnifiedOrderStatus.PROCESSING && (
            <Button
              onClick={() => handleStatusUpdate(UnifiedOrderStatus.READY)}
              className="flex-1 rounded-xl font-bold"
            >
              Mark Ready / Shipped
            </Button>
          )}

          {order.status === UnifiedOrderStatus.READY && (
            <Button
              onClick={() => handleStatusUpdate(UnifiedOrderStatus.COMPLETED)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold"
            >
              Complete Order
            </Button>
          )}
        </div>

        {/* Secondary Actions */}
        {order.status !== UnifiedOrderStatus.CANCELLED &&
          order.status !== UnifiedOrderStatus.REFUNDED &&
          order.status !== UnifiedOrderStatus.NEW && (
            <div className="flex gap-2 justify-center pt-2">
              <Button
                variant="link"
                onClick={() => setShowCancel(true)}
                className="text-xs font-bold text-red-500 hover:text-red-700 underline p-0 h-auto"
              >
                Cancel Order
              </Button>
              <span className="text-gray-300">|</span>
              <Button
                variant="link"
                onClick={() => setShowRefund(true)}
                className="text-xs font-bold text-orange-500 hover:text-orange-700 underline p-0 h-auto"
              >
                Issue Refund
              </Button>
            </div>
          )}
      </div>
    );
  };

  return (
    <Drawer
      isOpen={!!order}
      onClose={onClose}
      title={
        order.type === OrderType.SERVICE
          ? `Booking #${order.id.split("_")[1]}`
          : `Order #${order.id.split("_")[1]}`
      }
      className="md:max-w-md w-full"
    >
      <div className="p-6 space-y-8 pb-32">
        {/* Status Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wider">
              Status
            </p>
            <h2 className="text-xl font-bold capitalize">
              {order.status.replace("_", " ")}
            </h2>
          </div>
          <div
            className={cn(
              "px-4 py-2 rounded-full text-sm font-bold capitalize",
              order.status === UnifiedOrderStatus.NEW
                ? "bg-blue-100 text-blue-700"
                : order.status === UnifiedOrderStatus.COMPLETED
                  ? "bg-green-100 text-green-700"
                  : order.status === UnifiedOrderStatus.CANCELLED
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700",
            )}
          >
            {order.status.replace("_", " ").toLowerCase()}
          </div>
        </div>

        {/* Customer */}
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-500">
              {order.customer.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{order.customer.name}</h3>
              <p className="text-xs text-gray-500 font-mono">
                {order.customer.phone}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold gap-2">
              <Icon name="MessageCircle" size={16} /> WhatsApp
            </Button>
            <Button variant="outline" className="flex-1 rounded-lg font-bold">
              Call
            </Button>
          </div>
        </div>

        {/* Items */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Icon name="ShoppingBag" size={16} /> Items
          </h3>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-start py-2 border-b border-gray-50 last:border-0"
              >
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                    {item.quantity}x
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {item.name}
                    </p>
                    {item.modifiers && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.modifiers.map((m, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-gray-100 text-gray-600 px-1.5 rounded"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <span className="font-mono text-sm font-medium">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
            <div className="flex justify-between pt-4 border-t border-gray-100">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-bold text-xl text-gray-900">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Status */}
        <div className="p-4 rounded-xl border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="CreditCard" size={18} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-600">
              Payment Status
            </span>
          </div>
          <span
            className={cn(
              "text-xs font-bold px-2 py-1 rounded uppercase",
              order.paymentStatus === "paid"
                ? "bg-green-50 text-green-700"
                : "bg-orange-50 text-orange-700",
            )}
          >
            {order.paymentStatus}
          </span>
        </div>
      </div>

      {/* Sticky Actions Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-10">
        {renderActionButtons()}
      </div>
    </Drawer>
  );
};
