// import multer from "multer";

// const storage = multer.diskStorage({

//   filename: function (request, file, callback) {
//     callback(null, file.originalname); // Save uploaded files to "uploads/" directory
//   },
// });
// const upload = multer({ storage });

// export default upload;
import multer from "multer";
import fs from "fs";

// Ensure uploads folder exists
const uploadPath = "uploads/";
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, uploadPath); // or your desired folder
  },
  filename: function (request, file, callback) {
    callback(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });
export default upload;
