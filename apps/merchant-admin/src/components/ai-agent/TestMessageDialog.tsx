
import { useState } from "react";
import { Button, Input } from "@vayva/ui";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function TestMessageDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void, draftConfig: any }) {
    const [channel, setChannel] = useState("whatsapp");
    const [target, setTarget] = useState("");
    const [isSending, setIsSending] = useState(false);

    const handleSend = async () => {
        if (!target) {
            toast.error("Please enter a target destination");
            return;
        }
        setIsSending(true);
        try {
            const res = await fetch("/api/ai-agent/test-message", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ channel, target })
            });
            if (!res.ok) throw new Error("Send failed");
            toast.success("Test message sent!");
            onOpenChange(false);
        } catch (error) {
            toast.error("Failed to send test message");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Send Test Message</DialogTitle>
                    <DialogDescription>
                        Send a real message to test your agent's current configuration.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Channel</Label>
                        <Select value={channel} onValueChange={setChannel}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                                <SelectItem value="email">Email</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>{channel === "whatsapp" ? "Phone Number" : "Email Address"}</Label>
                        <Input
                            value={target}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTarget(e.target.value)}
                            placeholder={channel === "whatsapp" ? "+234..." : "test@example.com"}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSend} disabled={isSending}>
                        {isSending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Send Test
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
