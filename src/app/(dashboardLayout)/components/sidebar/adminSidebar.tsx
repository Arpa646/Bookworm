"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { useCurrentUser, logout } from "@/GlobalRedux/Features/auth/authSlice";
import { destroyCookie } from "nookies";
import { toast } from "sonner";

export const AdminSidebarWrapper = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const user = useSelector(useCurrentUser);
  const [collapsed, setCollapsed] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setCollapsed(false);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLogout = async () => {
    try {
      dispatch(logout());
      destroyCookie(null, "token", { path: "/" });
      destroyCookie(null, "user", { path: "/" });
      if (typeof document !== "undefined") {
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      }
      toast.success("Logged out successfully");
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      window.location.href = "/login";
    }
  };

  const menuItems = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
      href: "/admin-dashboard",
      isActive: pathname === "/admin-dashboard",
    },
  ];

  const managementItems = [
    {
      id: "books",
      title: "Books",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
      href: "/admin-dashboard/books",
      isActive: pathname === "/admin-dashboard/books" || pathname.startsWith("/admin-dashboard/books/"),
    },
    {
      id: "genres",
      title: "Genres",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      ),
      href: "/admin-dashboard/genres",
      isActive: pathname === "/admin-dashboard/genres" || pathname.startsWith("/admin-dashboard/genres/"),
    },
    {
      id: "reviews",
      title: "Reviews",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      href: "/admin-dashboard/reviews",
      isActive: pathname === "/admin-dashboard/reviews" || pathname.startsWith("/admin-dashboard/reviews/"),
    },
    {
      id: "users",
      title: "User Management",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      href: "/admin-dashboard/users",
      isActive: pathname === "/admin-dashboard/users" || pathname.startsWith("/admin-dashboard/users/"),
    },
  ];

  const NavItem = ({ item }: { item: typeof menuItems[0] }) => (
    <Link href={item.href} style={{ textDecoration: "none" }}>
      <div
        onMouseEnter={() => setHoveredItem(item.id)}
        onMouseLeave={() => setHoveredItem(null)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "12px 16px",
          borderRadius: "12px",
          cursor: "pointer",
          transition: "all 0.3s ease",
          background: item.isActive
            ? "linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(220, 38, 38, 0.1) 100%)"
            : hoveredItem === item.id
            ? "rgba(255, 255, 255, 0.05)"
            : "transparent",
          borderLeft: item.isActive ? "3px solid #ef4444" : "3px solid transparent",
          marginLeft: item.isActive ? "-3px" : "0",
        }}
      >
        <div
          style={{
            color: item.isActive ? "#ef4444" : hoveredItem === item.id ? "#ffffff" : "rgba(255, 255, 255, 0.5)",
            transition: "color 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {item.icon}
        </div>
        <span
          style={{
            fontSize: "14px",
            fontWeight: item.isActive ? 600 : 400,
            color: item.isActive ? "#ffffff" : hoveredItem === item.id ? "#ffffff" : "rgba(255, 255, 255, 0.6)",
            transition: "color 0.3s ease",
          }}
        >
          {item.title}
        </span>
        {item.isActive && (
          <div
            style={{
              marginLeft: "auto",
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#ef4444",
              boxShadow: "0 0 10px rgba(239, 68, 68, 0.5)",
            }}
          />
        )}
      </div>
    </Link>
  );

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Outfit:wght@300;400;500;600&display=swap');
        @keyframes slideIn {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      {/* Mobile Toggle Button */}
      {isMobile && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            position: "fixed",
            top: "16px",
            left: "16px",
            zIndex: 100,
            width: "44px",
            height: "44px",
            background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
            border: "none",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(220, 38, 38, 0.3)",
          }}
        >
          {collapsed ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          )}
        </button>
      )}

      {/* Overlay for mobile */}
      {isMobile && !collapsed && (
        <div
          onClick={() => setCollapsed(true)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 40,
            animation: "fadeIn 0.3s ease",
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          fontFamily: "'Outfit', sans-serif",
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: "280px",
          background: "linear-gradient(180deg, rgba(15, 15, 15, 0.98) 0%, rgba(10, 10, 10, 0.99) 100%)",
          borderRight: "1px solid rgba(255, 255, 255, 0.06)",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          transform: isMobile && collapsed ? "translateX(-100%)" : "translateX(0)",
          transition: "transform 0.3s ease",
          boxShadow: "4px 0 30px rgba(0, 0, 0, 0.3)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "24px 20px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <Link href="/admin-dashboard" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 24px rgba(220, 38, 38, 0.3)",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <div>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontWeight: 600, color: "#ffffff", margin: 0 }}>
                Bookworm
              </h1>
              <p style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.4)", letterSpacing: "1px", textTransform: "uppercase", margin: 0 }}>
                Admin Panel
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 12px" }}>
          {/* Main Menu */}
          <div style={{ marginBottom: "24px" }}>
            {menuItems.map((item) => (
              <NavItem key={item.id} item={item} />
            ))}
          </div>

          {/* Management Section */}
          <div>
            <p
              style={{
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "rgba(255, 255, 255, 0.3)",
                padding: "0 16px",
                marginBottom: "12px",
              }}
            >
              Management
            </p>
            {managementItems.map((item) => (
              <NavItem key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Footer - User Profile & Logout */}
        <div
          style={{
            padding: "16px",
            borderTop: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          {/* User Card */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              borderRadius: "14px",
              padding: "14px",
              marginBottom: "12px",
              border: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {/* Avatar */}
              <div
                style={{
                  position: "relative",
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "2px solid rgba(220, 38, 38, 0.3)",
                  flexShrink: 0,
                }}
              >
                {(user as any)?.profileImage ? (
                  <Image
                    src={(user as any).profileImage}
                    alt="Profile"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ffffff",
                      fontSize: "16px",
                      fontWeight: 600,
                    }}
                  >
                    {((user as any)?.name?.[0] || (user as any)?.email?.[0] || "A").toUpperCase()}
                  </div>
                )}
                {/* Online indicator */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "0",
                    right: "0",
                    width: "12px",
                    height: "12px",
                    background: "#22c55e",
                    borderRadius: "50%",
                    border: "2px solid #0f0f0f",
                  }}
                />
              </div>

              {/* User Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#ffffff",
                    margin: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {(user as any)?.name || "Admin User"}
                </p>
                <p
                  style={{
                    fontSize: "12px",
                    color: "rgba(255, 255, 255, 0.4)",
                    margin: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {(user as any)?.email || "admin@bookworm.com"}
                </p>
              </div>

              {/* Role Badge */}
              <div
                style={{
                  padding: "4px 10px",
                  background: "rgba(220, 38, 38, 0.15)",
                  borderRadius: "20px",
                  border: "1px solid rgba(220, 38, 38, 0.25)",
                }}
              >
                <span style={{ fontSize: "10px", fontWeight: 600, color: "#ef4444", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Admin
                </span>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            onMouseEnter={() => setHoveredItem("logout")}
            onMouseLeave={() => setHoveredItem(null)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              padding: "12px",
              background: hoveredItem === "logout" ? "rgba(220, 38, 38, 0.15)" : "rgba(255, 255, 255, 0.03)",
              border: hoveredItem === "logout" ? "1px solid rgba(220, 38, 38, 0.3)" : "1px solid rgba(255, 255, 255, 0.06)",
              borderRadius: "12px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke={hoveredItem === "logout" ? "#ef4444" : "rgba(255, 255, 255, 0.5)"}
              strokeWidth="2"
              style={{ transition: "stroke 0.3s ease" }}
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span
              style={{
                fontSize: "14px",
                fontWeight: 500,
                color: hoveredItem === "logout" ? "#ef4444" : "rgba(255, 255, 255, 0.6)",
                transition: "color 0.3s ease",
              }}
            >
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebarWrapper;