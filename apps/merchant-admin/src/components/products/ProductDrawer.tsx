import React, { useEffect, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductFormValues } from "@/lib/product-schema";
import {
  ProductServiceType,
  ProductServiceStatus,
  ProductServiceItem,
} from "@vayva/shared";
import { Button, Icon, Drawer, Input } from "@vayva/ui";

// --- Local UI Components (Missing in Shared) ---

const Label = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <label
    className={`block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide ${className}`}
  >
    {children}
  </label>
);

const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>((props, ref) => (
  <div className="relative">
    <textarea
      ref={ref}
      className="w-full min-h-[100px] px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-all placeholder:text-gray-400 resize-y"
      {...props}
    />
    {props["aria-invalid"] && (
      <div className="text-red-500 text-xs mt-1">
        {props["aria-errormessage"]}
      </div>
    )}
  </div>
));
Textarea.displayName = "Textarea";

const Select = forwardRef<HTMLSelectElement, React.ComponentProps<"select">>(
  (props, ref) => (
    <div className="relative">
      <select
        ref={ref}
        className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm focus:border-black focus:ring-1 focus:ring-black outline-none appearance-none"
        {...props}
      />
      <Icon
        name="ChevronDown"
        size={16}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
    </div>
  ),
);
Select.displayName = "Select";

const Switch = ({
  checked,
  onCheckedChange,
}: {
  checked: boolean;
  onCheckedChange: (c: boolean) => void;
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onCheckedChange(!checked)}
    className={`w-11 h-6 rounded-full relative transition-colors ${checked ? "bg-black" : "bg-gray-200"}`}
  >
    <span
      className={`block w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${checked ? "left-6" : "left-1"}`}
    />
  </button>
);

// ------------------------------------------------

// --- Image Uploader Component ---

