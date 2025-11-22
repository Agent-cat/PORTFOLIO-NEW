import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "Admin panel for managing blog posts",
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  try {
    await requireAdmin();
  } catch {
    redirect("/login");
  }
  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
