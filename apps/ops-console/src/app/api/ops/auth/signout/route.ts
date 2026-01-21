import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
    const cookieStore = await cookies();
    cookieStore.delete("ops_token"); // Assuming standard name, or check ops-auth.ts

    // Redirect to Ops Login
    return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_OPS_URL || "http://localhost:3002"));
}
