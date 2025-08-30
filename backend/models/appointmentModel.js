import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    // userId: { type: String, required: true },
    // docId: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    docId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    slotDate: { type: String, required: true }, // format "16_8_2025"
    slotTime: { type: String, required: true }, // format "03:00 PM"
    docData: { type: Object, required: true }, // storing doctor snapshot
    userData: { type: Object, required: true },
    amount: { type: Number, required: true },
    date: { type: Number, required: true },
    cancelled: { type: Boolean, default: false },
    payment: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const AppointmentModel =
  mongoose.models.appointment ||
  mongoose.model("appointment", appointmentSchema);

export default AppointmentModel;
