// backend/multer/uploadPP.js

import multer from "multer";
import cloudinary from "../config/cloudinaryConfig.js";

const uploadPP = multer({
  storage: multer.memoryStorage(), // Menggunakan memory storage untuk menyimpan sementara file di RAM
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Only image files are allowed!"));
    }
    cb(null, true);
  },
});

export default uploadPP.single("foto"); // Menggunakan single untuk mengunggah satu file saja dengan field "foto"
