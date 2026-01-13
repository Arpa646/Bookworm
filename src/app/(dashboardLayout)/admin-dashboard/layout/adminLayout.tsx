"use client";

import React, { useState } from "react";
import { SidebarContext } from "../../layout/layout-context";
import { AdminSidebarWrapper } from "../../components/sidebar/adminSidebar";

interface Props {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: Props) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex">
        {/* Sidebar */}
        <AdminSidebarWrapper />
        
        {/* Main Content Area */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Page Content */}
          <main className="flex-1 overflow-y-auto w-full">{children}</main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
};