const ImageUploader = ({
  images,
  onChange,
}: {
  images: string[];
  onChange: (images: string[]) => void;
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Test upload: create local URL
      const url = URL.createObjectURL(file);
      onChange([...images, url]);
    }
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <Label className="mb-0">Product Images</Label>
      <div className="flex flex-wrap gap-3">
        {images.map((url, i) => (
          <div
            key={i}
            className="relative w-24 h-24 rounded-lg border border-gray-200 overflow-hidden group"
          >
            <img
              src={url}
              alt={`Product ${i + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-1 right-1 bg-black/50 hover:bg-black text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Icon name="X" size={12} />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-200 hover:border-black hover:bg-gray-50 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Icon name="Upload" size={20} className="text-gray-400" />
          <span className="text-[10px] uppercase font-bold text-gray-400">
            Add Image
          </span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

// ------------------------------------------------

interface ProductDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormValues) => Promise<void>;
  initialData?: ProductServiceItem;
  isLoading?: boolean;
}

export const ProductDrawer: React.FC<ProductDrawerProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      type: ProductServiceType.RETAIL,
      status: ProductServiceStatus.ACTIVE,
      inventory: { enabled: true, quantity: 0 },
      availability: {
        days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        timeRange: "09:00 - 17:00",
      },
      images: [],
    },
  });

  const selectedType = watch("type");
  const inventoryEnabled = watch("inventory.enabled");
  const currentImages = watch("images") || [];

  useEffect(() => {
    if (isOpen && initialData) {
      // Map types manually to ensure compatibility if necessary
      reset({
        ...initialData,
        title: initialData.name, // Map Shared 'name' to Schema 'title'
        // Ensure nested optional objects are initialized if missing in data but needed for form
        inventory: initialData.inventory || { enabled: true, quantity: 0 },
        availability: initialData.availability || {
          days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
          timeRange: "09:00 - 17:00",
        },
        images: initialData.images || [],
      });
    } else if (isOpen) {
      reset({
        type: ProductServiceType.RETAIL,
        status: ProductServiceStatus.ACTIVE,
        inventory: { enabled: true, quantity: 0 },
        availability: {
          days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
          timeRange: "09:00 - 17:00",
        },
        images: [],
      });
    }
  }, [isOpen, initialData, reset]);

  const handleFormSubmit = async (data: ProductFormValues) => {
    await onSubmit(data);
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Product" : "New Product"}
    >
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-8 pb-20"
      >
        {/* 1. Basic Details */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-2">
            Basic Info
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Product Title</Label>
              <Input
                {...register("title")}
                placeholder="e.g. Vintage Cotton Shirt"
                error={!!errors.title}
              />
            </div>

            <div className="col-span-2">
              <Label>Description</Label>
              <Textarea
                {...register("description")}
                placeholder="Describe your product..."
                rows={3}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="col-span-2">
              <ImageUploader
                images={currentImages}
                onChange={(imgs) =>
                  setValue("images", imgs, { shouldValidate: true })
                }
              />
            </div>

            <div>
              <Label>Type</Label>
              <Select {...register("type")}>
                <option value={ProductServiceType.RETAIL}>
                  Physical Product
                </option>
                <option value={ProductServiceType.FOOD}>Food / Menu</option>
                <option value={ProductServiceType.SERVICE}>
                  Service / Booking
                </option>
              </Select>
            </div>

            <div>
              <Label>Category (Optional)</Label>
              <Input
                {...register("category")}
                placeholder="e.g. Summer Collection"
              />
            </div>
          </div>
        </section>

        {/* 2. Pricing & Inventory (Dynamic) */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-2">
            {selectedType === ProductServiceType.SERVICE
              ? "Service Details"
              : "Pricing & Inventory"}
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Price (₦)</Label>
              <Input
                type="number"
                {...register("price")}
                placeholder="0.00"
                error={!!errors.price}
              />
            </div>

            {/* RETAIL LOGIC */}
            {selectedType === ProductServiceType.RETAIL && (
              <>
                <div className="col-span-2 flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="text-sm">
                    <div className="font-bold text-gray-900">
                      Track Inventory
                    </div>
                    <div className="text-gray-500">
                      Auto-update stock on new orders
                    </div>
                  </div>
                  <Switch
                    checked={inventoryEnabled || false}
                    onCheckedChange={(c) => setValue("inventory.enabled", c)}
                  />
                </div>

                {inventoryEnabled && (
                  <>
                    <div>
                      <Label>Quantity Available</Label>
                      <Input
                        type="number"
                        {...register("inventory.quantity")}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label>Low Stock Alert</Label>
                      <Input
                        type="number"
                        {...register("inventory.lowStockThreshold")}
                        placeholder="5"
                      />
                    </div>
                  </>
                )}
              </>
            )}

            {/* FOOD LOGIC */}
            {selectedType === ProductServiceType.FOOD && (
              <div className="col-span-2 flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-100">
                <div className="text-sm">
                  <div className="font-bold text-orange-900">
                    Today's Special
                  </div>
                  <div className="text-orange-700">
                    Highlight this item on your menu
                  </div>
                </div>
                <Switch
                  checked={watch("isTodaysSpecial") || false}
                  onCheckedChange={(c) => setValue("isTodaysSpecial", c)}
                />
              </div>
            )}

            {/* SERVICE LOGIC */}
            {selectedType === ProductServiceType.SERVICE && (
              <div className="col-span-2 space-y-4">
                <div>
                  <Label>Availability (Days)</Label>
                  <Input
                    {...register("availability.days")}
                    placeholder="Mon, Tue, Wed..."
                  />
                </div>
                <div>
                  <Label>Time Range</Label>
                  <Input
                    {...register("availability.timeRange")}
                    placeholder="09:00 - 17:00"
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        <div className="fixed bottom-0 right-0 w-full sm:w-[500px] p-4 bg-white border-t border-gray-200 flex items-center justify-end gap-3 z-10">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting || isLoading}>
            {initialData ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </form>
    </Drawer>
  );
};
