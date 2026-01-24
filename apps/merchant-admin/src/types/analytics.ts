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

export interface ActivePerformance {
    // Define properties based on usage
    [key: string]: any;
}

export interface ComparisonData {
    // Define properties based on usage
    [key: string]: any;
}

export interface Insight {
    // Define properties based on usage
    [key: string]: any;
}

export interface Recommendation {
    // Define properties based on usage
    [key: string]: any;
}
