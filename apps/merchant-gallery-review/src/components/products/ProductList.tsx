import React from "react";
import {
  ProductServiceItem,
  ProductServiceType,
  ProductServiceStatus,
} from "@vayva/shared";
import { Icon, Button, Badge, cn } from "@vayva/ui";

interface ProductListProps {
  items: ProductServiceItem[];
  onEdit: (item: ProductServiceItem) => void;
  onDelete: (id: string, name: string) => void;
  onCreate?: () => void;
  isLoading: boolean;
}

export const ProductList: React.FC<ProductListProps> = ({
  items,
  onEdit,
  onDelete,
  onCreate,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">Loading products...</div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="p-16 text-center text-gray-500 flex flex-col items-center">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 ring-8 ring-gray-50/50">
          <Icon name="Package" size={40} className="text-gray-300" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Your product catalog is empty
        </h3>
        <p className="text-gray-500 max-w-sm mb-8">
          Add products so Vayva can generate invoices, track inventory, and help
          customers order online.
        </p>
        <div className="flex gap-4">
          {/* We can't trigger parent handleCreate easily without prop, but usually EmptyState is shown when no items. 
                         The parent has an "Add Product" button already in header.
                         Let's assume the user can click that, OR we can accept an onAdd prop.
                         Refactoring to accept onAdd prop in next step, or just direct user to Top Right.
                         Actually, let's reuse onEdit for "New" if parent supports it, or just generic instructions.
                         Wait, the parent handles "Add Product" via handleCreate.
                      */}
          {/* For now, just a message or visual cue */}
        </div>
        {/* 
                   Since we can't easily add a button that calls handleCreate without changing props 
                   (which I can do, but let's be minimal), let's change the text effectively.
                */}
        <Button variant="outline" className="gap-2" onClick={onCreate}>
          <Icon name="Plus" size={16} /> Add your first product
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Mobile View: Cards */}
      <div className="md:hidden space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm active:scale-[0.99] transition-transform"
            onClick={() => onEdit(item)}
          >
            <div className="flex items-start gap-4 mb-3">
              <div className="w-16 h-16 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                {item.images?.[0] ? (
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Icon name="Image" size={24} className="text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 line-clamp-1">
                  {item.name}
                </h4>
                <div className="text-xs text-gray-500 line-clamp-2 mt-0.5 mb-2">
                  {item.description || "No description"}
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      (item.type === ProductServiceType.RETAIL
                        ? "default"
                        : item.type === ProductServiceType.FOOD
                          ? "warning"
                          : "secondary") as any
                    }
                    className="text-[10px]"
                  >
                    {item.type}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
              <div className="font-mono font-bold text-gray-900">
                {item.currency} {item.price.toLocaleString()}
              </div>
              <div className="flex items-center gap-2">
                {item.inventory?.enabled ? (
                  <div
                    className={cn(
                      "flex items-center gap-1.5 text-xs font-medium",
                      item.inventory.quantity <=
                        (item.inventory.lowStockThreshold || 5)
                        ? "text-orange-600"
                        : "text-gray-600",
                    )}
                  >
                    <span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        item.inventory.quantity === 0
                          ? "bg-red-500"
                          : item.inventory.quantity <=
                              (item.inventory.lowStockThreshold || 5)
                            ? "bg-orange-500"
                            : "bg-emerald-500",
                      )}
                    />
                    {item.inventory.quantity} left
                  </div>
                ) : (
                  <span className="text-xs text-gray-400">In Stock</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View: Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wider">
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium text-right">Price</th>
              <th className="px-4 py-3 font-medium">Status / Stock</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {items.map((item) => (
              <tr
                key={item.id}
                className="group hover:bg-gray-50/50 transition-colors cursor-pointer"
                onClick={() => onEdit(item)}
              >
                {/* Product Info */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                      {item.images?.[0] ? (
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Icon
                          name="Image"
                          size={16}
                          className="text-gray-400"
                        />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 line-clamp-1">
                        {item.name}
                      </div>
                      <div className="text-xs text-gray-500 line-clamp-1">
                        {item.description}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Type Badge */}
                <td className="px-4 py-3">
                  <Badge
                    variant={
                      (item.type === ProductServiceType.RETAIL
                        ? "default"
                        : item.type === ProductServiceType.FOOD
                          ? "warning"
                          : "secondary") as any
                    }
                    className="uppercase text-[10px] tracking-wider"
                  >
                    {item.type}
                  </Badge>
                </td>

                {/* Price */}
                <td className="px-4 py-3 text-right font-mono text-sm text-gray-700">
                  {item.currency} {item.price.toLocaleString()}
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  {item.inventory?.enabled ? (
                    <div
                      className={cn(
                        "flex items-center gap-2 text-sm",
                        item.inventory.quantity <=
                          (item.inventory.lowStockThreshold || 5)
                          ? "text-orange-600"
                          : "text-gray-600",
                      )}
                    >
                      <span
                        className={cn(
                          "w-2 h-2 rounded-full",
                          item.inventory.quantity === 0
                            ? "bg-red-500"
                            : item.inventory.quantity <=
                                (item.inventory.lowStockThreshold || 5)
                              ? "bg-orange-500"
                              : "bg-emerald-500",
                        )}
                      />
                      {item.inventory.quantity} in stock
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">
                      {item.type === ProductServiceType.SERVICE
                        ? "Booking Available"
                        : "Always in stock"}
                    </div>
                  )}
                </td>

                {/* Actions */}
                <td
                  className="px-4 py-3 text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-black"
                      onClick={() => onEdit(item)}
                    >
                      <Icon name="Pencil" size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
                      onClick={() => onDelete(item.id, item.name)}
                    >
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
