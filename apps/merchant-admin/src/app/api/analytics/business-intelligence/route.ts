import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@vayva/db";
import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function GET() {
    try {
        const session = await requireAuth();
        const storeId = session.user.storeId;

        // 1. Fetch Sales Data (Last 30 Days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const orders = await prisma.order.findMany({
            where: {
                storeId,
                createdAt: { gte: thirtyDaysAgo },
                status: "PAID",
            },
            include: {
                items: true,
            },
        });

        // 2. Prepare Data for AI
        const totalSales = orders.reduce((sum, o) => sum + Number(o.total), 0);
        const totalOrders = orders.length;
        const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

        const itemFrequency: Record<string, number> = {};
        orders.forEach(o => {
            o.items.forEach((item: any) => {
                itemFrequency[item.title] = (itemFrequency[item.title] || 0) + item.quantity;
            });
        });

        const topItems = Object.entries(itemFrequency)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([name, qty]) => `${name} (${qty} sold)`);

        // 3. Prompt Groq for Insights
        const prompt = `
            Analyze the following 30-day business data for a Vayva merchant:
            - Total Sales: ₦${totalSales.toLocaleString()}
            - Total Orders: ${totalOrders}
            - Average Order Value: ₦${avgOrderValue.toLocaleString()}
            - Top Selling Items: ${topItems.join(", ")}

            Provide a concise "Business Health Summary" including:
            1. Current Performance (compared to a typical baseline).
            2. One actionable growth tip.
            3. Churn Risk assessment (High/Medium/Low) based on order volume.
            4. Predictive inventory hint.

            Format the response as a JSON object with keys: "summary", "growthTip", "churnRisk", "inventoryHint".
            Keep the tone professional and helpful.
        `;

        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama3-8b-8192",
            response_format: { type: "json_object" },
        });

        const responseContent = completion.choices[0].message.content;
        const aiInsights = responseContent ? JSON.parse(responseContent) : {};

        return NextResponse.json({
            stats: {
                totalSales,
                totalOrders,
                avgOrderValue,
                topItems,
            },
            insights: aiInsights,
        });

    } catch (error: any) {
        console.error("BI Analytics error:", error);
        return NextResponse.json(
            { error: "Failed to generate business intelligence" },
            { status: 500 }
        );
    }
}
