import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const initialState = {
  doctorsList: [],
  doctorToken: localStorage.getItem("doctorToken")
    ? localStorage.getItem("doctorToken")
    : "", // ✅ raw string
  appointments: [],
  doctorDashboardData: false,
  doctorProfileData: false,
  currencySymbol: "$",
  loading: false,
  isEdit: false,
  error: null,
  backendUrl: import.meta.env.VITE_BACKEND_URL,
};
/* ─────────── Thunks ─────────── */
// --- Async thunk for doctor profile ---
export const doctorUpdateProfile = createAsyncThunk(
  "doctorUpdateProfile",
  async (name, thunkAPI) => {
    const state = thunkAPI.getState();
    const { doctorProfileData, backendUrl, doctorToken } = state.doctor;
    try {
      const updateData = {
        address: doctorProfileData.address,
        fees: doctorProfileData.fees,
        available: doctorProfileData.available,
      };
      let response = await axios.post(
        `${backendUrl}/api/doctor/update-profile`,
        updateData,
        {
          headers: { doctorToken },
        }
      );
      console.log("response_doctorUpdateProfile", response);
      if (response.data.success) {
        // toast.success(response.data.message || "Profile Updated");
        toast.success(response.data.message);
        // refresh latest profile from server
        await thunkAPI.dispatch(getDoctorProfileData());
        return response.data;
      } else {
        toast.error(response.data.message);
        return thunkAPI.rejectWithValue(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const getDoctorProfileData = createAsyncThunk(
  "getDoctorProfileData",
  async (name, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const { doctorToken } = state.doctor;
      let response = await axios.get(`${backendUrl}/api/doctor/profile`, {
        headers: { doctorToken },
      });
      // console.log("response_getDoctorProfileData_doctorSlice", response);
      if (response.data.success) {
        toast.success(response.data.message);
        return response.data.profileData;
      } else {
        toast.error(response.data.message || "Failed to fetch profile");
        return thunkAPI.rejectWithValue(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getDashboardData = createAsyncThunk(
  "getDashboardData",
  async (name, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const { doctorToken } = state.doctor;
      let response = await axios.get(`${backendUrl}/api/doctor/dashboard`, {
        headers: { doctorToken },
      });
      // console.log("response_getDashboardData_29", response);
      if (response.data.success) {
        toast.success(response.data.message);
        return response.data.doctorDashboardData;
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }
);

export const completeAppointment = createAsyncThunk(
  "doctor/completeAppointment", // unique name
  async ({ appointmentId, docId }, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const { doctorToken } = state.doctor;
      // console.log(
      //   "appointmentId_completeAppointment_doctorSlice",
      //   appointmentId,
      //   docId
      // );
      let response = await axios.post(
        `${backendUrl}/api/doctor/complete-appointment`,
        { appointmentId, docId },
        { headers: { doctorToken } }
      );
      // console.log("response_completeAppointment", response);
      if (response.data.success) {
        toast.success(response.data.message);
        thunkAPI.dispatch(getAppointments());
        return response.data;
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const cancelAppointment = createAsyncThunk(
  "doctor/cancelAppointment", // unique name
  async ({ appointmentId, docId }, thunkAPI) => {
    try {
      // console.log(
      //   "appointmentId_cancelAppointment_doctorSlice",
      //   appointmentId,
      //   docId
      // );
      const state = thunkAPI.getState();
      const { doctorToken } = state.doctor;
      let response = await axios.post(
        `${backendUrl}/api/doctor/cancel-appointment`,
        { appointmentId, docId },
        { headers: { doctorToken } }
      );
      // console.log("response_completeAppointment", response);
      if (response.data.success) {
        toast.success(response.data.message);
        thunkAPI.dispatch(getAppointments());
        return response.data;
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getAppointments = createAsyncThunk(
  "getAppointments",
  async (name, thunkAPI) => {
    const state = thunkAPI.getState();
    const { doctorToken } = state.doctor;
    try {
      let response = await axios.get(`${backendUrl}/api/doctor/appointments`, {
        headers: { doctorToken },
      });
      // console.log("response_getAppointments_doctorSlice", response);
      if (response.data.success) {
        toast.success(response.data.message);
        return response.data.appointments;
      }
      if (!response.data.success) {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
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
      // Get the doctorToken from doctor slice
      const state = thunkAPI.getState();
      const { doctorToken } = state.doctor;
      // Call backend API
      //when we are doing fetching data make sure no body, only headers should maintain
      const response = await axios.get(`${backendUrl}/api/doctor/list`, {
        headers: { doctorToken },
      });
      // Return doctors list
      return response.data.doctors;
    } catch (error) {
      console.error("Axios error:", error.response || error.message);
      // throw error;
      toast.error(error.message);
    }
  }
);

export const logoutDoctor = createAsyncThunk(
  "doctor/logout",
  async (name, thunkAPI) => {
    localStorage.removeItem("doctorToken");
    // thunkAPI.dispatch(setDoctorToken(""));
    return true;
  }
);

export const logoutAll = createAsyncThunk(
  "auth/logoutAll",
  async (_, thunkAPI) => {
    localStorage.removeItem("doctorToken");
    localStorage.removeItem("adminToken");
    thunkAPI.dispatch(setDoctorToken(""));
    // we don’t directly dispatch admin here (adminSlice handles it)
    return true;
  }
);

/* ─────────── Slice ─────────── */
const doctorSlice = createSlice({
  name: "doctors",
  initialState,
  reducers: {
    setDoctorToken: (state, action) => {
      console.log("action.payload_doctorToken", action.payload);
      //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ODNkY2MxZGQ2ZmJmMDczNGM1M2E0MCIsImlhdCI6MTc1NjEyOTUwOX0.mO-msfXkJC_yg5KWHBiBXO3l5uItY1KHWhpVHN5GWHg
      state.doctorToken = action.payload;
    },
    // logoutDoctor: (state) => {
    //   state.doctorToken = "";
    //   localStorage.removeItem("doctorToken");
    // },
    setIsEdit: (state, action) => {
      state.isEdit = action.payload;
    },
    // local, in-form field updates while editing
    updateDoctorProfileField: (state, action) => {
      state.doctorProfileData = {
        ...state.doctorProfileData,
        ...action.payload,
      };
    },

    updateDoctorProfileAddress: (state, action) => {
      state.doctorProfileData = {
        ...state.doctorProfileData,
        address: {
          ...state.doctorProfileData.address,
          ...action.payload, // e.g., { line1: 'x' } or { line2: 'y' }
        },
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchDoctors lifecycle: pending → fulfilled → rejected
      .addCase(getDoctorsData.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDoctorsData.fulfilled, (state, action) => {
        state.loading = false;
        state.doctorsList = action.payload;
      })
      .addCase(getDoctorsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        console.error("Fetch Doctors Error:", action.error);
      })
      .addCase(getAppointments.fulfilled, (state, action) => {
        // console.log("action.payload_getAppointments_91", action.payload);
        state.appointments = action.payload;
      })
      .addCase(completeAppointment.fulfilled, (state, action) => {
        console.log("action.payload_completeAppointment", action.payload);
      })
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        console.log("action.payload_cancelAppointment", action.payload);
      })
      .addCase(getDashboardData.fulfilled, (state, action) => {
        // console.log("action.payload_getDashboardData", action.payload);
        state.doctorDashboardData = action.payload;
      })
      .addCase(getDoctorProfileData.fulfilled, (state, action) => {
        state.loading = false;
        state.doctorProfileData = action.payload || state.doctorProfileData;
      })
      .addCase(doctorUpdateProfile.fulfilled, (state) => {
        state.loading = false;
        state.isEdit = false; // exit edit mode on save
      })
      .addCase(logoutDoctor.fulfilled, (state) => {
        state.doctorToken = "";
      })
      .addCase(logoutAll.fulfilled, (state) => {
        state.doctorToken = "";
      });
  },
});

export default doctorSlice.reducer;
export const {
  setDoctorToken,
  setIsEdit,
  updateDoctorProfileField,
  updateDoctorProfileAddress,
  // logoutDoctor,
} = doctorSlice.actions;
