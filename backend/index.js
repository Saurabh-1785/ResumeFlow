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
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  const prompt = `You are an expert resume editor specializing in optimizing content for ATS (Applicant Tracking Systems) while keeping it professional and easy for hiring managers to read. Rewrite the following user-provided text to make it more structured, impactful, and aligned with ATS requirements. Follow these guidelines:

  1. Keep the original meaning and details intact without changing the intent.
  2. Use strong, relevant action verbs to describe tasks and responsibilities.
  3. In every sentence quantify achievements especially in description of project and experience (e.g., increased efficiency by 20%, managed a team of 5).
  4. Remove unnecessary buzzwords and generic phrases that do not add value since these terms are considered clichés by employers because they're so overused, and resumes are usually better off without them entirely (like presentation skills, management skills, drove, founded, etc).
  5. Ensure the text is clear, concise, and error-free while maintaining a formal tone.
  6. Include keywords that are relevant to job descriptions and industry requirements without keyword stuffing.
  7. Organize information logically with proper punctuation and formatting suitable for resumes.
  8. Direct Output: Provide only the enhanced text and in one paragraph, not in bullet points. Do not include any introductory phrases like "Here is the revised version:"


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