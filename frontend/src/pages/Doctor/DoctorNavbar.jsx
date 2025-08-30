import { useDispatch, useSelector } from "react-redux";
import { assets } from "../../assets/assets_admin/assets";
// import { logoutAndRemoveDoctorToken } from "../../features/doctors/doctorSlice";
import { logoutDoctor } from "../../features/doctors/doctorSlice";
import { useNavigate } from "react-router-dom";
const DoctorNavbar = () => {
  const { doctorToken } = useSelector((state) => state.doctor);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutHandler = async () => {
    // await dispatch(logoutAndRemoveDoctorToken());
    await dispatch(logoutDoctor());
    navigate("/doctor/signin", { replace: true }); // 👈 go to doctor signin page after logout // ✅ replace prevents back navigation
  };
  return (
    <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white">
      <div className="flex items-center gap-2 text-xs">
        <img
          src={assets.admin_logo}
          alt="admin_logo"
          className="w-36 sm:w-40 cursor-pointer"
        />
        <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600">
          {doctorToken ? "Admin" : "Doctor"}
        </p>
      </div>
      {doctorToken && (
        <button
          onClick={logoutHandler}
          className="bg-primary text-white text-sm px-10 py-2 rounded-full"
        >
          Logout
        </button>
      )}
    </div>
  );
};
export default DoctorNavbar;
