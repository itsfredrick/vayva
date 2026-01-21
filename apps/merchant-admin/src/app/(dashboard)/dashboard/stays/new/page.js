import { jsx as _jsx } from "react/jsx-runtime";
import { DynamicResourceForm } from "@/components/resources/DynamicResourceForm";
export default function NewStayPage() {
    return _jsx(DynamicResourceForm, { primaryObject: "listing", mode: "create" });
}
