import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRouteAdmin = () => {
  const adminToken = useSelector((state) => state.admin.adminToken);

  if (!adminToken) {
    return <Navigate to="/admin/signin" replace />;
  }

  return <Outlet />;
};

export default ProtectedRouteAdmin;

// import { useSelector } from "react-redux";
// import { Navigate, Outlet } from "react-router-dom";

// const ProtectedRouteAdmin = ({ children }) => {
//   const adminToken = useSelector((state) => state.admin.adminToken);

//   if (!adminToken) {
//     return <Navigate to="/admin/signin" replace />;
//   }

//   return children;
// };

// export default ProtectedRouteAdmin;
