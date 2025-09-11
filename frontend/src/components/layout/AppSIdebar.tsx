import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { useUser } from "@/features/authentication/useUser";
import { NavUser } from "@/components/layout/nav-user";
import type { SidebarItem } from "./../data/sidebarItems";
import { sidebarItems } from "@/data/sidebarItems";
import { ChevronsUpDown, Command } from "lucide-react";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { useLogout } from "@/features/authentication/useLogout";
import Spinner from "@/components/Spinner";

type Role = "user" | "admin" | "instructor";

export default function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { user, isLoading } = useUser();
  const { mutate: logoutUser, isPending } = useLogout(); // 👈 ubaci isPending

  if (isLoading) return null;

  const role: Role = (user?.user?.role as Role) ?? "user";
  const items: SidebarItem[] = sidebarItems[role];

  const currentUser = {
    name: user?.user?.user_name ?? "Guest User",
    email: user?.user?.user_email ?? "guest@example.com",
    avatar: user?.user?.avatarUrl ?? "/avatars/default.png",
  };

  const activeTeam = { name: "Evil .", logo: Command, plan: "Free" };

  const handleLogout = () => logoutUser();

  return (
    <>
      {/* Sidebar */}
      <Sidebar collapsible="icon" {...props} className="!bg-background2">
        <SidebarHeader>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-background2 data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-first text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <activeTeam.logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeTeam.name}</span>
                <span className="truncate text-xs">{activeTeam.plan}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className="hover:bg-accent hover:text-accent-foreground"
                    >
                      <Link to={item.href}>
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <div className="flex justify-between items-center">
                  <ModeToggle />
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <NavUser user={currentUser} onLogout={handleLogout} />
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      {isPending && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#181818] z-50">
          <Spinner />
        </div>
      )}
    </>
  );
}
