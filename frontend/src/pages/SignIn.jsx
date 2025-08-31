import { useState } from "react";
import { Navbar } from "../components/index";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { getUserProfile, setPatientToken } from "../features/user/userSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [state, setState] = useState("Sign Up");
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    dob: "",
    address: { line1: "", line2: "" },
  });
  const { backendUrl, patientToken } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    //making API calling
    try {
      if (state === "Sign Up") {
        let response = await axios.post(
          `${backendUrl}/api/user/register`,
          user
        );
        // console.log("response", response);
        if (response.data.success) {
          localStorage.setItem("patientToken", response.data.patientToken);
          dispatch(setPatientToken(response.data.patientToken));
          toast.success(response.data.message);
          setUser({ ...user, name: "", email: "", password: "" });
          setState("Sign In");
        } else {
          toast.error(response.data.message);
        }
      }
      if (state === "Sign In") {
        const { email, password } = user;
        const { data } = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        });
        // console.log("data", data);
        if (data.success) {
          localStorage.setItem("patientToken", data.patientToken);
          dispatch(setPatientToken(data.patientToken));
          dispatch(getUserProfile(data.loginUser));
          toast.success(data.message);
          setUser({ ...user, email: "", password: "" });
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  useEffect(() => {
    if (state === "Sign In" && patientToken) {
      navigate("/");
    }
  }, [patientToken]);
  return (
    <div>
      <Navbar />
      <form onSubmit={submitHandler} className="min-h-[80vh] flex items-center">
        <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
          <p className="text-2xl font-semibold ">
            {state === "Sign Up" ? "Create Account" : "Sign In"}
          </p>
          <p>
            Please {state === "Sign Up" ? "sign up" : "sign in"} to book
            appointment
          </p>
          {state === "Sign Up" && (
            <>
              {/* FullName */}
              <div className="w-full">
                <p>Full Name</p>
                <input
                  type="text"
                  placeholder="ENTER NAME"
                  value={user.name}
                  required
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  className="border border-zinc-300 rounded w-full p-2 mt-1"
                />
              </div>
              {/* Email */}
              <div className="w-full">
                <p>Email</p>
                <input
                  type="email"
                  value={user.email}
                  placeholder="ENTER EMAIL"
                  required
                  className="border border-zinc-300 rounded w-full p-2 mt-1"
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
              </div>
              {/* Password */}
              <div className="w-full">
                <p>Password</p>
                <input
                  type="password"
                  value={user.password}
                  placeholder="ENTER PASSWORD"
                  required
                  className="border border-zinc-300 rounded w-full p-2 mt-1"
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                />
              </div>
              {/* Phone Number */}
              <div className="w-full">
                <p>Phone Number</p>
                <input
                  type="number"
                  value={user.phone}
                  placeholder="ENTER PHONE NUMBER"
                  required
                  className="border border-zinc-300 rounded w-full p-2 mt-1"
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                />
              </div>
              {/* gender */}
              <div className="w-full">
                <h3>Select gender:</h3>

                <label>
                  <input
                    type="radio"
                    value="male"
                    name="gender"
                    checked={user.gender === "male"}
                    onChange={(e) =>
                      setUser({ ...user, gender: e.target.value })
                    }
                  />
                  Male
                </label>
                <label>
                  <input
                    type="radio"
                    value="female"
                    name="gender"
                    checked={user.gender === "female"}
                    onChange={(e) =>
                      setUser({ ...user, gender: e.target.value })
                    }
                  />
                  Female
                </label>
                <label>
                  <input
                    type="radio"
                    value="other"
                    name="gender"
                    checked={user.gender === "other"}
                    onChange={(e) =>
                      setUser({ ...user, gender: e.target.value })
                    }
                  />
                  Other
                </label>

                <p>Selected: {user.gender}</p>
              </div>
              {/* DOB */}
              <div className="w-full">
                <label>
                  Date of Birth:
                  <input
                    type="date"
                    value={user.dob}
                    onChange={(e) => setUser({ ...user, dob: e.target.value })}
                  />
                </label>

                <p>Selected DOB: {user.dob}</p>
              </div>
              {/* Addess */}
              <div className="w-full">
                <p>Address</p>
                <input
                  type="text"
                  value={user.address.line1}
                  placeholder="ENTER LINE1"
                  required
                  className="border border-zinc-300 rounded w-full p-2 mt-1"
                  onChange={(e) =>
                    setUser({
                      ...user,
                      address: { ...user.address, line1: e.target.value },
                    })
                  }
                />
                <input
                  type="text"
                  value={user.address.line2}
                  placeholder="ENTER LINE2"
                  required
                  className="border border-zinc-300 rounded w-full p-2 mt-2"
                  onChange={(e) =>
                    setUser({
                      ...user,
                      address: { ...user.address, line2: e.target.value },
                    })
                  }
                />
              </div>
            </>
          )}
          {state === "Sign In" && (
            <>
              {/* Email */}
              <div className="w-full">
                <p>Email</p>
                <input
                  type="email"
                  value={user.email}
                  placeholder="ENTER EMAIL"
                  required
                  className="border border-zinc-300 rounded w-full p-2 mt-1"
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
              </div>
              {/* Password */}
              <div className="w-full">
                <p>Password</p>
                <input
                  type="password"
                  value={user.password}
                  placeholder="ENTER PASSWORD"
                  required
                  className="border border-zinc-300 rounded w-full p-2 mt-1"
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                />
              </div>
            </>
          )}
          <button
            type="submit"
            className="bg-primary text-white w-full py-2 rounded-md text-base"
          >
            {state === "Sign Up" ? "Create Account" : "SignIn"}
          </button>
          {state === "Sign Up" ? (
            <p>
              Already have an account?
              <span
                onClick={() => setState("Sign In")}
                className="text-primary underline cursor-pointer"
              >
                Sign In here
              </span>
            </p>
          ) : (
            <p>
              Crate an account?
              <span
                onClick={() => setState("Sign Up")}
                className="text-primary underline cursor-pointer"
              >
                click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default SignIn;
