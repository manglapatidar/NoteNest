import Rate from "../models/ratingModel.js";
import Note from "../models/noteModel.js";
import mongoose from "mongoose";


// 1️ ADD OR UPDATE RATING
export const addOrUpdateRating = async (req, res) => {
  try {
    const { noteId, score } = req.body;

    if (!noteId || !score) {
      return res.status(400).json({
        message: "noteId and score are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      return res.status(400).json({ message: "Invalid noteId" });
    }

    if (score < 1 || score > 5) {
      return res.status(400).json({
        message: "Score must be between 1 and 5",
      });
    }

    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    // find existing rating
    let rating = await Rate.findOne({
      userId: req.user._id,
      noteId,
    });

    if (rating) {
      rating.score = score;
      await rating.save();
    } else {
      rating = await Rate.create({
        userId: req.user._id,
        noteId,
        score,
      });
    }

    // Calculate average rating
    const ratings = await Rate.find({ noteId });

    const avg =
      ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length;

    // Update note avgRating
    await Note.findByIdAndUpdate(noteId, {
      avgRating: avg.toFixed(1),
    });

    res.status(200).json({
      message: "Rating saved",
      rating,
      avgRating: avg.toFixed(1),
    });

  } catch (error) {
    res.status(500).json({
      message: "Error in rating",
      error: error.message,
    });
  }
};


// 2️ GET ALL RATINGS OF A NOTE
export const getRatingsByNote = async (req, res) => {
  try {
    const ratings = await Rate.find({
      noteId: req.params.noteId,
    }).populate("userId", "name email");

    res.status(200).json(ratings);

  } catch (error) {
    res.status(500).json({
      message: "Error fetching ratings",
      error: error.message,
    });
  }
};


// 3️ GET AVERAGE RATING
export const getAverageRating = async (req, res) => {
  try {
    const ratings = await Rate.find({
      noteId: req.params.noteId,
    });

    if (ratings.length === 0) {
      return res.status(200).json({
        avgRating: 0,
        totalRatings: 0,
      });
    }

    const total = ratings.reduce(
      (sum, r) => sum + r.score,
      0
    );

    const avg = total / ratings.length;

    res.status(200).json({
      avgRating: avg.toFixed(1),
      totalRatings: ratings.length,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error calculating average rating",
      error: error.message,
    });
  }
};


// 4️ DELETE RATING
export const deleteRating = async (req, res) => {
  try {
    const rating = await Rate.findById(req.params.id);

    if (!rating) {
      return res.status(404).json({
        message: "Rating not found",
      });
    }

    if (rating.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    const noteId = rating.noteId;

    await rating.deleteOne();

    // Recalculate avg after delete
    const ratings = await Rate.find({ noteId });

    const avg =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length
        : 0;

    await Note.findByIdAndUpdate(noteId, {
      avgRating: avg.toFixed(1),
    });

    res.status(200).json({
      message: "Rating deleted",
    });

  } catch (error) {
    res.status(500).json({
      message: "Error deleting rating",
      error: error.message,
    });
  }
};