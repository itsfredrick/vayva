import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Icon, cn, Button } from "@vayva/ui";
export const ThemeSelector = () => {
    const [themes, setThemes] = useState([]);
    const [activeTheme, setActiveTheme] = useState("minimal");
    useEffect(() => {
        fetch("/api/control-center/themes")
            .then((res) => res.json())
            .then(setThemes)
            .catch(console.error);
    }, []);
    const handleApply = async (id) => {
        setActiveTheme(id);
        try {
            await fetch("/api/control-center/themes/apply", {
                method: "POST",
                body: JSON.stringify({ themeId: id }),
            });
        }
        catch (e) {
            console.error("Failed to apply theme", e);
        }
    };
    if (themes.length === 0)
        return null;
    return (_jsxs("div", { className: "bg-white border border-gray-200 rounded-2xl p-6", children: [_jsxs("h4", { className: "text-sm font-bold text-gray-900 mb-4 flex items-center gap-2", children: [_jsx(Icon, { name: "Palette", size: 16 }), " Theme & Style"] }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: themes.map((theme) => (_jsxs("div", { onClick: () => handleApply(theme.id), className: cn("cursor-pointer rounded-xl border p-3 transition-all", activeTheme === theme.id
                        ? "border-black bg-gray-50 ring-1 ring-black"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-sm"), children: [_jsx("div", { className: "flex gap-1 mb-3", children: theme.colors.map((c, i) => (_jsx("div", { className: "w-4 h-4 rounded-full border border-gray-100 shadow-sm", style: { backgroundColor: c } }, i))) }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h5", { className: "font-bold text-sm text-gray-900", children: theme.name }), _jsx("p", { className: "text-[10px] text-gray-500 font-medium", children: theme.font })] }), activeTheme === theme.id && (_jsx(Icon, { name: "Check", size: 14, className: "text-green-600" }))] })] }, theme.id))) }), _jsx("div", { className: "mt-4 pt-4 border-t border-gray-100 flex justify-end", children: _jsxs(Button, { className: "text-xs font-bold text-gray-400 hover:text-black flex items-center gap-1", variant: "ghost", children: ["Advanced Customization ", _jsx(Icon, { name: "ChevronRight", size: 12 })] }) })] }));
};
