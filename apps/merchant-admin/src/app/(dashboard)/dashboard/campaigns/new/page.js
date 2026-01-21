import { jsx as _jsx } from "react/jsx-runtime";
import { DynamicResourceForm } from "@/components/resources/DynamicResourceForm";
export default function NewCampaignPage() {
    return _jsx(DynamicResourceForm, { primaryObject: "campaign", mode: "create" });
}
