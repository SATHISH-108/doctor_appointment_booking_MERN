import { useNavigate } from "react-router-dom";
// import { doctors } from "../assets/assets_frontend/assets";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getDoctorsData } from "../features/user/userSlice";
const TopDoctors = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { adminToken } = useSelector((state) => state.admin);
  const { patientToken, doctorsList } = useSelector((state) => state.user);
  useEffect(() => {
    if (!doctorsList || doctorsList.length === 0) {
      dispatch(getDoctorsData());
    }
  }, [adminToken, dispatch, doctorsList?.length, patientToken]);
  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-medium">Top Doctors to Book</h1>
      <p className="sm:w-1/3 text-center text-sm">
        Simply browse through our extensive list of trusted doctors.
      </p>
      <div className="w-full grid grid-cols-auto gap-5 pt-5 gap-y-6 px-3 sm:px-0">
        {(doctorsList || []).slice(0, 10).map((item, index) => {
          const {
            _id,
            name,
            years,
            speciality,
            image,
            degree,
            experience,
            about,
            fees,
            available,
          } = item;
          const { line1, line2 } = item.address;
          return (
            <div
              onClick={() => {
                navigate(`/appointment/${_id}`);
                scrollTo(0, 0);
              }}
              //scroll to top => scrollTop(0,0) index.html=>smooth scrolling
              key={index}
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
            >
              <img
                src={image}
                alt="top-doctors-image"
                className="bg-blue-50 "
              />
              <div className="p-4">
                <div
                  className={`flex items-center gap-2 text-sm text-center ${
                    item.available ? "text-green-500" : "text-gray-500"
                  } `}
                >
                  <p
                    className={`w-2 h-2 ${
                      item.available ? "bg-green-500" : "bg-gray-500"
                    } rounded-full`}
                  ></p>
                  <p>{item.available ? "Available" : "Not Available"}</p>
                </div>

                <p className="text-gray-900 text-lg font-medium">{name}</p>
                <p className="text-gray-600 text-sm ">{speciality}</p>
              </div>
            </div>
          );
        })}
      </div>
      <button
        onClick={() => {
          navigate("/doctors");
          scrollTo(0, 0);
        }}
        className="bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10"
      >
        more
      </button>
      {/* Whenever we click on more button it's navigate to all doctors page and
      it scroll the webpage to the top. (scroll(0,0)) */}
    </div>
  );
};

export default TopDoctors;
