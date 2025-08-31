// ui/AppSidebar.tsx
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { sidebarItems } from "@/lib/sidebarItems";
import type { SidebarItem } from "@/lib/sidebarItems";
import { useUser } from "@/features/authentication/useUser";

type Role = "user" | "admin" | "instructor";
export default function AppSidebar() {
  const { user, isLoading } = useUser();

  if (isLoading) return null;

  const role: Role = (user?.role as Role) ?? "user";
  const items: SidebarItem[] = sidebarItems[role];

  return (
    <Sidebar collapsible="icon" side="left">
      <SidebarContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link to={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
