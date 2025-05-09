"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
import { useAuthStore } from "@/store/useAuthStore";
import { trpc } from "@/lib/trpc/client";

export function DashboardSidebar() {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Track sidebar state

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
    { name: "Settings", href: "/account", icon: Settings },
    { name: "Messages", href: "/chat", icon: MessageSquare },
  ];

  const { logout, user } = useAuthStore();
  const router = useRouter();

  const { data: unreadCount } = trpc.notification.getUnreadCount.useQuery();
  const { data: messageCount } = trpc.message.getTotalUnreadCount.useQuery();
  console.log("Message Count:", messageCount);

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
                      <Link
                        href={item.href}
                        className="relative flex items-center gap-2"
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>

                        {/* Notifications count */}
                        {item.name === "Notifications" && unreadCount! > 0 && (
                          <span className="ml-auto inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary text-white">
                            {unreadCount}
                          </span>
                        )}

                        {/* Messages count */}
                        {item.name === "Messages" && messageCount > 0 && (
                          <span className="ml-auto inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary text-white">
                            {messageCount}
                          </span>
                        )}
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
                  <AvatarImage src={user?.profile_picture_url} alt="@user" />
                  <AvatarFallback>
                    {user?.first_name?.charAt(0).toUpperCase()}
                    {user?.last_name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {user?.first_name} {user?.last_name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {user?.email}
                  </span>
                </div>
              </div>
            </div>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/logout">
                    <LogOut className="h-5 w-5" />
                    <span onClick={() => logout(router)}>Logout</span>
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
