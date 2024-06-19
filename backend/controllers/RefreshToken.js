import jwt from "jsonwebtoken";
import pool from "../database/Database.js";

// users
export const refreshToken = async (req, res) => {
  const { refreshToken } = req.cookies;

  console.log("Received Refresh Token:", refreshToken);

  if (!refreshToken) return res.sendStatus(401); // Unauthorized

  try {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE refresh_token = ?",
      [refreshToken]
    );

    if (rows.length === 0) return res.sendStatus(403); // Forbidden

    const user = rows[0];

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || user.id_user !== decoded.id) return res.sendStatus(403); // Forbidden

        const accessToken = jwt.sign(
          { id: user.id_user, email: user.email },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "60m" }
        );

        res.json({ accessToken });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// dokter
export const refreshTokenDoctor = async (req, res) => {
  const { refreshToken } = req.cookies;

  console.log("Received Refresh Token:", refreshToken);

  if (!refreshToken) return res.sendStatus(401); // Unauthorized

  try {
    const [rows] = await pool.query(
      "SELECT * FROM dokter WHERE refresh_token = ?",
      [refreshToken]
    );

    if (rows.length === 0) return res.sendStatus(403); // Forbidden

    const doctor = rows[0];

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || doctor.id_dokter !== decoded.id) return res.sendStatus(403); // Forbidden

        const accessToken = jwt.sign(
          { id: doctor.id_dokter, email: doctor.email },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15m" }
        );

        res.json({ accessToken });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
