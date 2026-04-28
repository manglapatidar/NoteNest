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

const PORT = process.env.PORT || 5000
const app = express()

connectDB()

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://notenest-qlyi.onrender.com"
    ],
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/auth", authRoutes)
app.use("/api/subjects", subjectRoutes)
app.use("/api/notes", noteRoutes)


app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.use("/api/rating", ratingRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/admin", adminRoutes)


app.use("/api/notes/summarize", summarizeRoute);

const buildPath = path.resolve(__dirname, '../client/dist');

// Static File Serving & SPA Routing
if (process.env.NODE_ENV === "production") {
    // Serve static files from the build directory
    app.use(express.static(buildPath));

    // Express v5 requires a named parameter for wildcards (/*splat)
    app.get('/*splat', (req, res) => {
        res.sendFile(path.join(buildPath, 'index.html'))
        // , (err) => {
        //     if (err) {
        //         // If index.html is missing , this provides a clearer error
        //         res.status(500).send("Build File index.html not found. Ensure you ran 'npm run build'")
        //     }
        // });
    });
// } else {
//     app.get("/", (req, res) => {
//         res.send("API is running...(Development Mode)");
//     });
}


app.use(errorHandler)



app.listen(PORT, () => {
    console.log(`SERVER IS RUNNING AT PORT : ${PORT}`.bgBlue.black)
})