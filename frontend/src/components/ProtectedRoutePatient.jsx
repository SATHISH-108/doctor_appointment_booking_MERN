import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutePatient = () => {
  const patientToken = useSelector((state) => state.user.patientToken);

  if (!patientToken) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutePatient;

// import { useSelector } from "react-redux";
// import { Navigate, Outlet } from "react-router-dom";

// const ProtectedRoutePatient = ({ children }) => {
//   const patientToken = useSelector((state) => state.user.patientToken);

//   if (!patientToken) {
//     return <Navigate to="/signin" replace />;
//   }

//   return children;
// };

// export default ProtectedRoutePatient;
