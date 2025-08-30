import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { assets } from "../../assets/assets_admin/assets";

const DoctorSidebar = () => {
  const { doctorToken } = useSelector((state) => state.doctor);

  return (
    <div className="min-h-screen bg-white border-r">
      {/* doctorToken */}
      {doctorToken && (
        <ul className="text-[#515151] mt-5">
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
              }`
            }
            to="/doctor-dashboard"
          >
            <img src={assets.home_icon} alt="home_icon" className="" />
            <p className="hidden md:block">Dashboard</p>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
              }`
            }
            to="/doctor/appointments"
          >
            <img
              src={assets.appointment_icon}
              alt="appointment_icon"
              className=""
            />
            <p className="hidden md:block">Appointments</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
              }`
            }
            to="/doctor/profile"
          >
            <img src={assets.people_icon} alt="people_icon" className="" />
            <p className="hidden md:block">Profile</p>
          </NavLink>
        </ul>
      )}
    </div>
  );
};

export default DoctorSidebar;
