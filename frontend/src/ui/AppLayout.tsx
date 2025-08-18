import { Outlet } from "react-router-dom";

function AppLayout() {
  return (
    <div className="grid grid-cols-[260px_1fr] grid-rows-[auto_1fr] h-screen">
      <header className="col-span-2 bg-blue-600 text-white p-4">Header</header>
      <aside className="bg-gray-200 p-4">Sidebar</aside>
      <main className="bg-gray-50 p-6 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AppLayout;
