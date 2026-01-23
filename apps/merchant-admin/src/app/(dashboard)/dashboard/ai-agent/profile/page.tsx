
"use client";

import { useEffect, useState } from "react";
import { Button, Input } from "@vayva/ui";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Save, Send } from "lucide-react";
import { AgentPreview } from "@/components/ai-agent/AgentPreview";
import { TestMessageDialog } from "@/components/ai-agent/TestMessageDialog";

interface AgentConfig {
    name: string;
    avatarUrl: string;
    tone: string;
    signature: string;
}

interface AgentProfile {
    id: string;
    name: string;
    tone: string;
    signature: string;
    avatarUrl: string;
    config?: AgentConfig;
}

export default function AgentProfilePage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [agent, setAgent] = useState<AgentProfile | null>(null);
    const [draft, setDraft] = useState<AgentConfig>({
        name: "",
        avatarUrl: "",
        tone: "professional",
        signature: ""
    });
    const [isTestOpen, setIsTestOpen] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const res = await fetch("/api/ai-agent/profile");
            const data: AgentProfile = await res.json();
            setAgent(data);
            // Initialize draft with config or current values
            const initialDraft: AgentConfig = data.config && Object.keys(data.config).length > 0
                ? data.config
                : {
                    name: data.name || "",
                    tone: data.tone || "professional",
                    signature: data.signature || "",
                    avatarUrl: data.avatarUrl || ""
                };
            setDraft(initialDraft);
        } catch (error) {
            toast.error("Failed to load agent profile");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch("/api/ai-agent/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(draft)
            });
            if (!res.ok) throw new Error("Failed to save draft");
            toast.success("Draft saved successfully");
            if (agent) {
                setAgent({ ...agent, config: draft }); // Update local state
            }
        } catch (error) {
            toast.error("Failed to save draft");
        } finally {
            setIsSaving(false);
        }
    };

    const handlePublish = async () => {
        if (!confirm("Are you sure you want to publish these changes live?")) return;
        setIsSaving(true);
        try {
            const res = await fetch("/api/ai-agent/publish", { method: "POST" });
            if (!res.ok) throw new Error("Failed to publish");
            toast.success("Agent profile published!");
            loadProfile(); // Reload to sync
        } catch (error) {
            toast.error("Failed to publish changes");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto p-6">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Agent Identity</h1>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setIsTestOpen(true)}>
                            <Send className="w-4 h-4 mr-2" />
                            Test
                        </Button>
                        <Button onClick={handleSave} disabled={isSaving}>
                            <Save className="w-4 h-4 mr-2" />
                            Save Draft
                        </Button>
                    </div>
                </div>

                <div className="space-y-4 bg-white p-6 rounded-lg border shadow-sm">
                    <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                            value={draft.name || ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDraft({ ...draft, name: e.target.value })}
                            placeholder="e.g. Vayva Assistant"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Avatar URL</Label>
                        <Input
                            value={draft.avatarUrl || ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDraft({ ...draft, avatarUrl: e.target.value })}
                            placeholder="https://..."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Tone</Label>
                        <Select
                            value={draft.tone || "professional"}
                            onValueChange={(val: string) => setDraft({ ...draft, tone: val })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="professional">Professional</SelectItem>
                                <SelectItem value="friendly">Friendly</SelectItem>
                                <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                                <SelectItem value="empathetic">Empathetic</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Signature</Label>
                        <Textarea
                            value={draft.signature || ""}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDraft({ ...draft, signature: e.target.value })}
                            placeholder="e.g. - Sent by Vayva Agent"
                        />
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between border">
                    <div>
                        <p className="font-medium text-sm">Publish Changes</p>
                        <p className="text-xs text-muted-foreground">Make your draft changes live across all channels.</p>
                    </div>
                    <Button onClick={handlePublish} disabled={isSaving} variant="primary">Publish Live</Button>
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-xl font-semibold">Live Preview</h2>
                <div className="bg-gray-100 p-8 rounded-xl min-h-[500px] flex items-center justify-center border">
                    <AgentPreview config={draft} />
                </div>
            </div>

            <TestMessageDialog
                open={isTestOpen}
                onOpenChange={setIsTestOpen}
                draftConfig={draft}
            />
        </div>
    );
}
