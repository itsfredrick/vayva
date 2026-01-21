import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function TrendChart({ data, color = "#46EC13", height = 200, }) {
    // Determine bounds
    const max = Math.max(...data);
    const min = 0;
    const range = max - min;
    // Create points
    const points = data
        .map((val, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - ((val - min) / range) * 80; // keep 80% height to avoid clipping
        return `${x},${y}`;
    })
        .join(" ");
    return (_jsxs("div", { className: "w-full relative", style: { height: `${height}px` }, children: [_jsxs("svg", { viewBox: "0 0 100 100", preserveAspectRatio: "none", className: "w-full h-full overflow-visible", children: [_jsx("defs", { children: _jsxs("linearGradient", { id: `gradient-${color}`, x1: "0", x2: "0", y1: "0", y2: "1", children: [_jsx("stop", { offset: "0%", stopColor: color, stopOpacity: "0.2" }), _jsx("stop", { offset: "100%", stopColor: color, stopOpacity: "0" })] }) }), _jsx("path", { d: `M0,100 L0,${100 - ((data[0] - min) / range) * 80} ${points
                            .split(" ")
                            .map((p) => "L" + p)
                            .join(" ")} L100,100 Z`, fill: `url(#gradient-${color})` }), _jsx("polyline", { points: points, fill: "none", stroke: color, strokeWidth: "2", vectorEffect: "non-scaling-stroke" })] }), _jsxs("div", { className: "absolute bottom-0 inset-x-0 flex justify-between text-[10px] text-zinc-500 font-mono pt-2 border-t border-white/5 uppercase tracking-wider", children: [_jsx("span", { children: "Oct 01" }), _jsx("span", { children: "Oct 08" }), _jsx("span", { children: "Oct 15" }), _jsx("span", { children: "Oct 22" }), _jsx("span", { children: "Oct 29" })] })] }));
}
