import type { Metadata } from "next";
import { AdminLayout } from "./layout/adminLayout";

export const metadata: Metadata = {
  title: "Admin Dashboard - Bookworm",
  description: "Manage books, genres, and reviews",
};

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
     <AdminLayout>
      {children}
     </AdminLayout>
    </div>
  );
}
