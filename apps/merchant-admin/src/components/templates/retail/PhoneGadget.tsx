import { TemplateProps } from "@/components/templates/registry";
import { useStore } from "@/context/StoreContext";
import { Icon } from "@vayva/ui";

export const PhoneGadgetTemplate: React.FC<TemplateProps> = ({
  businessName,
  demoMode,
}) => {
  const {
    products,
    addToCart,
    cartTotal,
    itemCount,
    isCartOpen,
    toggleCart,
    checkout,
    isCheckoutProcessing,
    currency,
  } = useStore();

  // Demo Data Override for Phone Gadgets
  const gadgetItems = demoMode
    ? [
        {
          id: "ph_1",
          name: "iPhone 12",
          price: 380000,
          type: "retail",
          specs: { storage: "128GB", condition: "UK Used", battery: "89%" },
          image:
            "https://images.unsplash.com/photo-1603351154351-5cf233081e35?w=800&q=80",
        },
        {
          id: "ph_2",
          name: "Samsung A32",
          price: 120000,
          type: "retail",
          specs: { storage: "64GB", condition: "New", color: "Blue" },
          image:
            "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80",
        },
        {
          id: "ph_3",
          name: "AirPods Pro",
          price: 150000,
          type: "retail",
          specs: { condition: "New", warranty: "1 Year" },
          image:
            "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=800&q=80",
        },
        {
          id: "ph_4",
          name: "20W Charger",
          price: 15000,
          type: "retail",
          specs: { type: "Original", port: "USB-C" },
          image:
            "https://images.unsplash.com/photo-1625732292415-460bd582e0ea?w=800&q=80",
        },
      ]
    : products.filter((p) => p.type === "retail");

  return (
    <div className="font-sans min-h-screen bg-gray-50 text-gray-900 pb-20">
      {/* Tech Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              G
            </div>
            <span className="font-bold text-lg tracking-tight">
              {businessName || "Gadget Point"}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="relative p-2 hover:bg-gray-100 rounded-full"
              onClick={() => toggleCart(true)}
            >
              <Icon name="ShoppingBag" size={20} />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex justify-end">
          <div className="w-full max-w-sm bg-white h-full p-6 flex flex-col animate-in slide-in-from-right">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Cart ({itemCount})</h2>
              <button onClick={() => toggleCart(false)}>
                <Icon name="X" size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              {itemCount === 0 ? (
                <p className="text-gray-500 text-center py-10">
                  Your cart is empty.
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded text-sm text-blue-700">
                    <p className="font-bold">
                      Total: {currency} {cartTotal.toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-2">
                    {/* Simple list of items name/qty for now */}
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4">
              <button
                onClick={() => checkout("whatsapp")}
                disabled={isCheckoutProcessing || itemCount === 0}
                className="w-full bg-green-500 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2"
              >
                {isCheckoutProcessing ? (
                  "Processing..."
                ) : (
                  <>
                    <Icon name="MessageCircle" size={20} /> Chat to Confirm
                  </>
                )}
              </button>
            </div>

            {/* Footer Trust */}
            <div className="bg-gray-100 p-6 text-center text-xs text-gray-500 space-y-2 mt-4 rounded-lg">
              <p>📍 Shop 12, Ikeja City Mall, Lagos</p>
              <p>🛡️ All devices come with warranty receipt</p>
            </div>
          </div>
        </div>
      )}

      {/* Trust Banner */}
      <div className="bg-blue-600 text-white text-center py-2 text-sm font-bold">
        🛡️ 7-Day Money Back Guarantee on all items
      </div>

      {/* Product Grid */}
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-bold mb-6">Latest Arrivals</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {gadgetItems.map((item) => (
            <div
              key={item.id}
              className="bg-white p-3 rounded-xl border border-gray-200 flex flex-col shadow-sm"
            >
              <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden relative">
                {(item as any).image && (
                  <img
                    src={(item as any).image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                )}
                {(item as any).specs?.condition && (
                  <span className="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded backdrop-blur-md">
                    {(item as any).specs.condition}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1">
                  {item.name}
                </h3>
                {(item as any).specs && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {(item as any).specs.storage && (
                      <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
                        {(item as any).specs.storage}
                      </span>
                    )}
                    {(item as any).specs.battery && (
                      <span className="text-[10px] bg-green-50 px-1.5 py-0.5 rounded text-green-700">
                        🔋 {(item as any).specs.battery}
                      </span>
                    )}
                  </div>
                )}
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold text-blue-600">
                    {currency} {item.price.toLocaleString()}
                  </span>
                  <button
                    onClick={() =>
                      addToCart({ ...item, quantity: 1, productId: item.id })
                    }
                    className="bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Icon name="Plus" size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
