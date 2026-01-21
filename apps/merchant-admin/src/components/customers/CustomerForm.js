"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button, Input, Label, Icon } from "@vayva/ui";
import { useRouter } from "next/navigation";
export function CustomerForm({ initialData, onSuccess }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    // Split name if initialData exists
    const initialFirstName = initialData?.name?.split(" ")[0] || "";
    const initialLastName = initialData?.name?.split(" ").slice(1).join(" ") || "";
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        const formData = new FormData(e.currentTarget);
        const data = {
            firstName: formData.get("firstName"),
            lastName: formData.get("lastName"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            notes: formData.get("notes"),
        };
        try {
            const url = initialData
                ? `/api/customers/${initialData.id}`
                : "/api/customers";
            const method = initialData ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Something went wrong");
            }
            router.refresh();
            onSuccess();
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [error && (_jsx("div", { className: "p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100", children: error })), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "firstName", children: "First Name" }), _jsx(Input, { id: "firstName", name: "firstName", defaultValue: initialFirstName, placeholder: "e.g. Chioma", required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "lastName", children: "Last Name" }), _jsx(Input, { id: "lastName", name: "lastName", defaultValue: initialLastName, placeholder: "e.g. Okeke", required: true })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "email", children: "Email Address" }), _jsx(Input, { id: "email", name: "email", type: "email", defaultValue: initialData?.email, placeholder: "customer@example.com" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "phone", children: "Phone Number" }), _jsx(Input, { id: "phone", name: "phone", type: "tel", defaultValue: initialData?.phone, placeholder: "+234 ...", required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "notes", children: "Internal Notes" }), _jsx("textarea", { id: "notes", name: "notes", className: "w-full min-h-[100px] p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black/5 focus:border-black transition-all text-sm", placeholder: "Add any private notes about this customer...", defaultValue: initialData?.notes })] }), _jsx("div", { className: "pt-4 flex gap-3", children: _jsxs(Button, { type: "submit", className: "flex-1", disabled: isLoading, children: [isLoading ? (_jsx(Icon, { name: "Loader2", className: "animate-spin mr-2", size: 16 })) : null, initialData ? "Update Customer" : "Create Customer"] }) })] }));
}
