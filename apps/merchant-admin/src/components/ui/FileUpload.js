"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { Button } from "@vayva/ui";
import { UploadCloud, X, File as FileIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
export function FileUpload({ value, onChange, accept = "*/*", label = "Upload File", maxSizeMB = 10 }) {
    const [uploading, setUploading] = useState(false);
    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        // Size check here for immediate feedback
        if (file.size > maxSizeMB * 1024 * 1024) {
            toast.error(`File too large. Max ${maxSizeMB}MB.`);
            return;
        }
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await fetch("/api/storage/upload", {
                method: "POST",
                body: formData
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Upload failed");
            }
            onChange(data.url);
            toast.success("File uploaded successfully");
        }
        catch (err) {
            toast.error(err.message);
        }
        finally {
            setUploading(false);
            // Reset input
            e.target.value = "";
        }
    };
    const handleRemove = () => {
        onChange("");
    };
    if (value) {
        return (_jsxs("div", { className: "relative border rounded-lg p-4 flex items-center gap-3 bg-gray-50", children: [_jsx("div", { className: "h-10 w-10 bg-white rounded-md border flex items-center justify-center", children: value.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (_jsx("img", { src: value, alt: "Preview", className: "h-full w-full object-cover rounded-md" })) : (_jsx(FileIcon, { className: "h-5 w-5 text-gray-400" })) }), _jsx("div", { className: "flex-1 min-w-0", children: _jsx("p", { className: "text-sm font-medium truncate text-blue-600 hover:underline", children: _jsx("a", { href: value, target: "_blank", rel: "noopener noreferrer", children: value.split('/').pop() }) }) }), _jsx(Button, { variant: "ghost", size: "icon", onClick: handleRemove, className: "h-8 w-8 text-gray-500 hover:text-red-500", children: _jsx(X, { size: 16 }) })] }));
    }
    return (_jsx("div", { className: "w-full", children: _jsx("label", { className: "cursor-pointer border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors gap-2 text-center relative", children: uploading ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "h-8 w-8 text-blue-500 animate-spin" }), _jsx("span", { className: "text-sm text-gray-500", children: "Uploading..." })] })) : (_jsxs(_Fragment, { children: [_jsx(UploadCloud, { className: "h-8 w-8 text-gray-400" }), _jsx("span", { className: "text-sm font-medium text-gray-700", children: label }), _jsxs("span", { className: "text-xs text-gray-400", children: ["Max ", maxSizeMB, "MB"] }), _jsx("input", { type: "file", className: "hidden", accept: accept, onChange: handleFileChange, disabled: uploading })] })) }) }));
}
