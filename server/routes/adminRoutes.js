import express from "express";
import adminController from "../controllers/adminController.js";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

// Stats
router.get("/stats", protect, adminOnly, adminController.getStats);

// Notes
router.get("/notes", protect, adminOnly, adminController.getNotes);
router.delete("/notes/:id", protect, adminOnly, adminController.deleteNote);

export default router;