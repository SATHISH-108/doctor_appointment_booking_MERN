import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setDoctorToken } from "../../features/doctors/doctorSlice";
import { useNavigate } from "react-router-dom";
const DoctorSignIn = () => {
  const [doctorSignInDetails, setDoctorSignInDetails] = useState({
    email: "",
    password: "",
  });
  const { backendUrl } = useSelector((state) => state.doctor);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      // console.log("doctorSignInDetails", doctorSignInDetails);
      let response = await axios.post(
        `${backendUrl}/api/doctor/signin`,
        doctorSignInDetails
      );
      // console.log("response_doctorSignInDetails", response);
      // data:{doctorToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ODNkY2MxZGQ2ZmJmMDczNGM1M2E0MCIsImlhdCI6MTc1NjEzNDQ5OH0.J-jyiJF3rNhJY6Fdkn8xdiISglvORqPOnMvBew-GdsA";
      // message: "Doctor Login Successfully" success: true};
      if (response.data.success) {
        // ✅ Save token as RAW string (no JSON.stringify)
        localStorage.setItem("doctorToken", response.data.doctorToken);
        // ✅ Update Redux
        dispatch(setDoctorToken(response.data.doctorToken));

        toast.success(response.data.message);
        navigate("/doctor-dashboard"); // go to dashboard after login
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={submitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
        <p className="text-2xl font-semibold m-auto ">
          <span className="text-primary">Doctor </span>SignIn
        </p>
        {/* Email */}
        <div className="w-full">
          <p>Email</p>
          <input
            type="email"
            value={doctorSignInDetails.email}
            placeholder="ENTER EMAIL"
            required
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            onChange={(e) =>
              setDoctorSignInDetails({
                ...doctorSignInDetails,
                email: e.target.value,
              })
            }
          />
        </div>
        {/* Password */}
        <div className="w-full">
          <p>Password</p>
          <input
            type="password"
            value={doctorSignInDetails.password}
            placeholder="ENTER PASSWORD"
            required
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            onChange={(e) =>
              setDoctorSignInDetails({
                ...doctorSignInDetails,
                password: e.target.value,
              })
            }
          />
        </div>
        <button
          type="submit"
          className="bg-primary text-white w-full py-2 rounded-md text-base"
        >
          SignIn
        </button>
        <p>
          Admin Login
          <span
            className="text-primary underline cursor-pointer"
            onClick={() => navigate("/admin/signin")}
          >
            Click here
          </span>
        </p>
      </div>
    </form>
  );
};

export default DoctorSignIn;
