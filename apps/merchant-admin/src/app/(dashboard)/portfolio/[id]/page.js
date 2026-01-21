"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, Input, Label, Textarea } from "@vayva/ui";
import { ArrowLeft, Save, Upload, Lock, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
export default function ProjectEditorPage() {
    const params = useParams();
    const router = useRouter();
    const [project, setProject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    // Form State
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [clientMode, setClientMode] = useState(false);
    const [password, setPassword] = useState("");
    // Image State (Mocked uploads for now as backend storage is abstract)
    const [images, setImages] = useState([]);
    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await fetch(`/api/portfolio/${params.id}`);
                const data = await res.json();
                if (data.project) {
                    setProject(data.project);
                    setTitle(data.project.title);
                    setDescription(data.project.description || "");
                    setClientMode(data.project.clientMode);
                    setPassword(data.project.password || "");
                    setImages(Array.isArray(data.project.images) ? data.project.images : []);
                }
            }
            catch (e) {
                toast.error("Failed to load project");
                router.push("/dashboard/portfolio");
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchProject();
    }, [params.id, router]);
    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch(`/api/portfolio/${params.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    description,
                    clientMode,
                    password,
                    images
                })
            });
            if (res.ok) {
                toast.success("Project saved successfully");
            }
            else {
                throw new Error("Failed to save");
            }
        }
        catch (e) {
            toast.error("Error saving changes");
        }
        finally {
            setIsSaving(false);
        }
    };
    const handleImageUpload = (e) => {
        if (e.target.files) {
            // Mock Upload: Read as Data URL for immediate preview (Not production ready for large files, but good for demo)
            // Ideally we upload to blob here.
            Array.from(e.target.files).forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImages(prev => [...prev, {
                            url: reader.result,
                            caption: file.name,
                            id: Date.now() + Math.random().toString()
                        }]);
                };
                reader.readAsDataURL(file);
            });
            toast.success(`${e.target.files.length} images added (Draft)`);
        }
    };
    if (isLoading)
        return _jsx("div", { className: "p-12 text-center text-gray-500", children: "Loading editor..." });
    return (_jsxs("div", { className: "flex flex-col h-[calc(100vh-64px)] overflow-hidden", children: [_jsxs("div", { className: "h-16 border-b bg-white flex items-center justify-between px-6 shrink-0 z-10", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Link, { href: "/dashboard/portfolio", children: _jsx(Button, { variant: "ghost", size: "icon", children: _jsx(ArrowLeft, { size: 18 }) }) }), _jsx("div", { className: "h-6 w-px bg-gray-200" }), _jsxs("div", { children: [_jsx("h1", { className: "font-semibold text-gray-900 truncate max-w-xs", children: title || "Untitled Project" }), _jsxs("span", { className: "text-xs text-gray-500 flex items-center gap-1", children: [clientMode ? _jsx(Lock, { size: 10, className: "text-amber-500" }) : _jsx(Eye, { size: 10, className: "text-green-500" }), clientMode ? "Private / Proofing" : "Public Portfolio"] })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "text-xs text-gray-400 mr-2", children: isSaving ? "Saving..." : "Unsaved changes" }), _jsxs(Button, { onClick: handleSave, disabled: isSaving, children: [isSaving ? _jsx(Loader2, { className: "animate-spin w-4 h-4 mr-2" }) : _jsx(Save, { className: "w-4 h-4 mr-2" }), "Save Changes"] })] })] }), _jsxs("div", { className: "flex flex-1 overflow-hidden", children: [_jsx("div", { className: "flex-1 bg-gray-50 overflow-y-auto p-8", children: _jsxs("div", { className: "max-w-4xl mx-auto space-y-8", children: [_jsxs("div", { className: "border-2 border-dashed border-gray-300 rounded-xl p-12 text-center bg-white hover:bg-gray-50 transition-colors cursor-pointer relative", children: [_jsx("input", { title: "Upload project images", type: "file", multiple: true, accept: "image/*", className: "absolute inset-0 opacity-0 cursor-pointer", onChange: handleImageUpload }), _jsx(Upload, { className: "mx-auto h-10 w-10 text-gray-400 mb-3" }), _jsx("h3", { className: "text-sm font-medium text-gray-900", children: "Upload Images" }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Drag & drop or click to select files" })] }), images.length > 0 && (_jsx("div", { className: "columns-2 md:columns-3 gap-4 space-y-4", children: images.map((img, idx) => (_jsxs("div", { className: "break-inside-avoid relative group rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all", children: [_jsx("img", { src: img.url, alt: img.caption, className: "w-full h-auto block" }), _jsx("div", { className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2", children: _jsx(Button, { variant: "ghost", size: "icon", className: "text-white hover:bg-white/20", onClick: () => {
                                                        setImages(prev => prev.filter((_, i) => i !== idx));
                                                    }, children: _jsx(Trash2, { size: 16 }) }) })] }, idx))) }))] }) }), _jsxs("div", { className: "w-80 bg-white border-l p-6 overflow-y-auto shrink-0 flex flex-col gap-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-4", children: "Project Settings" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "title", children: "Title" }), _jsx(Input, { id: "title", value: title, onChange: e => setTitle(e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "desc", children: "Description" }), _jsx(Textarea, { id: "desc", value: description, onChange: e => setDescription(e.target.value), rows: 3 })] })] })] }), _jsx("div", { className: "h-px bg-gray-100" }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-4", children: "Client Proofing" }), _jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { className: "space-y-0.5", children: [_jsx(Label, { className: "text-base", children: "Client Mode" }), _jsx("p", { className: "text-xs text-gray-500", children: "Enable private access & commenting." })] }), _jsx(Switch, { checked: clientMode, onCheckedChange: setClientMode })] }), clientMode && (_jsxs("div", { className: "bg-amber-50 rounded-lg p-4 border border-amber-100 space-y-3 animate-in fade-in slide-in-from-top-2", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "pwd", className: "text-amber-900", children: "Access Password" }), _jsx(Input, { id: "pwd", type: "text", value: password, onChange: e => setPassword(e.target.value), className: "bg-white", placeholder: "Optional" })] }), _jsxs("div", { className: "text-xs text-amber-700 flex items-start gap-1.5", children: [_jsx(Lock, { size: 12, className: "mt-0.5 shrink-0" }), "Users can view and leave comments on specific images."] })] }))] })] })] })] }));
}
function Loader2(props) {
    return _jsx("svg", { ...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("path", { d: "M21 12a9 9 0 1 1-6.219-8.56" }) });
}
