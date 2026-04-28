import express from "express";
import protect from "../middleware/authMiddleware.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import pdfParse from "pdf-parse";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Note from "../models/noteModel.js";
import fetch from "node-fetch";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// POST /api/notes/summarize
router.post("/", protect, async (req, res) => {
  console.log("--- Summary Request Started ---");
  
  try {
    const { content, pdfBase64, mimeType, noteId } = req.body;
    let textToSummarize = "";

    // 1. Try to get text from disk if noteId is present
    if (noteId) {
      try {
        const note = await Note.findById(noteId);
        if (note && note.fileUrl && note.fileUrl.toLowerCase().endsWith('.pdf')) {
          const fileName = note.fileUrl.split('/').pop();
          const filePath = path.join(__dirname, '..', 'uploads', fileName);
          
          if (fs.existsSync(filePath)) {
            console.log("Found file on disk, parsing...");
            const buffer = fs.readFileSync(filePath);
            const pdfData = await pdfParse(buffer);
            textToSummarize = pdfData.text;
          }
        } else if (note && note.content) {
          textToSummarize = note.content;
        }
      } catch (err) {
        console.error("Disk extraction error:", err.message);
      }
    }

    // 2. Fallback to base64 if disk failed or noteId not provided
    if (!textToSummarize && pdfBase64) {
      try {
        console.log("Attempting base64 PDF parse...");
        const buffer = Buffer.from(pdfBase64, "base64");
        const pdfData = await pdfParse(buffer);
        textToSummarize = pdfData.text;
      } catch (err) {
        console.error("Base64 parse error:", err.message);
      }
    }

    // 3. Fallback to raw content
    if (!textToSummarize && content) {
      textToSummarize = content;
    }

    if (!textToSummarize || textToSummarize.trim().length < 5) {
      return res.status(400).json({ message: "No readable text found in the note or PDF." });
    }

    // 4. AI Processing using Auto-Discovery
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is missing from .env");

    let aiResponse = "";
    let lastError = "";

    try {
      console.log("Discovering available models...");
      const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
      const listRes = await fetch(listUrl);
      const listData = await listRes.json();
      
      // Filter for models that support generateContent
      const availableModels = (listData.models || [])
        .filter(m => m.supportedGenerationMethods.includes('generateContent'))
        .map(m => m.name);

      console.log("Found available models:", availableModels);

      if (availableModels.length === 0) {
        throw new Error("No compatible Gemini models found for this API key.");
      }

      // Try the best models first if they exist in the list
      const preferred = ["models/gemini-1.5-flash", "models/gemini-1.5-pro", "models/gemini-pro"];
      const modelsToTry = [...new Set([...preferred.filter(p => availableModels.includes(p)), ...availableModels])];

      for (const modelPath of modelsToTry) {
        try {
          console.log(`Trying model: ${modelPath}...`);
          // modelPath is already in "models/name" format from the API
          const url = `https://generativelanguage.googleapis.com/v1beta/${modelPath}:generateContent?key=${apiKey}`;
          
          const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{
                parts: [{ text: `Summarize this text in 5 bullet points:\n\n${textToSummarize.substring(0, 10000)}` }]
              }]
            })
          });

          const result = await response.json();
          if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
            aiResponse = result.candidates[0].content.parts[0].text;
            console.log(`Success with ${modelPath}!`);
            break;
          } else {
            lastError = result.error?.message || "Unknown error";
          }
        } catch (err) {
          lastError = err.message;
        }
      }
    } catch (discoveryErr) {
      lastError = discoveryErr.message;
    }

    if (!aiResponse) {
      throw new Error(`AI failed all attempts. Last error: ${lastError}`);
    }

    // 5. Clean and return
    const points = aiResponse
      .split('\n')
      .map(p => p.replace(/^[^a-zA-Z0-9]+/, '').trim())
      .filter(p => p.length > 3)
      .slice(0, 5);

    console.log("Summary generated successfully");
    return res.status(200).json({ summary: points });

  } catch (error) {
    console.error("CRITICAL SUMMARY ERROR:", error.message);
    return res.status(500).json({ 
      message: "Summarization failed", 
      error: error.message 
    });
  }
});

// GET /api/notes/summarize/models (Debug)
router.get("/models", protect, async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;