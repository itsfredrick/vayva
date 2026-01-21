import { jsx as _jsx } from "react/jsx-runtime";
import { DynamicResourceForm } from "@/components/resources/DynamicResourceForm";
export default function NewPostPage() {
    return _jsx(DynamicResourceForm, { primaryObject: "post", mode: "create" });
}
