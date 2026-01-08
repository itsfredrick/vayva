import React from "react";
import { TemplateProps } from "../registry";

export const WholesaleB2BTemplate: React.FC<TemplateProps> = ({
  businessName,
  demoMode,
}) => {
  return (
    <div className="font-mono min-h-screen bg-gray-50 text-gray-800">
      {/* Functional Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div>
          <h1 className="font-bold text-gray-900 uppercase tracking-tight">
            {businessName || "Alaba Electronics Wholesale"}
          </h1>
          <div className="text-[10px] text-gray-500 flex gap-2">
            <span>MOQ: 1 Dozen</span>
            <span>•</span>
            <span>GST: Included</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
            Hi, Distributor
          </span>
          <button className="bg-gray-900 text-white px-4 py-2 text-xs font-bold uppercase hover:bg-gray-800">
            Quick Order Form
          </button>
        </div>
      </header>

      {/* Data Table Catalog */}
      <div className="p-6 overflow-x-auto">
        <table className="w-full bg-white border border-gray-200 text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-600 border-b border-gray-200">
              <th className="py-3 px-4 text-left font-bold w-20">SKU</th>
              <th className="py-3 px-4 text-left font-bold">Product Name</th>
              <th className="py-3 px-4 text-left font-bold">Stock</th>
              <th className="py-3 px-4 text-right font-bold">Unit Price</th>
              <th className="py-3 px-4 text-right font-bold">
                Pack Price (12)
              </th>
              <th className="py-3 px-4 text-center font-bold w-32">
                Order Qty
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              {
                sku: "AE-001",
                name: "USB-C Fast Charger (20W)",
                stock: "450pcs",
                unit: "₦2,500",
                pack: "₦28,000",
              },
              {
                sku: "AE-002",
                name: "Bluetooth Earbuds (Pro Clone)",
                stock: "120pcs",
                unit: "₦8,000",
                pack: "₦90,000",
              },
              {
                sku: "AE-003",
                name: "Power Bank 20,000mAh",
                stock: "85pcs",
                unit: "₦12,500",
                pack: "₦145,000",
              },
              {
                sku: "AE-004",
                name: "Screen Guard (iPhone 13-15)",
                stock: "2,000pcs",
                unit: "₦500",
                pack: "₦5,000",
              },
              {
                sku: "AE-005",
                name: "OTG Adapter (Type C)",
                stock: "500pcs",
                unit: "₦300",
                pack: "₦3,000",
              },
            ].map((row, i) => (
              <tr key={i} className="hover:bg-blue-50/50 transition-colors">
                <td className="py-3 px-4 text-gray-500">{row.sku}</td>
                <td className="py-3 px-4 font-bold text-gray-900">
                  {row.name}
                </td>
                <td className="py-3 px-4 text-green-600 font-bold">
                  {row.stock}
                </td>
                <td className="py-3 px-4 text-right text-gray-600">
                  {row.unit}
                </td>
                <td className="py-3 px-4 text-right font-bold text-gray-900 bg-gray-50/50">
                  {row.pack}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center border border-gray-300 bg-white">
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      className="w-full px-2 py-1 text-center outline-none"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 p-4 shadow-lg flex justify-between items-center z-40">
        <div className="text-xs text-gray-500">
          <span className="font-bold text-gray-900">3 Items</span> in Draft
          Order
        </div>
        <div className="flex gap-4 items-center">
          <div className="text-right">
            <div className="text-[10px] text-gray-500 uppercase">
              Estimated Total
            </div>
            <div className="font-bold text-lg">₦175,000</div>
          </div>
          <button className="bg-green-600 text-white px-8 py-3 text-sm font-bold uppercase hover:bg-green-700 tracking-wide">
            Submit Order
          </button>
        </div>
      </div>
    </div>
  );
};
