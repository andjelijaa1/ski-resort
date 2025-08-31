import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSIdebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function AppLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex max-h-screen w-full">
        <AppSidebar />

        <main className="flex-1 flex flex-col p-4">
          <SidebarTrigger className="mb-4 cursor-pointer" />

          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
