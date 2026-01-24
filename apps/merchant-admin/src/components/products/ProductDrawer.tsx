import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { productSchema } from "@/lib/product-schema";
type ProductFormValues = any;
import {
  ProductServiceType,
  ProductServiceStatus,
  ProductServiceItem,
} from "@vayva/shared";
import { Button, Drawer, Icon, Input, Label, Textarea, Select, Switch } from "@vayva/ui";

// Image Uploader Component

const ImageUploader = ({
  images,
  onChange,
}: {
  images: string[];
  onChange: (images: string[]) => void;
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { data: session } = useSession();
  const [isProcessing, setIsProcessing] = useState<number | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(-1); // Use -1 to indicate general upload processing
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/storage/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || "Upload failed");
        }

        const data = await res.json();
        onChange([...images, data.url]);
        toast.success("Image uploaded successfully");
      } catch (error: any) {
        toast.error("Upload failed", {
          description: error.message,
        });
      } finally {
        setIsProcessing(null);
      }
    }
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_: any, i: any) => i !== index));
  };

  const handleRemoveBackground = async (index: number) => {
    const plan = (session?.user as any)?.plan || "FREE";

    if (plan !== "PRO") {
      toast.info("Pro Feature", {
        description: "Upgrade to Pro to use Vayva Cut Pro and get studio-quality product photos in one click!",
        action: {
          label: "Upgrade",
          onClick: () => window.location.href = "/dashboard/billing"
        }
      });
      return;
    }

    setIsProcessing(index);
    try {
      // Mock background removal
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("Background removed successfully!");
      // In a real app, we'd call an API and update the URL
    } catch (error: any) {
      toast.error("Failed to remove background");
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Product Images</Label>
      <div className="flex flex-wrap gap-3">
        {images.map((url: any, i: any) => (
          <div
            key={i}
            className="relative w-24 h-24 rounded-lg border border-gray-200 overflow-hidden group bg-gray-50"
          >
            <img
              src={url}
              alt={`Product ${i + 1}`}
              className="w-full h-full object-cover"
            />

            {/* Actions Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
              <Button
                type="button"
                onClick={() => handleRemoveBackground(i)}
                variant="ghost"
                disabled={isProcessing === i}
                className="w-full h-7 bg-white/90 hover:bg-white text-[10px] font-bold uppercase rounded flex items-center justify-center gap-1 text-black"
              >
                {isProcessing === i ? (
                  "Processing..."
                ) : (
                  <>
                    <Icon name="Sparkles" size={12} />
                    Cut Pro
                  </>
                )}
              </Button>

              <Button
                type="button"
                onClick={() => removeImage(i)}
                variant="destructive"
                className="w-full h-7 bg-red-500/90 hover:bg-red-500 text-[10px] font-bold uppercase rounded flex items-center justify-center gap-1 text-white"
              >
                <Icon name="Trash2" size={12} />
                Delete
              </Button>
            </div>
          </div>
        ))}

        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          variant="ghost"
          disabled={isProcessing === -1}
          className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-200 hover:border-vayva-green hover:bg-gray-50 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer"
        >
          {isProcessing === -1 ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-vayva-green" />
          ) : (
            <Icon name="Upload" size={20} className="text-gray-400" />
          )}
          <span className="text-[10px] uppercase font-bold text-gray-400">
            {isProcessing === -1 ? "Uploading..." : "Add Image"}
          </span>
        </Button>
        <input
          ref={fileInputRef}
          id="product-image-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          aria-label="Upload product image"
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

  // eslint-disable-next-line react-hooks/incompatible-library
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
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="product-title" className="text-xs font-bold text-gray-700 uppercase tracking-wide">Product Title</Label>
              <Input
                id="product-title"
                {...register("title")}
                placeholder="e.g. Vintage Cotton Shirt"
                error={!!errors.title}
                helperText={errors.title?.message as string}
              />
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="product-description" className="text-xs font-bold text-gray-700 uppercase tracking-wide">Description</Label>
              <Textarea
                id="product-description"
                {...register("description")}
                placeholder="Describe your product..."
                rows={3}
                error={!!errors.description}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description.message as string}
                </p>
              )}
            </div>

            <div className="col-span-2">
              <ImageUploader
                images={currentImages}
                onChange={(newImages: any) =>
                  setValue("images", newImages, { shouldValidate: true })
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="product-type" className="text-xs font-bold text-gray-700 uppercase tracking-wide">Type</Label>
              <Select id="product-type" {...register("type")}>
                <option value={(ProductServiceType.RETAIL as any)}>
                  Physical Product
                </option>
                <option value={(ProductServiceType.FOOD as any)}>Food / Menu</option>
                <option value={(ProductServiceType.SERVICE as any)}>Service / Booking</option>
                <option value={(ProductServiceType.DIGITAL as any)}>Digital Asset</option>
                <option value={(ProductServiceType.REAL_ESTATE as any)}>Real Estate / Property</option>
                <option value={(ProductServiceType.AUTO as any)}>Automotive / Vehicle</option>
                <option value={(ProductServiceType.HOTEL as any)}>Hotel / Stay</option>
                <option value={(ProductServiceType.EVENT as any)}>Event / Ticket</option>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="product-category" className="text-xs font-bold text-gray-700 uppercase tracking-wide">Category (Optional)</Label>
              <Input
                id="product-category"
                {...register("category")}
                placeholder="e.g. Summer Collection"
              />
            </div>
          </div>
        </section>

        {/* 2. Pricing & Inventory (Dynamic) */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-2">
            {selectedType === ProductServiceType.SERVICE ||
              selectedType === ProductServiceType.HOTEL ||
              selectedType === ProductServiceType.EVENT
              ? "Booking Details"
              : "Pricing & Inventory"}
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="product-price" className="text-xs font-bold text-gray-700 uppercase tracking-wide">Price (₦)</Label>
              <Input
                id="product-price"
                type="number"
                {...register("price", { valueAsNumber: true })}
                placeholder="0.00"
                error={!!errors.price}
                helperText={errors.price?.message as string}
              />
            </div>

            {/* RETAIL LOGIC */}
            {selectedType === ProductServiceType.RETAIL && (
              <>
                <div className="col-span-2 flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="text-sm">
                    <Label htmlFor="track-inventory" className="font-bold text-gray-900 cursor-pointer mb-0">
                      Track Inventory
                    </Label>
                    <div className="text-gray-500 text-xs">
                      Auto-update stock on new orders
                    </div>
                  </div>
                  <Switch
                    id="track-inventory"
                    checked={inventoryEnabled || false}
                    onCheckedChange={(c: boolean) => setValue("inventory.enabled", c)}
                  />
                </div>

                {inventoryEnabled && (
                  <>
                    <div className="space-y-1.5">
                      <Label htmlFor="inventory-quantity" className="text-xs font-bold text-gray-700 uppercase tracking-wide">Quantity Available</Label>
                      <Input
                        id="inventory-quantity"
                        type="number"
                        {...register("inventory.quantity", { valueAsNumber: true })}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="low-stock-threshold" className="text-xs font-bold text-gray-700 uppercase tracking-wide">Low Stock Alert</Label>
                      <Input
                        id="low-stock-threshold"
                        type="number"
                        {...register("inventory.lowStockThreshold", { valueAsNumber: true })}
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
                  <Label htmlFor="todays-special" className="font-bold text-orange-900 cursor-pointer mb-0">
                    Today's Special
                  </Label>
                  <div className="text-orange-700 text-xs">
                    Highlight this item on your menu
                  </div>
                </div>
                <Switch
                  id="todays-special"
                  checked={watch("isTodaysSpecial") || false}
                  onCheckedChange={(c: boolean) => setValue("isTodaysSpecial", c)}
                />
              </div>
            )}

            {/* SERVICE LOGIC */}
            {selectedType === ProductServiceType.SERVICE && (
              <div className="col-span-2 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="availability-days" className="text-xs font-bold text-gray-700 uppercase tracking-wide">Availability (Days)</Label>
                  <Input
                    id="availability-days"
                    {...register("availability.days")}
                    placeholder="Mon, Tue, Wed..."
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="time-range" className="text-xs font-bold text-gray-700 uppercase tracking-wide">Time Range</Label>
                  <Input
                    id="time-range"
                    {...register("availability.timeRange")}
                    placeholder="09:00 - 17:00"
                  />
                </div>
              </div>
            )}
            {/* DIGITAL LOGIC */}
            {selectedType === ProductServiceType.DIGITAL && (
              <div className="col-span-2 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="digital-file-url" className="text-xs font-bold text-gray-700 uppercase tracking-wide">File URL / Download Link</Label>
                  <Input
                    id="digital-file-url"
                    {...register("digital.fileUrl")}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="license-type" className="text-xs font-bold text-gray-700 uppercase tracking-wide">License Type</Label>
                  <Select id="license-type" {...register("digital.licenseType")}>
                    <option value="Personal">Personal Use</option>
                    <option value="Commercial">Commercial Use</option>
                  </Select>
                </div>
              </div>
            )}

            {/* REAL ESTATE LOGIC */}
            {selectedType === ProductServiceType.REAL_ESTATE && (
              <div className="col-span-2 grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="bedrooms" className="text-xs font-bold text-gray-700 uppercase tracking-wide">Bedrooms</Label>
                  <Input id="bedrooms" type="number" {...register("realEstate.bedrooms")} placeholder="3" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="bathrooms" className="text-xs font-bold text-gray-700 uppercase tracking-wide">Bathrooms</Label>
                  <Input id="bathrooms" type="number" {...register("realEstate.bathrooms")} placeholder="2" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="sqft" className="text-xs font-bold text-gray-700 uppercase tracking-wide">Sqft</Label>
                  <Input id="sqft" type="number" {...register("realEstate.sqft")} placeholder="1200" />
                </div>
                <div className="col-span-3 space-y-1.5">
                  <Label htmlFor="property-type" className="text-xs font-bold text-gray-700 uppercase tracking-wide">Property Type</Label>
                  <Select id="property-type" {...register("realEstate.propertyType")}>
                    <option value="Apartment">Apartment</option>
                    <option value="House">Self-contain / House</option>
                    <option value="Land">Land / Plot</option>
                    <option value="Office">Office / Shop</option>
                  </Select>
                </div>
              </div>
            )}

            {/* AUTOMOTIVE LOGIC */}
            {selectedType === ProductServiceType.AUTO && (
              <div className="col-span-2 grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="auto-make" className="text-xs font-bold text-gray-700 uppercase tracking-wide">Make</Label>
                  <Input id="auto-make" {...register("automotive.make")} placeholder="Toyota" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="auto-model" className="text-xs font-bold text-gray-700 uppercase tracking-wide">Model</Label>
                  <Input id="auto-model" {...register("automotive.model")} placeholder="Camry" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="auto-year" className="text-xs font-bold text-gray-700 uppercase tracking-wide">Year</Label>
                  <Input id="auto-year" type="number" {...register("automotive.year")} placeholder="2022" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="auto-mileage" className="text-xs font-bold text-gray-700 uppercase tracking-wide">Mileage</Label>
                  <Input id="auto-mileage" type="number" {...register("automotive.mileage")} placeholder="5000" />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label htmlFor="auto-vin" className="text-xs font-bold text-gray-700 uppercase tracking-wide">VIN (Optional)</Label>
                  <Input id="auto-vin" {...register("automotive.vin")} placeholder="VIN Number" />
                </div>
              </div>
            )}

            {/* HOTEL / STAY LOGIC */}
            {selectedType === ProductServiceType.HOTEL && (
              <div className="col-span-2 grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="max-guests" className="text-xs font-bold text-gray-700 uppercase tracking-wide">Max Guests</Label>
                  <Input id="max-guests" type="number" {...register("stay.maxGuests")} placeholder="2" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="room-type" className="text-xs font-bold text-gray-700 uppercase tracking-wide">Room Type</Label>
                  <Select id="room-type" {...register("stay.roomType")}>
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="check-in" className="text-xs font-bold text-gray-700 uppercase tracking-wide">Check-in</Label>
                  <Input id="check-in" {...register("stay.checkInTime")} placeholder="14:00" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="check-out" className="text-xs font-bold text-gray-700 uppercase tracking-wide">Check-out</Label>
                  <Input id="check-out" {...register("stay.checkOutTime")} placeholder="11:00" />
                </div>
              </div>
            )}

            {/* EVENT LOGIC */}
            {selectedType === ProductServiceType.EVENT && (
              <div className="col-span-2 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="event-date" className="text-xs font-bold text-gray-700 uppercase tracking-wide">Event Date & Time</Label>
                  <Input id="event-date" {...register("event.date")} placeholder="2024-12-25 18:00" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="event-venue" className="text-xs font-bold text-gray-700 uppercase tracking-wide">Venue / Location</Label>
                  <Input id="event-venue" {...register("event.venue")} placeholder="Main Hall or Zoom" />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="event-is-virtual"
                    checked={watch("event.isVirtual") || false}
                    onCheckedChange={(c: boolean) => setValue("event.isVirtual", c)}
                  />
                  <Label htmlFor="event-is-virtual" className="text-xs font-bold text-gray-700 uppercase tracking-wide">Virtual Event</Label>
                </div>
              </div>
            )}
          </div>
        </section>

        <div className="fixed bottom-0 right-0 w-full sm:w-[500px] p-4 bg-white border-t border-gray-200 flex items-center justify-end gap-3 z-10">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting || isLoading} className="bg-vayva-green text-white hover:bg-vayva-green/90 shadow-lg shadow-green-500/20">
            {initialData ? "Update Item" : "Create Item"}
          </Button>
        </div>
      </form>
    </Drawer>
  );
};
