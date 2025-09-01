// import jwt from "jsonwebtoken";

// //user authentication middleware
// const authUser = async (request, response, next) => {
//   try {
//     // console.log("requestHeaders", request.headers);
//     // requestHeaders {
//     //   patientToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OTFkMTIwZjFlNzMzY2Q4NGU1NDNiMyIsImlhdCI6MTc1NDQxOTAyMX0.al3IbTw392VRyLJu-nNM0BZf69nABWOLK8IWoP3gBZg',
//     //   'accept-encoding': 'gzip, deflate, br',
//     //   accept: '*/*',
//     //   'user-agent': 'Thunder Client (https://www.thunderclient.com)',
//     //   host: 'localhost:4000',
//     //   connection: 'close'
//     // }
//     const { patientToken } = request.headers;

//     if (!patientToken || patientToken.split(".").length !== 3) {
//       return response.json({
//         success: false,
//         message: "Invalid or missing patientToken. Please login again.",
//       });
//     }
//     const patientToken_decode = jwt.verify(
//       patientToken,
//       process.env.JWT_SECRET
//     );
//     // console.log("patientToken_decode_authUser_25line", patientToken_decode); //patientToken_decode { id: '6891d120f1e733cd84e543b3', iat: 1754419021 }
//     request.userId = patientToken_decode.id; ////userId: '6891d120f1e733cd84e543b3',=> It came from users(collection) userModel
//     // console.log("userId_authUser_27line", request.userId);
//     //callback function=>next()
//     next();
//   } catch (error) {
//     console.log(error);
//     response.json({ success: false, message: error.message });
//   }
// };
// export default authUser;

import jwt from "jsonwebtoken";

// User (Patient) authentication middleware
const authUser = async (req, res, next) => {
  try {
    // Expect header: Authorization: Bearer <token>
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid or missing patient token. Please login again.",
      });
    }

    const token = authHeader.split(" ")[1]; // Extract token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach userId to request (from users collection)
    req.userId = decoded.id;

    next();
  } catch (error) {
    console.error("authUser_error:", error);
    return res.status(401).json({
      success: false,
      message: "Patient Authentication Failed",
    });
  }
};

export default authUser;
