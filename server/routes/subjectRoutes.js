import express from "express";
import subjectController from "../controllers/subjectController.js";
import protect from "../middleware/authMiddleware.js"
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

// Admin Route
router.post("/", protect, adminOnly, subjectController.createSubject);
router.delete("/:id", protect, adminOnly, subjectController.deleteSubject);

// Public Route
router.get("/", subjectController.getSubjects);

export default router;