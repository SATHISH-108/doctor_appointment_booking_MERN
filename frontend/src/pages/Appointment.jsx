// import { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import { assets } from "../assets/assets_frontend/assets";
// import { dollarSymbol } from "../utils/index";
// import { RelatedDoctors } from "../components/index";
// import { getDoctorsData } from "../features/user/userSlice";
// import { fetchDoctors } from "../features/admin/adminSlice";
// import { toast } from "react-toastify";
// import axios from "axios";
// const Appointment = () => {
//   // const { doctorsList } = useSelector((state) => state.doctor);
//   const { doctorsList } = useSelector((state) => state.admin);
//   const { token, backendUrl } = useSelector((state) => state.user);
//   const { docId } = useParams();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
//   const [docInfo, setDocInfo] = useState(null); // Selected doctor details
//   const [docSlots, setDocSlots] = useState([]); // Array of 7 arrays for slots per day
//   const [slotIndex, setSlotIndex] = useState(0); // Currently selected date index (0–6)
//   const [slotTime, setSlotTime] = useState(""); // Selected time string

//   const bookAppointment = async () => {
//     if (!token) {
//       toast.warn("Signin to book appointment");
//       return navigate("/signin");
//     }
//     try {
//       const date = docSlots[slotIndex][0].dateTime;
//       console.log("date", date);
//       let day = date.getDate();
//       let month = date.getMonth() + 1;
//       let year = date.getFullYear();
//       const slotDate = day + "_" + month + "_" + year;
//       console.log(slotDate);
//       const { data } = await axios.post(
//         `${backendUrl}/api/user/book-appointment`,
//         { docId, slotDate, slotTime },
//         { headers: { token } }
//       );
//       if (data.success) {
//         toast.success(data.message);
//         dispatch(getDoctorsData());
//         navigate("/my-appointment");
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error(error.message);
//     }
//   };

//   useEffect(() => {
//     if (doctorsList.length === 0) {
//       dispatch(fetchDoctors());
//     }
//   }, [dispatch, doctorsList.length]);
//   // Get doctor info
//   useEffect(() => {
//     const doctorInfo = doctorsList.find((item) => item._id === docId);
//     setDocInfo(doctorInfo);
//   }, [docId, doctorsList]);

//   // Generate Time Slots (7 Days)
//   useEffect(() => {
//     if (!docInfo) return;

//     const today = new Date(); // Fri Jul 18 2025 17:06:10 GMT+0530 (India Standard Time)
//     const allSlots = [];
//     //Generates 7 days of appointment time slots.
//     for (let i = 0; i < 7; i++) {
//       const currentDate = new Date(today); // Fri Jul 18 2025 17:06:10 GMT+0530 (India Standard Time)
//       currentDate.setDate(today.getDate() + i); //increment +1 up to 7 next days. => Fri, Sat, Sun, Mon, Tue,Wed,Thu
//       const endTime = new Date(currentDate);
//       // console.log("endTime", endTime);
//       // Fri Jul 18 2025 17:10:27 GMT+0530 (India Standard Time)
//       //  Sat Jul 19 2025 17:10:27 GMT+0530 (India Standard Time)
//       //  Sun Jul 20 2025 17:10:27 GMT+0530 (India Standard Time)
//       //  Mon Jul 21 2025 17:10:27 GMT+0530 (India Standard Time)
//       //  Tue Jul 22 2025 17:10:27 GMT+0530 (India Standard Time)
//       //  Wed Jul 23 2025 17:10:27 GMT+0530 (India Standard Time)
//       //  Thu Jul 24 2025 17:10:27 GMT+0530 (India Standard Time)
//       endTime.setHours(21, 0, 0, 0); // 9 PM (Here we are setting the hours=> and will get next 7 days with 21:00:00 time)
//       // Date.setHours(hours: number, min?: number, sec?: number, ms?: number): number
//       if (i === 0) {
//         const currentHour = currentDate.getHours(); //17
//         currentDate.setHours(
//           currentHour >= 20 ? 22 : Math.max(currentHour + 1, 10)
//         );
//         currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
//         // console.log("currentDate", currentDate);
//       } else {
//         currentDate.setHours(10);
//         currentDate.setMinutes(0);
//       }

//       const timeSlots = [];
//       while (currentDate < endTime) {
//         const formattedTime = currentDate.toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         });

//         timeSlots.push({
//           dateTime: new Date(currentDate),
//           time: formattedTime,
//         });
//         //Increment current time by 30 minutes
//         currentDate.setMinutes(currentDate.getMinutes() + 30);
//       }

//       allSlots.push(timeSlots);
//     }

//     setDocSlots(allSlots);
//   }, [docInfo]);

