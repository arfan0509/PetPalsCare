import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../database/Database.js";
import fs from "fs";

export const getUsers = async (req, res) => {
  const userId = req.user.id; // Mengambil ID pengguna dari token akses
  try {
    const [rows] = await pool.query(
      "SELECT id_user, nama, no_hp, email, gender, usia, alamat, url_foto FROM users WHERE id_user = ?",
      [userId]
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const registerUser = async (req, res) => {
  const {
    nama,
    no_hp,
    email,
    password,
    confirmPassword,
    gender,
    usia,
    alamat,
  } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const [existingUser] = await pool.query(
      "SELECT email FROM users WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (nama, no_hp, email, password, gender, usia, alamat) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [nama, no_hp, email, hashedPassword, gender, usia, alamat]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (rows.length === 0)
      return res.status(400).json({ message: "Invalid email or password" });

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid email or password" });

    const accessToken = jwt.sign(
      { id: user.id_user, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "60m" }
    );
    const refreshToken = jwt.sign(
      { id: user.id_user, email: user.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    await pool.query("UPDATE users SET refresh_token = ? WHERE id_user = ?", [
      refreshToken,
      user.id_user,
    ]);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  const userId = req.user.id; // Mengambil ID pengguna dari token akses
  const { nama, no_hp, email, gender, usia, alamat, oldPassword, newPassword } =
    req.body;

  try {
    // Periksa apakah ada permintaan untuk mengubah password
    let passwordQuery = "";
    const passwordParams = [nama, no_hp, email, gender, usia, alamat, userId];
    if (oldPassword && newPassword) {
      // Jika ada permintaan untuk mengubah password, periksa apakah password lama benar
      const [userData] = await pool.query(
        "SELECT password FROM users WHERE id_user = ?",
        [userId]
      );
      const storedPassword = userData[0].password;
      // Jika password lama tidak cocok, kirim respon 401 Unauthorized
      if (storedPassword !== oldPassword) {
        return res.status(401).json({ message: "Password lama salah" });
      }
      // Jika password lama benar, tambahkan bagian untuk mengubah password dalam query
      passwordQuery = ", password = ?";
      passwordParams.push(newPassword);
    }

    // Buat query untuk memperbarui data pengguna
    const query = `
      UPDATE users
      SET nama = ?, no_hp = ?, email = ?, gender = ?, usia = ?, alamat = ?${passwordQuery}
      WHERE id_user = ?
    `;

    // Jalankan query untuk memperbarui data pengguna
    const [result] = await pool.query(query, passwordParams);

    // Jika tidak ada pengguna yang terpengaruh (tidak ditemukan), kirim respon 404 Not Found
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Dapatkan data pengguna yang telah diperbarui dari database
    const [updatedUser] = await pool.query(
      "SELECT id_user, nama, no_hp, email, gender, usia, alamat FROM users WHERE id_user = ?",
      [userId]
    );

    // Kirim data pengguna yang telah diperbarui dalam respon
    res.json(updatedUser[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logoutUser = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) return res.sendStatus(204); // No Content

  try {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE refresh_token = ?",
      [refreshToken]
    );
    if (rows.length === 0) return res.sendStatus(204); // No Content

    const user = rows[0];
    await pool.query(
      "UPDATE users SET refresh_token = NULL WHERE id_user = ?",
      [user.id_user]
    );

    res.clearCookie("refreshToken");
    return res.sendStatus(200); // OK
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//upload gambar
export const updateUserPhoto = async (req, res) => {
  const userId = req.user.id; // Mengambil ID pengguna dari token akses
  const newFoto = req.file ? req.file.filename : null; // Mendapatkan nama file baru jika ada

  if (!newFoto) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    // Periksa apakah pengguna sebelumnya memiliki foto profil yang disimpan di server
    const [userData] = await pool.query(
      "SELECT foto FROM users WHERE id_user = ?",
      [userId]
    );
    const oldFoto = userData[0].foto;

    // Jika pengguna sebelumnya memiliki foto profil, hapus file lama dari sistem file
    if (oldFoto) {
      const oldFotoPath = `../uploads/profile/${oldFoto}`;
      if (fs.existsSync(oldFotoPath)) {
        fs.unlinkSync(oldFotoPath);
      }
    }

    // Update database dengan nama file baru dan URL gambar
    const photoDir = "/uploads/profile/";
    const photoUrl = `${req.protocol}://${req.get(
      "host"
    )}${photoDir}${newFoto}`;

    await pool.query(
      "UPDATE users SET foto = ?, url_foto = ? WHERE id_user = ?",
      [newFoto, photoUrl, userId]
    );

    // Kirim URL gambar dalam tanggapan
    res
      .status(200)
      .json({ message: "User photo updated successfully", photoUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fungsi untuk mengubah kata sandi pengguna
export const changePassword = async (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;

  try {
    const [userData] = await pool.query(
      "SELECT password FROM users WHERE id_user = ?",
      [userId]
    );
    const storedPassword = userData[0].password;

    const isPasswordValid = await bcrypt.compare(oldPassword, storedPassword);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid old password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password = ? WHERE id_user = ?", [
      hashedPassword,
      userId,
    ]);

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fungsi untuk menghapus foto profil pengguna
export const deletePhoto = async (req, res) => {
  const userId = req.user.id;

  try {
    const [userData] = await pool.query(
      "SELECT foto FROM users WHERE id_user = ?",
      [userId]
    );
    const oldFoto = userData[0].foto;

    if (oldFoto) {
      const oldFotoPath = `../uploads/profile/${oldFoto}`;
      if (fs.existsSync(oldFotoPath)) {
        fs.unlinkSync(oldFotoPath);
      }
    }

    await pool.query(
      "UPDATE users SET foto = NULL, url_foto = NULL WHERE id_user = ?",
      [userId]
    );

    res.status(200).json({ message: "User photo deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fungsi untuk menghapus akun pengguna
export const deleteAccount = async (req, res) => {
  const userId = req.user.id;

  try {
    await pool.query("DELETE FROM users WHERE id_user = ?", [userId]);
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "User account deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
