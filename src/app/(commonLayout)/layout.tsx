import type { Metadata } from "next";
import ConditionalFooter from "./components/page/shared/ConditionalFooter";
import ConditionalNavbar from "./components/page/shared/ConditionalNavbar";

export const metadata: Metadata = {
  title: "Apollo Gears",
  description: "Next Level Riding Sharing Service",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <ConditionalNavbar />
      {children}
      <ConditionalFooter />
    </div>
  );
}
