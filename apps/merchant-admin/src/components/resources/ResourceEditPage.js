"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button, Icon } from "@vayva/ui";
import { DynamicResourceForm } from "@/components/resources/DynamicResourceForm";
export function ResourceEditPage({ primaryObject, resourceBasePath, title }) {
    const params = useParams();
    const router = useRouter();
    const id = params.id;
    const [isLoading, setIsLoading] = useState(true);
    const [initialData, setInitialData] = useState(null);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (!id)
            return;
        // Fetch Data
        setIsLoading(true);
        fetch(`/api/resources/${primaryObject}/${id}`)
            .then(async (res) => {
            if (!res.ok) {
                if (res.status === 404)
                    throw new Error("Resource not found");
                throw new Error("Failed to load resource");
            }
            return res.json();
        })
            .then((data) => {
            setInitialData(data);
            setIsLoading(false);
        })
            .catch((err) => {
            console.error(err);
            setError(err.message);
            setIsLoading(false);
            toast.error("Could not load resource");
        });
    }, [id, primaryObject]);
    const handleSuccess = () => {
        toast.success("Updated successfully");
        router.push(`/dashboard/${resourceBasePath}`);
        router.refresh();
    };
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center h-64", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" }) }));
    }
    if (error) {
        return (_jsxs("div", { className: "flex flex-col items-center justify-center h-64 text-center", children: [_jsx(Icon, { name: "AlertTriangle", className: "h-10 w-10 text-red-500 mb-4" }), _jsx("h2", { className: "text-xl font-bold", children: "Error" }), _jsx("p", { className: "text-gray-500 mb-4", children: error }), _jsx(Button, { onClick: () => router.push(`/dashboard/${resourceBasePath}`), children: "Go Back" })] }));
    }
    return (_jsxs("div", { className: "max-w-5xl mx-auto py-8 px-4", children: [_jsxs("div", { className: "mb-6 flex items-center gap-4", children: [_jsxs(Button, { variant: "ghost", size: "sm", onClick: () => router.back(), children: [_jsx(Icon, { name: "ArrowLeft", className: "mr-2 h-4 w-4" }), "Back"] }), _jsx("h1", { className: "text-2xl font-bold capitalize", children: title || `Edit ${primaryObject.replace(/_/g, " ")}` })] }), _jsx(DynamicResourceForm, { primaryObject: primaryObject, mode: "edit", initialData: initialData, onSuccessPath: `/dashboard/${resourceBasePath}`, 
                // Note: DynamicResourceForm usually handles submit internally. 
                // If it accepts `onSuccess` callback, clearer. 
                // I'll assume standard usage from my previous edits or update DynamicResourceForm if needed.
                // Actually, previous DynamicResourceForm logic was: create->submit->toast->redirect.
                // I need to ensure it handles PUT for edit mode.
                // pass the ID?
                resourceId: id })] }));
}
