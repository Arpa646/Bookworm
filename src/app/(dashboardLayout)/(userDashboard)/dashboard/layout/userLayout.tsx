"use client";

import { BookNavbar } from "@/app/(dashboardLayout)/components/navbar/BookNavbar";

interface Props {
  children: React.ReactNode;
}

export const UserLayout = ({ children }: Props) => {
  return <BookNavbar isAdmin={false}>{children}</BookNavbar>;
};
