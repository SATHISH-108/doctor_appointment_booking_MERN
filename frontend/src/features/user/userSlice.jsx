import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from "axios";
const initialState = {
  currencySymbol: "$",
  backendUrl: import.meta.env.VITE_BACKEND_URL,
  token: localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token"))
    : false,
  userProfileData: null,
  loading: false,
  error: null,
  doctorsList: [],
};
// =======================
// Utility Functions
// =======================
export const calculateAge = (dob) => {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  return age;
};
const months = [
  "",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
export const slotDateFormat = (slotDate) => {
  const dateArray = slotDate.split("_");
  return `${dateArray[0]} ${months[Number(dateArray[1])]} ${dateArray[2]}`;
};
// =======================
// Async Thunks
// =======================

//AsyncThunk: fetch user profile
export const getUserProfile = createAsyncThunk(
  "getProfile",
  async (name, thunkAPI) => {
    const state = thunkAPI.getState();
    const { token, backendUrl } = state.user;
    try {
      let { data } = await axios.get(`${backendUrl}/api/user/get-profile`, {
        headers: { token },
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);
//AsyncThunk : fetch updated user profile
export const updatedUserProfile = createAsyncThunk(
  "updatedProfile",
  async (name, thunkAPI) => {
    // console.log("updatedUser_thunkAPI", thunkAPI);
  }
);
// const fetchDoctors = createAsyncThunk(action, callbackFunction);
// Async Thunk to fetch doctors
export const getDoctorsData = createAsyncThunk(
  "getDoctorsList",
  async (name, thunkAPI) => {
    //instead of name you can give any name
    // console.log(name)
    // console.log(thunkAPI)
    try {
      // Get the token from admin slice
      const state = thunkAPI.getState();
      const { token, backendUrl } = state.user;
      // Call backend API
      //when we are doing fetching data make sure no body, only headers should maintain
      const response = await axios.get(`${backendUrl}/api/doctor/list`, {
        headers: { token },
      });
      // Return doctors list
      console.log("response_userSlice_getDoctorsData_88", response);
      return response.data.doctors;
    } catch (error) {
      console.error("Axios error:", error.response || error.message);
      // throw error;
      toast.error(error.message);
    }
  }
);

const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    setToken: (state, action) => {
      // console.log("setToken_user_slice", action);
      state.token = action.payload;
    },
    logout: (state) => {
      localStorage.removeItem("token");
      state.token = false;
      state.userProfileData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET PROFILE
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          // console.log("getUserProfile", action.payload);
          state.userProfileData = action.payload.userProfileData;
        }
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(getDoctorsData.fulfilled, (state, action) => {
        console.log("getDoctorsData_action.payload", action.payload);
        state.loading = false;
        state.doctorsList = action.payload;
      });
  },
});
export default user.reducer;
export const { setToken, logout } = user.actions;
