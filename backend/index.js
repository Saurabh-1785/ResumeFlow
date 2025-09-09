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

  // Debug logging
  console.log('Received enhance request:', { text: text?.substring(0, 100) + '...', context });
  console.log('API Key exists:', !!GEMINI_API_KEY);
  console.log('API Key first 10 chars:', GEMINI_API_KEY?.substring(0, 10) + '...');

  if (!text || !context) {
      return res.status(400).json({ error: 'Text and context are required.' });
  }

  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
      console.error('AI API key is missing or not configured in .env file.');
      return res.status(500).json({ error: 'AI API key is not configured.' });
  }
  
  // Updated API URL - using the correct v1 endpoint instead of v1beta
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

  const prompt = `You are an expert resume writer and an ATS (Applicant Tracking System) optimization specialist. Your task is to rewrite the following resume text to achieve a top-tier ATS score (above 90%). The text is from the "${context}" section.

  Follow these rules strictly:
  1.  **Quantify Achievements:** This is the most critical rule. If the original text has numbers, use them. If not, you MUST rephrase the statement to include a placeholder like [Number], [Percentage]%, or $[Amount] to prompt the user to add a specific metric. For example, transform 'Improved efficiency' into 'Improved operational efficiency by [Percentage]% by implementing a new automation script'.
  2.  **Use Strong Action Verbs:** Start every bullet point with a powerful and specific action verb (e.g., 'Architected', 'Revitalized', 'Negotiated', 'Streamlined'). Avoid weak or common verbs like 'Managed', 'Led', or 'Responsible for'.
  3.  **Eliminate Buzzwords:** Strictly remove all clichés, corporate jargon, and vague buzzwords. Do not use phrases like 'team player', 'results-driven', 'synergy', 'go-getter', or 'detail-oriented'. Focus on concrete skills and outcomes.
  4.  **Direct Output:** Provide only the enhanced text. Do not include any introductory phrases like "Here is the revised version:".

  Original text: "${text}"
  Enhanced text:`;

  const requestBody = {
    contents: [{ 
      parts: [{ text: prompt }] 
    }],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      }
    ]
  };

  console.log('Making API request to:', GEMINI_API_URL);

  try {
    const apiResponse = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });

    console.log('API Response status:', apiResponse.status);

    if (!apiResponse.ok) {
        const errorBody = await apiResponse.text();
        console.error('Error from AI API:', errorBody);
        
        // Try to parse as JSON, but fallback to text if it fails
        let errorMessage = 'Unknown error occurred';
        try {
          const errorJson = JSON.parse(errorBody);
          errorMessage = errorJson.error?.message || errorJson.message || errorBody;
        } catch {
          errorMessage = errorBody;
        }
        
        return res.status(apiResponse.status).json({ 
          error: `Error from AI service: ${errorMessage}` 
        });
    }

    const data = await apiResponse.json();
    console.log('API Response received:', JSON.stringify(data, null, 2));
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0] || !data.candidates[0].content.parts[0].text) {
        console.error('Unexpected response structure from AI API:', data);
        return res.status(500).json({ error: 'Received an unexpected response from the AI service.' });
    }
    
    const enhancedText = data.candidates[0].content.parts[0].text;
    console.log('Enhanced text generated successfully');
    res.json({ enhancedText: enhancedText.trim() });

  } catch (error) {
      console.error('Internal server error while calling AI service:', error);
      res.status(500).json({ error: 'An internal error occurred while enhancing the text.' });
  }
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log('Environment variables check:');
    console.log('- GOOGLE_API_KEY exists:', !!process.env.GOOGLE_API_KEY);
    console.log('- PORT:', process.env.PORT || 5000);
});