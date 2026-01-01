export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate: string;
  avatar?: string;
  address?: string;
}

export interface CustomerNote {
  id: string;
  content: string;
  date: string;
  author: string;
}

export interface CustomerOrderSummary {
  id: string;
  orderNumber: string;
  date: string;
  total: number;
  status: string;
  itemsCount: number;
}

export const CustomersService = {
  // 1. Get Customers List
  getCustomers: async (search?: string): Promise<Customer[]> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return [
      {
        id: "cust_1",
        name: "Chioma Adebayo",
        email: "chioma@example.com",
        phone: "+2348012345678",
        ordersCount: 12,
        totalSpent: 450000,
        lastOrderDate: new Date().toISOString(),
        address: "12 Admiralty Way, Lekki",
      },
      {
        id: "cust_2",
        name: "Emmanuel Kalu",
        email: "emmanuel@example.com",
        phone: "+2348098765432",
        ordersCount: 3,
        totalSpent: 85000,
        lastOrderDate: new Date(Date.now() - 86400000 * 5).toISOString(),
        address: "45 Awolowo Road, Ikoyi",
      },
      {
        id: "cust_3",
        name: "Aisha Bello",
        email: "aisha@example.com",
        phone: "+2347011223344",
        ordersCount: 1,
        totalSpent: 12500,
        lastOrderDate: new Date(Date.now() - 86400000 * 20).toISOString(),
      },
    ];
  },

  // 2. Get Single Customer
  getCustomer: async (id: string): Promise<Customer | null> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      id: id,
      name: "Chioma Adebayo",
      email: "chioma@example.com",
      phone: "+2348012345678",
      ordersCount: 12,
      totalSpent: 450000,
      lastOrderDate: new Date().toISOString(),
      address: "12 Admiralty Way, Lekki, Lagos",
      avatar: undefined,
    };
  },

  // 3. Get Customer Orders
  getCustomerOrders: async (id: string): Promise<CustomerOrderSummary[]> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return [
      {
        id: "ord_1",
        orderNumber: "#1024",
        date: new Date().toISOString(),
        total: 17000,
        status: "processing",
        itemsCount: 2,
      },
      {
        id: "ord_5",
        orderNumber: "#1020",
        date: new Date(Date.now() - 86400000 * 2).toISOString(),
        total: 45000,
        status: "delivered",
        itemsCount: 4,
      },
      {
        id: "ord_9",
        orderNumber: "#1015",
        date: new Date(Date.now() - 86400000 * 30).toISOString(),
        total: 12000,
        status: "delivered",
        itemsCount: 1,
      },
    ];
  },

  // 4. Get Customer Notes
  getNotes: async (id: string): Promise<CustomerNote[]> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return [
      {
        id: "note_1",
        content: "VIP Customer. Always request express delivery.",
        date: new Date(Date.now() - 86400000 * 10).toISOString(),
        author: "Ali Merchant",
      },
      {
        id: "note_2",
        content: "Called about sizing for the Denim Jacket.",
        date: new Date(Date.now() - 86400000 * 2).toISOString(),
        author: "Ali Merchant",
      },
    ];
  },

  // 5. Add Note
  addNote: async (id: string, content: string): Promise<CustomerNote> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      id: "note_" + Math.random().toString(36).substr(2, 9),
      content,
      date: new Date().toISOString(),
      author: "You",
    };
  },
};
