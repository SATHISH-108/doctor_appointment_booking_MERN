import { useDispatch, useSelector } from "react-redux";
import { assets } from "../../assets/assets_admin/assets";
import { logoutAdmin, logoutAll } from "../../features/admin/adminSlice";
import { useNavigate } from "react-router-dom";
const AdminNavbar = () => {
  const { adminToken } = useSelector((state) => state.admin);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logoutHandler = async () => {
    await dispatch(logoutAll());
    // await dispatch(logoutAdmin());
    navigate("/admin/signin", { replace: true }); // ✅ replace prevents back navigation
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
          {adminToken ? "Admin" : "Doctor"}
        </p>
      </div>
      <button
        onClick={logoutHandler} // handles both admin & doctor logout (remove adminToken & doctorToken)
        className="bg-primary text-white text-sm px-10 py-2 rounded-full"
      >
        Logout
      </button>
    </div>
  );
};
export default AdminNavbar;
