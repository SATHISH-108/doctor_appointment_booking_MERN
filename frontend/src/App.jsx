import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  ProtectedRouteAdmin,
  ProtectedRouteDoctor,
  ProtectedRoutePatient,
} from "./components/index";
import {
  HomeLayout,
  LandingPage,
  About,
  Contact,
  Doctors,
  SignIn,
  Error,
  Appointment,
  MyProfile,
  MyAppointments,
} from "./pages";
import {
  AdminHomeLayout,
  AddDoctor,
  AdminSignIn,
  AllAppointments,
  AdminDashboard,
  DoctorsList,
} from "./pages/Admin/index";

import {
  DoctorDashboard,
  DoctorSignIn,
  DoctorAppointments,
  DoctorHomeLayout,
  DoctorProfile,
} from "./pages/Doctor/index";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      { index: true, element: <LandingPage />, errorElement: <Error /> },
      { path: "/about", element: <About /> },
      { path: "/doctors", element: <Doctors /> },
      { path: "/doctors/:speciality", element: <Doctors /> },
      { path: "/contact", element: <Contact /> },

      // Protected patient routes inside wrapper
      {
        element: <ProtectedRoutePatient />,
        children: [
          { path: "/my-profile", element: <MyProfile /> },
          { path: "/appointment/:docId", element: <Appointment /> },
          { path: "/my-appointments", element: <MyAppointments /> },
        ],
      },
    ],
  },
  { path: "/signin", element: <SignIn />, errorElement: <Error /> },

  // Doctor Routes (Protected)
  {
    element: <ProtectedRouteDoctor />,
    children: [
      {
        path: "/doctor-dashboard",
        element: <DoctorHomeLayout />,
        errorElement: <Error />,
        children: [{ index: true, element: <DoctorDashboard /> }],
      },
      {
        path: "/doctor",
        element: <DoctorHomeLayout />,
        errorElement: <Error />,
        children: [
          { path: "appointments", element: <DoctorAppointments /> },
          { path: "profile", element: <DoctorProfile /> },
        ],
      },
    ],
  },
  // Doctor separate routes (appointments + profile)
  { path: "/doctor/signin", element: <DoctorSignIn /> },

  // Admin Routes (Protected)
  {
    element: <ProtectedRouteAdmin />,
    children: [
      {
        path: "/admin-dashboard",
        element: <AdminHomeLayout />,
        errorElement: <Error />,
        children: [{ index: true, element: <AdminDashboard /> }],
      },
      {
        path: "/admin",
        element: <AdminHomeLayout />,
        errorElement: <Error />,
        children: [
          { path: "all-appointments", element: <AllAppointments /> },
          { path: "add-doctor", element: <AddDoctor /> },
          { path: "doctors-list", element: <DoctorsList /> },
        ],
      },
    ],
  },
  { path: "/admin/signin", element: <AdminSignIn /> },
]);

const App = () => {
  return <RouterProvider router={router} />;
  // //here you should write router={routes} or router={router}
};

export default App;
