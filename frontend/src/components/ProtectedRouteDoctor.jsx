import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRouteDoctor = () => {
  const doctorToken = useSelector((state) => state.doctor.doctorToken);

  if (!doctorToken) {
    return <Navigate to="/doctor/signin" replace />;
  }

  return <Outlet />;
};

export default ProtectedRouteDoctor;

// import { useSelector } from "react-redux";
// import { Navigate, Outlet } from "react-router-dom";

// const ProtectedRouteDoctor = ({ children }) => {
//   const doctorToken = useSelector((state) => state.doctor.doctorToken);

//   if (!doctorToken) {
//     return <Navigate to="/doctor/signin" replace />;
//   }

//   return children;
// };

// export default ProtectedRouteDoctor;
