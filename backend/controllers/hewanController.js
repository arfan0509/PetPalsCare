import pool from "../database/Database.js";
import fs from "fs";

// Fungsi untuk mendapatkan hewan dengan informasi pengguna dan foto_hewan
export const getHewanWithUser = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT h.id_hewan, h.nama AS nama, h.jenis_hewan, h.gender, h.usia, h.warna, h.lokasi, h.tgl_publish, h.deskripsi, h.foto_utama, h.url_fotoutama,
             u.nama AS user_nama, u.alamat AS user_lokasi, u.no_hp AS user_no_hp,
             fh.id_foto, fh.foto AS foto_hewan, fh.url_foto
      FROM hewan h
      JOIN users u ON h.users_id_user = u.id_user
      LEFT JOIN foto_hewan fh ON h.id_hewan = fh.hewan_id_hewan
    `);
    // Group rows by hewan_id to combine multiple photos of the same hewan
    const groupedRows = {};
    rows.forEach((row) => {
      if (!groupedRows[row.id_hewan]) {
        // Initialize hewan data
        groupedRows[row.id_hewan] = {
          id_hewan: row.id_hewan,
          nama: row.nama,
          jenis_hewan: row.jenis_hewan,
          gender: row.gender,
          usia: row.usia,
          warna: row.warna,
          lokasi: row.lokasi,
          tgl_publish: row.tgl_publish,
          deskripsi: row.deskripsi,
          foto_utama: row.foto_utama,
          url_fotoutama: row.url_fotoutama,
          user_nama: row.user_nama,
          user_lokasi: row.user_lokasi,
          user_no_hp: row.user_no_hp,
          foto_hewan: [],
        };
      }
      // Add photo data if exists
      if (row.id_foto) {
        groupedRows[row.id_hewan].foto_hewan.push({
          id_foto: row.id_foto,
          foto_hewan: row.foto_hewan,
          url_foto: row.url_foto,
        });
      }
    });
    // Convert groupedRows object to array
    const hewanWithPhotos = Object.values(groupedRows);
    res.status(200).json(hewanWithPhotos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fungsi untuk mendapatkan hewan berdasarkan ID hewan
export const getHewanById = async (req, res) => {
  const hewanId = req.params.id;

  try {
    // Query untuk mendapatkan data hewan berdasarkan id_hewan
    const [rows] = await pool.query(
      `
      SELECT 
    h.id_hewan, h.nama AS nama, h.jenis_hewan, h.gender, h.usia, h.warna, h.lokasi, 
    DATE_FORMAT(h.tgl_publish, '%d %M %Y') AS tgl_publish, 
    h.deskripsi, h.foto_utama, h.url_fotoutama,
    u.nama AS user_nama, u.alamat AS user_lokasi, u.no_hp AS user_no_hp, u.url_foto AS user_url_foto,
    fh.id_foto, fh.foto AS foto_hewan, fh.url_foto
