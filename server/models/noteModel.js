import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  title: {
    type: String,
    required: [true, "Please enter note title"],
  },

  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: [true, "Please select subject"],
  },

  content: {
    type: String,
    default: "",
  },

  fileUrl: {
    type: String,
    default: "",
  },

  fileName: {
    type: String,
    default: "",
  },

  fileType: {
    type: String,
    default: "",
  },

  fileSize: {
    type: Number,
    default: 0,
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },

  avgRating: {
    type: Number,
    default: 0,
  },

  saves: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
}, {
  timestamps: true,
});

const Note = mongoose.model("Note", noteSchema);

export default Note;