import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets_frontend/assets";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUserProfile, logout } from "../features/user/userSlice";
const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  //if we have patientToken it means loggedin
  //if we don't have patientToken it means loggedout
  const { patientToken, userProfileData } = useSelector((state) => state.user);
  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch, patientToken]);
  return (
    <div className="flex items-center justify-between py-3 border-b border-b-gray-400">
      <div onClick={() => navigate("/")}>
        <img
          src={assets.logo}
          alt="prescripto-image"
          className="w-44 cursor-pointer"
        />
      </div>
      <div className="hidden md:flex items-start gap-5 font-medium">
        <NavLink to="/" className="py-1">
          HOME
          {/* <hr className=" border-b-2 border-b-primary mt-1 hidden" /> */}
          {/* you will get active class from Inspect-Element and you can see in index.css file*/}
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/doctors" className="py-1">
          ALL DOCTORS
          {/* <hr className=" border-b-2 border-b-primary mt-1 hidden" /> */}
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/about" className="py-1">
          ABOUT
          {/* <hr className=" border-b-2 border-b-primary mt-1 hidden" /> */}
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/contact" className="py-1">
          CONTACT
          {/* <hr className=" border-b-2 border-b-primary mt-1 hidden" /> */}
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
      </div>
      <div className="flex items-center gap-4">
        {patientToken ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            {userProfileData && (
              <p className="font-semibold">
                {userProfileData.name[0].toUpperCase() +
                  userProfileData.name.slice(1)}
              </p>
            )}
            <img
              src={assets.profile_pic}
              alt="profile_image"
              className="w-8 rounded-full"
            />
            <img src={assets.dropdown_icon} alt="drop_down" className="w-2.5" />
            <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
              <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                <p
                  onClick={() => navigate("/my-profile")}
                  className="hover:text-black cursor-pointer"
                >
                  My Profile
                </p>
                <p
                  onClick={() => navigate("/my-appointments")}
                  className="hover:text-black cursor-pointer"
                >
                  My Appointments
                </p>
                <p
                  onClick={() => {
                    dispatch(logout());
                    navigate("/signin", { replace: true }); // ✅ replace prevents back navigation
                  }}
                  className="hover:text-black cursor-pointer"
                >
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <button
              onClick={() => navigate("/signin")}
              className="bg-primary text-white py-3 px-8 rounded-full hidden md:block"
            >
              Create Account
            </button>
          </div>
        )}
        <img
          onClick={() => setShowMenu(true)}
          src={assets.menu_icon}
          alt=""
          className="w-6 md:hidden"
        />
        {/* ---- Mobile Menu ---- */}
        <div
          className={`${
            showMenu ? "fixed w-full" : "h-0 w-0"
          } md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}
        >
          <div className="flex items-center justify-between px-5 py-6">
            <img src={assets.logo} alt="" className="w-36" />
            <img
              onClick={() => setShowMenu(false)}
              src={assets.cross_icon}
              alt=""
              className="w-7"
            />
          </div>
          <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
            <NavLink to="/" onClick={() => setShowMenu(false)}>
              <p className="px-4 py-2 rounded inline-block">Home</p>
            </NavLink>
            <NavLink to="/doctors" onClick={() => setShowMenu(false)}>
              <p className="px-4 py-2 rounded inline-block">ALL DOCTORS</p>
            </NavLink>
            <NavLink to="/about" onClick={() => setShowMenu(false)}>
              <p className="px-4 py-2 rounded inline-block">ABOUT</p>
            </NavLink>
            <NavLink to="/contact" onClick={() => setShowMenu(false)}>
              <p className="px-4 py-2 rounded inline-block">CONTACT</p>
            </NavLink>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
