"use client";

import { Puck, Data } from "@measured/puck";
import { puckConfig } from "@/lib/theme/puck.config";
import { Button, Icon } from "@vayva/ui";
import { useState } from "react";
import { toast } from "sonner";
import "@measured/puck/dist/index.css";

const initialData: Data = {
  content: [],
  root: {},
};

export default function ThemeBuilderPage() {
  const [data, setData] = useState<Data>(initialData);

  const handleSave = async (newData: Data) => {
    setData(newData);
    try {
      const res = await fetch("/api/storefront/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ themeConfig: newData }),
      });
      if (!res.ok) throw new Error("Failed to save draft");
      toast.success("Theme draft saved successfully!");
    } catch (error) {
      toast.error("Error saving theme draft");
    }
  };

  const handlePublish = async () => {
    try {
      const res = await fetch("/api/storefront/publish", {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to publish");
      toast.success("Theme published to storefront! 🚀");
    } catch (error) {
      toast.error("Error publishing theme");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Visual Header for Shopify Feel */}
      <div className="h-16 border-b border-gray-100 px-6 flex items-center justify-between bg-white z-50">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            <Icon name="ChevronLeft" size={16} />
          </Button>
          <div className="flex flex-col">
            <h1 className="text-sm font-black uppercase tracking-widest text-gray-900">Vayva Studio</h1>
            <span className="text-[10px] text-gray-400 font-bold uppercase">Storefront Editor v1.0</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-gray-400 mr-4">Draft Saved: Just Now</span>
          <Button variant="outline" size="sm" className="h-9 px-6 rounded-full font-bold">
            Preview
          </Button>
          <Button size="sm" onClick={handlePublish} className="h-9 px-8 rounded-full font-black shadow-lg shadow-primary/20">
            Publish Changes
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Puck
          config={puckConfig}
          data={data}
          onPublish={handleSave}
          headerPath="/"
        />
      </div>
    </div>
  );
}
