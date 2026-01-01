import { KitchenOrder, KitchenMetrics, OrderStatus } from "@/types/kds";

// In-memory simulation of a backend database
class KitchenServiceManager {
  private orders: KitchenOrder[] = [];
  private listeners: ((orders: KitchenOrder[]) => void)[] = [];

  // Config
  private maxConcurrentOrders = 20;
  private averagePrepTime = 15; // minutes

  constructor() {
    // Hydrate with some placeholder data for demo
    this.orders = [
      {
        id: "ORD-8821",
        customerName: "Fredrick",
        source: "website",
        fulfillment: "delivery",
        status: "new",
        createdAt: Date.now() - 1000 * 60 * 2, // 2 mins ago
        prepTimeTarget: 15,
        items: [
          {
            name: "Jollof Rice",
            quantity: 2,
            modifiers: ["Spicy", "Extra Plantain"],
          },
        ],
      },
      {
        id: "ORD-8820",
        customerName: "Sarah",
        source: "whatsapp",
        fulfillment: "pickup",
        status: "preparing",
        createdAt: Date.now() - 1000 * 60 * 10, // 10 mins ago
        prepTimeTarget: 15,
        items: [
          { name: "Chicken Wings", quantity: 1, modifiers: ["BBQ Sauce"] },
        ],
      },
    ];
  }

  // --- Actions ---

  addOrder(order: Omit<KitchenOrder, "id" | "createdAt" | "status">) {
    const newOrder: KitchenOrder = {
      ...order,
      id: `ORD-${Math.floor(Math.random() * 9000) + 1000}`,
      status: "new",
      createdAt: Date.now(),
      prepTimeTarget: this.averagePrepTime,
    };
    this.orders = [newOrder, ...this.orders];
    this.notify();
    return newOrder;
  }

  updateStatus(orderId: string, status: OrderStatus) {
    this.orders = this.orders.map((o) =>
      o.id === orderId ? { ...o, status } : o,
    );
    this.notify();
  }

  // --- Queries ---

  getOrders() {
    return this.orders;
  }

  getMetrics(): KitchenMetrics {
    const today = this.orders.filter(
      (o) => o.createdAt > Date.now() - 1000 * 60 * 60 * 24,
    );
    const completed = today.filter((o) => o.status === "completed");

    return {
      ordersToday: today.length,
      ordersInQueue: this.orders.filter((o) =>
        ["new", "preparing"].includes(o.status),
      ).length,
      avgPrepTime: 18, // Tested for now
      throughput: 12, // Tested
    };
  }

  checkCapacity(): { allowed: boolean; waitTime: number } {
    const active = this.orders.filter((o) =>
      ["new", "preparing"].includes(o.status),
    ).length;
    if (active >= this.maxConcurrentOrders) {
      return { allowed: false, waitTime: 30 };
    }
    return { allowed: true, waitTime: this.averagePrepTime };
  }

  // --- Subscription (Test WebSocket) ---

  subscribe(listener: (orders: KitchenOrder[]) => void) {
    this.listeners.push(listener);
    listener(this.orders);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l(this.orders));
  }
}

// Global Singleton
export const KitchenService = new KitchenServiceManager();
