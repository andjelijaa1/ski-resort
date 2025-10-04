import {
  Home,
  Users,
  Settings,
  Calendar,
  User,
  MessageSquare,
  Briefcase,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type SidebarItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export const sidebarItems: Record<
  "admin" | "instructor" | "user",
  SidebarItem[]
> = {
  admin: [
    { title: "Dashboard", href: "/dashboard", icon: Home },
    { title: "Rooms", href: "/rooms", icon: Briefcase },
    { title: "Equipment", href: "/equipment", icon: Briefcase },
    { title: "Reservations", href: "/reservations", icon: Calendar },
    { title: "Users", href: "/users", icon: Users },
    { title: "Settings", href: "/settings", icon: Settings },
  ],
  instructor: [
    { title: "Dashboard", href: "/dashboard", icon: Home },
    { title: "My Profile", href: "/profile", icon: User },
    { title: "My Reservations", href: "/reservations", icon: Calendar },
    { title: "Chat", href: "/chat", icon: MessageSquare },
    { title: "Settings", href: "/settings", icon: Settings },
  ],
  user: [
    { title: "Home", href: "/", icon: Home },
    { title: "Rooms", href: "/rooms", icon: Briefcase },
    { title: "Equipment", href: "/equipment", icon: Briefcase },
    { title: "Instructors", href: "/instructors", icon: User },
    { title: "My Reservations", href: "/reservations", icon: Calendar },
    { title: "Chat", href: "/chat", icon: MessageSquare },
    { title: "Profile / Settings", href: "/settings", icon: Settings },
  ],
};
