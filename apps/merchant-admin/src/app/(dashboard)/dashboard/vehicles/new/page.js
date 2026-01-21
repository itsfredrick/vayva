import { jsx as _jsx } from "react/jsx-runtime";
import { DynamicResourceForm } from "@/components/resources/DynamicResourceForm";
export default function NewVehiclePage() {
    return _jsx(DynamicResourceForm, { primaryObject: "listing", mode: "create" });
}
