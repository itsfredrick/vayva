export interface ChartDataItem {
    date: string;
    sales: number;
    orders: number;
}

export interface OverviewMetrics {
    totalSales: number;
    totalOrders: number;
    aov: number;
    activeCustomers: number;
    chartData: ChartDataItem[];
}

export interface AnalyticInsight {
    type: "positive" | "negative" | "neutral";
    text: string;
}
