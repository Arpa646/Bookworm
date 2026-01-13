"use client";

import { LogOut, User, Menu } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useCurrentUser } from "@/GlobalRedux/Features/auth/authSlice";
import { logout } from "@/GlobalRedux/Features/auth/authSlice";
import { destroyCookie } from "nookies";
import { toast } from "sonner";
import { useSidebarContext } from "../../layout/layout-context";

export const AdminTopBar = () => {
  const dispatch = useDispatch();
  const user = useSelector(useCurrentUser);
  const { collapsed, setCollapsed } = useSidebarContext();

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
      window.location.href = "/login";
    } catch (error) {
      console.error("❌ Logout error:", error);
      // Force redirect even on error
      window.location.href = "/login";
    }
  };

  return (
    <nav className="bg-black border-b border-red-600 shadow-lg sticky top-0 z-50 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="md:hidden flex items-center justify-center p-2 text-gray-300 hover:bg-gray-800 hover:text-red-500 rounded-lg transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Spacer for mobile */}
          <div className="flex-1 md:hidden" />

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {(user as any)?.name || (user as any)?.email || "Admin"}
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
    </nav>
  );
};
