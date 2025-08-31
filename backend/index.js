import express from "express";
import cors from "cors";
import fs from "fs";
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import fetch from 'node-fetch';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

app.use(cors());
app.options('*', cors());
app.use(bodyParser.json({ limit: "10mb" }));

// PDF generation endpoint (remains the same)
app.post("/generate-pdf", (req, res) => {
  // ... your existing PDF generation logic
});

// --- UPDATED AI ENHANCEMENT ENDPOINT ---
const GEMINI_API_KEY = process.env.GOOGLE_API_KEY;
// THE ONLY CHANGE IS ON THE LINE BELOW
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

app.post("/enhance-text", async (req, res) => {
  const { text, context } = req.body;

  if (!text) {
    return res.status(400).json({ error: "No text provided for enhancement." });
  }
  
  if (!GEMINI_API_KEY || GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
    console.error("AI API key is missing or not configured in .env file.");
    return res.status(500).json({ error: "AI API key is not configured on the server. Please check your .env file." });
  }
  
  const prompt = `You are an expert resume writer. Rewrite the following text for a professional resume to maximize its ATS score. Focus on using strong action verbs, quantifying achievements where possible, and using clear, impactful language. The context for the text is a resume section titled "${context}". Do not add any introductory phrases like "Here is the rewritten text:". Just provide the enhanced text directly. Original text: "${text}" Enhanced text:`;

  try {
    const apiResponse = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!apiResponse.ok) {
      const errorBody = await apiResponse.json();
      console.error("Error from AI API:", errorBody.error);
      return res.status(apiResponse.status).json({ error: `Error from AI service: ${errorBody.error.message}` });
    }

    const data = await apiResponse.json();
    
    if (!data.candidates || !data.candidates[0].content.parts[0].text) {
        console.error("Unexpected response structure from AI API:", data);
        return res.status(500).json({ error: "Received an unexpected response structure from the AI service." });
    }
      
    const enhancedText = data.candidates[0].content.parts[0].text;
    res.json({ enhancedText: enhancedText.trim() });

  } catch (error) {
    console.error("Internal server error while calling AI service:", error);
    res.status(500).json({ error: "An internal error occurred while enhancing the text." });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));