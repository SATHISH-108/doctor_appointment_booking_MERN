import mongoose from "mongoose";

const DcotorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    image: { type: String, required: true },
    speciality: { type: String, required: true },
    degree: { type: String, required: true },
    experience: { type: String, required: true },
    about: { type: String, required: true },
    available: { type: Boolean, default: true },
    fees: { type: Number, required: true },
    address: {
      line1: { type: String, required: true },
      line2: { type: String, required: true },
    },
    date: { type: Number, required: true },
    // slots_booked: { type: Object, default: [] },
    slots_booked: { type: Object, default: {} }, // example { "16_8_2025": ["03:00 PM"] }
  },
  { timestamps: true, minimize: false }
);
//minimize:false => means takes as default:[]
const DoctorModel =
  mongoose.models.Doctor || mongoose.model("Doctor", DcotorSchema);

export default DoctorModel;
