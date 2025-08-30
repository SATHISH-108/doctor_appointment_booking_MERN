import { Outlet } from "react-router-dom";
import { DoctorNavbar } from "../Doctor/index";
import { useSelector } from "react-redux";
import { DoctorSidebar } from "./index";
const DoctorHomeLayout = () => {
  const { doctorToken } = useSelector((state) => state.doctor);

  return (
    <div className="min-h-screen flex flex-col">
      <DoctorNavbar />
      {doctorToken && (
        <div className="flex flex-1">
          {/* <div className="w-[250px] bg-gray-100"> */}
          <div>
            <DoctorSidebar />
          </div>
          <div className="flex-1 p-4">
            <Outlet />
          </div>
        </div>
      )}
    </div>
  );
};
export default DoctorHomeLayout;
