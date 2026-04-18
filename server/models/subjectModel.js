import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Please enter subject name"],
        unique: true,
       
    }

}, {
    timestamps: true
});

const Subject = mongoose.model("Subject", subjectSchema);

export default Subject;