"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { useCurrentUser, logout } from "@/GlobalRedux/Features/auth/authSlice";
import { destroyCookie } from "nookies";
import { toast } from "sonner";
import { BookFooter } from "../footer/BookFooter";

interface AuthUser {
  name?: string;
  email?: string;
  profileImage?: string;
}

interface Props {
  children: React.ReactNode;
  isAdmin?: boolean;
}

export const BookNavbar = ({ children, isAdmin = false }: Props) => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const user = useSelector(useCurrentUser);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    const checkMobile = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      setIsMobile(width < 1024);
    };
    checkMobile();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  }, [pathname]);

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

  const userLinks = [
    {
      href: "/dashboard",
      label: "Home",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      href: "/dashboard/my-library",
      label: "My Library",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      href: "/dashboard/search",
      label: "Search",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      ),
    },
    {
      href: "/dashboard/reading-challenge",
      label: "Challenge",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      ),
    },
    {
      href: "/dashboard/tutorial",
      label: "Tutorials",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polygon points="10 8 16 12 10 16 10 8" />
        </svg>
      ),
    },
  ];

  const adminLinks = [
    {
      href: "/admin-dashboard",
      label: "Dashboard",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
    },
    {
      href: "/admin-dashboard/books",
      label: "Books",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
    },
    {
      href: "/admin-dashboard/genres",
      label: "Genres",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      href: "/admin-dashboard/reviews",
      label: "Reviews",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      href: "/admin-dashboard/users",
      label: "Users",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  const isActive = (href: string) => {
    if (href === "/dashboard" || href === "/admin-dashboard") {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", minHeight: "100vh", backgroundColor: "#0a0a0a", display: "flex", flexDirection: "column" }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Outfit:wght@300;400;500;600&display=swap');
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 15px rgba(220, 38, 38, 0.3); }
          50% { box-shadow: 0 0 25px rgba(220, 38, 38, 0.5); }
        }
        @media (max-width: 640px) {
          .navbar-container {
            padding: 0 12px !important;
          }
          .navbar-height {
            height: 60px !important;
          }
        }
        @media (min-width: 641px) and (max-width: 1023px) {
          .navbar-container {
            padding: 0 16px !important;
          }
          .navbar-height {
            height: 65px !important;
          }
        }
        @media (min-width: 1024px) {
          .navbar-container {
            padding: 0 24px !important;
          }
        }
        @media (max-width: 480px) {
          .navbar-container {
            padding: 0 10px !important;
          }
          .navbar-height {
            height: 58px !important;
          }
        }
      `}</style>

      {/* Top Navbar */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: isScrolled
            ? "rgba(10, 10, 10, 0.95)"
            : "linear-gradient(180deg, rgba(15, 15, 15, 0.98) 0%, rgba(10, 10, 10, 0.95) 100%)",
          backdropFilter: "blur(20px)",
          borderBottom: isScrolled ? "1px solid rgba(220, 38, 38, 0.2)" : "1px solid rgba(255, 255, 255, 0.06)",
          transition: "all 0.3s ease",
          boxShadow: isScrolled ? "0 4px 30px rgba(0, 0, 0, 0.3)" : "none",
        }}
      >
        <div className="navbar-container" style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
          <div className="navbar-height" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: windowWidth < 640 ? "60px" : windowWidth < 1024 ? "65px" : "70px", gap: "8px" }}>
            {/* Logo */}
            <Link href={isAdmin ? "/admin-dashboard" : "/dashboard"} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: isMobile ? "8px" : "12px", flexShrink: 0 }}>
              <div
                style={{
                  width: isMobile ? "36px" : "42px",
                  height: isMobile ? "36px" : "42px",
                  background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
                  borderRadius: isMobile ? "10px" : "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 20px rgba(220, 38, 38, 0.3)",
                  flexShrink: 0,
                }}
              >
                <svg width={isMobile ? "18" : "22"} height={isMobile ? "18" : "22"} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              {!isMobile && (
                <div>
                  <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontWeight: 600, color: "#ffffff", margin: 0, lineHeight: 1 }}>
                    Bookworm
                  </h1>
                  {isAdmin && (
                    <span style={{ fontSize: "10px", color: "#ef4444", letterSpacing: "1px", textTransform: "uppercase" }}>Admin</span>
                  )}
                </div>
              )}
            </Link>

            {/* Desktop Navigation */}
            {!isMobile && (
              <div style={{ display: "flex", alignItems: "center", gap: "4px", flexWrap: "wrap", justifyContent: "center", flex: 1, maxWidth: "800px", margin: "0 auto" }}>
                {links.map((link) => (
                  <Link key={link.href} href={link.href} style={{ textDecoration: "none" }}>
                    <div
                      onMouseEnter={() => setHoveredItem(link.href)}
                      onMouseLeave={() => setHoveredItem(null)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: windowWidth >= 1024 ? "10px 16px" : "8px 12px",
                        borderRadius: "10px",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        background: isActive(link.href)
                          ? "linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(220, 38, 38, 0.1) 100%)"
                          : hoveredItem === link.href
                          ? "rgba(255, 255, 255, 0.05)"
                          : "transparent",
                        border: isActive(link.href) ? "1px solid rgba(220, 38, 38, 0.3)" : "1px solid transparent",
                      }}
                    >
                      <div style={{ color: isActive(link.href) ? "#ef4444" : hoveredItem === link.href ? "#ffffff" : "rgba(255, 255, 255, 0.5)", transition: "color 0.3s ease", flexShrink: 0 }}>
                        {link.icon}
                      </div>
                      <span
                        style={{
                          fontSize: windowWidth >= 1024 ? "14px" : "13px",
                          fontWeight: isActive(link.href) ? 600 : 400,
                          color: isActive(link.href) ? "#ffffff" : hoveredItem === link.href ? "#ffffff" : "rgba(255, 255, 255, 0.6)",
                          transition: "color 0.3s ease",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {link.label}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Right Section - Profile & Mobile Menu */}
            <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "8px" : "12px", flexShrink: 0 }}>
              {/* Profile Dropdown */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  onMouseEnter={() => setHoveredItem("profile")}
                  onMouseLeave={() => setHoveredItem(null)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: isMobile ? "6px" : "10px",
                    padding: isMobile ? "6px 8px" : "8px 12px",
                    background: isProfileOpen ? "rgba(220, 38, 38, 0.1)" : hoveredItem === "profile" ? "rgba(255, 255, 255, 0.05)" : "transparent",
                    border: isProfileOpen ? "1px solid rgba(220, 38, 38, 0.3)" : "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: isMobile ? "10px" : "12px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: isMobile ? "30px" : "34px",
                      height: isMobile ? "30px" : "34px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: "2px solid rgba(220, 38, 38, 0.3)",
                      flexShrink: 0,
                    }}
                  >
                    {(user as AuthUser)?.profileImage ? (
                      <Image src={(user as AuthUser).profileImage!} alt="Profile" width={isMobile ? 30 : 34} height={isMobile ? 30 : 34} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
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
                          fontSize: isMobile ? "12px" : "14px",
                          fontWeight: 600,
                        }}
                      >
                        {((user as AuthUser)?.name?.[0] || (user as AuthUser)?.email?.[0] || "U").toUpperCase()}
                      </div>
                    )}
                  </div>
                  {!isMobile && (
                    <p style={{ fontSize: "13px", fontWeight: 500, color: "#ffffff", margin: 0, maxWidth: windowWidth >= 1280 ? "150px" : "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "left" }}>
                      {(user as AuthUser)?.name || "User"}
                    </p>
                  )}
                  {!isMobile && (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.5)"
                      strokeWidth="2"
                      style={{ transition: "transform 0.3s ease", transform: isProfileOpen ? "rotate(180deg)" : "rotate(0)", flexShrink: 0 }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  )}
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileOpen && (
                  <div
                    style={{
                      position: isMobile ? "fixed" : "absolute",
                      top: isMobile ? "auto" : "calc(100% + 8px)",
                      bottom: isMobile ? "80px" : "auto",
                      right: isMobile ? "12px" : 0,
                      left: isMobile ? "12px" : "auto",
                      width: isMobile ? "auto" : "220px",
                      maxWidth: isMobile ? "400px" : "220px",
                      margin: isMobile ? "0 auto" : 0,
                      background: "linear-gradient(145deg, rgba(25, 25, 25, 0.98) 0%, rgba(15, 15, 15, 0.99) 100%)",
                      borderRadius: isMobile ? "20px" : "16px",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
                      overflow: "hidden",
                      animation: "fadeIn 0.2s ease",
                      zIndex: 200,
                    }}
                  >
                    {/* User Info */}
                    <div style={{ padding: isMobile ? "14px" : "16px", borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
                      <p style={{ fontSize: isMobile ? "15px" : "14px", fontWeight: 600, color: "#ffffff", margin: "0 0 4px 0" }}>
                        {(user as AuthUser)?.name || "User"}
                      </p>
                      <p style={{ fontSize: isMobile ? "13px" : "12px", color: "rgba(255, 255, 255, 0.4)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {(user as AuthUser)?.email || "user@example.com"}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <div style={{ padding: isMobile ? "10px" : "8px" }}>
                      <Link href={isAdmin ? "/admin-dashboard" : "/dashboard/profile"} style={{ textDecoration: "none" }}>
                        <div
                          onMouseEnter={() => setHoveredItem("profile-link")}
                          onMouseLeave={() => setHoveredItem(null)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: isMobile ? "12px" : "10px",
                            padding: isMobile ? "12px 14px" : "10px 12px",
                            borderRadius: isMobile ? "12px" : "10px",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            background: hoveredItem === "profile-link" ? "rgba(255, 255, 255, 0.05)" : "transparent",
                          }}
                        >
                          <svg width={isMobile ? "18" : "16"} height={isMobile ? "18" : "16"} viewBox="0 0 24 24" fill="none" stroke={hoveredItem === "profile-link" ? "#ef4444" : "rgba(255, 255, 255, 0.5)"} strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                          <span style={{ fontSize: isMobile ? "14px" : "13px", color: hoveredItem === "profile-link" ? "#ffffff" : "rgba(255, 255, 255, 0.7)" }}>Profile</span>
                        </div>
                      </Link>

                      {!isAdmin && (
                        <Link href="/dashboard/settings" style={{ textDecoration: "none" }}>
                          <div
                            onMouseEnter={() => setHoveredItem("settings-link")}
                            onMouseLeave={() => setHoveredItem(null)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: isMobile ? "12px" : "10px",
                              padding: isMobile ? "12px 14px" : "10px 12px",
                              borderRadius: isMobile ? "12px" : "10px",
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                              background: hoveredItem === "settings-link" ? "rgba(255, 255, 255, 0.05)" : "transparent",
                            }}
                          >
                            <svg width={isMobile ? "18" : "16"} height={isMobile ? "18" : "16"} viewBox="0 0 24 24" fill="none" stroke={hoveredItem === "settings-link" ? "#ef4444" : "rgba(255, 255, 255, 0.5)"} strokeWidth="2">
                              <circle cx="12" cy="12" r="3" />
                              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                            </svg>
                            <span style={{ fontSize: isMobile ? "14px" : "13px", color: hoveredItem === "settings-link" ? "#ffffff" : "rgba(255, 255, 255, 0.7)" }}>Settings</span>
                          </div>
                        </Link>
                      )}
                    </div>

                    {/* Logout */}
                    <div style={{ padding: isMobile ? "10px" : "8px", borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}>
                      <button
                        onClick={handleLogout}
                        onMouseEnter={() => setHoveredItem("logout")}
                        onMouseLeave={() => setHoveredItem(null)}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: isMobile ? "12px" : "10px",
                          padding: isMobile ? "12px 14px" : "10px 12px",
                          borderRadius: isMobile ? "12px" : "10px",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          background: hoveredItem === "logout" ? "rgba(220, 38, 38, 0.1)" : "transparent",
                          border: "none",
                          fontFamily: "'Outfit', sans-serif",
                        }}
                      >
                        <svg width={isMobile ? "18" : "16"} height={isMobile ? "18" : "16"} viewBox="0 0 24 24" fill="none" stroke={hoveredItem === "logout" ? "#ef4444" : "rgba(255, 255, 255, 0.5)"} strokeWidth="2">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        <span style={{ fontSize: isMobile ? "14px" : "13px", color: hoveredItem === "logout" ? "#ef4444" : "rgba(255, 255, 255, 0.7)" }}>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              {isMobile && (
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: windowWidth < 640 ? "38px" : "42px",
                    height: windowWidth < 640 ? "38px" : "42px",
                    background: isMobileMenuOpen ? "rgba(220, 38, 38, 0.1)" : "rgba(255, 255, 255, 0.03)",
                    border: isMobileMenuOpen ? "1px solid rgba(220, 38, 38, 0.3)" : "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: windowWidth < 640 ? "10px" : "12px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    flexShrink: 0,
                  }}
                >
                  {isMobileMenuOpen ? (
                    <svg width={windowWidth < 640 ? "18" : "20"} height={windowWidth < 640 ? "18" : "20"} viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  ) : (
                    <svg width={windowWidth < 640 ? "18" : "20"} height={windowWidth < 640 ? "18" : "20"} viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="2">
                      <line x1="3" y1="12" x2="21" y2="12" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobile && isMobileMenuOpen && (
          <div
            style={{
              borderTop: "1px solid rgba(255, 255, 255, 0.06)",
              background: "rgba(10, 10, 10, 0.98)",
              animation: "slideDown 0.3s ease",
              maxHeight: windowWidth < 640 ? "calc(100vh - 60px)" : "calc(100vh - 70px)",
              overflowY: "auto",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <div style={{ padding: windowWidth < 640 ? "12px" : "16px", display: "flex", flexDirection: "column", gap: windowWidth < 640 ? "6px" : "8px" }}>
              {links.map((link) => (
                <Link key={link.href} href={link.href} style={{ textDecoration: "none" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: windowWidth < 640 ? "10px" : "12px",
                      padding: windowWidth < 640 ? "12px 14px" : "14px 16px",
                      borderRadius: windowWidth < 640 ? "10px" : "12px",
                      background: isActive(link.href) ? "linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(220, 38, 38, 0.1) 100%)" : "transparent",
                      border: isActive(link.href) ? "1px solid rgba(220, 38, 38, 0.3)" : "1px solid transparent",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div style={{ color: isActive(link.href) ? "#ef4444" : "rgba(255, 255, 255, 0.5)", flexShrink: 0 }}>
                      {link.icon}
                    </div>
                    <span style={{ fontSize: windowWidth < 640 ? "14px" : "15px", fontWeight: isActive(link.href) ? 600 : 400, color: isActive(link.href) ? "#ffffff" : "rgba(255, 255, 255, 0.7)" }}>
                      {link.label}
                    </span>
                    {isActive(link.href) && (
                      <div style={{ marginLeft: "auto", width: "6px", height: "6px", borderRadius: "50%", background: "#ef4444", boxShadow: "0 0 10px rgba(239, 68, 68, 0.5)", flexShrink: 0 }} />
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Click outside to close dropdowns */}
      {(isProfileOpen || isMobileMenuOpen) && (
        <div
          onClick={() => {
            setIsProfileOpen(false);
            setIsMobileMenuOpen(false);
          }}
          style={{ position: "fixed", inset: 0, zIndex: 50 }}
        />
      )}

      {/* Page Content */}
      <main style={{ position: "relative", zIndex: 1, flex: 1 }}>{children}</main>

      {/* Footer */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <BookFooter />
      </div>
    </div>
  );
};

export default BookNavbar;