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
import summarizeRoute from "./routes/summarizeRoutes.js"

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT || 5000
const app = express()

connectDB()

// CORS — allows both local dev and production
app.use(cors({
    origin: process.env.NODE_ENV === "production"
        ? process.env.CLIENT_URL || "https://notenest-qlyi.onrender.com"
        : "http://localhost:5173",
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// API Routes — summarize BEFORE notes to avoid route shadowing
app.use("/api/auth", authRoutes)
app.use("/api/subjects", subjectRoutes)
app.use("/api/notes/summarize", summarizeRoute)   // ← moved above /api/notes
app.use("/api/notes", noteRoutes)
app.use("/api/rating", ratingRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/admin", adminRoutes)

// Serve React build in production
const buildPath = path.resolve(__dirname, "../client/dist")

if (process.env.NODE_ENV === "production") {
    app.use(express.static(buildPath))

    // Express v5 wildcard syntax
    app.get("/*splat", (req, res) => {
        res.sendFile(path.join(buildPath, "index.html"), (err) => {
            if (err) {
                res.status(500).send("Build file index.html not found. Run 'npm run build' first.")
            }
        })
    })
} else {
    app.get("/", (req, res) => {
        res.send("API is running... (Development Mode)")
    })
}

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`SERVER IS RUNNING AT PORT : ${PORT}`.bgBlue.black)
})