import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../uploads/profile"));
  },
  filename: function (req, file, cb) {
    const userId = req.user.id; // Mendapatkan ID pengguna dari request (pastikan Anda memiliki middleware yang menetapkan req.user)
    const filenameWithoutExt = path
      .parse(file.originalname)
      .name.replace(/\s+/g, "-"); // Mengganti semua spasi dengan tanda hubung
    cb(
      null,
      userId +
        "-" +
        filenameWithoutExt +
        "-" +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});

const uploadPP = multer({ storage: storage });

export default uploadPP;
