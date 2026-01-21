"use client";

import { Button, Card, Input, Label, Textarea } from "@vayva/ui";
import { ArrowLeft, Save, Upload, Lock, Clock, Eye, Trash2, GripVertical, Check } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Switch } from "@/components/ui/switch";



export default function ProjectEditorPage() {
    const params = useParams();
    const router = useRouter();
    const [project, setProject] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Form State
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [clientMode, setClientMode] = useState(false);
    const [password, setPassword] = useState("");

    // Image State (Mocked uploads for now as backend storage is abstract)
    const [images, setImages] = useState<any[]>([]);

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
            } catch (e) {
                toast.error("Failed to load project");
                router.push("/dashboard/portfolio");
            } finally {
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
            } else {
                throw new Error("Failed to save");
            }
        } catch (e) {
            toast.error("Error saving changes");
        } finally {
            setIsSaving(false);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            // Mock Upload: Read as Data URL for immediate preview (Not production ready for large files, but good for demo)
            // Ideally we upload to blob here.
            Array.from(e.target.files).forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImages(prev => [...prev, {
                        url: reader.result as string,
                        caption: file.name,
                        id: Date.now() + Math.random().toString()
                    }]);
                };
                reader.readAsDataURL(file);
            });
            toast.success(`${e.target.files.length} images added (Draft)`);
        }
    };

    if (isLoading) return <div className="p-12 text-center text-gray-500">Loading editor...</div>;

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
            {/* Toolbar */}
            <div className="h-16 border-b bg-white flex items-center justify-between px-6 shrink-0 z-10">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/portfolio">
                        <Button variant="ghost" size="icon"><ArrowLeft size={18} /></Button>
                    </Link>
                    <div className="h-6 w-px bg-gray-200" />
                    <div>
                        <h1 className="font-semibold text-gray-900 truncate max-w-xs">{title || "Untitled Project"}</h1>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                            {clientMode ? <Lock size={10} className="text-amber-500" /> : <Eye size={10} className="text-green-500" />}
                            {clientMode ? "Private / Proofing" : "Public Portfolio"}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 mr-2">
                        {isSaving ? "Saving..." : "Unsaved changes"}
                    </span>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        Save Changes
                    </Button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Main: Masonry Grid Preview */}
                <div className="flex-1 bg-gray-50 overflow-y-auto p-8">
                    <div className="max-w-4xl mx-auto space-y-8">
                        {/* Empty State / Upload Zone */}
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center bg-white hover:bg-gray-50 transition-colors cursor-pointer relative">
                            <input
                                title="Upload project images"
                                type="file"
                                multiple
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleImageUpload}
                            />
                            <Upload className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                            <h3 className="text-sm font-medium text-gray-900">Upload Images</h3>
                            <p className="text-xs text-gray-500 mt-1">Drag & drop or click to select files</p>
                        </div>

                        {/* Grid */}
                        {images.length > 0 && (
                            <div className="columns-2 md:columns-3 gap-4 space-y-4">
                                {images.map((img, idx) => (
                                    <div key={idx} className="break-inside-avoid relative group rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all">
                                        <img src={img.url} alt={img.caption} className="w-full h-auto block" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={() => {
                                                setImages(prev => prev.filter((_, i) => i !== idx));
                                            }}>
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar: Settings */}
                <div className="w-80 bg-white border-l p-6 overflow-y-auto shrink-0 flex flex-col gap-6">
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Project Settings</h3>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" value={title} onChange={e => setTitle(e.target.value)} />
                            </div>
                            <div>
                                <Label htmlFor="desc">Description</Label>
                                <Textarea id="desc" value={description} onChange={e => setDescription(e.target.value)} rows={3} />
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-gray-100" />

                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Client Proofing</h3>
                        <div className="flex items-start justify-between mb-4">
                            <div className="space-y-0.5">
                                <Label className="text-base">Client Mode</Label>
                                <p className="text-xs text-gray-500">Enable private access & commenting.</p>
                            </div>
                            <Switch checked={clientMode} onCheckedChange={setClientMode} />
                        </div>

                        {clientMode && (
                            <div className="bg-amber-50 rounded-lg p-4 border border-amber-100 space-y-3 animate-in fade-in slide-in-from-top-2">
                                <div>
                                    <Label htmlFor="pwd" className="text-amber-900">Access Password</Label>
                                    <Input
                                        id="pwd"
                                        type="text"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="bg-white"
                                        placeholder="Optional"
                                    />
                                </div>
                                <div className="text-xs text-amber-700 flex items-start gap-1.5">
                                    <Lock size={12} className="mt-0.5 shrink-0" />
                                    Users can view and leave comments on specific images.
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function Loader2(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>;
}
