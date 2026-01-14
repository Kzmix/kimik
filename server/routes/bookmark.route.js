import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import * as controller from "../controllers/bookmark.controller.js";

const router = express.Router();

router.get("/", requireAuth, controller.getBookmarks);
router.post("/:slug", requireAuth, controller.toggleBookmark);

export default router;