import express from "express";
import { addOrUpdateRating, getRatingsByNote, getAverageRating, deleteRating} from "../controllers/ratingController.js";

import  protect  from "../middleware/authMiddleware.js";

const router = express.Router();


//  Add / Update Rating
router.post("/", protect, addOrUpdateRating);


//  Get all ratings of a note
router.get("/:noteId", getRatingsByNote);


//  Get average rating of a note
router.get("/average/:noteId", getAverageRating);


//  Delete rating
router.delete("/:id", protect, deleteRating);


export default router;