import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../uploads/hewan"));
  },
  filename: function (req, file, cb) {
    const filenameWithoutExt = path
      .parse(file.originalname)
      .name.replace(/\s+/g, "-"); // Mengganti semua spasi dengan tanda hubung
    cb(
      null,
      "foto-" +
        filenameWithoutExt +
        "-" +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});

const uploadFotoHewanArray = multer({ storage: storage });

export default uploadFotoHewanArray;
