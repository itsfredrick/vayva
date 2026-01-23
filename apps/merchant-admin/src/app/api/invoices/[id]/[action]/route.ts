import { NextResponse } from "next/server";
export async function POST(request: unknown, { params }: unknown) {
    const { id, action } = await params;
    // Test processing delay
    await new Promise((resolve: unknown) => setTimeout(resolve, 500));
    if (action === "paylink") {
        return NextResponse.json({
            payLink: `https://pay.vayva.ng/${id}`,
        });
    }
    return NextResponse.json({
        success: true,
        action,
        id,
        processed_at: new Date().toISOString(),
    });
}
