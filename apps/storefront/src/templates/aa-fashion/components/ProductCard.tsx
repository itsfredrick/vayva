import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Check } from "lucide-react";
import { PublicProduct } from "@/types/storefront";
import { useStore } from "@/context/StoreContext";

interface ProductCardProps {
  product: PublicProduct;
  storeSlug?: string;
}

export const ProductCard = ({ product, storeSlug = "#" }: ProductCardProps) => {
  const { addToCart } = useStore();
  const [added, setAdded] = React.useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      productId: product.id,
      variantId: "default",
      productName: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0],
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Link
      href={`/products/${product.id}?store=${storeSlug}`}
      className="group block"
    >
      <div className="relative aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden mb-3">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Quick Add Button */}
        <button
          className={`absolute bottom-3 right-3 p-2 rounded-full shadow-lg transition-all duration-300 ${added ? "bg-green-500 text-white" : "bg-white text-black hover:bg-black hover:text-white"}`}
          onClick={handleAdd}
        >
          {added ? (
            <Check size={18} strokeWidth={2.5} />
          ) : (
            <Plus size={18} strokeWidth={2.5} />
          )}
        </button>
      </div>

      <div className="space-y-1">
        <h3 className="font-medium text-[#111111] text-sm leading-tight line-clamp-2 min-h-[2.5em]">
          {product.name}
        </h3>
        <p className="font-bold text-[#111111] text-sm">
          ₦{product.price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
};
