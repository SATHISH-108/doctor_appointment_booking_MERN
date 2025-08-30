import express from "express";
import {
  loginUser,
  registerUser,
  getProfile,
  updatedProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  paymentRazorpay,
  verifyRazorpay,
} from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";
const userRouter = express.Router();
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/get-profile", authUser, getProfile);
//here we are using two middlewares 1.passing the formData upload.single("image") 2.authenticate the user and getting the userId
//multer middleware=> upload.single(fieldName)=> fieldName is image (passing the form data)
//authUser middleware (authenticate the user and the getting the userID)
//=> now we have to use the upload middleware before the authUser middleware so that our image will get passed after that we will authenticate the user.
userRouter.post(
  "/update-profile",
  upload.single("image"),
  authUser,
  updatedProfile
);
userRouter.post("/book-appointment", authUser, bookAppointment);
userRouter.get("/appointments", authUser, listAppointment);
// authUser middleware
userRouter.post("/cancel-appointment", authUser, cancelAppointment);
//api endpoint => /apyment-razorpay
userRouter.post("/payment-razorpay", authUser, paymentRazorpay);
userRouter.post("/verify-razorpay", authUser, verifyRazorpay);
export default userRouter;
