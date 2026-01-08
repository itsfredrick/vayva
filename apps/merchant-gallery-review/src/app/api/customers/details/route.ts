import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  await new Promise((resolve) => setTimeout(resolve, 300));

  // Test History Data
  const history = [
    {
      id: "act_1",
      type: "order",
      amount: 15000,
      status: "completed",
      date: new Date().toISOString(),
    },
    {
      id: "act_2",
      type: "order",
      amount: 8500,
      status: "completed",
      date: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      id: "act_3",
      type: "inquiry",
      status: "resolved",
      date: new Date(Date.now() - 86400000 * 10).toISOString(),
    },
  ];

  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  return NextResponse.json({
    id,
    history,
    notes: "Customer prefers delivery to office address on weekdays.",
  });
}
