
"use client";

import { useState } from "react";
import { Button, Icon, cn } from "@vayva/ui";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function CreativeEditorPage() {
    const [activeTab, setActiveTab] = useState("graphics");
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            toast.success("Draft saved successfully");
        }, 1500);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header */}
            <header className="px-8 py-4 border-b border-gray-100 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-10">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Creative Editor</h1>
                    <p className="text-sm text-gray-500">Design high-converting marketing visuals for your store.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm">Preview</Button>
                    <Button size="sm" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Draft"}
                    </Button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Toolbar */}
                <aside className="w-16 border-r border-gray-100 flex flex-col items-center py-6 gap-6 bg-gray-50/50">
                    <ToolbarButton icon="MousePointer2" active />
                    <ToolbarButton icon="Type" />
                    <ToolbarButton icon="Image" />
                    <ToolbarButton icon="Square" />
                    <ToolbarButton icon="Smile" />
                    <div className="mt-auto">
                        <ToolbarButton icon="Settings" />
                    </div>
                </aside>

                {/* Main Canvas Area */}
                <main className="flex-1 bg-gray-100/50 relative flex items-center justify-center p-12 overflow-auto">
                    <motion.div 
                        layoutId="canvas"
                        className="bg-white shadow-2xl rounded-lg overflow-hidden w-full max-w-2xl aspect-video relative group"
                        style={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
                    >
                        {/* Mock Canvas Content */}
                        <div className="absolute inset-0 flex items-center justify-center border-2 border-dashed border-gray-200 m-8 rounded-lg">
                            <div className="text-center">
                                <Icon name="Image" size={48} className="text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-400 font-medium">Click to add assets or drag & drop</p>
                                <p className="text-xs text-gray-300 mt-1">Supports PNG, JPG, and Motion Assets</p>
                            </div>
                        </div>

                        {/* Top Bar for Selection */}
                        <div className="absolute top-0 left-0 right-0 h-10 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center px-4 gap-2">
                             <div className="w-2 h-2 rounded-full bg-blue-500" />
                             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Main Canvas layer</span>
                        </div>
                    </motion.div>
                </main>

                {/* Right Properties Panel */}
                <aside className="w-80 border-l border-gray-100 bg-white p-6 overflow-y-auto">
                    <Tabs defaultValue="properties">
                        <TabsList className="w-full mb-6">
                            <TabsTrigger value="properties" className="flex-1">Properties</TabsTrigger>
                            <TabsTrigger value="layers" className="flex-1">Layers</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="properties" className="space-y-6">
                            <section>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Canvas Settings</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label htmlFor="canvas-width" className="text-[11px] font-medium text-gray-500">Width</label>
                                        <input id="canvas-width" title="Canvas Width" type="text" className="w-full px-2 py-1.5 border rounded-lg text-sm bg-gray-50" defaultValue="1920" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label htmlFor="canvas-height" className="text-[11px] font-medium text-gray-500">Height</label>
                                        <input id="canvas-height" title="Canvas Height" type="text" className="w-full px-2 py-1.5 border rounded-lg text-sm bg-gray-50" defaultValue="1080" />
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Background</h3>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded border bg-white shadow-sm cursor-pointer" title="Color Picker" />
                                    <input title="Background Color" type="text" className="flex-1 px-2 py-1.5 border rounded-lg text-sm bg-gray-50" defaultValue="#FFFFFF" />
                                </div>
                            </section>

                            <section>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Active Layer</h3>
                                <div className="p-4 rounded-xl border border-dashed border-gray-200 text-center">
                                    <p className="text-xs text-gray-400">No element selected</p>
                                </div>
                            </section>
                        </TabsContent>

                        <TabsContent value="layers">
                            <div className="space-y-2">
                                <LayerItem name="Background" active />
                            </div>
                        </TabsContent>
                    </Tabs>
                </aside>
            </div>
        </div>
    );
}

function ToolbarButton({ icon, active }: { icon: any, active?: boolean }) {
    return (
        <Button 
          title={`Tool: ${icon}`}
          className={cn(
            "p-2.5 rounded-xl transition-all",
            active ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "text-gray-400 hover:bg-gray-100"
        )}>
            <Icon name={icon} size={20} />
        </Button>
    );
}

function LayerItem({ name, active }: { name: string, active?: boolean }) {
    return (
        <div className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors",
            active ? "bg-indigo-50 text-indigo-700 font-medium" : "hover:bg-gray-50 text-gray-600"
        )}>
            <Icon name="Layers" size={14} className={active ? "text-indigo-500" : "text-gray-400"} />
            {name}
        </div>
    );
}