//   return (
//     <div>
//       {/* ---- Doctor Info ---- */}
//       {docInfo && (
//         <div className="flex flex-col sm:flex-row gap-4">
//           {/* Image */}
//           <div>
//             <img
//               src={docInfo.image}
//               alt="single_user_image"
//               className="bg-primary w-full sm:max-w-72 rounded-lg"
//             />
//           </div>

//           {/* Details */}
//           <div className="flex-1 border border-grey-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
//             <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
//               {docInfo.name}
//               <img className="w-5" src={assets.verified_icon} alt="verified" />
//             </p>
//             <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
//               <p>
//                 {docInfo.degree} - {docInfo.speciality}
//               </p>
//               <button className="py-0.5 px-2 border text-xs rounded-full">
//                 {docInfo.experience}
//               </button>
//             </div>

//             <div>
//               <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
//                 About <img src={assets.info_icon} alt="info" />
//               </p>
//               <p className="text-sm text-gray-500 max-w-[700px] mt-1">
//                 {docInfo.about}
//               </p>
//               <div>
//                 <p className="text-gray-500 font-medium mt-4">
//                   Appointment fee:{" "}
//                   <span className="text-gray-600">
//                     {`${dollarSymbol}${docInfo.fees}`}
//                   </span>
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ---- Booking Slots ---- */}
//       <div className="sm:ml-72 sm:pl-4 mt-8 font-medium text-gray-600">
//         <p>Booking slot</p>

//         {/* Day Slots */}
//         <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
//           {Array(7)
//             .fill(0)
//             .map((_, index) => {
//               const today = new Date();
//               const thisDate = new Date(today.setDate(today.getDate() + index));
//               const dayLabel = daysOfWeek[thisDate.getDay()];
//               const dateNum = thisDate.getDate();
//               const hasSlots = docSlots[index] && docSlots[index].length > 0;

//               return (
//                 <div
//                   key={index}
//                   onClick={() => hasSlots && setSlotIndex(index)}
//                   className={`text-center py-6 min-w-16 rounded-full cursor-pointer px-4 transition-all duration-300 ${
//                     slotIndex === index
//                       ? "bg-primary text-white"
//                       : hasSlots
//                       ? "border border-gray-200"
//                       : "border border-gray-200 opacity-50 cursor-not-allowed"
//                   }`}
//                 >
//                   <p>{dayLabel}</p>
//                   <p>{dateNum}</p>
//                 </div>
//               );
//             })}
//         </div>

//         {/* Time Slots */}
//         <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
//           {docSlots[slotIndex] &&
//             docSlots[slotIndex].map((item, index) => (
//               <p
//                 onClick={() => setSlotTime(item.time)}
//                 className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer transition-all duration-200 ${
//                   item.time === slotTime
//                     ? "bg-primary text-white"
//                     : "text-gray-400 border border-gray-300"
//                 }`}
//                 key={index}
//               >
//                 {item.time.toLowerCase()}
//               </p>
//             ))}
//         </div>
//         <button
//           onClick={bookAppointment}
//           className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6"
//         >
//           Book an appointment
//         </button>
//       </div>
//       {/* ---- Listing Related Doctors */}
//       {docInfo && (
//         <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
//       )}
//     </div>
//   );
// };

// export default Appointment;

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { assets } from "../assets/assets_frontend/assets";
import { dollarSymbol } from "../utils/index";
import { RelatedDoctors } from "../components/index";
import { getDoctorsData } from "../features/user/userSlice";
import { fetchDoctors } from "../features/admin/adminSlice";
import { toast } from "react-toastify";
import axios from "axios";

