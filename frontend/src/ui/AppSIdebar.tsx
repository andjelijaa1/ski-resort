import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { sidebarItems } from "@/lib/sidebarItems";
import type { SidebarItem } from "@/lib/sidebarItems";
import { useUser } from "@/features/authentication/useUser";
import ThemeToggle from "@/components/ThemeToggle";
import { ModeToggle } from "@/components/mode-toggle";

type Role = "user" | "admin" | "instructor";
export default function AppSidebar() {
  const { user, isLoading } = useUser();

  if (isLoading) return null;

  const role: Role = (user?.role as Role) ?? "user";
  const items: SidebarItem[] = sidebarItems[role];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <div className="flex items-center justify-between px-2 py-1">
                  <span className="text-sm">Theme</span>
                  <ModeToggle />
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
