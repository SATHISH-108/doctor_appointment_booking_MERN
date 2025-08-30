import { useState } from "react";
import { assets } from "../../assets/assets_admin/assets";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
const AddDoctor = () => {
  const [doctor, setDoctor] = useState({
    doctorImage: false,
    name: "",
    email: "",
    password: "",
    experience: "1 Year",
    fees: "",
    About: "",
    speciality: "General physician",
    degree: "",
    address1: "",
    address2: "",
    about: "",
  });
  const { adminToken, backendUrl } = useSelector((state) => state.admin);
  const addDoctorSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (!doctor.doctorImage) {
        return toast.error("Doctor Image Not Selected");
      }
      const formData = new FormData();
      formData.append("doctorImage", doctor.doctorImage);
      formData.append("name", doctor.name);
      formData.append("email", doctor.email);
      formData.append("password", doctor.password);
      formData.append("experience", doctor.experience);
      formData.append("fees", Number(doctor.fees));
      formData.append("about", doctor.about);
      formData.append("speciality", doctor.speciality);
      formData.append("degree", doctor.degree);
      formData.append(
        "address",
        JSON.stringify({
          line1: doctor.address1,
          line2: doctor.address2,
        })
      );
      //we can't console the formData directly for that we are using forEach method
      formData.forEach((value, key) => {
        // console.log(`${key} : ${value}`);
        // doctorImage: [object File]
        // name: sathish
        // email: sathish@gmail.com
        // password: Sathish@
        // experience : 3 Year
        // fees: 500
        // about: Doctor name is sathish
        // speciality: Dermatologist
        // degree: MBBS
        // address: { "line1": "Hyderabad", "line2": "Telangana" }
      });
      //save the doctor details in Database(MongoDB)

      const data = await axios.post(
        // backendUrl + "/api/admin/add-doctor",
        `${backendUrl}/api/admin/add-doctor`,
        formData,
        {
          headers: { adminToken },
        }
      );
      // console.log("data", data);
      if (data.data.success) {
        //true
        toast.success(data.data.message);
        setDoctor({
          ...doctor,
          doctorImage: false,
          name: "",
          email: "",
          password: "",
          fees: "",
          degree: "",
          address1: "",
          address2: "",
          about: "",
          speciality: "General physician",
          experience: "1 Year",
        });
      }
      if (!data.data.success) {
        //false
        toast.error(data.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  return (
    <form className="m-5 w-full" onSubmit={addDoctorSubmitHandler}>
      <p className="mb-3 text-lg font-medium">Add Doctor</p>
      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
        {/* Upload -File - Doctor Image*/}
        <div className="flex items-center gap-3">
          <label htmlFor="doc-img">
            <img
              src={
                doctor.doctorImage
                  ? URL.createObjectURL(doctor.doctorImage)
                  : assets.upload_area
              }
              alt=""
              className="w-16 bg-gray-100 rounded-full cursor-pointer"
            />
          </label>
          <input
            type="file"
            id="doc-img"
            hidden
            onChange={(e) =>
              setDoctor({ ...doctor, doctorImage: e.target.files[0] })
            }
          />
          <p>
            Upload doctor <br /> picture
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 text-gray-600 mt-5">
          {/* Left column - Name to Fees */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p>Doctor name</p>
              <input
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Name"
                value={doctor.name}
                onChange={(e) => setDoctor({ ...doctor, name: e.target.value })}
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <p>Doctor Email</p>
              <input
                className="border rounded px-3 py-2"
                type="email"
                placeholder="Email"
                value={doctor.email}
                onChange={(e) =>
                  setDoctor({ ...doctor, email: e.target.value })
                }
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <p>Doctor Password</p>
              <input
                className="border rounded px-3 py-2"
                type="password"
                placeholder="Password"
                value={doctor.password}
                onChange={(e) =>
                  setDoctor({ ...doctor, password: e.target.value })
                }
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <p>Experience</p>
              <select
                className="border rounded px-3 py-2"
                value={doctor.experience}
                onChange={(e) =>
                  setDoctor({ ...doctor, experience: e.target.value })
                }
              >
                <option value="1 Year">1 Year</option>
                <option value="2 Year">2 Year</option>
                <option value="3 Year">3 Year</option>
                <option value="4 Year">4 Year</option>
                <option value="5 Year">5 Year</option>
                <option value="6 Year">6 Year</option>
                <option value="7 Year">7 Year</option>
                <option value="8 Year">8 Year</option>
                <option value="9 Year">9 Year</option>
                <option value="10 Year">10 Year</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <p>Fees</p>
              <input
                className="border rounded px-3 py-2"
                type="number"
                placeholder="Fees"
                value={doctor.fees}
                onChange={(e) => setDoctor({ ...doctor, fees: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Right column - Speciality to About */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p>Speciality</p>
              <select
                className="border rounded px-3 py-2"
                value={doctor.speciality}
                onChange={(e) =>
                  setDoctor({ ...doctor, speciality: e.target.value })
                }
              >
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <p>Education</p>
              <input
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Education"
                value={doctor.degree}
                onChange={(e) =>
                  setDoctor({ ...doctor, degree: e.target.value })
                }
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <p>Address</p>
              <input
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Address 1"
                value={doctor.address1}
                onChange={(e) =>
                  setDoctor({ ...doctor, address1: e.target.value })
                }
                required
              />
              <input
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Address 2"
                value={doctor.address2}
                onChange={(e) =>
                  setDoctor({ ...doctor, address2: e.target.value })
                }
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <p className="mt-4 mb-2">About Doctor</p>
              <textarea
                className="w-full px-4 pt-2 border rounded"
                placeholder="Write about doctor"
                rows={5}
                value={doctor.about}
                onChange={(e) =>
                  setDoctor({ ...doctor, about: e.target.value })
                }
                required
              />
            </div>
          </div>
        </div>

        <button
          className="bg-primary rounded-full px-10 py-3 mt-5 text-white"
          type="submit"
        >
          Add doctor
        </button>
      </div>
    </form>
  );
};

export default AddDoctor;
