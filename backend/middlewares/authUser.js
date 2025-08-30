import jwt from "jsonwebtoken";

//user authentication middleware
const authUser = async (request, response, next) => {
  try {
    // console.log("requestHeaders", request.headers);
    // requestHeaders {
    //   token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OTFkMTIwZjFlNzMzY2Q4NGU1NDNiMyIsImlhdCI6MTc1NDQxOTAyMX0.al3IbTw392VRyLJu-nNM0BZf69nABWOLK8IWoP3gBZg',
    //   'accept-encoding': 'gzip, deflate, br',
    //   accept: '*/*',
    //   'user-agent': 'Thunder Client (https://www.thunderclient.com)',
    //   host: 'localhost:4000',
    //   connection: 'close'
    // }
    const { token } = request.headers;

    if (!token || token.split(".").length !== 3) {
      return response.json({
        success: false,
        message: "Invalid or missing token. Please login again.",
      });
    }
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("token_decode_authUser_25line", token_decode); //token_decode { id: '6891d120f1e733cd84e543b3', iat: 1754419021 }
    request.userId = token_decode.id; ////userId: '6891d120f1e733cd84e543b3',=> It came from users(collection) userModel
    // console.log("userId_authUser_27line", request.userId);
    //callback function=>next()
    next();
  } catch (error) {
    console.log(error);
    response.json({ success: false, message: error.message });
  }
};
export default authUser;
