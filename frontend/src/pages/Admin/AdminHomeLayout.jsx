import { Outlet } from "react-router-dom";
import { AdminNavbar } from "../Admin/index";
import { AdminSidebar } from "./index";
import { useSelector } from "react-redux";
const AdminHomeLayout = () => {
  const { adminToken } = useSelector((state) => state.admin);

  return (
    <div className="min-h-screen flex flex-col">
      <AdminNavbar />
      {adminToken && (
        <div className="flex flex-1">
          {/* <div className="w-[250px] bg-gray-100"> */}

          <div>
            <AdminSidebar />
          </div>
          <div className="flex-1 p-4">
            <Outlet />
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminHomeLayout;
