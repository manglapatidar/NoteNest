import Subject from "../models/subjectModel.js";

// Add Subject (Admin)
const createSubject = async (req, res) => {
    const { name } = req.body;

    if (!name) {
        res.status(400);
        throw new Error("Subject name is required");
    }

    const subjectExists = await Subject.findOne({ name });

    if (subjectExists) {
        res.status(400);
        throw new Error("Subject already exists");
    }

    const subject = await Subject.create({ name });

    res.status(201).json(subject);
};


// Get All Subjects
const getSubjects = async (req, res) => {
    const subjects = await Subject.find().sort({ createdAt: -1 });
    res.status(200).json(subjects);
};


// Delete Subject (Admin)
const deleteSubject = async (req, res) => {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
        res.status(404);
        throw new Error("Subject not found");
    }

    await subject.deleteOne();

    res.status(200).json({ message: "Subject deleted" });
};

const subjectController = { createSubject, getSubjects, deleteSubject
};

export default subjectController;