import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../database/Database.js";
import cloudinary from "../config/cloudinaryConfig.js";

// Mendapatkan profil dokter
export const getDoctorProfile = async (req, res) => {
  const doctorId = req.user.id; // Mengambil ID dokter dari token akses
  try {
    const [rows] = await pool.query(
      "SELECT id_dokter, nama, no_hp, email, gender, usia, alamat, spesialis, lulusan, pengalaman, url_foto FROM dokter WHERE id_dokter = ?",
      [doctorId]
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Registrasi dokter baru
export const registerDoctor = async (req, res) => {
  const {
    nama,
    no_hp,
    alamat,
    email,
    password,
    confirmPassword,
    gender,
    usia,
    lulusan,
    spesialis,

    pengalaman,
  } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const [existingDoctor] = await pool.query(
      "SELECT email FROM dokter WHERE email = ?",
      [email]
    );
    if (existingDoctor.length > 0)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO dokter (nama, no_hp, alamat, email, password, gender, usia, lulusan, spesialis, pengalaman) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        nama,
        no_hp,
        alamat,
        email,
        hashedPassword,
        gender,
        usia,
        lulusan,
        spesialis,

        pengalaman,
      ]
    );

    res.status(201).json({ message: "Doctor registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login dokter
export const loginDoctor = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query("SELECT * FROM dokter WHERE email = ?", [
      email,
    ]);
    if (rows.length === 0)
      return res.status(400).json({ message: "Invalid email or password" });

    const doctor = rows[0];
    const isPasswordValid = await bcrypt.compare(password, doctor.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid email or password" });

    const accessToken = jwt.sign(
      { id: doctor.id_dokter, email: doctor.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "60m" }
    );
    const refreshToken = jwt.sign(
      { id: doctor.id_dokter, email: doctor.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    await pool.query(
      "UPDATE dokter SET refresh_token = ? WHERE id_dokter = ?",
      [refreshToken, doctor.id_dokter]
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mengupdate profil dokter
export const updateDoctor = async (req, res) => {
  const doctorId = req.user.id; // Mengambil ID dokter dari token akses
  const {
    nama,
    no_hp,
    email,
    gender,
    usia,
    alamat,
    spesialis,
    lulusan,
    pengalaman,
    oldPassword,
    newPassword,
  } = req.body;

  try {
    // Periksa apakah ada permintaan untuk mengubah password
    let passwordQuery = "";
    const passwordParams = [
      nama,
      no_hp,
      email,
      gender,
      usia,
      alamat,
      spesialis,
      lulusan,
      pengalaman,
      doctorId,
    ];
    if (oldPassword && newPassword) {
      // Jika ada permintaan untuk mengubah password, periksa apakah password lama benar
      const [doctorData] = await pool.query(
        "SELECT password FROM dokter WHERE id_dokter = ?",
        [doctorId]
      );
      const storedPassword = doctorData[0].password;
      // Jika password lama tidak cocok, kirim respon 401 Unauthorized
      if (storedPassword !== oldPassword) {
        return res.status(401).json({ message: "Password lama salah" });
      }
      // Jika password lama benar, tambahkan bagian untuk mengubah password dalam query
      passwordQuery = ", password = ?";
      passwordParams.push(newPassword);
    }

    // Buat query untuk memperbarui data dokter
    const query = `
      UPDATE dokter
      SET nama = ?, no_hp = ?, email = ?, gender = ?, usia = ?, alamat = ?, spesialis = ?, lulusan = ?, pengalaman = ?${passwordQuery}
      WHERE id_dokter = ?
    `;

    // Jalankan query untuk memperbarui data dokter
    const [result] = await pool.query(query, passwordParams);

    // Jika tidak ada dokter yang terpengaruh (tidak ditemukan), kirim respon 404 Not Found
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Dapatkan data dokter yang telah diperbarui dari database
    const [updatedDoctor] = await pool.query(
      "SELECT id_dokter, nama, no_hp, email, gender, usia, alamat, spesialis, lulusan, pengalaman FROM dokter WHERE id_dokter = ?",
      [doctorId]
    );

    // Kirim data dokter yang telah diperbarui dalam respon
    res.json(updatedDoctor[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Logout dokter
export const logoutDoctor = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) return res.sendStatus(204); // No Content

  try {
    const [rows] = await pool.query(
      "SELECT * FROM dokter WHERE refresh_token = ?",
      [refreshToken]
    );
    if (rows.length === 0) return res.sendStatus(204); // No Content

    const doctor = rows[0];
    await pool.query(
      "UPDATE dokter SET refresh_token = NULL WHERE id_dokter = ?",
      [doctor.id_dokter]
    );

    res.clearCookie("refreshToken");
    return res.sendStatus(200); // OK
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mengupdate foto profil dokter
// Fungsi untuk mengunggah gambar ke Cloudinary
const uploadToCloudinary = async (filePath) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(
      filePath,
      {
        folder: "profile", // Ganti dengan folder yang sesuai di Cloudinary Anda
        overwrite: true,
        resource_type: "image", // Tipe resource yang diunggah (gambar)
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

// Controller untuk mengupdate foto profil dokter
export const updateDoctorPhoto = async (req, res) => {
  const doctorId = req.user.id; // Mendapatkan ID dokter dari token akses
  const newFoto = req.files.file; // Mendapatkan file gambar dari permintaan

  if (!newFoto) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    // Unggah file ke Cloudinary
    const cloudinaryResponse = await uploadToCloudinary(newFoto.tempFilePath);

    // Perbarui database dengan nama file baru dan URL gambar dari Cloudinary
    const { secure_url, public_id } = cloudinaryResponse;

    // Ambil foto lama dokter dari database untuk penghapusan
    const [doctorData] = await pool.query(
      "SELECT foto FROM dokter WHERE id_dokter = ?",
      [doctorId]
    );

    if (doctorData.length > 0) {
      const oldFoto = doctorData[0].foto;

      // Jika dokter memiliki foto profil sebelumnya, hapus dari Cloudinary
      if (oldFoto) {
        await cloudinary.v2.uploader.destroy(oldFoto);
      }

      // Update database dengan foto baru dan URL gambar
      await pool.query(
        "UPDATE dokter SET foto = ?, url_foto = ? WHERE id_dokter = ?",
        [public_id, secure_url, doctorId]
      );

      // Kirim URL gambar dalam tanggapan
      res.status(200).json({
        message: "Doctor photo updated successfully",
        photoUrl: secure_url,
      });
    } else {
      res.status(404).json({ message: "Doctor not found" });
    }
  } catch (error) {
    console.error("Error updating doctor photo:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fungsi untuk menghapus foto profil dokter
export const deleteDoctorPhoto = async (req, res) => {
  const doctorId = req.user.id; // Mendapatkan ID dokter dari token akses

  try {
    // Ambil data foto dokter dari database
    const [doctorData] = await pool.query(
      "SELECT foto FROM dokter WHERE id_dokter = ?",
      [doctorId]
    );

    if (doctorData.length > 0) {
      const oldFoto = doctorData[0].foto;

      // Jika dokter memiliki foto profil sebelumnya, hapus dari Cloudinary
      if (oldFoto) {
        await cloudinary.v2.uploader.destroy(oldFoto);
      }

      // Update database untuk menghapus referensi foto
      await pool.query(
        "UPDATE dokter SET foto = NULL, url_foto = NULL WHERE id_dokter = ?",
        [doctorId]
      );

      res.status(200).json({ message: "Doctor photo deleted successfully" });
    } else {
      res.status(404).json({ message: "Doctor not found" });
    }
  } catch (error) {
    console.error("Error deleting doctor photo:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fungsi untuk mengubah kata sandi dokter
export const changeDoctorPassword = async (req, res) => {
  const doctorId = req.user.id;
  const { oldPassword, newPassword } = req.body;

  try {
    const [doctorData] = await pool.query(
      "SELECT password FROM dokter WHERE id_dokter = ?",
      [doctorId]
    );
    const storedPassword = doctorData[0].password;

    const isPasswordValid = await bcrypt.compare(oldPassword, storedPassword);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid old password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE dokter SET password = ? WHERE id_dokter = ?", [
      hashedPassword,
      doctorId,
    ]);

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fungsi untuk menghapus akun dokter
export const deleteDoctorAccount = async (req, res) => {
  const doctorId = req.user.id;

  try {
    await pool.query("DELETE FROM dokter WHERE id_dokter = ?", [doctorId]);
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Doctor account deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Controller untuk mendapatkan seluruh data dokter
export const getAllDoctors = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id_dokter, nama, no_hp, email, gender, usia, alamat, spesialis, lulusan, pengalaman, url_foto FROM dokter"
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller untuk mendapatkan informasi detail dari dokter berdasarkan id_dokter
export const getDoctorById = async (req, res) => {
  const { id } = req.params; // Mendapatkan id_dokter dari URL
  try {
    const [rows] = await pool.query(
      "SELECT * FROM dokter WHERE id_dokter = ?",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
