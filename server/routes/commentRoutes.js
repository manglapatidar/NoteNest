import express from "express";
import commentController from "../controllers/commentController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();


// Add Comment (User)
router.post("/", protect, commentController.addComment);


// Get Comments by Note (Public)
router.get("/:noteId", commentController.getCommentsByNote);


// Update Comment (User)
router.put("/:id", protect, commentController.updateComment);


// Delete Comment (User / Admin)
router.delete("/:id", protect, commentController.deleteComment);


export default router;