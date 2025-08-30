// npm install validator
//online json stringify => you can use =>online json stringify when address is nested object(object of object)
// address :{{ line1: "17th Cross, Richmond"},{line2: "Circle, Ring Road, London"}}
import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import DoctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";
import AppointmentModel from "../models/appointmentModel.js";
import UserModel from "../models/userModel.js";
//API For adding doctor
const addDoctor = async (request, response) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
    } = request.body;
    const parsedAddress = JSON.parse(request.body.address);
    const image = request.file ? request.file.filename : null;
    // console.log("doctor-info", request.body);
    // console.log("doctor-image", request.file);
    //checking for all data to add doctor
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !parsedAddress.line1 ||
      !parsedAddress.line2 ||
      !image
    ) {
      return response.json({
        success: false,
        message: "All fields are required",
      });
    }
    // validating email formatting
    if (!validator.isEmail(email)) {
      //if email is not in valid format then if block will be excuite
      return response.json({
        success: false,
        message: "Please enter a valid email",
      });
    }
    //validating a strong password
    if (password.length < 8) {
      response.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    // Check if image exists
    if (!request.file) {
      return response.json({
        success: false,
        message: "Image not uploaded",
      });
    }
    // upload image to cloudinary
    // const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
    //   resource_type: "image",
    // });
    // const imageUrl = imageUpload.secure_url;
    const imageUpload = await cloudinary.uploader.upload(request.file.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;
    //hasing doctor password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // console.log("hashedPassword", hashedPassword);//$2b$10$MgCnpuC0daa59PT2YejAWuoGXwpAmlTLdb3GrdJNGK2TWQ6fxFsbS

    //Inserting the doctor data into Database (MongoDB)
    const doctorsData = {
      name,
      email,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: parsedAddress,
      date: Date.now(),
      image: imageUrl,
    };
    // const newDoctor = new doctorModel(doctorsData);
    // await newDoctor.save();
    await DoctorModel.create(doctorsData);
    response.json({
      success: true,
      message: "Doctor Added successfully",
    });
  } catch (error) {
    console.log(error);
    response.json({ success: false, message: error.message });
  }
};
//API For Admin Login
const AdminSignIn = async (request, response) => {
  try {
    // console.log("adminController_request.body", request.body);
    const { email, password } = request.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // sign a structured payload so we can read fields later
      // const adminToken = jwt.sign(
      //   { role: "admin", email }, // keep it minimal; no password inside token
      //   process.env.JWT_SECRET,
      //   { expiresIn: "1d" }
      // );
      const adminToken = jwt.sign(email + password, process.env.JWT_SECRET);
      // console.log("token_adminController", adminToken);
      // //eyJhbGciOiJIUzI1NiJ9.YWRtaW5AcHJlc2NyaXB0by5jb21BZG1pbkA.xI5rT4IfPt4bHlpSDNW-bpNlY6x_oiquvukCE439-fA
      response.json({
        success: true,
        adminToken,
        message: "Admin Login Successfully",
      });
    } else {
      response.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    response.json({ success: false, message: error.message });
  }
};
//API to get all doctors list for admin panel'
const allDoctors = async (request, response) => {
  try {
    // console.log("allDoctors_adminController", request.body);
    //get all doctorsList from database excluding with password
    const doctors = await DoctorModel.find({}).select("-password");
    response.json({ success: true, doctors });
    // console.log("doctors_allDoctors", doctors); // you can get all doctors data from MongoDB & you can see in the terminal.
  } catch (error) {
    console.log(error);
    response.json({ success: false, message: error.message });
  }
};
const changeAvailability = async (request, response) => {
  try {
    const { docId } = request.body;
    const doctorData = await DoctorModel.findById(docId);
    if (!doctorData) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }
    const doctorDetails = await DoctorModel.findByIdAndUpdate(docId, {
      available: !doctorData.available,
    });
    // doctorDetails.save();
    // console.log("doctorDetails_changeAvailability", doctorDetails);
    response.json({
      success: true,
      doctorDetails,
      message: "Availability Updated",
    });
  } catch (error) {
    console.log(error);
    response.json({ success: false, message: error.message });
  }
};
//APPI to get all appointment s list
const appointmentsAdmin = async (request, response) => {
  try {
    const appointments = await AppointmentModel.find({});
    return response.json({ success: true, appointments });
  } catch (error) {
    return response.json({ success: false, message: error.message });
  }
};

// API to cancel appointment (Admin)
const appointmentCancel = async (request, response) => {
  try {
    // set by authAdmin middleware
    const admin = request.adminId;
    const { appointmentId } = request.body;

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

    // mark as cancelled
    if (!appointmentData.cancelled) {
      await AppointmentModel.findByIdAndUpdate(appointmentId, {
        cancelled: true,
      });
    }

    // release doctor slot if it was booked
    const { docId, slotDate, slotTime } = appointmentData;
    if (docId && slotDate && slotTime) {
      const doctorData = await DoctorModel.findById(docId);
      if (doctorData && doctorData.slots_booked) {
        const slots_booked = { ...(doctorData.slots_booked || {}) };
        if (Array.isArray(slots_booked[slotDate])) {
          slots_booked[slotDate] = slots_booked[slotDate].filter(
            (t) => t !== slotTime
          );
          await DoctorModel.findByIdAndUpdate(docId, { slots_booked });
        }
      }
    }

    return response.json({
      success: true,
      message: "Appointment cancelled by admin",
      cancelledBy: admin,
      appointmentId,
    });
  } catch (error) {
    console.log(error);
    return response.json({ success: false, message: error.message });
  }
};

//API to get dashboard data for admin panel
const adminDashboard = async (request, response) => {
  try {
    const doctors = await DoctorModel.find({});
    const users = await UserModel.find({});
    const appointments = await AppointmentModel.find({});
    const dashboardData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };
    return response.json({
      success: true,
      doctors,
      users,
      appointments,
      dashboardData,
    });
  } catch (error) {
    console.log(error.message);
    return response.json({ success: false, message: error.message });
  }
};
export {
  addDoctor,
  AdminSignIn,
  allDoctors,
  changeAvailability,
  appointmentsAdmin,
  appointmentCancel,
  adminDashboard,
};
