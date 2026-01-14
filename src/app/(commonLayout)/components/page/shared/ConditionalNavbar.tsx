"use client";

import { usePathname } from "next/navigation";
import NavBar from "./Navnar";

export default function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Hide navbar on login and register pages
  const hideNavbar = pathname === "/login" || pathname === "/register";
  
  if (hideNavbar) {
    return null;
  }
  
  return <NavBar />;
}
