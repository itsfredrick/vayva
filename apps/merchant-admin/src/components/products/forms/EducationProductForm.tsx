"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { Button, Input, Textarea, Label, Select } from "@vayva/ui";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

export function EducationProductForm({ productId }: { productId?: string }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, control, formState: { errors } } = useForm();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "curriculum" // Expecting [{ moduleTitle: string, lessons: string }]
    });

    const onSubmit = async (data: any) => {
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
                    curriculum: data.curriculum?.map((c: any) => ({
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
            if (!res.ok) throw new Error("Failed to save course");
            toast.success(productId ? "Course updated" : "Course created");
            router.push("/dashboard/products");
        } catch (e) {
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto">
            <div className="space-y-4">
                <h3 className="text-xl font-semibold border-b pb-2">Course Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="title">Course Title</Label>
                        <Input
                            id="title"
                            {...register("title", { required: true })}
                        />
                    </div>
                    <div>
                        <Label htmlFor="instructor">Instructor Name</Label>
                        <Input
                            id="instructor"
                            {...register("instructor")}
                        />
                    </div>
                </div>
                <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        {...register("description")}
                        rows={3}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <Label htmlFor="duration">Duration (e.g. 10 hours)</Label>
                        <Input
                            id="duration"
                            {...register("duration")}
                        />
                    </div>
                    <div>
                        <Label htmlFor="difficulty">Difficulty</Label>
                        <Select {...register("difficulty")}>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Expert">Expert</option>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="price">Price</Label>
                        <Input
                            id="price"
                            type="number"
                            {...register("price", { min: 0 })}
                            prefix="₦"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-xl font-semibold">Curriculum Builder</h3>
                    <Button type="button" variant="outline" size="sm" onClick={() => append({ moduleTitle: "", lessons: "" })}>
                        <Plus className="w-4 h-4 mr-2" /> Add Module
                    </Button>
                </div>

                <div className="space-y-6">
                    {fields.map((field, index) => (
                        <div key={field.id} className="bg-gray-50 p-4 rounded-lg border space-y-3 relative">
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-6 w-6"
                                onClick={() => remove(index)}
                            >
                                <Trash2 className="w-3 h-3" />
                            </Button>

                            <div>
                                <Label>Module Title</Label>
                                <Input
                                    {...register(`curriculum.${index}.moduleTitle` as const, { required: true })}
                                    placeholder="e.g. Introduction to React"
                                />
                            </div>
                            <div>
                                <Label>Lessons (One per line)</Label>
                                <Textarea
                                    {...register(`curriculum.${index}.lessons` as const)}
                                    placeholder="Lesson 1: Components&#10;Lesson 2: Props&#10;Lesson 3: State"
                                    rows={4}
                                />
                            </div>
                        </div>
                    ))}
                    {fields.length === 0 && <p className="text-gray-500 text-center">No modules added yet.</p>}
                </div>
            </div>

            <div className="pt-4 flex justify-end">
                <Button type="submit" disabled={isSubmitting} className="min-w-[150px]">
                    {isSubmitting ? "Saving..." : productId ? "Update Course" : "Create Course"}
                </Button>
            </div>
        </form>
    );
}
