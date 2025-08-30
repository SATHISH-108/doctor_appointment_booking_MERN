import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { assets } from "../../assets/assets_admin/assets";
import {
  getDashboardData,
  completeAppointment,
  cancelAppointment,
} from "../../features/doctors/doctorSlice";
import { slotDateFormat } from "../../features/user/userSlice";
const DoctorDashboard = () => {
  const { doctorToken, doctorDashboardData, currencySymbol } = useSelector(
    (state) => state.doctor
  );

  const dispatch = useDispatch();
  // console.log("doctorDashboardData_doctorDashboard", doctorDashboardData);
  useEffect(() => {
    if (doctorToken) {
      dispatch(getDashboardData());
    }
  }, [dispatch, doctorToken]);
  return (
    doctorDashboardData && (
      <div className="m-5">
        <div className="flex flex-wrap gap-3">
          {/* Doctors */}
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.earning_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {currencySymbol}
                {doctorDashboardData.earnings}
              </p>
              <p className="text-gray-400 ">Earnings</p>
            </div>
          </div>
          {/* Appointments */}
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all ">
            <img className="w-14" src={assets.appointment_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {doctorDashboardData.appointments}
              </p>
              <p className="text-gray-400 ">Appointments</p>
            </div>
          </div>
          {/* Patients */}
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all ">
            <img className="w-14" src={assets.patients_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {doctorDashboardData.patients}
              </p>
              <p className="text-gray-400 ">Patients</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border">
          <img src={assets.list_icon} alt="" />
          <p className="font-semibold">Latest Bookings</p>
        </div>
        <div className="pt-4 border border-t-0">
          {doctorDashboardData.latestAppointments.map((item, index) => (
            <div
              className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100"
              key={index}
            >
              <img
                className="rounded-full w-10"
                src={item.userData.image}
                alt=""
              />
              {/* Date Formate */}
              <div className="flex-1 text-sm">
                <p className="text-gray-800 font-medium">
                  {item.userData.name}
                </p>
                <p className="text-gray-600">{slotDateFormat(item.slotDate)}</p>
              </div>

              {item.cancelled ? (
                <p className="text-red-400 text-xs font-medium">Cancelled</p>
              ) : item.isCompleted ? (
                <p className="text-green-500 text-xs font-medium">Completed</p>
              ) : (
                <div className="flex ">
                  <img
                    onClick={() =>
                      dispatch(
                        completeAppointment({
                          appointmentId: item._id,
                          docId: item.docId,
                        })
                      )
                    }
                    className="w-10 cursor-pointer"
                    src={assets.tick_icon}
                    alt=""
                  />
                  <img
                    onClick={() =>
                      dispatch(
                        cancelAppointment({
                          appointmentId: item._id,
                          docId: item.docId,
                        })
                      )
                    }
                    className="w-10 cursor-pointer"
                    src={assets.cancel_icon}
                    alt=""
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  );
};
export default DoctorDashboard;
