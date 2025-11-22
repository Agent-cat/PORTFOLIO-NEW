"use server";

import { connectDB } from "@/lib/mongoose";
import { User } from "@/lib/models/User";
import { verifyPassword, signToken, setAuthCookie, clearAuthCookie, getSessionUser } from "@/lib/auth";

export async function signIn(email: string, password: string) {
  try {
    await connectDB();
  } catch (err) {
    console.error("Database connection failed:", err);
    throw new Error("Database connection failed. Please try again later.");
  }
  
  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() }).lean();
    if (!user) throw new Error("Invalid credentials");
    const ok = await verifyPassword(password, (user as any).passwordHash);
    if (!ok) throw new Error("Invalid credentials");
    const token = await signToken({
      id: String((user as any)._id),
      email: (user as any).email,
      name: (user as any).name || null,
      role: (user as any).role,
    });
    await setAuthCookie(token);
    return { ok: true };
  } catch (err) {
    if (err instanceof Error && err.message === "Invalid credentials") {
      throw err;
    }
    console.error("Sign in error:", err);
    throw new Error("Authentication failed. Please try again.");
  }
}

export async function signOut() {
  await clearAuthCookie();
  return { ok: true };
}

export async function currentUser() {
  return getSessionUser();
}
