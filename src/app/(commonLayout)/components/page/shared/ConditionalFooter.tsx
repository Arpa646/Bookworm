"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // Hide footer on login and register pages
  const hideFooter = pathname === "/login" || pathname === "/register";
  
  if (hideFooter) {
    return null;
  }
  
  return <Footer />;
}
