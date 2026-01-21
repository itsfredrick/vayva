"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { format } from "date-fns";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, Input } from "@vayva/ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
export function TemplateManager({ templates, onRefresh }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newTemplate, setNewTemplate] = useState({
        name: "",
        language: "en",
        category: "UTILITY",
        bodyText: "",
    });
    const handleCreate = async () => {
        if (!newTemplate.name || !newTemplate.bodyText) {
            toast.error("Name and Body Text are required");
            return;
        }
        setIsSubmitting(true);
        try {
            // Transform bodyText into WhatsApp component structure
            const components = [{
                    type: "BODY",
                    text: newTemplate.bodyText
                }];
            const res = await fetch("/api/settings/whatsapp/templates", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: newTemplate.name,
                    language: newTemplate.language,
                    category: newTemplate.category,
                    components,
                    status: "PENDING"
                }),
            });
            if (!res.ok)
                throw new Error("Failed to create template");
            toast.success("Template created");
            setIsOpen(false);
            setNewTemplate({ name: "", language: "en", category: "UTILITY", bodyText: "" });
            onRefresh();
        }
        catch (error) {
            toast.error("Error creating template");
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleDelete = async (id) => {
        if (!confirm("Delete this template?"))
            return;
        try {
            const res = await fetch(`/api/settings/whatsapp/templates?id=${id}`, {
                method: "DELETE"
            });
            if (!res.ok)
                throw new Error("Failed");
            toast.success("Template deleted");
            onRefresh();
        }
        catch (error) {
            toast.error("Error deleting template");
        }
    };
    const getStatusBadge = (status) => {
        switch (status) {
            case "APPROVED": return _jsx(Badge, { className: "bg-green-500", children: "Approved" });
            case "REJECTED": return _jsx(Badge, { variant: "destructive", children: "Rejected" });
            default: return _jsx(Badge, { variant: "secondary", children: "Pending" });
        }
    };
    return (_jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between", children: [_jsxs("div", { children: [_jsx(CardTitle, { children: "Message Templates" }), _jsx(CardDescription, { children: "Manage approved WhatsApp templates for notifications." })] }), _jsxs(Dialog, { open: isOpen, onOpenChange: setIsOpen, children: [_jsx(DialogTrigger, { asChild: true, children: _jsxs(Button, { children: [_jsx(Plus, { className: "mr-2 h-4 w-4" }), " Create Template"] }) }), _jsxs(DialogContent, { className: "sm:max-w-[425px]", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "New Template" }), _jsx(DialogDescription, { children: "Create a template to send notifications. It will be auto-approved in sandbox." })] }), _jsxs("div", { className: "grid gap-4 py-4", children: [_jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { children: "Template Name" }), _jsx(Input, { placeholder: "order_update_v1", value: newTemplate.name, onChange: (e) => setNewTemplate({ ...newTemplate, name: e.target.value.toLowerCase().replace(/\s/g, '_') }) }), _jsx("span", { className: "text-xs text-muted-foreground", children: "LowerCase, underscores only." })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { children: "Category" }), _jsxs(Select, { value: newTemplate.category, onValueChange: (val) => setNewTemplate({ ...newTemplate, category: val }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "UTILITY", children: "Utility" }), _jsx(SelectItem, { value: "MARKETING", children: "Marketing" }), _jsx(SelectItem, { value: "AUTHENTICATION", children: "Auth" })] })] })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { children: "Language" }), _jsxs(Select, { value: newTemplate.language, onValueChange: (val) => setNewTemplate({ ...newTemplate, language: val }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "en", children: "English (en)" }), _jsx(SelectItem, { value: "en_US", children: "English (US)" })] })] })] })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { children: "Body Text" }), _jsx(Textarea, { rows: 4, placeholder: "Hello {{1}}, your order {{2}} has been shipped!", value: newTemplate.bodyText, onChange: (e) => setNewTemplate({ ...newTemplate, bodyText: e.target.value }) }), _jsxs("span", { className: "text-xs text-muted-foreground", children: ["Use ", "{{1}}", ", ", "{{2}}", " for variables."] })] }), _jsxs("div", { className: "mt-2 p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-900/20", children: [_jsx("span", { className: "text-xs font-semibold text-green-800 dark:text-green-400 mb-1 block", children: "Preview" }), _jsx("p", { className: "text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap", children: newTemplate.bodyText || "Message content..." })] })] }), _jsx(DialogFooter, { children: _jsx(Button, { onClick: handleCreate, disabled: isSubmitting, children: "create" }) })] })] })] }), _jsx(CardContent, { children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Name" }), _jsx(TableHead, { children: "Category" }), _jsx(TableHead, { children: "Language" }), _jsx(TableHead, { children: "Status" }), _jsx(TableHead, { children: "Created" }), _jsx(TableHead, { className: "text-right", children: "Actions" })] }) }), _jsxs(TableBody, { children: [templates?.map((t) => (_jsxs(TableRow, { children: [_jsx(TableCell, { className: "font-medium font-mono text-xs", children: t.name }), _jsx(TableCell, { children: t.category }), _jsx(TableCell, { children: t.language }), _jsx(TableCell, { children: getStatusBadge(t.status) }), _jsx(TableCell, { children: format(new Date(t.createdAt), "MMM d, yyyy") }), _jsx(TableCell, { className: "text-right", children: _jsx(Button, { variant: "ghost", size: "icon", onClick: () => handleDelete(t.id), children: _jsx(Trash2, { className: "h-4 w-4 text-muted-foreground hover:text-red-500" }) }) })] }, t.id))), (!templates || templates.length === 0) && (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 6, className: "text-center py-8 text-muted-foreground", children: "No templates found." }) }))] })] }) })] }));
}
