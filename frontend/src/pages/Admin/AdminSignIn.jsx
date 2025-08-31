import { useState } from "react";
// import { AdminContextProvider } from "../context/AdminContext";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setadminToken } from "../../features/admin/adminSlice";
import { toast } from "react-toastify";
import { AdminHomeLayout } from "./index";
import { useNavigate } from "react-router-dom";
const AdminSignIn = () => {
  const [adminSignInDetails, setAdminSignInDetails] = useState({
    email: "",
    password: "",
  });
  const { adminToken, backendUrl } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      //http://localhost:4000/api/admin/login
      let data = await axios.post(
        backendUrl + "/api/admin/signin",
        adminSignInDetails
      );
      //{success: true, token :"eyJhbGciOiJIUzI1NiJ9.YWRtaW5AcHJlc2NyaXB0by5jb21BZG1pbkA.xI5rT4IfPt4bHlpSDNW-bpNlY6x_oiquvukCE439-fA"}
      // console.log("adminSignIn_data", data);
      if (data.data.success) {
        const adminToken = data.data.adminToken;
        // Save raw token (no JSON.stringify)
        localStorage.setItem("adminToken", adminToken);
        // Update Redux
        dispatch(setadminToken(adminToken));
        toast.success(data.data.message);
        navigate("/admin-dashboard");
      } else {
        toast.error(data.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  return (
    <>
      {!adminToken ? (
        <form
          onSubmit={submitHandler}
          className="min-h-[80vh] flex  items-center"
        >
          <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
            <p className="text-2xl font-semibold m-auto ">
              <span className="text-primary">Admin </span>SignIn
            </p>
            <div className="w-full">
              <p>Email</p>
              <input
                className="border border-[#DADADA] rounded w-full p-2 mt-1"
                type="email"
                value={adminSignInDetails.email}
                onChange={(e) =>
                  setAdminSignInDetails({
                    ...adminSignInDetails,
                    email: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="w-full">
              <p>Password</p>
              <input
                className="border border-[#DADADA] rounded w-full p-2 mt-1"
                type="password"
                value={adminSignInDetails.password}
                onChange={(e) =>
                  setAdminSignInDetails({
                    ...adminSignInDetails,
                    password: e.target.value,
                  })
                }
                required
              />
            </div>
            <button
              type="submit"
              className="bg-primary text-white w-full py-2 rounded-md text-base"
            >
              Login
            </button>

            <p>
              Doctor Login
              <span
                className="text-primary underline cursor-pointer"
                onClick={() => navigate("/doctor/signin")}
              >
                Click here
              </span>
            </p>
          </div>
        </form>
      ) : (
        <AdminHomeLayout />
      )}
    </>
  );
};

export default AdminSignIn;
