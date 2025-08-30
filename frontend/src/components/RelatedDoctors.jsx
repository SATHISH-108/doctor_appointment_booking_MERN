import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const RelatedDoctors = ({ docId, speciality }) => {
  // console.log(docId, speciality); //doc15 Dermatologist
  const { doctorsList } = useSelector((state) => state.doctor);
  const navigate = useNavigate();
  const [relatedDoctors, setRelatedDoctors] = useState([]);

  useEffect(() => {
    if (doctorsList.length > 0 && speciality) {
      const filteredDoctors = doctorsList.filter(
        (item) => item.speciality === speciality && item._id !== docId
      );
      setRelatedDoctors(filteredDoctors);
      // console.log("relatedDoctors", filteredDoctors);
    }
  }, [docId, speciality, doctorsList]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-medium">Related Doctors</h1>
      <p className="sm:w-1/3 text-center text-sm">
        Simply browse through our extensive list of trusted doctors.
      </p>
      <div className="flex items-center justify-center flex-wrap w-full  gap-5 pt-5 gap-y-6 px-3 sm:px-0">
        {relatedDoctors.slice(0, 5).map((item, index) => {
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
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 w-64"
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
    </div>
  );
};

export default RelatedDoctors;
