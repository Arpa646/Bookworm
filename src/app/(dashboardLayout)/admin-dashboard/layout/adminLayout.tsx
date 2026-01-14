"use client";

import React, { useState, useEffect } from "react";
import { SidebarContext } from "../../layout/layout-context";
import { AdminSidebarWrapper } from "../../components/sidebar/adminSidebar";

interface Props {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: Props) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setCollapsed(mobile);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Outfit:wght@300;400;500;600&display=swap');
      `}</style>
      
      <div style={{ 
        minHeight: "100vh", 
        backgroundColor: "#0a0a0a",
        fontFamily: "'Outfit', sans-serif",
      }}>
        {/* Sidebar */}
        <AdminSidebarWrapper />
        
        {/* Main Content Area */}
        <div 
          style={{ 
            marginLeft: isMobile ? "0" : "280px",
            minHeight: "100vh",
            transition: "margin-left 0.3s ease",
            position: "relative",
          }}
        >
          {/* Page Content */}
          <main style={{ 
            width: "100%",
            minHeight: "100vh",
          }}>
            {children}
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
};

export default AdminLayout;