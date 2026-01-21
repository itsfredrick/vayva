import { jsx as _jsx } from "react/jsx-runtime";
export const Textarea = ({ value, onChange, placeholder, rows, className, }) => (_jsx("textarea", { className: `w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all resize-none ${className}`, value: value, onChange: onChange, placeholder: placeholder, rows: rows }));
