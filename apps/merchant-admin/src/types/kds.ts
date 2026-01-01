import { StorefrontProduct } from "./storefront";

export type OrderStatus =
  | "new"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";
export type OrderSource = "website" | "whatsapp";
export type FulfillmentType = "delivery" | "pickup";

export interface OrderItem {
  name: string;
  quantity: number;
  modifiers: string[]; // "Spicy", "Extra Cheese"
  notes?: string;
}

export interface KitchenOrder {
  id: string; // "ORD-1234"
  customerName: string;
  source: OrderSource;
  fulfillment: FulfillmentType;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: number; // timestamp
  prepTimeTarget: number; // minutes expected
}

export interface KitchenMetrics {
  ordersToday: number;
  avgPrepTime: number; // minutes
  throughput: number; // orders/hour
  ordersInQueue: number;
}
