import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storageFotoUtama = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../uploads/hewan"));
  },
  filename: function (req, file, cb) {
    const filenameWithoutExt = path
      .parse(file.originalname)
      .name.replace(/\s+/g, "-"); // Mengganti semua spasi dengan tanda hubung
    cb(
      null,
      "main-" +
        filenameWithoutExt +
        "-" +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});

const uploadFotoUtama = multer({
  storage: storageFotoUtama,
  // limits: { fileSize: 5 * 1024 * 1024 }, // Batasan ukuran file
  fileFilter: function (req, file, cb) {
    // Filter untuk tipe file gambar (misal: jpeg, jpg, png)
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: File must be an image (jpeg, jpg, png)");
    }
  },
});

export default uploadFotoUtama;
