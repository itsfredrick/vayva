import { NextResponse } from "next/server";
import { Customer, CustomerStatus } from "@vayva/shared";

// Test Data
const CUSTOMERS: Customer[] = [
  {
    id: "cus_001",
    merchantId: "mer_1",
    name: "Amina Bello",
    phone: "+234 801 234 5678",
    firstSeenAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(), // 45 days ago
    lastSeenAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    totalOrders: 12,
    totalSpend: 154000,
    status: CustomerStatus.VIP,
    preferredChannel: "whatsapp",
  },
  {
    id: "cus_002",
    merchantId: "mer_1",
    name: "Chinedu Eze",
    phone: "+234 809 876 5432",
    firstSeenAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    lastSeenAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    totalOrders: 1,
    totalSpend: 15000,
    status: CustomerStatus.NEW,
    preferredChannel: "website",
  },
  {
    id: "cus_003",
    merchantId: "mer_1",
    name: "Sarah Adeyemi",
    phone: "+234 812 345 6789",
    firstSeenAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120).toISOString(),
    lastSeenAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    totalOrders: 4,
    totalSpend: 45000,
    status: CustomerStatus.RETURNING,
    preferredChannel: "whatsapp",
  },
  {
    id: "cus_004",
    merchantId: "mer_1",
    name: "Ibrahim Musa",
    phone: "+234 703 111 2222",
    firstSeenAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    lastSeenAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    totalOrders: 2,
    totalSpend: 28000,
    status: CustomerStatus.RETURNING,
    preferredChannel: "whatsapp",
  },
  {
    id: "cus_005",
    merchantId: "mer_1",
    name: "Unknown Shopper",
    phone: "+234 909 000 0000",
    firstSeenAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    lastSeenAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    totalOrders: 1,
    totalSpend: 5000,
    status: CustomerStatus.NEW,
    preferredChannel: "website",
  },
];

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return NextResponse.json(CUSTOMERS);
}
