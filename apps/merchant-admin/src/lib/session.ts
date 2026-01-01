import jwt from "jsonwebtoken";
import { prisma } from "@vayva/db";
import { cookies } from "next/headers";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  "dev-secret-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
export const COOKIE_NAME = "vayva_session";

export interface SessionPayload {
  userId: string;
  email: string;
  storeId: string;
  storeName: string;
  role: string;
}

export interface SessionUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  storeId: string;
  storeName: string;
  role: string;
}

/**
 * Generate JWT token for user session
 */
export function generateToken(payload: SessionPayload): string {
  return jwt.sign({ ...payload }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as any,
  });
}

/**
 * Verify and decode JWT token
 */
export function verifyToken(token: string): SessionPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as SessionPayload;
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

/**
 * Create session in database and set cookie
 */
export async function createSession(
  user: SessionUser,
  device?: string,
  ipAddress?: string,
): Promise<string> {
  const payload: SessionPayload = {
    userId: user.id,
    email: user.email,
    storeId: user.storeId,
    storeName: user.storeName,
    role: user.role,
  };

  const token = generateToken(payload);

  // Calculate expiration date (7 days from now)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  // Create session record in database
  await prisma.merchantSession.create({
    data: {
      userId: user.id,
      token,
      device: device || null,
      ipAddress: ipAddress || null,
      expiresAt,
    },
  });

  // Set HTTP-only cookie
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    path: "/",
  });

  return token;
}

/**
 * Get session from cookie and validate
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  // Verify token
  const payload = verifyToken(token);
  if (!payload) {
    return null;
  }

  // Check if session exists in database and hasn't expired
  const session = await prisma.merchantSession.findUnique({
    where: { token },
  });

  if (!session || session.expiresAt < new Date()) {
    // Session expired or doesn't exist, clear cookie
    await clearSession();
    return null;
  }

  return payload;
}

/**
 * Get full user data from session
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await getSession();
  if (!session) {
    return null;
  }

  // Fetch user with store membership
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      memberships: {
        where: {
          storeId: session.storeId,
          status: "active",
        },
        include: {
          store: true,
        },
      },
    },
  });

  if (!user || user.memberships.length === 0) {
    return null;
  }

  const membership = user.memberships[0];

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    storeId: membership.storeId,
    storeName: membership.store.name,
    role: membership.role,
  };
}

/**
 * Clear session cookie and delete from database
 */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (token) {
    // Delete session from database
    try {
      await prisma.merchantSession.delete({
        where: { token },
      });
    } catch (error) {
      // Session might not exist, ignore error
      console.warn("Session deletion failed:", error);
    }
  }

  // Clear cookie
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Require authentication - throws error if not authenticated
 */
export async function requireAuth(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}
