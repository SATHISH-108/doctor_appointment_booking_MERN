import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctors } from "../../features/admin/adminSlice";
import {
  changeAvailability,
  // fetchDoctors,
} from "../../features/admin/adminSlice";

const DoctorsList = () => {
  // const { doctorsList, loading, error } = useSelector((state) => state.doctor);
  const { adminToken, backendUrl, doctorsList, loading, error } = useSelector(
    (state) => state.admin
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (adminToken || DoctorsList.length === 0) {
      dispatch(fetchDoctors());
    }
  }, [adminToken, dispatch, doctorsList.length]);

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <h1 className="text-lg font-medium">All Doctors</h1>
      <div className="w-full flex flex-wrap gap-3 pt-5 gap-y-6">
        {doctorsList.map((item, index) => (
          <div
            className="group border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer"
            key={index}
          >
            <img
              className=" bg-indigo-50 group-hover:bg-primary transition-all duration-500"
              src={item.image}
              alt="doctor-image"
            />
            <div>
              <p className="text-neutral-800 text-lg font-medium">
                {item.name}
              </p>
              <p className="text-zinc-600 text-sm">{item.speciality}</p>
              <div className="mt-2 flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={item.available}
                  onChange={() => dispatch(changeAvailability(item._id))}
                />
                <p>Available</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;
