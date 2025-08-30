import express from "express";
import upload from "../middlewares/multer.js";
import {
  addDoctor,
  AdminSignIn,
  allDoctors,
  appointmentCancel,
  appointmentsAdmin,
  adminDashboard,
} from "../controllers/adminController.js";
import authAdmin from "../middlewares/authAdmin.js";
import { changeAvailability } from "../controllers/adminController.js";
const PORT = 4000;
//creating route
const adminRouter = express.Router();
//endPoint
// Important: multer should run before controller
//If we don't have the jwtToken then admin can't add the doctor
//here authAdmin => admin authentication middleware
adminRouter.post(
  "/add-doctor",
  authAdmin,
  upload.single("doctorImage"),
  addDoctor
); //upload.single("image") => middleware
//whenever we call the endpoint "/add-doctor" in the form data we will send the image with the filedname "image" then only our middleware will process that image and form data

//whenever we will try to add doctor then we check for the token when we have the token(thunderclient /login) then only we will be able to add the doctor.if we don't have admin Token then we can't add the doctor using this API.
adminRouter.post("/signin", AdminSignIn);
//middleware=>authAdmin
// adminRouter.post("/all-doctors", authAdmin, allDoctors);
adminRouter.get("/all-doctors", authAdmin, allDoctors);
//creating route
adminRouter.post("/change-availability", authAdmin, changeAvailability);
adminRouter.get("/appointments", authAdmin, appointmentsAdmin);
// api endpoint is /cancel-appointment
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel);
adminRouter.get("/dashboard", authAdmin, adminDashboard);
export default adminRouter;
