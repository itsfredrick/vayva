import { NextResponse } from "next/server";

export interface AICoachMessage {
  id: string;
  type: "insight" | "alert" | "education" | "pulse";
  content: string;
  timestamp: string;
  actions?: {
    label: string;
    link?: string;
    actionId?: string;
  }[];
  isRead: boolean;
  feedback?: "helpful" | "not_helpful";
}

const DEMO_MESSAGES: AICoachMessage[] = [
  {
    id: "msg_1",
    type: "pulse",
    content:
      "Good morning Fred 👋\nYesterday: ₦48,200 from 12 orders.\n2 customers returned. Nice work.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    isRead: false,
  },
  {
    id: "msg_2",
    type: "insight",
    content:
      "Your mobile checkout dropped slightly. Switching to the Bold theme may help.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    actions: [
      {
        label: "Preview Template",
        link: "/admin/control-center?tab=gallery&preview=bold",
      },
    ],
    isRead: true,
  },
];

export async function GET() {
  return NextResponse.json(DEMO_MESSAGES);
}

export async function POST(request: Request) {
  const { messageId, feedback } = await request.json();
  return NextResponse.json({ success: true, messageId, feedback });
}
