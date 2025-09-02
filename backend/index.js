import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// --- API Endpoints ---

/**
 * @route   POST /generate-pdf
 * @desc    Generates a PDF from a LaTeX string
 * @access  Public
 */
app.post('/generate-pdf', (req, res) => {
    const { tex } = req.body;

    if (!tex) {
        return res.status(400).send('Missing TeX content.');
    }

    const fileName = `resume_${Date.now()}`;
    const texPath = path.join(__dirname, `${fileName}.tex`);
    const pdfPath = path.join(__dirname, `${fileName}.pdf`);

    fs.writeFile(texPath, tex, (err) => {
        if (err) {
            console.error('Error writing .tex file:', err);
            return res.status(500).send('Error creating .tex file.');
        }

        exec(`pdflatex -output-directory=${__dirname} ${texPath}`, (error, stdout, stderr) => {
            // Cleanup the temporary files
            fs.unlink(texPath, () => {});
            fs.unlink(path.join(__dirname, `${fileName}.aux`), () => {});
            fs.unlink(path.join(__dirname, `${fileName}.log`), () => {});

            if (error) {
                console.error('PDF Generation Error:', stderr);
                return res.status(500).send('Error generating PDF.');
            }

            res.sendFile(pdfPath, (err) => {
                if (err) {
                    console.error('Error sending PDF file:', err);
                }
                // Cleanup the PDF file after sending
                fs.unlink(pdfPath, () => {});
            });
        });
    });
});


/**
 * @route   POST /enhance-text
 * @desc    Enhances a given text using Google Generative AI
 * @access  Public
 */
app.post('/enhance-text', async (req, res) => {
  const { text, context } = req.body;
  const GEMINI_API_KEY = process.env.GOOGLE_API_KEY;

  if (!text || !context) {
      return res.status(400).json({ error: 'Text and context are required.' });
  }

  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
      console.error('AI API key is missing or not configured in .env file.');
      return res.status(500).json({ error: 'AI API key is not configured.' });
  }
  
  // Note: The v1beta endpoint might change. Consider using the official Google AI SDK for stability.
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

  const prompt = `You are an expert resume writer and an ATS (Applicant Tracking System) optimization specialist. Your task is to rewrite the following resume text to achieve a top-tier ATS score (above 90%). The text is from the "${context}" section.

  Follow these rules strictly:
  1.  **Quantify Achievements:** This is the most critical rule. If the original text has numbers, use them. If not, you MUST rephrase the statement to include a placeholder like [Number], [Percentage]%, or $[Amount] to prompt the user to add a specific metric. For example, transform 'Improved efficiency' into 'Improved operational efficiency by [Percentage]% by implementing a new automation script'.
  2.  **Use Strong Action Verbs:** Start every bullet point with a powerful and specific action verb (e.g., 'Architected', 'Revitalized', 'Negotiated', 'Streamlined'). Avoid weak or common verbs like 'Managed', 'Led', or 'Responsible for'.
  3.  **Eliminate Buzzwords:** Strictly remove all clichés, corporate jargon, and vague buzzwords. Do not use phrases like 'team player', 'results-driven', 'synergy', 'go-getter', or 'detail-oriented'. Focus on concrete skills and outcomes.
  4.  **Direct Output:** Provide only the enhanced text. Do not include any introductory phrases like "Here is the revised version:".

  Original text: "${text}"
  Enhanced text:`;

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
        console.error('Error from AI API:', errorBody.error);
        return res.status(apiResponse.status).json({ error: `Error from AI service: ${errorBody.error.message}` });
    }

    const data = await apiResponse.json();
    
    if (!data.candidates || !data.candidates[0].content.parts[0].text) {
        console.error('Unexpected response structure from AI API:', data);
        return res.status(500).json({ error: 'Received an unexpected response from the AI service.' });
    }
    
    const enhancedText = data.candidates[0].content.parts[0].text;
    res.json({ enhancedText: enhancedText.trim() });

  } catch (error) {
      console.error('Internal server error while calling AI service:', error);
      res.status(500).json({ error: 'An internal error occurred while enhancing the text.' });
  }
});


// --- Start Server ---
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});