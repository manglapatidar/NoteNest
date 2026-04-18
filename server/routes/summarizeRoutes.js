import express from "express";
import protect from "../middleware/authMiddleware.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import pdfParse from "pdf-parse";

dotenv.config();

const router = express.Router();

// POST /api/notes/summarize
router.post("/", protect, async (req, res) => {
  try {
    const { content, pdfBase64, mimeType } = req.body;
    let textToSummarize = "";

    console.log("Incoming to summarize:", { hasContent: !!content, hasPdfBase64: !!pdfBase64 });

    // Handle PDF base64
    if (pdfBase64 && mimeType === "application/pdf") {
      try {
        const buffer = Buffer.from(pdfBase64, "base64");
        
        // Use native pdf-parse for reliable Node.js server-side extraction
        const pdfData = await pdfParse(buffer);
        textToSummarize = pdfData.text;

        // Safety limit to avoid huge payload size
        textToSummarize = textToSummarize.slice(0, 30000);
        console.log(" Extracted PDF text length:", textToSummarize.length);
      } catch (err) {
        console.error("PDF parsing failed:", err);
        return res.status(500).json({ message: "Failed to read PDF" });
      }
    } else if (content && content.trim()) {
      textToSummarize = content.trim();
    } else {
      return res.status(400).json({ message: "No content available to summarize" });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("Gemini API key not configured");
      return res.status(500).json({ message: "Gemini API key not configured" });
    }

    // Initialize Generative AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Summarize the following content in exactly 5 concise bullet points. 
Return only the bullet points, no extra text.
Content: ${textToSummarize}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Process text into 5 bullet points
    const points = responseText
      .split("\n")
      .map((line) => line.replace(/^[•\-\*\d\.\)\s]+/, "").trim())
      .filter(Boolean)
      .slice(0, 5);

    return res.status(200).json({ summary: points });

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({
      message: "Failed to generate summary",
      error: error.message,
    });
  }
});

export default router;