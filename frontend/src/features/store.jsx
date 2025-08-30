import { configureStore } from "@reduxjs/toolkit";

import doctorReducer from "./doctors/doctorSlice";
import adminReducer from "./admin/adminSlice";
import userReducer from "./user/userSlice";
const store = configureStore({
  reducer: {
    doctor: doctorReducer,
    admin: adminReducer,
    user: userReducer,
  },
});
export default store;
