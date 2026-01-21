
import { DeliveryForm } from "./delivery-form";

export default function DeliverySettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Delivery Preferences</h3>
                <p className="text-sm text-muted-foreground">
                    Configure how your store handles deliveries, radius, and fees.
                </p>
            </div>
            <DeliveryForm />
        </div>
    );
}
