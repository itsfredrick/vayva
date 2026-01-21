"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Button, Card, Icon, Input } from "@vayva/ui";
import { toast } from "sonner";
export default function DeveloperHubPage() {
    const [apps, setApps] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRegistering, setIsRegistering] = useState(false);
    const [manifestUrl, setManifestUrl] = useState("");
    const fetchApps = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/developer/apps");
            const data = await res.json();
            setApps(data);
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchApps();
    }, []);
    const handleRegister = async () => {
        if (!manifestUrl)
            return;
        try {
            const res = await fetch("/api/developer/apps", {
                method: "POST",
                body: JSON.stringify({ manifestUrl })
            });
            const data = await res.json();
            if (res.ok) {
                toast.success("Extension registered!");
                setIsRegistering(false);
                setManifestUrl("");
                fetchApps();
            }
            else {
                toast.error(data.error);
            }
        }
        catch (err) {
            toast.error("Failed to register");
        }
    };
    return (_jsxs("div", { className: "p-6 max-w-6xl mx-auto space-y-8", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-end justify-between gap-4", children: [_jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("h1", { className: "text-4xl font-black tracking-tight text-black", children: "Developer Hub" }), _jsx("p", { className: "text-gray-500", children: "Register and manage your Vayva extensions. Manifests must be publicly accessible JSON." })] }), _jsxs(Button, { onClick: () => setIsRegistering(true), children: [_jsx(Icon, { name: "Plus", size: 18, className: "mr-2" }), "Register Extension"] })] }), isRegistering && (_jsxs(Card, { className: "p-6 space-y-4", children: [_jsx("h3", { className: "font-bold", children: "Register New Manifest" }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Input, { placeholder: "https://your-server.com/va-extension.json", value: manifestUrl, onChange: e => setManifestUrl(e.target.value) }), _jsx(Button, { onClick: handleRegister, children: "Fetch & Register" }), _jsx(Button, { variant: "outline", onClick: () => setIsRegistering(false), children: "Cancel" })] }), _jsx("p", { className: "text-xs text-gray-400", children: "Vayva will fetch your manifest and attempt to validate its structure." })] })), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: isLoading ? (_jsx("div", { className: "col-span-full py-12 text-center text-gray-400", children: "Loading your apps..." })) : apps.length === 0 ? (_jsx("div", { className: "col-span-full py-12 text-center border-2 border-dashed rounded-3xl text-gray-400", children: "No extensions registered yet. Click \"Register Extension\" to start." })) : (apps.map(app => (_jsxs(Card, { className: "p-6 flex flex-col gap-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "p-2 bg-gray-100 rounded-lg", children: _jsx(Icon, { name: "Code", size: 20 }) }), _jsx("h3", { className: "font-bold", children: app.cachedManifest?.name || app.extensionId })] }), _jsx("span", { className: `text-[10px] font-bold px-2 py-1 rounded-full uppercase ${app.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                        app.status === 'PENDING' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`, children: app.status })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("p", { className: "text-xs text-gray-500 truncate", children: app.manifestUrl }), _jsx("p", { className: "text-sm font-bold mt-2", children: "API Key:" }), _jsxs("div", { className: "p-2 bg-gray-50 rounded font-mono text-[10px] break-all border group relative", children: [app.secretKey, _jsx(Button, { variant: "ghost", className: "absolute right-2 top-1 h-6 w-6 p-0 text-gray-400 hover:text-black", title: "Copy API Key", onClick: () => {
                                                navigator.clipboard.writeText(app.secretKey);
                                                toast.success("API Key copied");
                                            }, children: _jsx(Icon, { name: "Copy", size: 12 }) })] })] }), _jsxs("div", { className: "mt-auto pt-4 border-t flex justify-between items-center", children: [_jsxs("span", { className: "text-[10px] text-gray-400", children: ["v", app.cachedManifest?.version] }), _jsx(Button, { variant: "ghost", size: "sm", className: "text-xs h-auto py-1", children: "View Manifest" })] })] }, app.id)))) })] }));
}
