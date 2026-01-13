"use client";

import { BookOpen, Home, Search, BookMarked, Target, PlayCircle, LogOut, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { useCurrentUser } from "@/GlobalRedux/Features/auth/authSlice";
import { logout } from "@/GlobalRedux/Features/auth/authSlice";
import { destroyCookie } from "nookies";
import { toast } from "sonner";

interface Props {
  children: React.ReactNode;
  isAdmin?: boolean;
}

export const BookNavbar = ({ children, isAdmin = false }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector(useCurrentUser);

  const handleLogout = async () => {
    try {
      console.log("🟢 Logout button clicked");
      
      // Clear Redux state first
      dispatch(logout());
      
      // Clear cookies with explicit path
      destroyCookie(null, "token", { path: "/" });
      destroyCookie(null, "user", { path: "/" });
      
      // Also clear cookies via document.cookie for immediate effect
      if (typeof document !== "undefined") {
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      }
      
      // Show success message
      toast.success("Logged out successfully");
      
      console.log("🔄 Redirecting to login page...");
      
      // Use window.location.href for immediate hard redirect
      // This ensures cookies are cleared and forces a full page reload
      window.location.href = "/login";
    } catch (error) {
      console.error("❌ Logout error:", error);
      // Force redirect even on error
      window.location.href = "/login";
    }
  };

  const userLinks = [
    { href: "/dashboard", label: "Home", icon: <Home className="h-4 w-4" /> },
    { href: "/dashboard/my-library", label: "My Library", icon: <BookMarked className="h-4 w-4" /> },
    { href: "/dashboard/search", label: "Search", icon: <Search className="h-4 w-4" /> },
    { href: "/dashboard/reading-challenge", label: "Challenge", icon: <Target className="h-4 w-4" /> },
    { href: "/dashboard/tutorial", label: "Tutorials", icon: <PlayCircle className="h-4 w-4" /> },
  ];

  const adminLinks = [
    { href: "/admin-dashboard", label: "Dashboard", icon: <Home className="h-4 w-4" /> },
    { href: "/admin-dashboard/books", label: "Books", icon: <BookOpen className="h-4 w-4" /> },
    { href: "/admin-dashboard/genres", label: "Genres", icon: <BookMarked className="h-4 w-4" /> },
    { href: "/admin-dashboard/reviews", label: "Reviews", icon: <Search className="h-4 w-4" /> },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 w-full">
      {/* Top Navbar */}
      <nav className="bg-black border-b border-red-600 shadow-lg sticky top-0 z-50 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href={isAdmin ? "/admin-dashboard" : "/dashboard"} className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-red-600" />
              <span className="font-bold text-xl text-white">Bookworm</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    pathname === link.href || pathname.startsWith(link.href + "/")
                      ? "bg-red-600 text-white font-medium"
                      : "text-gray-300 hover:bg-gray-800 hover:text-red-500"
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              {user && (
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {(user as any)?.name || (user as any)?.email || "User"}
                  </span>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-red-500 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden border-t border-red-600">
          <div className="px-4 py-2 flex gap-2 overflow-x-auto">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm whitespace-nowrap ${
                  pathname === link.href || pathname.startsWith(link.href + "/")
                    ? "bg-red-600 text-white font-medium"
                    : "text-gray-300 hover:bg-gray-800 hover:text-red-500"
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Page Content - Full Width */}
      <main className="w-full">{children}</main>
    </div>
  );
};
