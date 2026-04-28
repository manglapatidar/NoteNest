import Note from "../models/noteModel.js";

const getStats = async (req, res) => {
  try {
    const stats = await Note.aggregate([
      { $match: { status: "approved" } },
      {
        $group: {
          _id: "$subject",
          totalNotes: { $sum: 1 },
          avgRating: { $avg: "$avgRating" }
        }
      },
      {
        $lookup: {
          from: "subjects",
          localField: "_id",
          foreignField: "_id",
          as: "subject"
        }
      },
      {
        $unwind: {
          path: "$subject",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 0,
          subject: "$subject.name",
          totalNotes: 1,
          avgRating: { $round: ["$avgRating", 1] }
        }
      }
    ]);

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats", error: error.message });
  }
};

const getNotes = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const notes = await Note.find(filter)
      .populate("user", "name email")
      .populate("subject", "name")  
      .sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notes", error: error.message });
  }
};

const deleteNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.status(200).json({ message: "Note deleted", id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: "Error deleting note", error: error.message });
  }
};

const adminController = { getStats, getNotes, deleteNote };
export default adminController;