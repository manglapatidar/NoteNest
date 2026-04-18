import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";
import noteController from "../controllers/noteController.js";

const router = express.Router();

// Public Routes
router.get("/", noteController.getApprovedNotes);

// Specific routes
router.get("/my-notes", protect, noteController.getMyNotes);
router.get("/saved", protect, noteController.getSavedNotes);
router.get("/pending", protect, adminOnly, noteController.getPendingNotes);

// Param routes 
router.get("/:id", noteController.getNoteById);
router.patch("/:id/approve", protect, adminOnly, noteController.approveNote);
router.put("/:id/reject", protect, adminOnly, noteController.rejectNote);
router.post("/", protect, upload.single("file"), noteController.createNote);
router.put("/save/:id", protect, noteController.toggleSaveNote);
router.patch("/:id", protect, upload.single("file"), noteController.updateNoteFile);
router.delete("/:id", protect, noteController.deleteNote);

export default router;