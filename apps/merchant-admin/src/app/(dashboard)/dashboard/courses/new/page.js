import { jsx as _jsx } from "react/jsx-runtime";
import { DynamicResourceForm } from "@/components/resources/DynamicResourceForm";
export default function NewCoursePage() {
    return _jsx(DynamicResourceForm, { primaryObject: "course", mode: "create" });
}
