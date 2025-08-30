import { useSelector, useDispatch } from "react-redux";
import { Navbar } from "../components";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { getDoctorsData, slotDateFormat } from "../features/user/userSlice";
import { useNavigate } from "react-router-dom";

const MyAppointments = () => {
  const { doctorsList } = useSelector((state) => state.admin);
  const { backendUrl, token } = useSelector((state) => state.user);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getUserAppointments = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { token },
      });
      // const {data} = await axios.get(`${backendUrl}/api/user/appointments`, {
      //   headers: {token},
      // });
      // console.log("response_getUserAppointments", response);
      if (response.data.success) {
        setLoading(false);
        setAppointments(response.data.appointments.reverse());
        console.log(response.data.appointments);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  const cancelAppointment = async (appointmentId) => {
    try {
      // console.log("appointmentId_cancelAppointment", appointmentId);
      //here passing appointment in body
      const response = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId },
        { headers: { token } }
      );
      // console.log("response_cancelAppointment", response);
      // console.log("appointmentId", appointmentId);
      if (response.data.success) {
        toast.success(response.data.message);
        getUserAppointments();
        dispatch(getDoctorsData());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Appointment Payment",
      description: "Appointment Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        console.log("initPay_response", response);
        //         initPay_response{razorpay_order_id: "order_R7GvEAKcSnzQtB", razorpay_payment_id: "pay_R7Gw9UnSNM1C7j",
        // razorpay_signature:"e8e766668cb838fdf834489860c2ee7284413fc54e188161e0e674d74e3f0d1e"}

        const { razorpay_order_id } = response;
        try {
          const { data } = await axios.post(
            `${backendUrl}/api/user/verify-razorpay`,
            { razorpay_order_id },
            { headers: { token } }
          );
          console.log("data_initPay", data);
          if (data.success) {
            getUserAppointments(); //make payment:true
            navigate("/my-appointments");
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };
  const appointmentRazorpay = async (appointmentId) => {
    try {
      // passing appointmentId in body {appointmentId}
      const { data } = await axios.post(
        `${backendUrl}/api/user/payment-razorpay`,
        { appointmentId },
        { headers: { token } }
      );
      // console.log("data_appointmentRazorpay", data);
      if (data.success) {
        // console.log(data.order);
        //{   amount: 40000,amount_due:40000, amount_apid:0, attempts:0, created_at:1755613458, currency:"INR", entity:"order",
        // id :"order_R7E0fedKKYrPJD", notes : [], offer_id : null, receipt:"68a366d1461ad2369240a5da", status:"created"}

        initPay(data.order);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);
  return (
    <div>
      <Navbar />
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
        My-appointments
      </p>
      {loading ? (
        <div className="text-center mt-3">
          <p className="text-xl">Loading...</p>
        </div>
      ) : (
        <div>
          {appointments.length === 0 ? (
            <div className="text-center mt-5">
              <p className="text-xl">There is no Appointments</p>
            </div>
          ) : (
            appointments.map((item, index) => (
              <div
                className="flex flex-row items-start justify-center md:justify-evenly gap-6 py-2 border-b"
                key={index}
              >
                <div>
                  <img
                    src={item.docData.image}
                    alt=""
                    className="w-32 bg-indigo-50"
                  />
                </div>
                <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:items-center md:justify-between md:gap-12">
                  <div className="flex-1 text-sm text-zinc-600">
                    <p className="font-semibold">{item.docData.name}</p>
                    <p>{item.docData.speciality}</p>
                    <p className="text-zinc-700 font-medium mt-1">Address</p>
                    <p className="text-xs">{item.docData.address.line1}</p>
                    <p className="text-xs">{item.docData.address.line2}</p>
                    <p className="text-xs mt-1">
                      <span className="text-sm text-neutral-700 font-medium">
                        Date & Time :
                      </span>
                      {slotDateFormat(item.slotDate)} | {item.slotTime}
                    </p>
                  </div>
                  <div></div>
                  {/* ---- Pay Online  && Cancel Appointment buttons-- */}
                  <div className="flex flex-col gap-2 justify-end">
                    {!item.cancelled && item.payment && !item.isCompleted && (
                      <button className="sm:min-w-48 py-2 border rounded text-stone-500 bg-indigo-50">
                        Paid
                      </button>
                    )}
                    {!item.cancelled && !item.payment && !item.isCompleted && (
                      <button
                        onClick={() => appointmentRazorpay(item._id)}
                        className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300"
                      >
                        Pay Online
                      </button>
                    )}
                    {!item.cancelled && !item.isCompleted && (
                      <button
                        onClick={() => cancelAppointment(item._id)}
                        className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                      >
                        Cancel appointment
                      </button>
                    )}
                    {item.cancelled && !item.isCompleted && (
                      <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">
                        Appointment cancelled
                      </button>
                    )}
                    {item.isCompleted && (
                      <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500">
                        Completed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
