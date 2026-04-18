import Comment from "../models/commentModel.js";
import Note from "../models/noteModel.js";

//  Add Comment
const addComment = async (req, res) => {
  try {
    const { noteId, text } = req.body;

    if (!noteId || !text) {
      return res.status(400).json({
        message: "noteId and text are required",
      });
    }

    // check note exists
    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    const comment = new Comment({
      userId: req.user._id,
      noteId,
      text,
    });

    await comment.save();

    res.status(201).json({
      message: "Comment added",
      comment,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error adding comment",
      error: error.message,
    });
  }
};


// Get Comments by Note
const getCommentsByNote = async (req, res) => {
  try {
    const comments = await Comment.find({
      noteId: req.params.noteId,
    })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);

  } catch (error) {
    res.status(500).json({
      message: "Error fetching comments",
      error: error.message,
    });
  }
};


// Delete Comment
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    // owner OR admin
    if (
      comment.userId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await comment.deleteOne();

    res.status(200).json({
      message: "Comment deleted",
    });

  } catch (error) {
    res.status(500).json({
      message: "Error deleting comment",
      error: error.message,
    });
  }
};


// Update Comment (optional but useful)
const updateComment = async (req, res) => {
  try {
    const { text } = req.body;

    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    // only owner
    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    comment.text = text || comment.text;

    await comment.save();

    res.status(200).json({
      message: "Comment updated",
      comment,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error updating comment",
      error: error.message,
    });
  }
};

const commentController = {addComment, getCommentsByNote, deleteComment, updateComment}

export default commentController;