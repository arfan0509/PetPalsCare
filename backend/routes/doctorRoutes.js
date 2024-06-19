import express from "express";
import {
  registerDoctor,
  loginDoctor,
  logoutDoctor,
  updateDoctorPhoto,
  getDoctorProfile,
  updateDoctor,
  changeDoctorPassword,
  deleteDoctorPhoto,
  getAllDoctors,
} from "../controllers/doctorController.js";
import { refreshTokenDoctor } from "../controllers/RefreshToken.js";
import verifyToken from "../middleware/VerifyToken.js";
import uploadPP from "../middleware/multer.js";

const router = express.Router();

router.post("/register", registerDoctor);
router.post("/login", loginDoctor);
router.get("/refresh-token", refreshTokenDoctor);
router.delete("/logout", logoutDoctor);

// Rute untuk mendapatkan seluruh data dokter
router.get("/", getAllDoctors);

// Rute yang memerlukan otentikasi
router.get("/dokter-data", verifyToken, getDoctorProfile);
router.put("/update-data", verifyToken, updateDoctor);
router.put(
  "/update-photo",
  verifyToken,
  uploadPP.single("foto"),
  updateDoctorPhoto
);
router.put("/change-password", verifyToken, changeDoctorPassword);
router.delete("/delete-photo", verifyToken, deleteDoctorPhoto);

export default router;
