
import { Button } from "@vayva/ui";
import { QrCode } from "lucide-react";

export default function CheckInPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Guest Check-in</h2>
                    <p className="text-muted-foreground">Scan tickets and manage event entry.</p>
                </div>
                <Button>
                    <QrCode className="mr-2 h-4 w-4" /> Open Scanner
                </Button>
            </div>
            <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">Waiting for guests...</p>
            </div>
        </div>
    );
}
