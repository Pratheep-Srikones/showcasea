"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ImageIcon,
  Heart,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export function DashboardSidebar() {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Track sidebar state

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Artworks", href: "/dashboard/artworks", icon: ImageIcon },
    { name: "Likes", href: "/dashboard/likes", icon: Heart },
    { name: "Comments", href: "/dashboard/comments", icon: MessageSquare },
    { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
    { name: "Settings", href: "/account", icon: Settings },
  ];

  return (
    <div>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-4 py-2">
              {/* Mobile toggle button */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-md"
              >
                <Menu className="h-5 w-5" />
              </button>

              <span className="font-bold text-lg">Showcasa</span>
            </div>
          </SidebarHeader>

          {/* Sidebar content */}
          {isSidebarOpen && (
            <SidebarContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                    >
                      <Link href={item.href}>
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
          )}

          {/* Sidebar footer */}
          <SidebarFooter>
            <div className="px-3 py-2">
              <div className="flex items-center gap-3 rounded-md px-3 py-2">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/placeholder-user.jpg" alt="@user" />
                  <AvatarFallback>AC</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Alex Chen</span>
                  <span className="text-xs text-muted-foreground">
                    alex@showcasa.com
                  </span>
                </div>
              </div>
            </div>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/logout">
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
      </SidebarProvider>
    </div>
  );
}
