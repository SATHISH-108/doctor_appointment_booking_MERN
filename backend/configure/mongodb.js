import mongoose from "mongoose";

//configuring the MongoDB database
const DBConnection = async () => {
  try {
    // console.log(process.env);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database Connected");
  } catch (error) {
    console.log(error);
  }
};
export default DBConnection;