const Appointment = () => {
  const { doctorsList } = useSelector((state) => state.admin);
  const { token, backendUrl } = useSelector((state) => state.user);
  const { docId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  // ---------------- BOOK APPOINTMENT FUNCTION ----------------
  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Signin to book appointment");
      return navigate("/signin");
    }

    if (!slotTime) {
      toast.warn("Please select a time slot");
      return;
    }

    try {
      const date = docSlots[slotIndex][0].dateTime;
      // console.log("date", date);
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      const slotDate = `${day}_${month}_${year}`;
      // console.log("slotDate", slotDate);

      const response = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        { docId, slotDate, slotTime },
        { headers: { token } }
      );
      // console.log("response", response);
      if (response.data.success) {
        toast.success(
          response.data.message || "Appointment Booked successfully"
        );
        setTimeout(() => {
          dispatch(getDoctorsData());
          navigate("/my-appointments");
        }, 1500); // delay navigation so toast can be seen
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // ---------------- FETCH DOCTORS IF NOT IN STATE ----------------
  useEffect(() => {
    if (doctorsList.length === 0) {
      dispatch(fetchDoctors());
    }
  }, [dispatch, doctorsList.length]);

  // ---------------- SET SELECTED DOCTOR ----------------
  useEffect(() => {
    const doctorInfo = doctorsList.find((item) => item._id === docId);
    setDocInfo(doctorInfo);
  }, [docId, doctorsList]);

  // ---------------- GENERATE TIME SLOTS FOR 7 DAYS ----------------
  useEffect(() => {
    if (!docInfo) return;

    const today = new Date();
    const allSlots = [];

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      const endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0); // 9 PM

      if (i === 0) {
        const currentHour = currentDate.getHours();
        currentDate.setHours(
          currentHour >= 20 ? 22 : Math.max(currentHour + 1, 10)
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      const timeSlots = [];
      while (currentDate < endTime) {
        const formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();
        const slotDate = day + "_" + month + "_" + year;
        const slotTime = formattedTime;
        //if any entry is there with that date then we are going to check if with that date this slot timing is already booked or not.
        //if both of the statements are true that case we will not add the slot time. that why we provided false.
        const isSlotAvailable =
          docInfo.slots_booked[slotDate] &&
          docInfo.slots_booked[slotDate].includes(slotTime)
            ? false
            : true;
        // console.log("isSlotAvailable", isSlotAvailable);
        if (isSlotAvailable) {
          //add slot to array
          timeSlots.push({
            dateTime: new Date(currentDate),
            time: formattedTime,
          });
        }
        //increment current time by 30 minutes
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      allSlots.push(timeSlots);
    }

    setDocSlots(allSlots);
  }, [docInfo]);

  return (
    <div>
      {/* ---- Doctor Info ---- */}
      {docInfo && (
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Image */}
          <div>
            <img
              src={docInfo.image}
              alt="single_user_image"
              className="bg-primary w-full sm:max-w-72 rounded-lg"
            />
          </div>

          {/* Details */}
          <div className="flex-1 border border-grey-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            {/* Name - availability */}
            <div className="flex flex-col md:flex-row items-center justify-between">
              <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
                {docInfo.name}
                <img
                  className="w-5"
                  src={assets.verified_icon}
                  alt="verified"
                />
              </p>
              {/* availability */}
              <div className="flex items-center gap-2 text-sm text-center text-green-500 ">
                {/* <p className="w-2 h-2 bg-green-500 rounded-full"></p> */}
                {docInfo.available ? (
                  <div className="mr-8 w-24 flex items-center justify-evenly font-semibold">
                    <p className="w-2 h-2 bg-green-500 rounded-full text-md"></p>
                    <p className="text-md text-green-500">Available</p>
                  </div>
                ) : (
                  <>
                    <div className="mr-8 w-24 flex items-center justify-evenly font-semibold">
                      <p className="w-2 h-2 bg-gray-500 rounded-full text-md"></p>
                      <p className="text-md text-gray-500">Not Available</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {docInfo.degree} - {docInfo.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {docInfo.experience}
              </button>
            </div>

            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                About <img src={assets.info_icon} alt="info" />
              </p>
              <p className="text-sm text-gray-500 max-w-[700px] mt-1">
                {docInfo.about}
              </p>
              <div>
                <p className="text-gray-500 font-medium mt-4">
                  Appointment fee:{" "}
                  <span className="text-gray-600">
                    {`${dollarSymbol}${docInfo.fees}`}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---- Booking Slots ---- */}
      <div className="sm:ml-72 sm:pl-4 mt-8 font-medium text-gray-600">
        <p>Booking slot</p>

        {/* Day Slots */}
        <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
          {Array(7)
            .fill(0)
            .map((_, index) => {
              const today = new Date();
              const thisDate = new Date(today.setDate(today.getDate() + index));
              const dayLabel = daysOfWeek[thisDate.getDay()];
              const dateNum = thisDate.getDate();
              const hasSlots = docSlots[index] && docSlots[index].length > 0;

              return (
                <div
                  key={index}
                  onClick={() => hasSlots && setSlotIndex(index)}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer px-4 transition-all duration-300 ${
                    slotIndex === index
                      ? "bg-primary text-white"
                      : hasSlots
                      ? "border border-gray-200"
                      : "border border-gray-200 opacity-50 cursor-not-allowed"
                  }`}
                >
                  <p>{dayLabel}</p>
                  <p>{dateNum}</p>
                </div>
              );
            })}
        </div>

        {/* Time Slots */}
        <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
          {docSlots[slotIndex] &&
            docSlots[slotIndex].map((item, index) => (
              <p
                onClick={() => setSlotTime(item.time)}
                className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer transition-all duration-200 ${
                  item.time === slotTime
                    ? "bg-primary text-white"
                    : "text-gray-400 border border-gray-300"
                }`}
                key={index}
              >
                {item.time.toLowerCase()}
              </p>
            ))}
        </div>

        {/* Book Button */}
        <button
          onClick={bookAppointment}
          className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6"
        >
          Book an appointment
        </button>
      </div>

      {/* ---- Related Doctors ---- */}
      {docInfo && (
        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      )}
    </div>
  );
};

export default Appointment;
