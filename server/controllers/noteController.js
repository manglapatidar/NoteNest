import Note from "../models/noteModel.js";
import mongoose from "mongoose";
import fs from "fs";

// 1. CREATE NOTE (User)
const createNote = async (req, res) => {
  try {
    const { title, subject, content } = req.body;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!title || !subject) {
      return res.status(400).json({ message: "Title and Subject are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(subject)) {
      return res.status(400).json({ message: "Invalid subject" });
    }

    const note = await Note.create({
      user: req.user._id,
      title,
      subject,
      content,
      fileUrl: req.file ? `/uploads/${req.file.filename}` : "",
      status: "pending",
    });

    const savedNote = await Note.findById(note._id)
      .populate("user", "name email")
      .populate("subject", "name");

    return res.status(201).json(savedNote);

  } catch (error) {
    return res.status(500).json({
      message: "Error creating note",
      error: error.message,
    });
  }
};


// 2. GET APPROVED NOTES (Public)
const getApprovedNotes = async (req, res) => {
  try {
    const { subject } = req.query;

    let filter = { status: "approved" };

    if (subject && mongoose.Types.ObjectId.isValid(subject)) {
      filter.subject = subject;
    }

    const notes = await Note.find(filter)
      .populate("user", "name email")
      .populate("subject", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json(notes);

  } catch (error) {
    return res.status(500).json({
      message: "Error fetching notes",
      error: error.message,
    });
  }
};


// 3. GET PENDING NOTES (Admin)
const getPendingNotes = async (req, res) => {
  try {
    const notes = await Note.find({ status: "pending" })
      .populate("user", "name email")
      .populate("subject", "name");

    return res.status(200).json(notes);

  } catch (error) {
    return res.status(500).json({
      message: "Error fetching pending notes",
      error: error.message,
    });
  }
};


// 4. APPROVE NOTE (Admin)
const approveNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    note.status = "approved";
    await note.save();

    return res.status(200).json({ message: "Note approved successfully" });

  } catch (error) {
    return res.status(500).json({
      message: "Error approving note",
      error: error.message,
    });
  }
};


// 5. REJECT NOTE (Admin)
const rejectNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    note.status = "rejected";
    await note.save();

    return res.status(200).json({ message: "Note rejected successfully" });

  } catch (error) {
    return res.status(500).json({
      message: "Error rejecting note",
      error: error.message,
    });
  }
};


// 6. DELETE NOTE (Owner or Admin)
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (
      note.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized to delete this note" });
    }

    if (note.fileUrl) {
      const filePath = `./server${note.fileUrl}`;
      fs.unlink(filePath, (err) => {
        if (err) console.log("File delete error:", err);
      });
    }

    await note.deleteOne();

    return res.status(200).json({ message: "Note deleted successfully" });

  } catch (error) {
    return res.status(500).json({
      message: "Error deleting note",
      error: error.message,
    });
  }
};


// 7. SAVE / UNSAVE NOTE
const toggleSaveNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user._id;

    const alreadySaved = note.saves.some(
      (id) => id.toString() === userId.toString()
    );

    if (alreadySaved) {
      note.saves = note.saves.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      note.saves.push(userId);
    }

    await note.save();

    return res.status(200).json({
      message: alreadySaved ? "Note unsaved" : "Note saved",
      totalSaves: note.saves.length,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error saving note",
      error: error.message,
    });
  }
};


// 8. GET NOTE BY ID
const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
      .populate("user", "name email")
      .populate("subject", "name");

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    return res.status(200).json(note);

  } catch (error) {
    return res.status(500).json({ message: "Error fetching note", error: error.message });
  }
};


// 9. GET MY NOTES
const getMyNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id })
      .populate("user", "name email")
      .populate("subject", "name")
      .sort({ createdAt: -1 });
    return res.status(200).json(notes);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching your notes", error: error.message });
  }
};


// 10. GET SAVED NOTES
const getSavedNotes = async (req, res) => {
  try {
    const notes = await Note.find({ saves: req.user._id })
      .populate("user", "name email")
      .populate("subject", "name")
      .sort({ createdAt: -1 });
    return res.status(200).json(notes);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching saved notes", error: error.message });
  }
};


// 11. UPDATE NOTE (Title + Content + Subject + File) — PATCH /:id
const updateNoteFile = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // ✅ Title update
    if (req.body.title && req.body.title.trim()) {
      note.title = req.body.title.trim();
    }

    // ✅ Content update
    if (req.body.content !== undefined) {
      note.content = req.body.content;
    }

    // ✅ Subject update
    if (req.body.subject && mongoose.Types.ObjectId.isValid(req.body.subject)) {
      note.subject = req.body.subject;
    }

    // ✅ File update — old file delete, new save
    if (req.file) {
      if (note.fileUrl) {
        const oldPath = `./server${note.fileUrl}`;
        fs.unlink(oldPath, (err) => {
          if (err) console.log("Old file delete error:", err);
        });
      }
      note.fileUrl  = `/uploads/${req.file.filename}`;
      note.fileName = req.file.originalname;
      note.fileType = req.file.mimetype;
      note.fileSize = req.file.size;
    }

    // ✅ Status wapis pending karo taaki admin re-approve kare
    note.status = "pending";

    await note.save();

    const updatedNote = await Note.findById(id)
      .populate("user", "name email")
      .populate("subject", "name");

    return res.status(200).json({
      message: "Note updated successfully",
      note: updatedNote,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error updating note",
      error: error.message,
    });
  }
};


// EXPORT
const noteController = {
  getMyNotes,
  getSavedNotes,
  getNoteById,
  createNote,
  getApprovedNotes,
  getPendingNotes,
  approveNote,
  rejectNote,
  deleteNote,
  toggleSaveNote,
  updateNoteFile,
};

export default noteController;