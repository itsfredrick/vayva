"use client";

import { useState, useEffect } from "react";
import { Button, Card, Input, Badge } from "@vayva/ui";
import { Plus, Zap, Trash2, Calendar, Loader2 } from "lucide-react";

export default function FlashSalesPage() {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [newItem, setNewItem] = useState({
    name: "",
    discount: 20,
    startTime: "",
    endTime: "",
  });

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const res = await fetch("/api/marketing/flash-sales");
      const data = await res.json();
      if (Array.isArray(data)) setSales(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/marketing/flash-sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      if (res.ok) {
        setNewItem({ name: "", discount: 20, startTime: "", endTime: "" });
        setIsCreating(false);
        fetchSales();
      }
    } catch (e) {
      alert("Failed to create sale");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-headings font-bold">Flash Sales</h1>
          <p className="text-text-secondary">
            Create urgency with time-limited campaigns.
          </p>
        </div>
        <Button onClick={() => setIsCreating(!isCreating)} className="gap-2">
          <Plus size={16} /> New Campaign
        </Button>
      </div>

      {/* Creation Form */}
      {isCreating && (
        <Card className="p-6 bg-white/5 border-primary/20 animate-in slide-in-from-top-4">
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Campaign Name</label>
                <Input
                  placeholder="e.g. Midnight Madness"
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Discount Percentage (%)
                </label>
                <Input
                  type="number"
                  min="1"
                  max="99"
                  value={newItem.discount}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      discount: parseInt(e.target.value),
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Time</label>
                <Input
                  type="datetime-local"
                  value={newItem.startTime}
                  onChange={(e) =>
                    setNewItem({ ...newItem, startTime: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">End Time</label>
                <Input
                  type="datetime-local"
                  value={newItem.endTime}
                  onChange={(e) =>
                    setNewItem({ ...newItem, endTime: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setIsCreating(false)}
                type="button"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 animate-spin" size={16} />}
                Launch Campaign
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sales.map((sale) => (
          <Card
            key={sale.id}
            className="p-5 flex flex-col gap-4 relative overflow-hidden group hover:border-primary/50 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="p-2 bg-yellow-500/10 text-yellow-500 rounded-lg">
                <Zap size={20} />
              </div>
              <Badge variant={sale.isActive ? "success" : "default"}>
                {sale.isActive ? "Active" : "Ended"}
              </Badge>
            </div>

            <div>
              <h3 className="font-bold text-lg">{sale.name}</h3>
              <div className="text-3xl font-bold mt-1 text-primary">
                {sale.discount}% OFF
              </div>
            </div>

            <div className="text-sm text-text-secondary space-y-1">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <span>
                  Starts: {new Date(sale.startTime).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <span>Ends: {new Date(sale.endTime).toLocaleDateString()}</span>
              </div>
            </div>
          </Card>
        ))}

        {!loading && sales.length === 0 && !isCreating && (
          <div className="col-span-full py-12 text-center text-text-secondary border border-dashed border-border rounded-xl">
            <Zap className="mx-auto mb-3 opacity-20" size={48} />
            <p>No active flash sales. Create one to boost revenue!</p>
          </div>
        )}
      </div>
    </div>
  );
}
