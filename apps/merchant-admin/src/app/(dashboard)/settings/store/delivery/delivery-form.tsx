
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button, Switch } from "@vayva/ui";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

// Schema matching Prisma model
const formSchema = z.object({
    isEnabled: z.boolean(),
    deliveryRadiusKm: z.coerce.number().min(1),
    baseDeliveryFee: z.coerce.number().min(0),
    deliveryFeeType: z.enum(["FLAT", "DISTANCE"]),
    allowSelfPickup: z.boolean(),
    selfDeliveryEnabled: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export function DeliveryForm() {
    const [isLoading, setIsLoading] = useState(true);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            isEnabled: true,
            deliveryRadiusKm: 10,
            baseDeliveryFee: 1000,
            deliveryFeeType: "FLAT",
            allowSelfPickup: false,
            selfDeliveryEnabled: false,
        },
    });

    // Fetch initial data
    useEffect(() => {
        fetch("/api/settings/delivery")
            .then((res) => res.json())
            .then((data) => {
                if (data) {
                    form.reset({
                        ...data,
                        baseDeliveryFee: Number(data.baseDeliveryFee), // Ensure number
                    });
                }
            })
            .catch((err) => console.error(err))
            .finally(() => setIsLoading(false));
    }, [form]);

    async function onSubmit(data: FormValues) {
        try {
            const res = await fetch("/api/settings/delivery", {
                method: "POST", // Upsert
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error("Failed to save");

            toast.success("Delivery settings saved successfully");
        } catch (error: any) {
            toast.error("Failed to save settings");
        }
    }

    if (isLoading) {
        return <div className="flex h-32 items-center justify-center"><Loader2 className="animate-spin h-6 w-6 text-muted-foreground" /></div>
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-lg bg-card p-6 rounded-lg border">

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">General Capabilities</h3>
                    <FormField
                        control={form.control}
                        name="isEnabled"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Enable Delivery</FormLabel>
                                    <FormDescription>
                                        Offer delivery options to customers.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="allowSelfPickup"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Allow Pickup</FormLabel>
                                    <FormDescription>
                                        Customers can pick up orders from your locations.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Delivery Configuration</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="deliveryRadiusKm"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Radius (km)</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="baseDeliveryFee"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Base Fee (₦)</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="deliveryFeeType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Fee Calculation</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={(field.value as any)}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a fee type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="FLAT">Flat Rate</SelectItem>
                                        <SelectItem value="DISTANCE">Distance Based</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    {field.value === "FLAT" ? "Standard fee for all deliveries." : "Fee increases with distance."}
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="selfDeliveryEnabled"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Use Own Fleet</FormLabel>
                                    <FormDescription>
                                        You handle last-mile delivery yourself.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Save Changes
                </Button>
            </form>
        </Form>
    );
}
