import React from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@vayva/ui";

// Fallback GlassCard
const GlassCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl shadow-sm ${className}`}
  >
    {children}
  </div>
);

interface PaymentMethodProps {
  last4?: string;
  brand?: string;
  expiry?: string;
  onAdd?: () => void;
  onRemove?: () => void;
}

export const PaymentMethodCard = ({
  last4,
  brand = "Credit Card",
  expiry,
  onAdd,
  onRemove,
}: PaymentMethodProps) => {
  const hasCard = !!last4;

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Icon name="CreditCard" size={20} className="text-gray-500" />
          Payment Method
        </h3>
        {!hasCard && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onAdd}
            className="text-primary-600 hover:text-primary-700"
          >
            + Add New
          </Button>
        )}
      </div>

      {hasCard ? (
        <div className="flex items-center justify-between p-4 border rounded-xl bg-gray-50">
          <div className="flex items-center gap-4">
            <div className="h-10 w-16 bg-white border rounded flex items-center justify-center">
              <Icon name="CreditCard" size={20} />
            </div>
            <div>
              <p className="font-medium text-gray-900 capitalize">
                {brand} •••• {last4}
              </p>
              {expiry && (
                <p className="text-xs text-gray-500">Expires {expiry}</p>
              )}
            </div>
          </div>
          {onRemove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="text-red-600 hover:bg-red-50"
            >
              Remove
            </Button>
          )}
        </div>
      ) : (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
          <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Icon name="CreditCard" className="text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 font-medium">
            No payment method added
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Add a card to enable automatic renewals.
          </p>
          <Button variant="outline" size="sm" onClick={onAdd} className="mt-4">
            Add Card
          </Button>
        </div>
      )}
    </GlassCard>
  );
};
