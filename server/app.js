import dotenv from "dotenv";
dotenv.config({
  path: new URL("./config/.env", import.meta.url).pathname
});

import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import bookmarkRoutes from "./routes/bookmark.route.js";

/* ================================
   INIT
================================ */
const app = express();

/* ================================
   CORS (HARUS PALING ATAS)
================================ */
app.use(cors({
  origin: [
    "https://rexcom.netlify.app",
    "https://controls-highlight-blake-picture.trycloudflare.com",
    "http://localhost:5000"
  ],
  credentials: true
}));

/* ================================
   BASIC MIDDLEWARE
================================ */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================================
   SESSION (WAJIB BENAR)
================================ */
if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is missing in .env");
}

app.use(session({
  name: "comic.sid",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    httpOnly: true,
    sameSite: "none", // ⬅️ WAJIB
    secure: true,     // ⬅️ WAJIB (HTTPS)
    maxAge: 1000 * 60 * 60 * 24
  }
}));

/* ================================
   STATIC FILE
================================ */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_PATH = path.join(__dirname, "../public");

app.use(express.static(PUBLIC_PATH, { index: false }));

/* ================================
   FRONTEND ROUTES
================================ */
app.get("/", (req, res) => {
  res.sendFile(path.join(PUBLIC_PATH, "index.html"));
});

app.get("/comic/:slug", (req, res) => {
  res.sendFile(path.join(PUBLIC_PATH, "comic.html"));
});

app.get("/comic/:slug/:chapter", (req, res) => {
  res.sendFile(path.join(PUBLIC_PATH, "reader.html"));
});

/* ================================
   API ROUTES
================================ */
app.use("/api/auth", authRoutes);
app.use("/api/bookmarks", bookmarkRoutes);

export default app;