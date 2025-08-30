import jwt, { decode } from "jsonwebtoken";

//admin authentication middleware
const authAdmin = async (request, response, next) => {
  try {
    // console.log("requestHeaders_authAdmin", request.headers);
    //     requestHeaders {......
    //   admintoken: 'eyJhbGciOiJIUzI1NiJ9.YWRtaW5AcHJlc2NyaXB0by5jb21BZG1pbkA.xI5rT4IfPt4bHlpSDNW-bpNlY6x_oiquvukCE439-fA',
    //   host: 'localhost:4000',
    //   connection: 'close'
    // }
    const { admintoken } = request.headers;
    if (!admintoken) {
      return response.status(401).json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }
    const token_decode = jwt.verify(admintoken, process.env.JWT_SECRET);
    // console.log("token_decode", token_decode); // admin@prescripto.comAdmin@
    if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      return response.json({
        success: false,
        message: "Invalid or Expired Token",
      });
    }
    request.adminId = token_decode.id;
    //callback function=>next()
    next();
  } catch (error) {
    console.log(error);
    // response.status(401).json({ success: false, message: error.message });
    response
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};
export default authAdmin;
