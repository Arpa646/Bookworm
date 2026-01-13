"use client";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { useUser } from "@/services";

export default function NavBar() {
  const user = useUser();

  return (
    <Navbar maxWidth="full" className="bg-white border-b border-amber-200">
      <NavbarBrand>
        <Link className="flex items-center gap-2" href="/">
          <BookOpen className="h-6 w-6 text-amber-600" />
          <p className="font-bold text-xl text-amber-900">Bookworm</p>
        </Link>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link href="/login" className="text-amber-700 hover:text-amber-900 transition-colors">
            Sign In
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/register" className="text-amber-700 hover:text-amber-900 transition-colors">
            Sign Up
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <ThemeSwitcher />
        </NavbarItem>

        {user ? (
          <NavbarItem>
            <Link
              href="/dashboard"
              className="px-6 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all"
            >
              Dashboard
            </Link>
          </NavbarItem>
        ) : (
          <NavbarItem>
            <Link
              href="/login"
              className="px-6 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all"
            >
              Login
            </Link>
          </NavbarItem>
        )}
      </NavbarContent>
    </Navbar>
  );
}
