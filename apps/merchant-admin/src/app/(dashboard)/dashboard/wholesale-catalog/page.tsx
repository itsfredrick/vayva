
import { Button } from "@vayva/ui";
import { Plus } from "lucide-react";

export default function WholesaleCatalogPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Wholesale Catalog</h2>
                    <p className="text-muted-foreground">Manage B2B products and volume pricing.</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Product
                </Button>
            </div>
            <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">No products in wholesale catalog.</p>
            </div>
        </div>
    );
}
