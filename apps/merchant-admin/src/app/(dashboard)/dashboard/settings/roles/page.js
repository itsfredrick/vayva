"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Button, Card, Icon, Input, Checkbox } from "@vayva/ui";
import { toast } from "sonner";
import { PERMISSION_GROUPS } from "@/lib/auth/permissions";
export default function RolesSettingsPage() {
    const [roles, setRoles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentRole, setCurrentRole] = useState({
        name: "",
        description: "",
        permissionIds: []
    });
    const fetchRoles = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/settings/roles");
            const data = await res.json();
            setRoles(data);
        }
        catch (err) {
            toast.error("Failed to load roles");
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchRoles();
    }, []);
    const handleSave = async () => {
        if (!currentRole.name)
            return toast.error("Role name is required");
        try {
            const res = await fetch("/api/settings/roles", {
                method: "POST",
                body: JSON.stringify(currentRole)
            });
            if (res.ok) {
                toast.success("Role saved successfully");
                setIsEditing(false);
                fetchRoles();
            }
        }
        catch (err) {
            toast.error("Failed to save role");
        }
    };
    const togglePermission = (permId) => {
        const ids = [...currentRole.permissionIds];
        if (ids.includes(permId)) {
            setCurrentRole({ ...currentRole, permissionIds: ids.filter(id => id !== permId) });
        }
        else {
            setCurrentRole({ ...currentRole, permissionIds: [...ids, permId] });
        }
    };
    if (isEditing) {
        return (_jsxs("div", { className: "p-6 max-w-4xl mx-auto space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h1", { className: "text-2xl font-bold", children: currentRole.id ? "Edit Role" : "Create Custom Role" }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: "outline", onClick: () => setIsEditing(false), children: "Cancel" }), _jsx(Button, { onClick: handleSave, children: "Save Role" })] })] }), _jsxs(Card, { className: "p-6 space-y-4", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm font-bold", children: "Role Name" }), _jsx(Input, { placeholder: "e.g. Content Manager", value: currentRole.name, onChange: e => setCurrentRole({ ...currentRole, name: e.target.value }) })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm font-bold", children: "Description" }), _jsx(Input, { placeholder: "Short summary of what this role can do", value: currentRole.description, onChange: e => setCurrentRole({ ...currentRole, description: e.target.value }) })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "font-bold text-lg", children: "Permissions" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: PERMISSION_GROUPS.map(group => (_jsxs(Card, { className: "p-6 flex flex-col gap-4", children: [_jsxs("div", { className: "flex items-center gap-2 border-b pb-2", children: [_jsx(Icon, { name: "Shield", size: 16, className: "text-indigo-600" }), _jsx("h4", { className: "font-bold", children: group.name })] }), _jsx("div", { className: "space-y-3", children: group.permissions.map(perm => (_jsxs("div", { className: "flex items-start gap-3", children: [_jsx(Checkbox, { checked: currentRole.permissionIds.includes(perm.id), onCheckedChange: () => togglePermission(perm.id), id: perm.id }), _jsxs("label", { htmlFor: perm.id, className: "flex flex-col cursor-pointer", children: [_jsx("span", { className: "text-sm font-bold", children: perm.label }), _jsx("span", { className: "text-xs text-gray-500", children: perm.description })] })] }, perm.id))) })] }, group.id))) })] })] }));
    }
    return (_jsxs("div", { className: "p-6 max-w-6xl mx-auto space-y-8", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-end justify-between gap-4", children: [_jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("h1", { className: "text-4xl font-black tracking-tight text-black", children: "Roles & Permissions" }), _jsx("p", { className: "text-gray-500", children: "Define custom access levels for your staff. Limit sensitive data visibility." })] }), _jsxs(Button, { onClick: () => {
                            setCurrentRole({ name: "", description: "", permissionIds: [] });
                            setIsEditing(true);
                        }, children: [_jsx(Icon, { name: "Plus", size: 18, className: "mr-2" }), "Create Role"] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs(Card, { className: "p-6 bg-gray-50/50 border-dashed", children: [_jsx("h3", { className: "font-bold text-gray-400 uppercase text-xs tracking-widest mb-4", children: "System Roles" }), _jsx("div", { className: "flex flex-col gap-3", children: ["Owner", "Admin", "Finance", "Support", "Viewer"].map(r => (_jsxs("div", { className: "flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border border-gray-100", children: [_jsx("span", { className: "font-bold", children: r }), _jsx("span", { className: "text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-400", children: "Fixed" })] }, r))) })] }), _jsxs("div", { className: "md:col-span-2 space-y-4", children: [_jsx("h3", { className: "font-bold uppercase text-xs tracking-widest text-indigo-600", children: "Custom Roles" }), isLoading ? (_jsx("div", { className: "p-12 text-center text-gray-400", children: "Loading roles..." })) : roles.length === 0 ? (_jsx("div", { className: "p-12 text-center border-2 border-dashed rounded-3xl text-gray-400", children: "No custom roles created yet." })) : (roles.map(role => (_jsxs(Card, { className: "p-6 flex items-center justify-between", children: [_jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("h4", { className: "font-bold text-lg", children: role.name }), _jsx("p", { className: "text-sm text-gray-500", children: role.description || "No description provided." }), _jsxs("div", { className: "flex gap-2 mt-2", children: [_jsxs("span", { className: "text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full font-bold", children: [role.RolePermission?.length || 0, " Permissions"] }), _jsxs("span", { className: "text-xs bg-gray-50 text-gray-500 px-2 py-1 rounded-full", children: [role._count?.Membership || 0, " Staff Members"] })] })] }), _jsx("div", { className: "flex gap-2", children: _jsx(Button, { variant: "outline", size: "sm", onClick: () => {
                                                setCurrentRole({
                                                    id: role.id,
                                                    name: role.name,
                                                    description: role.description,
                                                    permissionIds: role.RolePermission.map((rp) => rp.Permission.name)
                                                });
                                                setIsEditing(true);
                                            }, children: "Edit" }) })] }, role.id))))] })] })] }));
}
