"use client";

import React from "react";
import { Checkbox, Input, Select } from "@vayva/ui";
import { MapPin } from "lucide-react";

// Nigerian states for location filtering
const NIGERIAN_STATES = [
  "All Nigeria",
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe",
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara",
  "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau",
  "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

export interface SearchFilterState {
  minPrice: string;
  maxPrice: string;
  minMoq: string;
  verifiedOnly: boolean;
  chinaBulkOnly: boolean;
  location: string;
}

export interface SearchFiltersProps {
  value: SearchFilterState;
  onChange: (next: SearchFilterState) => void;
}

export function SearchFilters({
  value,
  onChange,
}: SearchFiltersProps): React.JSX.Element {
  return (
    <div className="space-y-6">
      {/* Location Filter */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
          <MapPin className="h-4 w-4 text-vayva-green" />
          Location
        </div>
        <Select
          value={value.location || "All Nigeria"}
          onChange={(e) => onChange({ ...value, location: e.target.value })}
        >
          {NIGERIAN_STATES.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </Select>
        <div className="text-xs text-gray-500">
          Filter products by seller location for faster delivery.
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-bold text-gray-900">Price Range (NGN)</div>
        <div className="grid grid-cols-2 gap-3">
          <Input
            inputMode="numeric"
            placeholder="Min"
            value={value.minPrice}
            onChange={(e) => onChange({ ...value, minPrice: e.target.value })}
          />
          <Input
            inputMode="numeric"
            placeholder="Max"
            value={value.maxPrice}
            onChange={(e) => onChange({ ...value, maxPrice: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-bold text-gray-900">MOQ</div>
        <Input
          inputMode="numeric"
          placeholder="Min MOQ"
          value={value.minMoq}
          onChange={(e) => onChange({ ...value, minMoq: e.target.value })}
        />
        <div className="text-xs text-gray-500">
          Useful for wholesale / China Bulk sourcing.
        </div>
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm text-gray-900 select-none">
          <Checkbox
            checked={value.verifiedOnly}
            onCheckedChange={(checked) =>
              onChange({ ...value, verifiedOnly: Boolean(checked) })
            }
          />
          Verified sellers only
        </label>

        <label className="flex items-center gap-2 text-sm text-gray-900 select-none">
          <Checkbox
            checked={value.chinaBulkOnly}
            onCheckedChange={(checked) =>
              onChange({ ...value, chinaBulkOnly: Boolean(checked) })
            }
          />
          🇨🇳 China Bulk only
        </label>

        <div className="text-xs text-gray-500">
          China Bulk filters suppliers tagged as China import / factory supply.
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-3">
        <div className="text-xs font-bold text-gray-900">Buyer protection</div>
        <div className="mt-1 text-xs text-gray-600">
          Escrow + verified supplier signals will show on product cards.
        </div>
      </div>
    </div>
  );
}
