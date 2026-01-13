"use client";

import { useState, useEffect } from "react";
import { useGetAllUserQuery, useChangeUserRoleMutation } from "@/GlobalRedux/api/api";
import { toast } from "sonner";

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isBlock?: boolean;
  createdAt?: string;
}

const UsersPage = () => {
  const { data: usersData, isLoading, refetch } = useGetAllUserQuery({});
  const [changeUserRole, { isLoading: isChangingRole }] = useChangeUserRoleMutation();
  const [hoveredUser, setHoveredUser] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [changingUserId, setChangingUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const users = usersData?.data || [];

  const handleChangeRole = async (userId: string, newRole: string) => {
    try {
      setChangingUserId(userId);
      await changeUserRole({ id: userId, role: newRole }).unwrap();
      toast.success(`User role changed to ${newRole} successfully`);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to change user role");
    } finally {
      setChangingUserId(null);
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div style={{ fontFamily: "'Outfit', sans-serif", minHeight: "100vh", backgroundColor: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Outfit:wght@300;400;500;600&display=swap');
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "60px", height: "60px", border: "3px solid rgba(220, 38, 38, 0.2)", borderTopColor: "#dc2626", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 20px" }} />
          <p style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "14px", letterSpacing: "2px" }}>LOADING USERS...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", minHeight: "100vh", backgroundColor: "#0a0a0a", padding: isMobile ? "20px" : "32px", position: "relative", overflow: "hidden" }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Outfit:wght@300;400;500;600&display=swap');
        @keyframes float { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-20px) scale(1.05); } }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 20px rgba(220, 38, 38, 0.2); } 50% { box-shadow: 0 0 40px rgba(220, 38, 38, 0.4); } }
        @keyframes rotate { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        .user-card { animation: fadeIn 0.5s ease-out forwards; opacity: 0; }
      `}</style>

      {/* Background Effects */}
      <div style={{ position: "fixed", top: "-200px", left: "10%", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(220, 38, 38, 0.1) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(80px)", animation: "float 8s ease-in-out infinite", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "-200px", right: "10%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(220, 38, 38, 0.08) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(60px)", animation: "float 8s ease-in-out infinite 4s", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", width: "1200px", height: "1200px", border: "1px solid rgba(220, 38, 38, 0.05)", borderRadius: "50%", animation: "rotate 40s linear infinite", pointerEvents: "none", zIndex: 0 }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px", flexWrap: "wrap", gap: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "56px", height: "56px", background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 30px rgba(220, 38, 38, 0.3)", animation: "glow 3s ease-in-out infinite" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? "28px" : "36px", fontWeight: 600, color: "#ffffff", margin: 0 }}>User Management</h1>
              <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "14px", marginTop: "4px" }}>
                Manage users and roles • {users.length} {users.length === 1 ? "user" : "users"}
              </p>
            </div>
          </div>
        </div>

        {/* Users Grid / Empty State */}
        {users.length === 0 ? (
          <div style={{ background: "linear-gradient(145deg, rgba(25, 25, 25, 0.95) 0%, rgba(15, 15, 15, 0.98) 100%)", borderRadius: "24px", padding: "80px 20px", border: "1px solid rgba(255, 255, 255, 0.08)", textAlign: "center" }}>
            <div style={{ width: "100px", height: "100px", background: "rgba(220, 38, 38, 0.1)", borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="rgba(220, 38, 38, 0.4)" strokeWidth="1.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "26px", color: "#ffffff", marginBottom: "12px" }}>No users found</h3>
            <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "15px", maxWidth: "400px", margin: "0 auto" }}>
              There are no users in the system yet
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? "280px" : "320px"}, 1fr))`, gap: "20px" }}>
            {users.map((user: User, index: number) => (
              <div
                key={user._id}
                className="user-card"
                style={{
                  background: "linear-gradient(145deg, rgba(20, 20, 20, 0.9) 0%, rgba(10, 10, 10, 0.95) 100%)",
                  borderRadius: "20px",
                  border: hoveredUser === user._id ? "1px solid rgba(220, 38, 38, 0.4)" : "1px solid rgba(255, 255, 255, 0.06)",
                  padding: "24px",
                  transition: "all 0.3s ease",
                  transform: hoveredUser === user._id ? "translateY(-4px)" : "translateY(0)",
                  boxShadow: hoveredUser === user._id ? "0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(220, 38, 38, 0.1)" : "0 4px 20px rgba(0, 0, 0, 0.3)",
                  animationDelay: `${0.05 + index * 0.03}s`,
                }}
                onMouseEnter={() => setHoveredUser(user._id)}
                onMouseLeave={() => setHoveredUser(null)}
              >
                {/* User Icon & Info */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: "20px" }}>
                  <div style={{ width: "48px", height: "48px", background: hoveredUser === user._id ? "rgba(220, 38, 38, 0.2)" : "rgba(220, 38, 38, 0.1)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s ease", flexShrink: 0 }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontWeight: 600, color: hoveredUser === user._id ? "#ef4444" : "#ffffff", marginBottom: "4px", transition: "color 0.3s ease", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {user.name}
                    </h3>
                    <p style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "13px", marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {user.email}
                    </p>
                    {user.phone && (
                      <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "12px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {user.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Role Badge */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
                  <span style={{ display: "inline-block", padding: "6px 14px", background: user.role === "admin" ? "rgba(220, 38, 38, 0.2)" : "rgba(34, 197, 94, 0.15)", border: user.role === "admin" ? "1px solid rgba(220, 38, 38, 0.4)" : "1px solid rgba(34, 197, 94, 0.3)", borderRadius: "20px", color: user.role === "admin" ? "#ef4444" : "#22c55e", fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>
                    {user.role || "user"}
                  </span>
                  {user.isBlock && (
                    <span style={{ display: "inline-block", padding: "6px 14px", background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "20px", color: "#ef4444", fontSize: "12px", fontWeight: 500 }}>
                      Blocked
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {user.role !== "admin" && (
                    <button
                      onClick={() => handleChangeRole(user._id, "admin")}
                      disabled={changingUserId === user._id || isChangingRole}
                      style={{
                        width: "100%",
                        padding: "12px",
                        background: changingUserId === user._id ? "rgba(220, 38, 38, 0.3)" : "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
                        border: "none",
                        borderRadius: "10px",
                        color: "#ffffff",
                        fontSize: "13px",
                        fontWeight: 600,
                        cursor: changingUserId === user._id ? "wait" : "pointer",
                        fontFamily: "'Outfit', sans-serif",
                        transition: "all 0.3s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        boxShadow: changingUserId === user._id ? "none" : "0 4px 15px rgba(220, 38, 38, 0.3)",
                      }}
                      onMouseOver={(e) => {
                        if (changingUserId !== user._id) {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "0 6px 20px rgba(220, 38, 38, 0.4)";
                        }
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = changingUserId === user._id ? "none" : "0 4px 15px rgba(220, 38, 38, 0.3)";
                      }}
                    >
                      {changingUserId === user._id ? (
                        <>
                          <div style={{ width: "14px", height: "14px", border: "2px solid rgba(255, 255, 255, 0.3)", borderTopColor: "#ffffff", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                          Making Admin...
                        </>
                      ) : (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                          </svg>
                          Make Admin
                        </>
                      )}
                    </button>
                  )}
                  {user.role === "admin" && (
                    <div style={{ padding: "12px", background: "rgba(220, 38, 38, 0.1)", border: "1px solid rgba(220, 38, 38, 0.2)", borderRadius: "10px", textAlign: "center" }}>
                      <p style={{ color: "#ef4444", fontSize: "12px", fontWeight: 500, margin: 0 }}>
                        ✓ Admin User
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
