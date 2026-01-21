import { jsx as _jsx } from "react/jsx-runtime";
import { DynamicResourceForm } from "@/components/resources/DynamicResourceForm";
export default function NewEventPage() {
    return _jsx(DynamicResourceForm, { primaryObject: "event", mode: "create" });
}