FROM hewan h
JOIN users u ON h.users_id_user = u.id_user
LEFT JOIN foto_hewan fh ON h.id_hewan = fh.hewan_id_hewan
WHERE h.id_hewan = ?

    `,
      [hewanId]
    );

    // Jika tidak ada data hewan dengan id yang diminta, kembalikan respons 404
    if (rows.length === 0) {
      return res.status(404).json({ message: "Hewan not found" });
    }

    // Group rows by hewan_id to combine multiple photos of the same hewan
    const groupedRows = {};
    rows.forEach((row) => {
      if (!groupedRows[row.id_hewan]) {
        // Initialize hewan data
        groupedRows[row.id_hewan] = {
          id_hewan: row.id_hewan,
          nama: row.nama,
          jenis_hewan: row.jenis_hewan,
          gender: row.gender,
          usia: row.usia,
          warna: row.warna,
          lokasi: row.lokasi,
          tgl_publish: row.tgl_publish,
          deskripsi: row.deskripsi,
          foto_utama: row.foto_utama,
          url_fotoutama: row.url_fotoutama,
          user_nama: row.user_nama,
          user_lokasi: row.user_lokasi,
          user_no_hp: row.user_no_hp,
          user_url_foto: row.user_url_foto,
          foto_hewan: [],
        };
      }
      // Add photo data if exists
      if (row.id_foto) {
        groupedRows[row.id_hewan].foto_hewan.push({
          id_foto: row.id_foto,
          foto_hewan: row.foto_hewan,
          url_foto: row.url_foto,
        });
      }
    });

    // Convert groupedRows object to array
    const hewanWithPhotos = Object.values(groupedRows);
    res.status(200).json(hewanWithPhotos[0]); // Return the first element assuming only one hewan with given id
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fungsi untuk mendapatkan hewan berdasarkan ID pengguna yang login
export const getHewanByUserLogin = async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await pool.query(
      `
      SELECT h.id_hewan, h.nama AS nama, h.jenis_hewan, h.gender, h.usia, h.warna, h.lokasi, h.tgl_publish, h.deskripsi, h.foto_utama, h.url_fotoutama,
             u.nama AS user_nama, u.alamat AS user_lokasi, u.no_hp AS user_no_hp,
             fh.id_foto, fh.foto AS foto_hewan, fh.url_foto
      FROM hewan h
      JOIN users u ON h.users_id_user = u.id_user
      LEFT JOIN foto_hewan fh ON h.id_hewan = fh.hewan_id_hewan
      WHERE h.users_id_user = ?
    `,
      [userId]
    );

    // Group rows by hewan_id to combine multiple photos of the same hewan
    const groupedRows = {};
    rows.forEach((row) => {
      if (!groupedRows[row.id_hewan]) {
        // Initialize hewan data
        groupedRows[row.id_hewan] = {
          id_hewan: row.id_hewan,
          nama: row.nama,
          jenis_hewan: row.jenis_hewan,
          gender: row.gender,
          usia: row.usia,
          warna: row.warna,
          lokasi: row.lokasi,
          tgl_publish: row.tgl_publish,
          deskripsi: row.deskripsi,
          foto_utama: row.foto_utama,
          url_fotoutama: row.url_fotoutama,
          user_nama: row.user_nama,
          user_lokasi: row.user_lokasi,
          user_no_hp: row.user_no_hp,
          foto_hewan: [],
        };
      }
      // Add photo data if exists
      if (row.id_foto) {
        groupedRows[row.id_hewan].foto_hewan.push({
          id_foto: row.id_foto,
          foto_hewan: row.foto_hewan,
          url_foto: row.url_foto,
        });
      }
    });

    // Convert groupedRows object to array
    const hewanWithPhotos = Object.values(groupedRows);
    res.status(200).json(hewanWithPhotos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fungsi untuk mengupload hewan dan foto
export const uploadHewan = async (req, res) => {
  const {
    nama,
    jenis_hewan,
    gender,
    usia,
    warna,
    lokasi,
    tgl_publish,
    deskripsi,
  } = req.body;
  const userId = req.user.id;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No main photo uploaded" });
  }

  try {
    // Mulai transaksi
    await pool.query("START TRANSACTION");

    // URL untuk foto utama
    const fotoUtamaUrl = `${req.protocol}://${req.get("host")}/uploads/hewan/${
      file.filename
    }`;

    // Insert data hewan ke dalam tabel hewan
    const [result] = await pool.query(
      "INSERT INTO hewan (nama, jenis_hewan, gender, usia, warna, lokasi, tgl_publish, deskripsi, foto_utama, url_fotoutama, users_id_user) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        nama,
        jenis_hewan,
        gender,
        usia,
        warna,
        lokasi,
        tgl_publish,
        deskripsi,
        file.filename,
        fotoUtamaUrl,
        userId,
      ]
    );

    // Commit transaksi
    await pool.query("COMMIT");

    res.status(201).json({
      message: "Hewan uploaded successfully",
      hewanId: result.insertId,
    });
  } catch (error) {
    // Rollback transaksi jika terjadi kesalahan
    await pool.query("ROLLBACK");

    // Hapus file yang diunggah jika terjadi kesalahan
    if (file) {
      const filePath = `../uploads/hewan/${file.filename}`;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fungsi untuk mengupload foto hewan ke dalam tabel foto_hewan
export const uploadFotoHewan = async (req, res) => {
  const hewanId = req.params.id;
  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  try {
    // Cek jumlah foto yang sudah ada untuk hewan tersebut
    const [existingPhotos] = await pool.query(
      "SELECT COUNT(*) AS photoCount FROM foto_hewan WHERE hewan_id_hewan = ?",
      [hewanId]
    );
    const photoCount = existingPhotos[0].photoCount;

    // Jika jumlah foto melebihi 5, batalkan upload
    if (photoCount + files.length > 5) {
      // Hapus file yang diunggah jika tidak valid
      files.forEach((file) => {
        const filePath = `../uploads/hewan/${file.filename}`;
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
      return res
        .status(400)
        .json({ message: "A hewan can only have up to 5 photos" });
    }

    // Insert foto ke dalam tabel foto_hewan
    await Promise.all(
      files.map(async (file) => {
        const photoUrl = `${req.protocol}://${req.get("host")}/uploads/hewan/${
          file.filename
        }`;
        await pool.query(
          "INSERT INTO foto_hewan (hewan_id_hewan, foto, url_foto) VALUES (?, ?, ?)",
          [hewanId, file.filename, photoUrl]
        );
      })
    );

    res.status(201).json({ message: "Photos uploaded successfully" });
  } catch (error) {
    // Hapus file yang diunggah jika terjadi kesalahan
    files.forEach((file) => {
      const filePath = `../uploads/hewan/${file.filename}`;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fungsi Delete Data Hewan Beserta Fotonya
export const deleteHewan = async (req, res) => {
  const hewanId = req.params.id;
  const userId = req.user.id;

  try {
    // Ambil nama file gambar utama terkait dengan hewan yang akan dihapus
    const [hewanData] = await pool.query(
      "SELECT foto_utama FROM hewan WHERE id_hewan = ? AND users_id_user = ?",
      [hewanId, userId]
    );

    if (hewanData.length > 0) {
      const fotoUtama = hewanData[0].foto_utama;
      const fotoUtamaPath = `../uploads/hewan/${fotoUtama}`;
      if (fs.existsSync(fotoUtamaPath)) {
        fs.unlinkSync(fotoUtamaPath);
      }
    }

    // Ambil nama file gambar dari tabel foto_hewan terkait dengan hewan yang akan dihapus
    const [fotoHewanRows] = await pool.query(
      "SELECT foto FROM foto_hewan WHERE hewan_id_hewan = ?",
      [hewanId]
    );

    // Hapus file foto dari sistem
    fotoHewanRows.forEach((row) => {
      const fotoPath = `../uploads/hewan/${row.foto}`;
      if (fs.existsSync(fotoPath)) {
        fs.unlinkSync(fotoPath);
      }
    });

    // Hapus entri foto dari tabel foto_hewan
    await pool.query("DELETE FROM foto_hewan WHERE hewan_id_hewan = ?", [
      hewanId,
    ]);

    // Hapus data hewan dari tabel hewan
    const [result] = await pool.query(
      "DELETE FROM hewan WHERE id_hewan = ? AND users_id_user = ?",
      [hewanId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Hewan not found" });
    }

    res.status(200).json({ message: "Hewan deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fungsi untuk mencari hewan berdasarkan jenis_hewan
export const searchHewanByJenis = async (req, res) => {
  const { jenis_hewan } = req.query; // Ambil jenis_hewan dari query parameters

  try {
    // Query untuk mencari hewan berdasarkan jenis_hewan
    const [rows] = await pool.query(
      `
      SELECT h.id_hewan, h.nama AS nama, h.jenis_hewan, h.gender, h.usia, h.warna, h.lokasi, h.tgl_publish, h.deskripsi, h.foto_utama, h.url_fotoutama,
             u.nama AS user_nama, u.alamat AS user_lokasi, u.no_hp AS user_no_hp,
             fh.id_foto, fh.foto AS foto_hewan, fh.url_foto
      FROM hewan h
      JOIN users u ON h.users_id_user = u.id_user
      LEFT JOIN foto_hewan fh ON h.id_hewan = fh.hewan_id_hewan
      WHERE h.jenis_hewan LIKE ?
    `,
      [`%${jenis_hewan}%`] // Gunakan LIKE '%jenis_hewan%' untuk pencarian yang fleksibel
    );

    // Jika tidak ada hasil, kembalikan respons 404
    if (rows.length === 0) {
      return res.status(404).json({ message: "No hewan found" });
    }

    // Group rows by hewan_id to combine multiple photos of the same hewan
    const groupedRows = {};
    rows.forEach((row) => {
      if (!groupedRows[row.id_hewan]) {
        // Initialize hewan data
        groupedRows[row.id_hewan] = {
          id_hewan: row.id_hewan,
          nama: row.nama,
          jenis_hewan: row.jenis_hewan,
          gender: row.gender,
          usia: row.usia,
          warna: row.warna,
          lokasi: row.lokasi,
          tgl_publish: row.tgl_publish,
          deskripsi: row.deskripsi,
          foto_utama: row.foto_utama,
          url_fotoutama: row.url_fotoutama,
          user_nama: row.user_nama,
          user_lokasi: row.user_lokasi,
          user_no_hp: row.user_no_hp,
          foto_hewan: [],
        };
      }
      // Add photo data if exists
      if (row.id_foto) {
        groupedRows[row.id_hewan].foto_hewan.push({
          id_foto: row.id_foto,
          foto_hewan: row.foto_hewan,
          url_foto: row.url_foto,
        });
      }
    });

    // Convert groupedRows object to array
    const hewanWithPhotos = Object.values(groupedRows);
    res.status(200).json(hewanWithPhotos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
