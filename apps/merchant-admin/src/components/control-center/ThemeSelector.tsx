import React, { useState, useEffect } from "react";
import { Icon, cn } from "@vayva/ui";

interface Theme {
  id: string;
  name: string;
  colors: string[];
  font: string;
}

export const ThemeSelector = () => {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [activeTheme, setActiveTheme] = useState<string>("minimal");

  useEffect(() => {
    fetch("/api/control-center/themes")
      .then((res) => res.json())
      .then(setThemes)
      .catch(console.error);
  }, []);

  const handleApply = async (id: string) => {
    setActiveTheme(id);
    try {
      await fetch("/api/control-center/themes/apply", {
        method: "POST",
        body: JSON.stringify({ themeId: id }),
      });
    } catch (e) {
      console.error("Failed to apply theme", e);
    }
  };

  if (themes.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Icon name="Palette" size={16} /> Theme & Style
      </h4>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {themes.map((theme) => (
          <div
            key={theme.id}
            onClick={() => handleApply(theme.id)}
            className={cn(
              "cursor-pointer rounded-xl border p-3 transition-all",
              activeTheme === theme.id
                ? "border-black bg-gray-50 ring-1 ring-black"
                : "border-gray-200 hover:border-gray-300 hover:shadow-sm",
            )}
          >
            {/* Color Swatches */}
            <div className="flex gap-1 mb-3">
              {theme.colors.map((c, i) => (
                <div
                  key={i}
                  className="w-4 h-4 rounded-full border border-gray-100 shadow-sm"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>

            <div className="flex justify-between items-center">
              <div>
                <h5 className="font-bold text-sm text-gray-900">
                  {theme.name}
                </h5>
                <p className="text-[10px] text-gray-500 font-medium">
                  {theme.font}
                </p>
              </div>
              {activeTheme === theme.id && (
                <Icon name="Check" size={14} className="text-green-600" />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
        <button className="text-xs font-bold text-gray-400 hover:text-black flex items-center gap-1">
          Advanced Customization <Icon name="ChevronRight" size={12} />
        </button>
      </div>
    </div>
  );
};
