import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const VistaIndexAdmin = () => {
  return (
    <div className="min-h-screen bg-gris flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default VistaIndexAdmin;
