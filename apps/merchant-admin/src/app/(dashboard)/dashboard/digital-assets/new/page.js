import { jsx as _jsx } from "react/jsx-runtime";
import { DynamicResourceForm } from "@/components/resources/DynamicResourceForm";
export default function NewDigitalAssetPage() {
    return _jsx(DynamicResourceForm, { primaryObject: "digital_asset", mode: "create" });
}
