import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import hewanRoutes from "./routes/hewanRoutes.js";
import { fileDir } from "./utils/filehandler.cjs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import morgan from "morgan";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000; // Default to port 3000 if not specified in environment variables

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173", // Change this to your frontend URL
  })
);

// Middleware for logging HTTP requests
app.use(morgan("dev"));

// Menyajikan folder uploads/profile secara publik
app.use("/uploads/profile", express.static(fileDir("profile")));

// Menyajikan folder uploads/hewan secara publik
app.use("/uploads/hewan", express.static(fileDir("hewan")));

app.use(cookieParser());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/hewan", hewanRoutes);

// Middleware for error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => console.log(`Server running at port ${port}`));
