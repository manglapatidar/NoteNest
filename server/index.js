import express from "express"
import dotenv from "dotenv"
import colors from "colors"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"
import connectDB from "./config/dbconfig.js"

import authRoutes from "./routes/authRoutes.js"
import errorHandler from "./middleware/errorHandler.js"
import subjectRoutes from "./routes/subjectRoutes.js"
import noteRoutes from "./routes/noteRoutes.js"
import ratingRoutes from "./routes/ratingRoutes.js"
import commentRoutes from "./routes/commentRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import summarizeRoute from "./routes/summarizeRoutes.js";

dotenv.config()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 8080
const app = express()

connectDB()

app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        
    ],
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health Check
app.get("/", (req, res) => {
  res.send("API is running...");
});

// API Routes
app.use("/api/auth", authRoutes)
app.use("/api/subjects", subjectRoutes)
app.use("/api/notes/summarize", summarizeRoute)
app.use("/api/notes", noteRoutes)
app.use("/api/rating", ratingRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/admin", adminRoutes)

// Static Files
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

const buildPath = path.resolve(__dirname, '../client/dist');
 
// if(process.env.NODE_ENV === "production"){
    app.use(express.static(buildPath));
 
    app.get('/*splat', (req, res) => {
        res.sendFile(path.join(buildPath, 'index.html'))
    });
 
 

// Error Handling
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})