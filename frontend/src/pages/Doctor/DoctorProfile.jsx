import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDoctorProfileData,
  setIsEdit,
  updateDoctorProfileField,
  updateDoctorProfileAddress,
  doctorUpdateProfile,
} from "../../features/doctors/doctorSlice";
const DoctorProfile = () => {
  const { doctorToken, doctorProfileData, currencySymbol, isEdit } =
    useSelector((state) => state.doctor);
  const dispatch = useDispatch();
  // console.log("doctorProfileData_doctorProfile.jsx", doctorProfileData);
  useEffect(() => {
    if (doctorToken) {
      dispatch(getDoctorProfileData());
    }
  }, [dispatch, doctorToken]);
  const handleSave = () => {
    dispatch(doctorUpdateProfile()); //save to backend
  };
  return (
    doctorProfileData && (
      <div>
        <div className="flex flex-col gap-4 mt-5">
          <div>
            <img
              className="bg-primary/80 w-full sm:max-w-64 rounded-lg"
              src={doctorProfileData.image}
              alt=""
            />
          </div>
          <div className="flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white">
            {/* Doc Info : name, degree, experience  */}
            <p className="flex items-center gap-2 text-3xl font-medium text-gray-700">
              {doctorProfileData.name}
            </p>
            <div className="flex items-center gap-2 mt-1 text-gray-600">
              <p>
                {doctorProfileData.degree} - {doctorProfileData.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {doctorProfileData.experience}
              </button>
            </div>
            {/* Doctor About */}
            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3">
                About :
              </p>
              <p className="text-sm text-gray-600 max-w-[700px] mt-1">
                {doctorProfileData.about}
              </p>
            </div>
            {/* Appointment Fee */}
            {/* <p className="text-gray-600 font-medium mt-4">
              Appointment fee :{" "}
              <span className="text-gray-800">
                {currencySymbol}
                {isEdit ? (
                  <input
                    type="number"
                    onChange={(e) =>
                      dispatch(
                        getDoctorProfileData((prev) => ({
                          ...prev,
                          fees: e.target.value,
                        }))
                      )
                    }
                    value={doctorProfileData.fees}
                    className="border px-2 ml-2"
                  />
                ) : (
                  doctorProfileData.fees
                )}
              </span>
            </p> */}

            <p className="text-gray-600 font-medium mt-4">
              Appointment fee :{" "}
              <span className="text-gray-800">
                {currencySymbol}
                {isEdit ? (
                  <input
                    type="number"
                    onChange={(e) =>
                      dispatch(
                        updateDoctorProfileField({ fees: e.target.value })
                      )
                    }
                    value={doctorProfileData.fees}
                    className="border px-2 ml-2"
                  />
                ) : (
                  doctorProfileData.fees
                )}
              </span>
            </p>

            {/* Address */}
            <div className="flex gap-2 py-2">
              <p>Address:</p>
              <p className="text-sm">
                {isEdit ? (
                  <input
                    type="text"
                    onChange={(e) =>
                      dispatch(
                        updateDoctorProfileAddress({ line1: e.target.value })
                      )
                    }
                    value={doctorProfileData.address.line1}
                  />
                ) : (
                  doctorProfileData.address.line1
                )}
                <br />
                {isEdit ? (
                  <input
                    type="text"
                    onChange={(e) =>
                      dispatch(
                        updateDoctorProfileAddress({ line2: e.target.value })
                      )
                    }
                    value={doctorProfileData.address.line2}
                  />
                ) : (
                  doctorProfileData.address.line2
                )}
              </p>
            </div>

            <div className="flex gap-1 pt-2">
              <input
                type="checkbox"
                checked={doctorProfileData.available}
                onChange={() =>
                  isEdit &&
                  dispatch(
                    updateDoctorProfileField({
                      available: !doctorProfileData.available,
                    })
                  )
                }
              />
              <label>Available</label>
            </div>

            {isEdit ? (
              <button
                onClick={handleSave}
                className="px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => dispatch(setIsEdit(true))}
                className="px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorProfile;
