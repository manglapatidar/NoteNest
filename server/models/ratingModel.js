import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  noteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Note",
    required: true,
  },
  score: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
}, { timestamps: true });

// One user can rate a note only once
ratingSchema.index({ userId: 1, noteId: 1 }, { unique: true });

const Rate = mongoose.model("Rate", ratingSchema);
export default Rate;