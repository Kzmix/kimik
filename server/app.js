import dotenv from "dotenv";
dotenv.config({
  path: new URL("./config/.env", import.meta.url).pathname
});

import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.route.js";
import bookmarkRoutes from "./routes/bookmark.route.js";

/* ================================
   INIT
================================ */
const app = express();

/* ================================
   BASIC MIDDLEWARE
================================ */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================================
   SESSION
================================ */
if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is missing in .env");
}

app.use(session({
  name: "comic.sid",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  rolling: true,           // ⬅️ PENTING
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 // 1 hari
  }
}));

/* ================================
   STATIC FRONTEND (PALING PENTING)
================================ */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_PATH = path.join(__dirname, "../public");
/* ================================
   STATIC FILE (HANYA ASSET)
================================ */
app.use(express.static(PUBLIC_PATH, {
  index: false // ⬅️ PENTING
}));

/* ================================
   FRONTEND ROUTES (HTML)
================================ */

// HOME
app.get("/", (req, res) => {
  res.sendFile(path.join(PUBLIC_PATH, "index.html"));
});

// COMIC DETAIL
app.get("/comic/:slug", (req, res) => {
  res.sendFile(path.join(PUBLIC_PATH, "comic.html"));
});

// READER CLEAN URL
app.get("/comic/:slug/:chapter", (req, res) => {
  res.sendFile(path.join(PUBLIC_PATH, "reader.html"));
});

// reader
app.get("/read/:slug/:chapter", (req, res) => {
  res.sendFile(path.join(PUBLIC_PATH, "read.html"));
});

/* ================================
   API ROUTES (HARUS DI BAWAH)
================================ */
app.use("/api/auth", authRoutes);
app.use("/api/bookmarks", bookmarkRoutes);

export default app;