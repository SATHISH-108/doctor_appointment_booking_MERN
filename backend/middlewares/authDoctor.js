import jwt from "jsonwebtoken";

//doctor authentication middleware
const authDoctor = async (request, response, next) => {
  try {
    // console.log("requestHeaders_authDoctor", request.headers);
    // requestHeaders_authDoctor {
    //   host: 'localhost:4000',
    //   connection: 'keep-alive',
    //   'content-length': '24',
    //   'sec-ch-ua-platform': '"Windows"',
    //   'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
    //   accept: 'application/json, text/plain, */*',  'sec-ch-ua': '"Not;A=Brand";v="99", "Google
    // Chrome";v="139", "Chromium";v="139"',
    //   'content-type': 'application/x-www-form-urlencoded',
    //   'sec-ch-ua-mobile': '?0',
    //   doctortoken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ODRlMzQyNjk0NGNkNTMxYzZmMmU4YyIsImlhdCI6MTc1NjI2NzU4NX0.jbo95nEX9KPYeItx9aZZ6Ox1WLwVhlm4oj68uAVUH6A',
    //   origin: 'http://localhost:5173',
    //   'sec-fetch-site': 'same-site',
    //   'sec-fetch-mode': 'cors',
    //   'sec-fetch-dest': 'empty',
    //   referer: 'http://localhost:5173/',
    //   'accept-encoding': 'gzip, deflate, br, zstd',
    //   'accept-language': 'en-US,en;q=0.9'
    // }

    // You are sending token as doctortoken header
    const { doctortoken } = request.headers; // frontend sends doctortoken in headers
    if (!doctortoken || doctortoken.split(".").length !== 3) {
      return response.json({
        success: false,
        message: "Invalid or missing token. Please login again.",
      });
    }
    // decode token -> we signed { id: doctor._id }
    const token_decode = jwt.verify(doctortoken, process.env.JWT_SECRET);
    // console.log("doctorToken_decode_authDoctor_25line", token_decode); //token_decode { id: '6891d120f1e733cd84e543b3', iat: 1754419021 }
    // ✅ token has { id: doctor._id }, not docId
    request.doctorId = token_decode.id; // attach doctorId to request
    //callback function=>next()
    next();
  } catch (error) {
    console.log("authDoctor_error", error);
    response.json({ success: false, message: "Doctor Authentication Failed" });
  }
};
export default authDoctor;
