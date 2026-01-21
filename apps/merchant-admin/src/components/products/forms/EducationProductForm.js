"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm, useFieldArray } from "react-hook-form";
import { Button, Input, Label, Select, Textarea } from "@vayva/ui";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
export function EducationProductForm({ productId }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, control, formState: { errors } } = useForm();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "curriculum" // Expecting [{ moduleTitle: string, lessons: string }]
    });
    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const payload = {
                title: data.title,
                description: data.description,
                price: Number(data.price),
                metadata: {
                    type: "education",
                    difficulty: data.difficulty,
                    duration: data.duration,
                    instructor: data.instructor,
                    curriculum: data.curriculum?.map((c) => ({
                        moduleTitle: c.moduleTitle,
                        lessons: c.lessons ? c.lessons.split("\n").filter(Boolean) : []
                    })) || []
                }
            };
            const endpoint = productId
                ? `/api/products/${productId}`
                : "/api/products/create";
            const method = productId ? "PATCH" : "POST";
            const res = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok)
                throw new Error("Failed to save course");
            toast.success(productId ? "Course updated" : "Course created");
            router.push("/dashboard/products");
        }
        catch (e) {
            toast.error("Something went wrong");
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-8 max-w-4xl mx-auto", children: [_jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-xl font-semibold border-b pb-2", children: "Course Details" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "title", children: "Course Title" }), _jsx(Input, { id: "title", ...register("title", { required: true }) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "instructor", children: "Instructor Name" }), _jsx(Input, { id: "instructor", ...register("instructor") })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "description", children: "Description" }), _jsx(Textarea, { id: "description", ...register("description"), rows: 3 })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "duration", children: "Duration (e.g. 10 hours)" }), _jsx(Input, { id: "duration", ...register("duration") })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "difficulty", children: "Difficulty" }), _jsxs(Select, { ...register("difficulty"), children: [_jsx("option", { value: "Beginner", children: "Beginner" }), _jsx("option", { value: "Intermediate", children: "Intermediate" }), _jsx("option", { value: "Expert", children: "Expert" })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "price", children: "Price" }), _jsx(Input, { id: "price", type: "number", ...register("price", { min: 0 }), prefix: "\u20A6" })] })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex justify-between items-center border-b pb-2", children: [_jsx("h3", { className: "text-xl font-semibold", children: "Curriculum Builder" }), _jsxs(Button, { type: "button", variant: "outline", size: "sm", onClick: () => append({ moduleTitle: "", lessons: "" }), children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), " Add Module"] })] }), _jsxs("div", { className: "space-y-6", children: [fields.map((field, index) => (_jsxs("div", { className: "bg-gray-50 p-4 rounded-lg border space-y-3 relative", children: [_jsx(Button, { type: "button", variant: "destructive", size: "icon", className: "absolute top-2 right-2 h-6 w-6", onClick: () => remove(index), children: _jsx(Trash2, { className: "w-3 h-3" }) }), _jsxs("div", { children: [_jsx(Label, { children: "Module Title" }), _jsx(Input, { ...register(`curriculum.${index}.moduleTitle`, { required: true }), placeholder: "e.g. Introduction to React" })] }), _jsxs("div", { children: [_jsx(Label, { children: "Lessons (One per line)" }), _jsx(Textarea, { ...register(`curriculum.${index}.lessons`), placeholder: "Lesson 1: Components\nLesson 2: Props\nLesson 3: State", rows: 4 })] })] }, field.id))), fields.length === 0 && _jsx("p", { className: "text-gray-500 text-center", children: "No modules added yet." })] })] }), _jsx("div", { className: "pt-4 flex justify-end", children: _jsx(Button, { type: "submit", disabled: isSubmitting, className: "min-w-[150px]", children: isSubmitting ? "Saving..." : productId ? "Update Course" : "Create Course" }) })] }));
}
