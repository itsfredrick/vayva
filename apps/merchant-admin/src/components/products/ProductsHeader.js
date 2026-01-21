import { jsx as _jsx } from "react/jsx-runtime";
import { DashboardPageHeader } from "../DashboardPageHeader";
import { Plus, LayoutGrid, ListFilter, Package } from "lucide-react";
import { useRouter } from "next/navigation";
export function ProductsHeader({ isBulkMode, onToggleBulkMode }) {
    const router = useRouter();
    return (_jsx(DashboardPageHeader, { title: "Products", description: "Manage your inventory, pricing, and product variants.", icon: Package, primaryAction: {
            label: "Add Product",
            icon: Plus,
            onClick: () => router.push("/dashboard/products/new")
        }, secondaryAction: {
            label: isBulkMode ? "List View" : "Bulk Edit",
            icon: isBulkMode ? ListFilter : LayoutGrid,
            onClick: onToggleBulkMode
        } }));
}
