import { useState, useEffect } from "react";
// import { assets } from "../assets/assets_frontend/assets";
import { getUserProfile } from "../features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
const MyProfile = () => {
  // const [userProfileData, setuserProfileData] = useState({
  //   name: "Edward Vincent",
  //   image: assets.profile_pic,
  //   email: "richardjameswap@gmail.com",
  //   phone: "+1 23 456 7890",
  //   address: {
  //     line1: "57th Cross, Richmond",
  //     line2: "Circle church Road, London",
  //   },
  //   gender: "Male",
  //   dob: "2000-01-20",
  // });
  const [isEdit, setIsEdit] = useState(false);
  const { userProfileData, token, loading } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch profile only if not already in Redux
    if (!userProfileData) {
      dispatch(getUserProfile());
    }
  }, [dispatch, userProfileData, token]);
  if (loading) return <p>Loading profile...</p>;
  if (!userProfileData) return <p>No profile data found</p>;
  return (
    // userProfileData && (
    <div className="max-w-lg flex flex-col gap-2 text-sm">
      <img
        src={userProfileData.image}
        alt="my_profile_image"
        className="w-36 rounded mt-4"
      />
      {isEdit ? (
        <input
          type="text"
          value={`${userProfileData.name[0].toUpperCase()}${userProfileData.name
            .slice(1)
            .toLowerCase()}`}
          className="bg-gray-50 text-3xl font-medium max-w-60 mt-4"
          onChange={(e) =>
            setuserProfileData((prev) => ({ ...prev, name: e.target.value }))
          }
        />
      ) : (
        <p className="font-medium text-3xl text-neutral-800 mt-4">
          {`${userProfileData.name[0].toUpperCase()}${userProfileData.name
            .slice(1)
            .toLowerCase()}`}
        </p>
      )}
      <hr className="bg-zinc-400 h-[1px] border-none" />
      <div>
        <p className="text-neutral-500 underline mt-3">CONTACT INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium ">Email id:</p>
          <p className="text-blue-500">{userProfileData.email}</p>
          <p className="font-medium">Phone: </p>
          {isEdit ? (
            <input
              type="text"
              className="bg-gray-100 max-w-52"
              value={userProfileData.phone}
              onChange={(e) =>
                setuserProfileData((prev) => ({
                  ...prev,
                  phone: e.target.value,
                }))
              }
            />
          ) : (
            <p className="text-blue-400">{userProfileData.phone}</p>
          )}
          <p className="font-medium">Address: </p>
          {isEdit ? (
            <p>
              <input
                className="bg-gray-50"
                onChange={(e) =>
                  setuserProfileData((prev) => ({
                    ...prev,
                    address: { ...prev.address, line1: e.target.value },
                  }))
                }
                value={userProfileData.address.line1}
                type="text"
              />
              <br />
              <input
                type="text"
                className="bg-gray-50"
                onChange={(e) =>
                  setuserProfileData((prev) => ({
                    ...prev,
                    address: { ...prev.address, line2: e.target.value },
                  }))
                }
                value={userProfileData.address.line2}
              />
            </p>
          ) : (
            <p className="text-gray-500">
              {userProfileData.address.line1}
              <br />
              {userProfileData.address.line2}
            </p>
          )}
        </div>
      </div>
      <div>
        <p className=" text-neutral-500 underline mt-3">BASIC INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium">gender:</p>
          {isEdit ? (
            <select
              className="max-w-20 bg-gray-100"
              onChange={(e) =>
                setuserProfileData((prev) => ({
                  ...prev,
                  gender: e.target.value,
                }))
              }
              value={userProfileData.gender}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <p className="text-gray-400 ">{userProfileData.gender}</p>
          )}

          <p className="font-medium">Birthday:</p>
          {isEdit ? (
            <input
              type="date"
              className="max-w-28 bg-gray-100"
              onChange={(e) =>
                setuserProfileData((prev) => ({
                  ...prev,
                  dob: e.target.value,
                }))
              }
              value={userProfileData.dob}
            />
          ) : (
            <p className="text-gray-400">{userProfileData.dob}</p>
          )}
        </div>
      </div>

      <div className="mt-10">
        {isEdit ? (
          <button
            className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
            onClick={() => setIsEdit(false)}
          >
            Save information
          </button>
        ) : (
          <button
            className="border border-primary px-8 py-2 rounded-full  hover:bg-primary hover:text-white transition-all"
            onClick={() => setIsEdit(true)}
          >
            Edit
          </button>
        )}
      </div>
    </div>
    // )
  );
};
export default MyProfile;
