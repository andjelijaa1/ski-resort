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
import { Link, useLocation } from "react-router-dom";
import { useUser } from "@/features/authentication/useUser";
import { NavUser } from "@/components/layout/nav-user";
import type { SidebarItem } from "../../data/sidebarItems";
import { sidebarItems } from "@/data/sidebarItems";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { useLogout } from "@/features/authentication/useLogout";
import Spinner from "@/components/Spinner";
import { Command } from "lucide-react";

export default function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { user, role, isLoading } = useUser();
  const { mutate: logoutUser, isPending } = useLogout();
  const location = useLocation();

  // Dok se ne učita user ili role, prikazujemo loading
  if (isLoading || !role) return <Spinner />;

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
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="gap-5">
              <SidebarMenu>
                {items.map((item) => {
                  const isActive = location.pathname === item.href;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`hover:bg-accent hover:text-accent-foreground ${
                          isActive ? "bg-accent text-accent-foreground" : ""
                        }`}
                      >
                        <Link to={item.href} className="flex items-center">
                          <div
                            className={`mr-2 h-5 w-5 flex items-center justify-center rounded ${
                              isActive ? "bg-first text-white" : ""
                            }`}
                          >
                            <item.icon className="h-4 w-4" />
                          </div>
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
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
