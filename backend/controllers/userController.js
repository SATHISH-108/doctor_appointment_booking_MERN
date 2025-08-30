// creating API for login, register, getProfile, updatedProfile, BookAppointment, displaying the bookAppointments, canceling the book appointments, payment gatway.

import validator from "validator";
import bcrypt from "bcrypt";
import UserModel from "../models/userModel.js";
import DoctorModel from "../models/doctorModel.js";
import AppointmentModel from "../models/appointmentModel.js";
import jwt from "jsonwebtoken"; //generate jwt token for each user
import { v2 as cloudinary } from "cloudinary";
import razorpay from "razorpay";
import { request } from "express";
//API to register user
const registerUser = async (request, response) => {
  try {
    const { name, email, password, phone, gender, dob, address } = request.body;
    // console.log("request.body", request.body);
    if (
      !name ||
      !email ||
      !password ||
      !phone ||
      !dob ||
      !address.line1 ||
      !address.line2 ||
      !gender
    ) {
      return response.json({
        success: false,
        message: "All fields are required",
      });
    }
    if (!validator.isEmail(email)) {
      return response.json({
        success: false,
        message: "Please Enter Valid Email",
      });
    }
    if (password.length < 6) {
      return response.json({
        success: false,
        message: "Please Enter Strong Password",
      });
    }
    if (phone.length < 10) {
      return response.json({
        success: false,
        message: "Please Enter Valid Phone Number",
      });
    }
    // Check if user with email already exists
    const existingUser = await UserModel.findOne({ email });
    // const existingUser= await UserModel.find({email, name}) // check email & name is exist in our database.
    if (existingUser) {
      return response.json({ success: false, message: "Email Already Taken" });
    }
    //hasing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userProfileData = {
      name,
      email,
      password: hashedPassword,
      phone,
      gender,
      dob,
      address,
    };
    // console.log("userProfileData", userProfileData);

    // console.log("user");
    const newUser = new UserModel(userProfileData);
    const user = await newUser.save();
    //const users= await UserModel.create(userProfileData)
    // console.log("registeredUser", user);
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    response.json({
      success: true,
      token,
      message: "User Registered Successfully",
    });
  } catch (error) {
    console.log(error.message);
    response.json({ success: false, message: error.message });
  }
};
//API for login user
const loginUser = async (request, response) => {
  try {
    const { email, password } = request.body;
    const user = await UserModel.findOne({ email });
    // console.log("user_userController", user);
    if (!user) {
      return response.json({ success: false, message: "User does not exist" });
    }
    //Converting normal password into bcryprt password
    const isMatch = await bcrypt.compare(password, user.password);
    // console.log("isMatch", isMatch);
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      return response.json({
        success: true,
        token,
        loginUser: user,
        message: "User Login Successfully",
      });
    } else {
      response.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
  }
};
//API to get user profile data
const getProfile = async (request, response) => {
  try {
    // console.log("request_getProfile", request);
    const userId = request.userId; //userId: '6891d120f1e733cd84e543b3',=> It came from users(collection) userModel
    const userProfileData = await UserModel.findById(userId).select(
      "-password"
    );
    // console.log("userProfileData_getProfile", userProfileData);
    response.json({ success: true, userProfileData });
  } catch (error) {
    console.log(error);
    response.json({ success: false, message: error.message });
  }
};
//API to update user profile
const updatedProfile = async (request, response) => {
  try {
    const { userId } = request;
    const { name, phone, address, dob, gender, email } = request.body;
    const imageFile = request.file;
    //console.log("userId_updatedProfile", userId); //  userId: '6894cfb06cd34b03f7bc227d',
    //console.log("imageFile", imageFile);
    if (!name || !phone || !dob || !gender || !email) {
      return response.status(400).json({
        success: false,
        message: "All Fields Are Required",
      });
    }
    // await UserModel.findByIdAndUpdate(userId, {
    //   name,
    //   phone,
    //   address: JSON.parse(address),
    //   dob,
    //   gender,
    // });
    // if (imageFile) {
    //   //upload image to cloudinary
    //   const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
    //     resource_type: "image",
    //   });
    //   const imageURL = imageUpload.secure_url;
    //   //save this imageURL in the users data
    //   await UserModel.findByIdAndUpdate(userId, { image: imageURL });
    // }
    // response.json({ success: true, message: "Profile Updated" });

    const updateData = {
      name,
      phone,
      address: typeof address === "string" ? JSON.parse(address) : address,
      dob,
      gender,
      email,
    };
    // Handle image upload if file exists
    if (imageFile) {
      // console.log("Uploading image to Cloudinary...");
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      updateData.image = imageUpload.secure_url;
      // console.log("Uploaded image URL:", imageUpload.secure_url);
    }

    // Only one update to MongoDB
    const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password"); // Exclude password from response
    // console.log("updatedUser", updatedUser);
    response.status(200).json({
      success: true,
      message: "Profile Updated",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({ success: false, message: error.message });
  }
};
//API to book appointment
// const bookAppointment = async (request, response) => {
//   try {
//     const { userId } = request;
//     const { docId, slotDate, slotTime } = request.body;
//     // console.log("userId_bookAppointment", userId); //6894cf526cd34b03f7bc2277
//     //console.log("bookAppointments_docId", docId); //6883dd20dd6fbf0734c53a42
//     //console.log("bookAppointments_slotdate", slotDate); //20_8_2025
//     //console.log("bookAppointments_slotdate", slotTime); // 11:00 AM
//     const docData = await DoctorModel.findById(docId).select("-password");
//     //console.log("bookAppointment_docData", docData);
//     //     bookAppointment_docData {
//     //   address: { line1: '37th Cross, Richmond', line2: 'Circle, Ring Road, London' },
//     //   _id: new ObjectId('6883dd20dd6fbf0734c53a42'),
//     //   name: 'Dr. Sarah Patel',
//     //   email: 'sarah.patel@prescripto.com',
//     //   image: 'https://res.cloudinary.com/dvpd8pzkl/image/upload/v1753472290/vjwai0b88tjmondefnkl.png',
//     //   speciality: 'Dermatologist',
//     //   degree: 'MBBS',
//     //   experience: '1 Year',
//     //   about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies',
//     //   available: true,
//     //   fees: 200,
//     //   date: 1753472288895,
//     //   slots_booked: [],
//     //   createdAt: 2025-07-25T19:38:08.898Z,
//     //   updatedAt: 2025-08-13T12:09:45.733Z,
//     //   __v: 0
//     // }
//     if (!docData.available) {
//       return response.json({ success: false, message: "Doctor not available" });
//     }
//     let slots_booked = docData.slots_booked;
//     //checking for slot availablity
//     if (slots_booked[slotDate]) {
//       if (slots_booked[slotDate].includes(slotTime)) {
//         return response.json({
//           success: false,
//           message: "Slot not available",
//         });
//       } else {
//         slots_booked[slotDate].push(slotTime);
//       }
//     } else {
//       slots_booked[slotDate] = [];
//       slots_booked[slotDate].push(slotTime);
//     }
//     const userData = await UserModel.findById(userId).select("-password");
//     //deleting the slots_booked data from doctorData
//     delete docData.slots_booked;
//     const appointmentData = {
//       userId,
//       docId,
//       userData,
//       docData,
//       amount: docData.fees,
//       slotTime,
//       slotDate,
//       date: Date.now(),
//     };
//     //saving the appointments into Database
//     // const newAppointment = new appointModel(appointmentData);
//     // await newAppointment.save();
//     await AppointmentModel.create(appointmentData);
//     //save new slots data in docData
//     await DoctorModel.findByIdAndUpdate(docId, { slots_booked });
//     response.json({ success: true, message: "Appointment Booked" });
//   } catch (error) {
//     console.log(error);
//   }
// };

// API to book appointment
const bookAppointment = async (request, response) => {
  try {
    const { userId } = request; // from authUser middleware
    const { docId, slotDate, slotTime } = request.body;
    if (!docId || !slotDate || !slotTime) {
      return response.json({
        success: false,
        message: "Missing required fields",
      });
    }

    // 1. Find doctor (Fetch doctor)
    const docData = await DoctorModel.findById(docId).select("-password");
    if (!docData) {
      return response.json({ success: false, message: "Doctor not found" });
    }
    //check doctor availability
    if (!docData.available) {
      return response.json({ success: false, message: "Doctor not available" });
    }

    // 2.Doctor's slots( Get slots)
    let slots_booked = docData.slots_booked || {};
    // If date does not exist yet, create it
    if (!slots_booked[slotDate]) {
      slots_booked[slotDate] = [];
    }

    // 3. Check if slot already taken (by anyone)
    // Prevent duplicate booking for same doctor + date + time
    if (slots_booked[slotDate].includes(slotTime)) {
      return response.json({
        success: false,
        message: "This slot is already booked. Please choose another time.",
      });
    }

    // 4. Check if same user already booked same slot with this doctor
    const alreadyBooked = await AppointmentModel.findOne({
      userId,
      docId,
      slotDate,
      slotTime,
    });

    if (alreadyBooked) {
      return response.json({
        success: false,
        message: "You already booked this slot / Slot not available",
      });
    }

    // 5. Add slot to doctor's record
    slots_booked[slotDate].push(slotTime);

    // 6. Get user data
    const userData = await UserModel.findById(userId).select("-password");

    // remove slots_booked before storing in appointment
    const { slots_booked: _, ...doctorInfo } = docData.toObject();
    // Save appointment
    const appointmentData = {
      userId,
      docId,
      userData,
      docData: doctorInfo,
      amount: docData.fees,
      slotTime,
      slotDate,
      // date: new Date(),
    };

    // 7. Save appointment
    //  const newAppointment = new AppointmentModel(appointmentData);
    // await newAppointment.save();
    const appointments = await AppointmentModel.create(appointmentData);

    // 8.Add slot to doctor’s slots_booked
    slots_booked[slotDate].push(slotTime);
    const slots = await DoctorModel.findByIdAndUpdate(docId, { slots_booked });
    // console.log("slots", slots);

    //     slots {
    //   address: { line1: '37th Cross, Richmond', line2: 'Circle, Ring Road, London' },
    //   _id: new ObjectId('6884e3426944cd531c6f2e8c'),
    //   name: 'Dr. Ava Mitchell',
    //   email: 'ava.mitchell@prescripto.com',
    //   password: '$2b$10$cE959uStd8aCrEj75OwFbOSZ2HVsIhNT1ok9UTVlmcXrRXmuNOQ6q',
    //   image: 'https://res.cloudinary.com/dvpd8pzkl/image/upload/v1753539394/xdkzzejowpoidkg0jk1l.png',
    //   speciality: 'Dermatologist',
    //   degree: 'MBBS',
    //   experience: '1 Year',
    //   about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
    //   available: true,
    //   fees: 200,
    //   date: 1753539394841,
    //   slots_booked: [],
    //   createdAt: 2025-07-26T14:16:34.844Z,
    //   updatedAt: 2025-08-18T17:24:56.828Z,
    //   __v: 0
    // }

    return response.json({
      success: true,
      message: "Appointment Booked",
      appointments,
    });
  } catch (error) {
    console.error("bookAppointment error:", error);
    return response.status(500).json({
      success: false,
      message: "Server error while booking appointment",
      error: error.message,
    });
  }
};
// API to get user appointments for frotend my-appointments page
const listAppointment = async (request, response) => {
  try {
    // console.log("userId_listAppointment", request.userId);
    const { userId } = request;
    //find method is used to find the particular user (specific user)
    const appointments = await AppointmentModel.find({ userId });
    response.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    response.json({ success: false, message: error.message });
  }
};
//API to cancel appointment
const cancelAppointment = async (request, response) => {
  try {
    const { userId } = request; // added by authUser middleware
    const { appointmentId } = request.body; // comes from frontend body
    // console.log("request.body_cancelAppointment", appointmentId);
    // console.log("userId_cancelAppointment", userId);

    if (!appointmentId) {
      return response.json({
        success: false,
        message: "Appointment ID missing",
      });
    }

    const appointmentData = await AppointmentModel.findById(appointmentId);
    if (!appointmentData) {
      return response.json({
        success: false,
        message: "Appointment not found",
      });
    }

    // verify appointment user
    if (appointmentData.userId.toString() !== userId) {
      return response.json({ success: false, message: "Unauthorized action" });
    }

    await AppointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    // releasing doctor slot
    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await DoctorModel.findById(docId);
    let slots_booked = doctorData.slots_booked;
    if (slots_booked[slotDate]) {
      slots_booked[slotDate] = slots_booked[slotDate].filter(
        (e) => e !== slotTime
      );
    }
    await DoctorModel.findByIdAndUpdate(docId, { slots_booked });

    response.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.log(error);
    response.json({ success: false, message: error.message });
  }
};
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
// npm install razorpay --save (install in backend package.json)
//API to make payment of appointment using razorpay
const paymentRazorpay = async (request, response) => {
  try {
    const { appointmentId } = request.body;
    const appointmentData = await AppointmentModel.findById(appointmentId);
    // console.log("paymentRazorpay_appointmentId", appointmentId); //68a366d1461ad2369240a5da
    // console.log("appointmentData_paymentRazorpay", appointmentData);
    if (!appointmentData || appointmentData.cancelled) {
      return response.json({
        success: false,
        message: "Appointment Cancelled or not found",
      });
    }
    //creating options for razorpay payment
    const options = {
      amount: appointmentData.amount * 100,
      currency: process.env.CURRENCY,
      receipt: appointmentId,
    };
    //creation of an order
    const order = await razorpayInstance.orders.create(options);
    console.log("order", order);
    //     order { amount: 40000, amount_due: 40000, amount_paid: 0, attempts: 0, created_at: 1755613337, currency: 'INR', entity: 'order',
    //   id: 'order_R7DyY8NyAr9NJS',notes: [],offer_id: null,receipt: '68a366d1461ad2369240a5da', status: 'created' }
    return response.json({ success: true, order });
  } catch (error) {
    response.json({ success: false, message: error.message });
  }
};
//API to verify payment of razorpay
const verifyRazorpay = async (request, response) => {
  try {
    const { razorpay_order_id } = request.body;
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    console.log("orderInfo", orderInfo);
    //     orderInfo {
    //   id: 'order_R7GvEAKcSnzQtB',entity: 'order', amount: 20000, amount_paid: 20000, amount_due: 0,
    //     currency: 'INR',receipt: '68a364b65f6543882d85d6b8', offer_id: null, status: 'paid',  attempts: 1,
    //  notes: [],created_at: 1755623713,  description: null,checkout: null}
    if (orderInfo.status === "paid") {
      await AppointmentModel.findByIdAndUpdate(orderInfo.receipt, {
        payment: true,
      });
      return response.json({ success: true, message: "Payment successful" });
    } else {
      return response.json({ success: false, message: "Payment failed" });
    }
  } catch (error) {
    response.json({ success: false, message: error.message });
  }
};
export {
  registerUser,
  loginUser,
  getProfile,
  updatedProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  paymentRazorpay,
  verifyRazorpay,
};
