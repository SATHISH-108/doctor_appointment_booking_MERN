import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { setDoctorToken } from "../doctors/doctorSlice";

const backendUrl = import.meta.env.VITE_BACKEND_URL; //http://localhost:4000
const initialState = {
  adminToken: localStorage.getItem("adminToken") || "", // ✅ raw string now
  backendUrl,
  doctorsList: [],
  appointments: [],
  dashboardData: false,
  loading: false,
  error: null,
};

// const fetchDoctors = createAsyncThunk(action, callbackFunction);
// Async Thunk to fetch doctors
export const fetchDoctors = createAsyncThunk(
  "getDoctorsList",
  async (name, thunkAPI) => {
    //instead of name you can give any name
    // console.log(name)
    // console.log(thunkAPI)
    try {
      // Get the token from admin slice
      const state = thunkAPI.getState();
      const { adminToken } = state.admin;
      console.log("adminToken_fetchDoctors_adminSlice_28", adminToken);
      //adminToken: 'eyJhbGciOiJIUzI1NiJ9.YWRtaW5AcHJlc2NyaXB0by5jb21BZG1pbkA.xI5rT4IfPt4bHlpSDNW-bpNlY6x_oiquvukCE439-fA'
      // Call backend API
      //when we are doing fetching data make sure no body, only headers should maintain
      const response = await axios.get(`${backendUrl}/api/admin/all-doctors`, {
        headers: { adminToken },
        // headers: { Authorization: `Bearer ${adminToken}` },
      });
      // Return doctors list
      console.log("adminSlice_response", response);
      return response.data.doctors;
    } catch (error) {
      console.error("Axios error:", error.response || error.message);
      // throw error;
      toast.error(error.message);
    }
  }
);

// Async Thunk to change availability status
export const changeAvailability = createAsyncThunk(
  "getAvailabilityStatus",
  async (docId, thunkAPI) => {
    //here docId you can give any name you will get docId bcz we are calling the dispatch(changeAvailability(item._id)) from DoctorsList component
    // console.log("name", name); // 6883dbeddd6fbf0734c53a3e
    try {
      const state = thunkAPI.getState();
      const { adminToken } = state.admin;
      const response = await axios.post(
        `${backendUrl}/api/admin/change-availability`,
        { docId },
        { headers: { adminToken } }
      );
      // console.log("response_changeAvailability", response);
      if (response.data.success) {
        toast.success(response.data.message);
      }
      return { docId };
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);
//Async Thunk to get all appointments (admin dashboard)
export const getAllAppointments = createAsyncThunk(
  "getAllAppointments",
  async (name, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const { adminToken, backendUrl } = state.admin;
      const response = await axios.get(`${backendUrl}/api/admin/appointments`, {
        headers: { adminToken },
      });
      // console.log("response_admin_getAllAppointments", response);
      if (response.data.success) {
        return response.data.appointments;
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }
);
export const cancelAppointment = createAsyncThunk(
  "cancelAppointment",
  async (appointmentId, thunkAPI) => {
    try {
      let state = thunkAPI.getState();
      // console.log("thunkAPI", thunkAPI);
      //       thunkAPI
      // {extra: undefined, requestId: '_fxLDdr0tBblihc_JqRx2', signal: AbortSignal, dispatch: ƒ, getState: ƒ, …}
      // abort : ƒ abort(reason) dispatch : (action, ...args) => dispatch(action, ...args) extra : undefined
      // fulfillWithValue: (value, meta) => {…}
      // getState: ƒ i()
      // rejectWithValue: (value, meta) => {…}
      // requestId: "_fxLDdr0tBblihc_JqRx2"
      // signal: AbortSignal {aborted: false, reason: undefined, onabort: null}
      // [[Prototype]]
      // :
      // Object
      const { adminToken } = state.admin;
      console.log("appointmentId_cancelAppointment", appointmentId); // 68a366d1461ad2369240a5da
      let response = await axios.post(
        `${backendUrl}/api/admin/cancel-appointment`,
        { appointmentId },
        { headers: { adminToken } }
      );
      console.log("response_cancelAppointment", response);

      if (response.data.success) {
        toast.success(response.data.message);
        thunkAPI.dispatch(getAllAppointments());
        return { appointmentId };
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }
);
export const getDashboardData = createAsyncThunk(
  "getDashboardData",
  async (name, thunkAPI) => {
    try {
      const state = await thunkAPI.getState();
      const { adminToken } = state.admin;
      let response = await axios.get(`${backendUrl}/api/admin/dashboard`, {
        headers: { adminToken },
      });
      if (response.data.success) {
        toast.success(response.data.message);
      }
      // console.log("response", response);
      const { appointments, dashboardData, doctors, users } = response.data;
      return dashboardData;
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }
);
export const logoutAdmin = createAsyncThunk(
  "admin/logout",
  async (name, thunkAPI) => {
    localStorage.removeItem("adminToken");
    thunkAPI.dispatch(setadminToken(""));
    return true;
  }
);
//Logout (Admin+Doctor)
export const logoutAll = createAsyncThunk(
  "auth/logoutAll",
  async (_, thunkAPI) => {
    localStorage.removeItem("doctorToken");
    localStorage.removeItem("adminToken");
    thunkAPI.dispatch(setDoctorToken(""));
    thunkAPI.dispatch(setadminToken(""));
    return true;
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    // This action sets the adminToken value
    setadminToken: (state, action) => {
      //console.log(action);//{type: 'admin/setadminToken', payload: 'eyJhbGciOiJIUzI1NiJ9.YWRtaW5AcHJlc2NyaXB0by5jb21BZG1pbkA.xI5rT4IfPt4bHlpSDNW-bpNlY6x_oiquvukCE439-fA'}
      state.adminToken = action.payload;
    },
    logoutAdmin: (state) => {
      state.adminToken = "";
      localStorage.removeItem("adminToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        // console.log("fetchDoctors", action);
        state.loading = false;
        state.doctorsList = action.payload || [];
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      //changeAvailability lifecycle
      .addCase(changeAvailability.fulfilled, (state, action) => {
        const doctor = state.doctorsList.find(
          (item) => item._id === action.payload.docId
        );
        if (doctor) {
          doctor.available = !doctor.available;
        }
      })
      .addCase(getAllAppointments.fulfilled, (state, action) => {
        state.appointments = action.payload;
      })
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        console.log("action_cancelAppointment", action);
        const { appointmentId } = action.payload;
        state.appointments = state.appointments.filter(
          (appt) => appt._id !== appointmentId
        );
      })
      .addCase(getDashboardData.fulfilled, (state, action) => {
        // console.log(action.payload);
        // {doctors: 16, appointments: 21, patients: 13, latestAppointments: Array(5)}
        state.dashboardData = action.payload;
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.adminToken = "";
      })
      .addCase(logoutAll.fulfilled, (state) => {
        state.adminToken = "";
      });
  },
});
export default adminSlice.reducer;
export const {
  setadminToken,
  //  logoutAdmin
} = adminSlice.actions;
