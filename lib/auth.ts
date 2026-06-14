// auth.ts — admin session verification and role guards
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export type AdminSession = {
  email?: string;
  name?: string;
  role?: string;
};

// Decode base64 session cookie from admin login
export async function verifyAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("dkm_admin_session");

  if (!sessionCookie?.value) return null;

  try {
    const decodedData = Buffer.from(sessionCookie.value, "base64").toString(
      "utf8",
    );
    return JSON.parse(decodedData) as AdminSession;
  } catch {
    return null;
  }
}

export interface UserProfile {
  id: string;
  email: string;
  role: "admin" | "customer" | "staff";
  name?: string;
  avatar_url?: string;
  created_at: string;
}

// Merge session with Prisma profile when available
export async function getCurrentUser(): Promise<UserProfile | null> {
  const session = await verifyAdminSession();
  if (!session?.email) return null;

  try {
    const profile = await prisma.profile.findUnique({
      where: { email: session.email },
    });

    return {
      id: profile?.id || "admin-id",
      email: session.email,
      role:
        profile?.role === "admin"
          ? "admin"
          : profile?.role === "staff"
            ? "staff"
            : "customer",
      name: profile?.name || session.name,
      avatar_url: profile?.avatar_url || undefined,
      created_at:
        profile?.created_at?.toISOString() || new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== "admin") throw new Error("Forbidden");
  return user;
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete("dkm_admin_session");
}
