import { Car, Cog, History, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Sidebar } from "./sidebar.styles";
import { SidebarItem } from "./sidebar-item";
import { SidebarMenu } from "./sidebar-menu";
import { useSidebarContext } from "@/app/(dashboardLayout)/layout/layout-context";
import { CollapseItems } from "./collapse-items";

export const SidebarWrapper = () => {
  const pathname = usePathname();
  const { collapsed } = useSidebarContext();

  return (
    <aside className="h-screen z-[20] sticky top-0">
      {collapsed ? <div className={Sidebar.Overlay()} /> : null}
      <div
        className={Sidebar({
          collapsed: collapsed,
        })}
      >
        <div className={Sidebar.Header()}>
          {" "}
          <Link className="flex" href="/">
            <Cog />
            <p className="font-bold text-inherit px-4">APOLLO GEARS</p>
          </Link>
        </div>

        <div className="flex flex-col justify-between h-full">
          <div className={Sidebar.Body()}>
            <SidebarItem
              title="Home"
              icon={<Home />}
              isActive={pathname === "/dashboard"}
              href="/dashboard"
            />

            <SidebarMenu title="Main Menu">
              <SidebarItem
                isActive={pathname === "/dashboard/myprofile"}
                title="Myprofile"
                icon={<Car />}
                href="/dashboard/myprofile"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/update-pass"}
                title="UpdatePassword"
                icon={<Car />}
                href="/dashboard/update-pass"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/update-profile"}
                title="UpdateProfileInfo"
                icon={<Car />}
                href="/dashboard/update-profile"
              />
            </SidebarMenu>

            <SidebarMenu title="Updates">
              <SidebarItem
                isActive={pathname === "/changelog"}
                title="Changelog"
                icon={<Home />}
              />
            </SidebarMenu>
          </div>
        </div>
      </div>
    </aside>
  );
};
