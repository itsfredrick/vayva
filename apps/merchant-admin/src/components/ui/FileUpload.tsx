
"use client";

import { useState } from "react";
import { Button } from "@vayva/ui";
import { UploadCloud, X, File as FileIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FileUploadProps {
    value?: string;
    onChange: (url: string) => void;
    accept?: string;
    label?: string;
    maxSizeMB?: number;
}

export function FileUpload({
    value,
    onChange,
    accept = "*/*",
    label = "Upload File",
    maxSizeMB = 10
}: FileUploadProps) {
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

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
        } catch (err: unknown) {
            toast.error(err.message);
        } finally {
            setUploading(false);
            // Reset input
            e.target.value = "";
        }
    };

    const handleRemove = () => {
        onChange("");
    };

    if (value) {
        return (
            <div className="relative border rounded-lg p-4 flex items-center gap-3 bg-gray-50">
                <div className="h-10 w-10 bg-white rounded-md border flex items-center justify-center">
                    {value.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                        <img src={value} alt="Preview" className="h-full w-full object-cover rounded-md" />
                    ) : (
                        <FileIcon className="h-5 w-5 text-gray-400" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-blue-600 hover:underline">
                        <a href={value} target="_blank" rel="noopener noreferrer">
                            {value.split('/').pop()}
                        </a>
                    </p>
                </div>
                <Button variant="ghost" size="icon" onClick={handleRemove} className="h-8 w-8 text-gray-500 hover:text-red-500">
                    <X size={16} />
                </Button>
            </div>
        );
    }

    return (
        <div className="w-full">
            <label className="cursor-pointer border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors gap-2 text-center relative">
                {uploading ? (
                    <>
                        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                        <span className="text-sm text-gray-500">Uploading...</span>
                    </>
                ) : (
                    <>
                        <UploadCloud className="h-8 w-8 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">{label}</span>
                        <span className="text-xs text-gray-400">Max {maxSizeMB}MB</span>
                        <input
                            type="file"
                            className="hidden"
                            accept={accept}
                            onChange={handleFileChange}
                            disabled={uploading}
                        />
                    </>
                )}
            </label>
        </div>
    );
}
