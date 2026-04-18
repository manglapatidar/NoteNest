import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true , "Please Enter Your Name"],
    },
    email: {
        type: String,
        required: [true , "Please Enter Your Email"],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true , "Please Enter Your Password"],
    },

    role: {
        type: String,
        enum: ["user", "admin"],   // only these values allowed
        default: "user"
    }

}, {
    timestamps: true
});

const user = mongoose.model('User', userSchema);
export default user;