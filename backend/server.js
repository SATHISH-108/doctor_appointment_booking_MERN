import express from "express";
import cors from "cors";
import "dotenv/config";
import DBConnection from "./configure/mongodb.js";
import connectToCloudinary from "./configure/cloudinary.js";
import adminRouter from "./routes/adminroute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";
//app config
const app = express();
const PORT = process.env.PORT || 4000;
DBConnection();
connectToCloudinary();
//middlewares => apply for all routes
app.use(express.json()); // ✅ Needed to parse JSON request bodies
app.use(cors()); // allows you to connect frontend to backend

//api endpoints
app.use("/api/admin", adminRouter); //localhost:4000/api/admin
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);
app.get("/", (request, response) => {
  response.send("API WORKING");
});

app.listen(PORT, () => {
  console.log("Server started ", PORT);
});
