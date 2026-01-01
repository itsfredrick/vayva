import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { z } from "zod";
import { compare } from "bcryptjs";
import { reportError } from "@/lib/error";

const loginSchema = z.object({
  storeId: z.string(),
  email: z.string().email(),
  password: z.string(),
});

export async function POST(req: NextRequest) {
  let email: string | undefined;
  try {
    const body = await req.json();
    const parsed = loginSchema.parse(body);
    email = parsed.email;
    const { storeId, password } = parsed;

    // Find customer
    // Cast to 'any' to allow access to passwordHash which might not be in the generated type yet
    const customer = (await prisma.customer.findUnique({
      where: { storeId_email: { storeId, email } },
    })) as any;

    if (!customer || !customer.passwordHash) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    // Verify password
    const isValid = await compare(password, customer.passwordHash);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    // Return success (Frontend will handle session cookie)
    return NextResponse.json({
      success: true,
      customer: {
        id: customer.id,
        email: customer.email,
        name: `${customer.firstName} ${customer.lastName}`,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 },
      );
    }
    reportError(error, { route: "POST /api/auth/login", email });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
