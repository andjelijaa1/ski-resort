import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSIdebar";

function AppLayout() {
  return (
    <SidebarProvider>
      <div className="grid grid-cols-[260px_1fr]  h-screen">
        <AppSidebar />
        <main className="bg-gray-50 p-6 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

export default AppLayout;
